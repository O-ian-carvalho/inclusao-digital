// Arquivo de configuração mínimo do Firebase.
// Substitua os valores pelas chaves do seu projeto Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyCHJjK0kskawGIn4ghjX2tujxLYnmcusuc",
  authDomain: "trabalho-so-ce47e.firebaseapp.com",
  projectId: "trabalho-so-ce47e",
  storageBucket: "trabalho-so-ce47e.firebasestorage.app",
  messagingSenderId: "90463042369",
  appId: "1:90463042369:web:5cc545030b81e3e6dfbfc0"
};

// Inicializa o Firebase quando o SDK estiver disponível.
// Aguarda o objeto `firebase` por alguns segundos (evita condição de corrida com o loader).
;(function initWhenReady(){
  const start = Date.now()
  const timeoutMs = 8000

  function fail(msg){
    console.error(msg)
    window.firebaseApp = null
    window.firestore = null
    window.firebaseAuth = null
  }

  function tryInit(){
    // aguarda o objeto global `firebase` e o sinal do loader `window._vendorsReady`
    const vendorsReady = window._vendorsReady === true

    // diagnóstico rápido
    console.debug('[firebase-config] vendorsReady=', vendorsReady, 'firebase=', typeof firebase !== 'undefined')

    // espera até que os vendors indiquem que terminaram de carregar
    if(typeof firebase === 'undefined' || !vendorsReady){
      if(Date.now() - start > timeoutMs){
        fail('Firebase SDK não encontrado. Verifique se os scripts do Firebase foram carregados e se o CDN/local vendor está acessível.')
        return
      }
      return setTimeout(tryInit, 200)
    }

    try{
      // expose config for debugging/builds
      window.FIREBASE_CONFIG = window.FIREBASE_CONFIG || firebaseConfig
      if(!firebase.apps || firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig)
      }
      window.firebaseApp = firebase.app()
      // auth fallback: compat (firebase.auth()) or modular (firebase.getAuth)
      try{
        console.debug('[firebase-config] tentando inicializar Auth')
        if(typeof firebase.auth === 'function'){
          window.firebaseAuth = firebase.auth()
        } else if(typeof firebase.getAuth === 'function'){
          // modular API (getAuth) may require app param
          try{ window.firebaseAuth = firebase.getAuth(firebase.app()) }catch(e){ window.firebaseAuth = firebase.getAuth() }
        } else if(firebase.auth){
          window.firebaseAuth = firebase.auth
        } else {
          console.warn('[firebase-config] Auth API não encontrada nas checkagens padrão')
          window.firebaseAuth = null
        }
      }catch(e){
        console.error('Erro ao inicializar Firebase Auth:', e)
        window.firebaseAuth = null
      }

      // firestore fallback: compat (firebase.firestore()) or modular (firebase.getFirestore)
      try{
        console.debug('[firebase-config] tentando inicializar Firestore')
        if(typeof firebase.firestore === 'function'){
          window.firestore = firebase.firestore()
        } else if(typeof firebase.getFirestore === 'function'){
          try{ window.firestore = firebase.getFirestore(firebase.app()) }catch(e){ window.firestore = firebase.getFirestore() }
        } else if(firebase.firestore){
          window.firestore = firebase.firestore
        } else {
          console.warn('[firebase-config] Firestore API não encontrada nas checkagens padrão')
          window.firestore = null
        }
      }catch(e){
        console.error('Erro ao inicializar Firestore:', e)
        window.firestore = null
      }
      console.info('Firebase inicializado')
    }catch(e){
      fail('Erro ao inicializar Firebase: ' + e.message)
    }
  }

  tryInit()
})()

// Nota: para produção, prefira injetar as chaves via variáveis de ambiente e não versionar `firebase-config.js`.
