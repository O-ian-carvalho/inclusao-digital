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

  const header = el('div','mb-3')
  header.appendChild(el('h2','', `Módulo ${mod.number} - ${mod.title}`))
  header.appendChild(el('p','text-muted', mod.full))

  const video = el('div','mb-3')
  if(mod.video){
    video.innerHTML = '<div class="ratio ratio-16x9"><iframe src="'+mod.video+'" title="Vídeo" allowfullscreen></iframe></div>'
  } else {
    video.appendChild(el('div','video-placeholder','Vídeo não disponível — espaço reservado'))
  }

  const btnBar = el('div','d-flex justify-content-between align-items-center')
  const status = el('div','')
  const btn = el('button','btn btn-success','Marcar como concluído')

  btnBar.appendChild(status); btnBar.appendChild(btn)

  container.appendChild(header)
  container.appendChild(video)
  container.appendChild(btnBar)

  async function refreshStatus(){
    const docId = `${user.uid}_${mod.id}`
    const doc = await db.collection('user_progress').doc(docId).get()
    if(doc.exists && doc.data().completed){
      status.innerHTML = '<span class="badge bg-success">Concluído</span>'
      btn.disabled = true
    } else {
      status.innerHTML = '<span class="badge bg-secondary">Pendente</span>'
      btn.disabled = false
    }
  }

  btn.addEventListener('click', async ()=>{
    btn.disabled = true
    try{
      const docId = `${user.uid}_${mod.id}`
      const payload = { user_id: user.uid, module_id: mod.id, completed: true, completed_at: new Date().toISOString() }
      await db.collection('user_progress').doc(docId).set(payload, { merge: true })
      await refreshStatus()
      // success toast
      const t = document.createElement('div')
      t.className = 'alert alert-success mt-3'
      t.textContent = 'Módulo marcado como concluído! Próximo liberado.'
      container.insertBefore(t, container.children[2])
      setTimeout(()=> t.remove(), 3000)
    }catch(e){
      console.error(e)
      alert('Erro ao salvar progresso')
      btn.disabled = false
    }
  })

  refreshStatus()

})();
