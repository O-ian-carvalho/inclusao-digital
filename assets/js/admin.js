// admin.js - painel administrativo
(async function(){
  // ==================== CONFIG ====================
  // Altere aqui o email do administrador
  const ADMIN_EMAIL = 'admin@admin.com'

  const modules = window.MODULES || []
  const totalModules = modules.length

  function el(tag, cls, html){ const e = document.createElement(tag); if(cls) e.className = cls; if(html!==undefined) e.innerHTML = html; return e }

  // ==================== Firebase ====================
  async function waitForFirebase(){
    const start = Date.now()
    const timeout = 8000
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
    document.body.innerHTML = '<div class="alert alert-danger m-4">Serviço Firebase indisponível.</div>'
    return
  }
  const { auth, db } = env

  // aguarda auth
  if(!auth.currentUser){
    await new Promise((resolve)=>{ const unsub = auth.onAuthStateChanged(u=>{ unsub(); resolve() }) })
  }
  const user = auth.currentUser
  if(!user || user.email !== ADMIN_EMAIL){
    location.href = 'dashboard.html'
    return
  }

  // mostra email
  const emailDisplay = document.getElementById('admin-email-display')
  if(emailDisplay) emailDisplay.textContent = user.email

  // logout
  const logoutBtn = document.getElementById('logout-btn')
  if(logoutBtn) logoutBtn.addEventListener('click', async ()=>{
    await auth.signOut()
    location.href = 'index.html'
  })

  // ==================== Dados ====================
  async function fetchAllUsersFromDb(){
    try{
      const snap = await db.collection('users').get()
      const map = {}
      snap.forEach(doc => {
        const d = doc.data()
        if(d && d.uid) map[d.uid] = { uid: d.uid, email: d.email || d.uid, created_at: d.created_at || '' }
      })
      return map
    }catch(e){
      console.error('Erro ao buscar usuários:', e)
      return {}
    }
  }

  async function fetchProgress(){
    try{
      const snapshot = await db.collection('user_progress').get()
      const records = []
      snapshot.forEach(doc => {
        const d = doc.data()
        if(d && d.user_id && d.module_id) records.push(d)
      })
      return records
    }catch(e){
      console.error('Erro ao buscar progresso:', e)
      return []
    }
  }

  const [usersMap, progress] = await Promise.all([fetchAllUsersFromDb(), fetchProgress()])

  // Merge: users from 'users' collection + unique ids from 'user_progress'
  const progressUserIds = new Set(progress.map(p => p.user_id))
  const allUids = new Set([...Object.keys(usersMap), ...progressUserIds])
  const emailFromProgress = {}
  progress.forEach(p => {
    if(p.user_email && !emailFromProgress[p.user_id]) emailFromProgress[p.user_id] = p.user_email
  })
  const users = Array.from(allUids).map(uid => {
    if(usersMap[uid]) return usersMap[uid]
    const fallbackEmail = emailFromProgress[uid] || ''
    return { uid, email: fallbackEmail, displayName: fallbackEmail || uid, created_at: '' }
  })

  // ==================== Stats ====================
  const userCount = users.length
  const totalCompletions = progress.filter(p => p.completed).length
  const avgProgress = userCount > 0 ? Math.round((totalCompletions / (userCount * totalModules)) * 100) : 0

  document.getElementById('stat-users').textContent = userCount
  document.getElementById('stat-completions').textContent = totalCompletions
  document.getElementById('stat-avg').textContent = avgProgress

  // ==================== Módulos por usuário ====================
  const moduleStatsContainer = document.getElementById('module-stats')
  moduleStatsContainer.innerHTML = ''

  const moduleCompletionCounts = modules.map(m => {
    const count = progress.filter(p => p.module_id === m.id && p.completed).length
    return { module: m, count }
  })

  moduleCompletionCounts.forEach(({ module: m, count }) => {
    const pct = userCount > 0 ? Math.round((count / userCount) * 100) : 0
    const row = el('div','d-flex align-items-center gap-3 mb-3')
    const label = el('div','text-nowrap', 'M' + m.number + ' - ' + m.title)
    label.style.minWidth = '200px'
    label.style.fontSize = '.85rem'

    const barWrap = el('div','flex-grow-1')
    const bar = el('div','progress', '')
    bar.style.height = '22px'
    const fill = el('div','progress-bar bg-primary', '')
    fill.style.width = pct + '%'
    fill.style.fontSize = '.75rem'
    fill.textContent = pct > 0 ? pct + '%' : ''
    bar.appendChild(fill)
    barWrap.appendChild(bar)

    const num = el('div','text-muted small text-nowrap', count + '/' + userCount)
    num.style.minWidth = '60px'
    num.style.textAlign = 'right'

    row.appendChild(label)
    row.appendChild(barWrap)
    row.appendChild(num)
    moduleStatsContainer.appendChild(row)
  })

  // ==================== Tabela de usuários ====================
  const tableContainer = document.getElementById('user-progress-table')
  tableContainer.innerHTML = ''

  if(users.length === 0){
    tableContainer.innerHTML = '<div class="p-4 text-center text-muted">Nenhum usuário cadastrado ainda.</div>'
    return
  }

  const table = el('table','table table-hover mb-0 align-middle')
  const thead = el('thead','table-light')
  thead.innerHTML = '<tr><th class="ps-3">Usuário</th><th>Cadastro</th>' + modules.map(m => '<th class="text-center" style="width:70px">M' + m.number + '</th>').join('') + '<th class="text-center pe-3" style="width:90px">Progresso</th></tr>'
  table.appendChild(thead)

  const tbody = el('tbody','')
  users.forEach(u => {
    const userProgress = progress.filter(p => p.user_id === u.uid)
    const completedModules = userProgress.filter(p => p.completed).map(p => p.module_id)
    const pct = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0

    const tr = el('tr','')
    const label = u.email || u.displayName || u.uid
    let cellsHTML = '<td class="ps-3"><span class="fw-medium small">' + label + '</span></td>'
    cellsHTML += '<td class="small text-muted">' + (u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—') + '</td>'
    modules.forEach(m => {
      const done = completedModules.includes(m.id)
      cellsHTML += '<td class="text-center">' + (done ? '<i class="bi bi-check-circle-fill text-success"></i>' : '<i class="bi bi-circle text-secondary opacity-50"></i>') + '</td>'
    })
    cellsHTML += '<td class="text-center pe-3"><span class="fw-semibold small">' + pct + '%</span></td>'
    tr.innerHTML = cellsHTML
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)
  tableContainer.appendChild(table)
})();
