(async function(){
  function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html!==undefined) e.innerHTML = html; return e }

  const modules = window.MODULES || []

  // Wait for Firebase initialization
  async function waitForFirebase(){
    const start = Date.now()
    const timeout = 8000
    while(true){
      const auth = window.firebaseAuth
      const db = window.firestore
      if(auth && db) return { auth, db }
      if(Date.now() - start > timeout){
        console.error('Firebase Auth/Firestore não inicializado após timeout')
        return null
      }
      await new Promise(r=>setTimeout(r, 200))
    }
  }
  const env = await waitForFirebase()
  if(!env){
    document.getElementById('modules-container').innerHTML = '<div class="alert alert-danger">Serviço Firebase indisponível. Recarregue a página.</div>'
    return
  }
  const auth = env.auth
  const db = env.db

  // ensure authenticated
  if(!auth.currentUser){
    await new Promise((resolve)=>{
      const unsub = auth.onAuthStateChanged(u=>{ unsub(); resolve() })
    })
    if(!auth.currentUser){ location.href = 'index.html'; return }
  }
  const user = auth.currentUser

  // Show user email in navbar
  const emailDisplay = document.getElementById('user-email-display')
  if(emailDisplay && user.email) emailDisplay.textContent = user.email

  // Admin link for admin user
  const adminEmail = 'admin@admin.com'
  if(user.email === adminEmail){
    const navRight = document.querySelector('.navbar .d-flex')
    if(navRight){
      const link = document.createElement('a')
      link.href = 'admin.html'
      link.className = 'btn btn-outline-primary btn-sm'
      link.innerHTML = '<i class="bi bi-shield-lock"></i> Admin'
      navRight.insertBefore(link, navRight.querySelector('#logout-btn'))
    }
  }

  const logoutBtn = document.getElementById('logout-btn')
  if(logoutBtn) logoutBtn.addEventListener('click', async ()=>{
    await auth.signOut()
    location.href = 'index.html'
  })

  async function loadProgressMap(){
    try{
      if(typeof db.collection === 'function'){
        const snapshot = await db.collection('user_progress').where('user_id','==', user.uid).get()
        const map = {}
        snapshot.forEach(doc=>{ map[doc.data().module_id] = doc.data() })
        return map
      }
      return {}
    }catch(e){
      console.error('Erro ao carregar progresso:', e)
      return {}
    }
  }
  const progressMap = await loadProgressMap()

  // Hide skeleton, show container
  const skeleton = document.getElementById('modules-skeleton')
  const container = document.getElementById('modules-container')
  if(!container) return
  if(skeleton) skeleton.remove()
  container.classList.remove('d-none')
  container.innerHTML = ''

  // determine counts
  const total = modules.length
  let completedCount = 0
  modules.forEach((m)=>{
    const prog = progressMap[m.id]
    if(prog && prog.completed) completedCount++
  })

  const completedEl = document.getElementById('modules-completed')
  const totalEl = document.getElementById('modules-total')
  const bar = document.getElementById('progress-bar')
  if(completedEl) completedEl.textContent = completedCount
  if(totalEl) totalEl.textContent = total
  const percent = total>0? Math.round((completedCount/total)*100) : 0
  if(bar){ bar.style.width = percent + '%' }

  // find first not completed index
  const firstNot = modules.findIndex(m=> !(progressMap[m.id] && progressMap[m.id].completed))

  modules.forEach((m, idx)=>{
    const card = el('div','card module-card fade-up')
    const body = el('div','card-body')

    const top = el('div','d-flex justify-content-between align-items-start')
    const left = el('div','')
    const number = el('div','module-number','Módulo '+m.number)
    const title = el('div','module-title', m.title)
    left.appendChild(number); left.appendChild(title)

    const icon = el('div','module-icon text-primary', '<i class="bi '+(m.icon||'bi-journal')+'"></i>')
    top.appendChild(left); top.appendChild(icon)

    const short = el('p','module-short', m.short)

    const footer = el('div','module-footer')
    const statusSpan = el('span','status-pill')
    const prog = progressMap[m.id]
    if(prog && prog.completed){
      statusSpan.classList.add('status-done')
      statusSpan.innerHTML = '<i class="bi bi-check-circle-fill"></i> Concluído'
    } else if(firstNot !== -1 && idx === firstNot){
      statusSpan.classList.add('status-in')
      statusSpan.innerHTML = '<i class="bi bi-hourglass-split"></i> Em andamento'
    } else {
      statusSpan.classList.add('status-not')
      statusSpan.innerHTML = '<i class="bi bi-circle"></i> Não iniciado'
    }

    const btn = el('a','btn btn-primary btn-sm','Ver conteúdo')
    btn.href = 'module.html?module='+m.id

    footer.appendChild(statusSpan); footer.appendChild(btn)
    body.appendChild(top)
    body.appendChild(short)
    body.appendChild(footer)
    card.appendChild(body)
    container.appendChild(card)
  })

  // stagger animation delay
  container.querySelectorAll('.fade-up').forEach((el, i) => {
    el.style.animationDelay = (i * 0.07) + 's'
  })

})();
