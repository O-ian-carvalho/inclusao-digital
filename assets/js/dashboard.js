(async function(){
  function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html!==undefined) e.innerHTML = html; return e }

  // Wait for modules data
  const modules = window.MODULES || []
  const course = window.COURSE || { title: 'Curso' }

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
  }
  const user = auth.currentUser
  if(!user){
    location.href = 'index.html'
    return
  }

  const logoutBtn = document.getElementById('logout-btn')
  if(logoutBtn) logoutBtn.addEventListener('click', async ()=>{
    await auth.signOut()
    location.href = 'index.html'
  })

  async function loadProgressMap(){
    try{
      // compat API: db.collection(...).where(...).get()
      if(typeof db.collection === 'function'){
        const snapshot = await db.collection('user_progress').where('user_id','==', user.uid).get()
        const map = {}
        snapshot.forEach(doc=>{ map[doc.data().module_id] = doc.data() })
        return map
      }
      // modular API: assume window.firebase (compat provided) — fallback empty
      return {}
    }catch(e){
      console.error('Erro ao carregar progresso:', e)
      return {}
    }
  }

  const progressMap = await loadProgressMap()

  const container = document.getElementById('modules-container')
  if(!container) return
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
  if(bar){ bar.style.width = percent + '%'; bar.textContent = percent + '%' }

  // find first not completed index
  const firstNot = modules.findIndex(m=> !(progressMap[m.id] && progressMap[m.id].completed))

  modules.forEach((m, idx)=>{
    const col = el('div','col-12 col-md-6 col-lg-4')
    const card = el('div','card module-card h-100')
    const body = el('div','card-body')

    const top = el('div','d-flex justify-content-between')
    const left = el('div','')
    const number = el('div','text-muted small','Módulo '+m.number)
    const title = el('div','h6 mt-1', m.title)
    left.appendChild(number); left.appendChild(title)

    const icon = el('div','module-icon text-primary', '<i class="bi '+(m.icon||'bi-journal')+'"></i>')
    top.appendChild(left); top.appendChild(icon)

    const short = el('p','text-muted small mt-2', m.short)

    const footer = el('div','d-flex justify-content-between align-items-center mt-3')
    const statusSpan = el('span','status-pill')
    // status
    const prog = progressMap[m.id]
    if(prog && prog.completed){
      statusSpan.classList.add('status-done')
      statusSpan.textContent = 'Concluído'
    } else if(firstNot !== -1 && idx === firstNot){
      statusSpan.classList.add('status-in')
      statusSpan.textContent = 'Em andamento'
    } else {
      statusSpan.classList.add('status-not')
      statusSpan.textContent = 'Não iniciado'
    }

    const btn = el('a','btn btn-sm btn-primary','Ver conteúdo')
    btn.href = 'module.html?module='+m.id

    footer.appendChild(statusSpan); footer.appendChild(btn)

    body.appendChild(top)
    body.appendChild(short)
    body.appendChild(footer)
    card.appendChild(body)
    col.appendChild(card)
    container.appendChild(col)
  })

})();
