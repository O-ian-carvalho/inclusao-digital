// module.js - renders single module page and handles completion
(async function(){
  function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html!==undefined) e.innerHTML = html; return e }

  // read module id from query
  const params = new URLSearchParams(location.search)
  const moduleId = parseInt(params.get('module'),10)
  const modules = window.MODULES || []
  const mod = modules.find(m=>m.id === moduleId)
  if(!mod){ document.getElementById('module-content').innerHTML = '<div class="alert alert-danger">Módulo não encontrado</div>'; return }

  // aguarda Firebase ser inicializado pelo loader/config
  const start = Date.now()
  const timeout = 8000
  async function waitForFirebase(){
    while(true){
      const auth = window.firebaseAuth
      const db = window.firestore
      if(auth && db) return { auth, db }
      if(Date.now() - start > timeout) return null
      await new Promise(r=>setTimeout(r, 200))
    }
  }

  const env = await waitForFirebase()
  if(!env){
    const el = document.getElementById('module-content')
    if(el) el.innerHTML = '<div class="alert alert-danger">Serviço Firebase indisponível. Recarregue a página.</div>'
    console.error('Firebase não inicializado após timeout')
    return
  }

  const auth = env.auth
  const db = env.db

  // aguarda estado de autenticação do usuário antes de prosseguir
  if(!auth.currentUser){
    await new Promise((resolve)=>{ const unsub = auth.onAuthStateChanged(u=>{ unsub(); resolve() }) })
  }
  const user = auth.currentUser
  if(!user){
    location.href = 'index.html'
    return
  }

  const container = document.getElementById('module-content')
  container.innerHTML = ''

  const header = el('div','module-header fade-up')
  const titleRow = el('div','d-flex align-items-center gap-2')
  const iconBadge = el('span','badge bg-primary bg-opacity-10 text-primary','Módulo '+mod.number)
  titleRow.appendChild(iconBadge)
  header.appendChild(titleRow)
  header.appendChild(el('h2','mt-2', mod.title))
  const fullParts = (mod.full || '').split('\n\n')
  fullParts.forEach(part => {
    if(part.trim()) header.appendChild(el('p','module-full mb-2', part.trim()))
  })

  const videosContainer = el('div','videos-container fade-up')
  const modVideos = mod.videos || (mod.video ? [{ title: '', url: mod.video }] : [])

  if(modVideos.length > 0){
    modVideos.forEach((v, i) => {
      const wrapper = el('div','video-wrapper mb-3')
      if(v.url){
        wrapper.innerHTML = v.title ? '<div class="video-label mb-2 fw-semibold small text-muted">' + v.title + '</div>' : ''
        wrapper.innerHTML += '<div class="ratio ratio-16x9"><iframe src="' + v.url + '" title="' + (v.title || 'Vídeo') + '" allowfullscreen></iframe></div>'
      } else {
        const placeholder = el('div','video-placeholder')
        placeholder.innerHTML = '<i class="bi bi-play-circle me-2"></i>' + (v.title || 'Vídeo não disponível — espaço reservado')
        wrapper.appendChild(placeholder)
        if(v.title) wrapper.insertBefore(el('div','video-label mb-2 fw-semibold small text-muted', v.title), placeholder)
      }
      videosContainer.appendChild(wrapper)
    })
  } else {
    videosContainer.appendChild(el('div','video-placeholder','<i class="bi bi-play-circle me-2"></i>Vídeo não disponível — espaço reservado'))
  }

  const actions = el('div','module-actions fade-up')
  const status = el('div','')
  const btn = el('button','btn btn-success','<i class="bi bi-check-lg me-1"></i>Marcar como concluído')

  actions.appendChild(status); actions.appendChild(btn)

  container.appendChild(header)
  container.appendChild(videosContainer)
  container.appendChild(actions)

  // stagger
  container.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.animationDelay = (i * 0.1) + 's'
  })

  async function refreshStatus(){
    const docId = `${user.uid}_${mod.id}`
    const doc = await db.collection('user_progress').doc(docId).get()
    if(doc.exists && doc.data().completed){
      status.innerHTML = '<span class="badge bg-success fs-6 px-3 py-2"><i class="bi bi-check-circle-fill me-1"></i>Concluído</span>'
      btn.disabled = true
    } else {
      status.innerHTML = '<span class="badge bg-secondary fs-6 px-3 py-2"><i class="bi bi-clock me-1"></i>Pendente</span>'
      btn.disabled = false
    }
  }

  btn.addEventListener('click', async ()=>{
    btn.disabled = true
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Salvando...'
    try{
      const docId = `${user.uid}_${mod.id}`
      const payload = { user_id: user.uid, user_email: user.email || '', module_id: mod.id, completed: true, completed_at: new Date().toISOString() }
      await db.collection('user_progress').doc(docId).set(payload, { merge: true })
      await refreshStatus()
      // toast notification
      const t = document.createElement('div')
      t.className = 'toast-notification'
      t.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Módulo concluído! Próximo liberado.'
      document.body.appendChild(t)
      setTimeout(()=> t.remove(), 3500)
    }catch(e){
      console.error(e)
      alert('Erro ao salvar progresso')
      btn.disabled = false
      btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Marcar como concluído'
    }
  })

  refreshStatus()

})();
