// auth.js - shared for login and signup
(async function(){
  const loginForm = document.getElementById('login-form')
  const signupForm = document.getElementById('signup-form')

  function getFirebaseErrorMessage(err){
    const code = err.code || ''
    const map = {
      'auth/user-not-found': 'Email não encontrado. Verifique se digitou corretamente.',
      'auth/wrong-password': 'Senha incorreta. Tente novamente.',
      'auth/invalid-email': 'Email inválido. Digite um email válido.',
      'auth/invalid-credential': 'Email ou senha incorretos.',
      'auth/invalid-login-credentials': 'Email ou senha incorretos.',
      'auth/user-disabled': 'Esta conta foi desativada.',
      'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.',
      'auth/email-already-in-use': 'Este email já está cadastrado.',
      'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
      'auth/internal-error': 'Erro interno do servidor. Tente novamente mais tarde.',
    }
    return map[code] || err.message || 'Ocorreu um erro inesperado. Tente novamente.'
  }

  function showAlert(msg, type){
    const a = document.getElementById('alert')
    if(!a) return
    a.className = 'alert d-flex align-items-center gap-2'
    const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'
    a.innerHTML = '<i class="bi ' + icon + '"></i><span>' + msg + '</span>'
    a.classList.remove('d-none')
  }

  function hideAlert(){
    const a = document.getElementById('alert')
    if(a) a.classList.add('d-none')
  }

  function setLoading(form, loading){
    const btn = form.querySelector('button[type="submit"]')
    if(!btn) return
    btn.disabled = loading
    if(loading){
      btn.dataset.originalHtml = btn.innerHTML
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> ' + (signupForm && form === signupForm ? 'Criando...' : 'Entrando...')
    } else {
      btn.innerHTML = btn.dataset.originalHtml || btn.innerHTML
    }
  }

  async function waitForFirebase(){
    const start = Date.now()
    const timeout = 8000
    while(true){
      if(window.firebaseAuth) return
      if(Date.now() - start > timeout) throw new Error('Firebase não inicializado. Verifique `firebase-config.js` e o carregamento do SDK.')
      await new Promise(r=>setTimeout(r, 200))
    }
  }

  try{
    await waitForFirebase()
  }catch(err){
    showAlert(err.message)
    return
  }

  const auth = window.firebaseAuth

  // Clear alert on input
  document.addEventListener('input', function(e){
    if(e.target.closest('form')) hideAlert()
  })

  if(signupForm){
    signupForm.addEventListener('submit', async (e)=>{
      e.preventDefault()
      hideAlert()
      setLoading(signupForm, true)
      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value
      try{
        const userCred = await auth.createUserWithEmailAndPassword(email, password)
        if(!userCred || !userCred.user) throw new Error('Erro ao criar usuário')
        try{
          const db = window.firestore
          if(db && typeof db.collection === 'function'){
            await db.collection('users').doc(userCred.user.uid).set({
              uid: userCred.user.uid,
              email: userCred.user.email,
              created_at: new Date().toISOString()
            })
          }
        }catch(e){ /* fallback silencioso */ }
        location.href = 'dashboard.html'
      }catch(err){
        showAlert(getFirebaseErrorMessage(err))
        setLoading(signupForm, false)
      }
    })
  }

  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault()
      hideAlert()
      setLoading(loginForm, true)
      const email = document.getElementById('email').value.trim()
      const password = document.getElementById('password').value
      try{
        await auth.signInWithEmailAndPassword(email, password)
        location.href = 'dashboard.html'
      }catch(err){
        showAlert(getFirebaseErrorMessage(err))
        setLoading(loginForm, false)
      }
    })
  }

})();
