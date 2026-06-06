// auth.js - shared for login and signup
(async function(){
  const loginForm = document.getElementById('login-form')
  const signupForm = document.getElementById('signup-form')

  function showAlert(msg){
    const a = document.getElementById('alert')
    if(!a) return
    a.textContent = msg
    a.classList.remove('d-none')
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

  if(signupForm){
    signupForm.addEventListener('submit', async (e)=>{
      e.preventDefault()
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      try{
        const userCred = await auth.createUserWithEmailAndPassword(email, password)
        if(!userCred || !userCred.user) throw new Error('Erro ao criar usuário')
        location.href = 'dashboard.html'
      }catch(err){
        showAlert(err.message || JSON.stringify(err))
      }
    })
  }

  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault()
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      try{
        await auth.signInWithEmailAndPassword(email, password)
        location.href = 'dashboard.html'
      }catch(err){
        showAlert(err.message || JSON.stringify(err))
      }
    })
  }

})();
