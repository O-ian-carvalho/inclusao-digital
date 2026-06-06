(function(){
  function loadCSS(local, cdn){
    try{
      const l = document.createElement('link')
      l.rel = 'stylesheet'
      l.href = local
      l.onerror = function(){
        const f = document.createElement('link')
        f.rel = 'stylesheet'
        f.href = cdn
        document.head.appendChild(f)
      }
      document.head.appendChild(l)
    }catch(e){
      const f = document.createElement('link')
      f.rel = 'stylesheet'
      f.href = cdn
      document.head.appendChild(f)
    }
  }

  function loadScript(local, cdn, onload){
    try{
      const s = document.createElement('script')
      s.src = local
      s.defer = false
      s.async = false
      s.onload = onload
      s.onerror = function(){
        const f = document.createElement('script')
        f.src = cdn
        if(onload) f.onload = onload
        f.defer = false
        f.async = false
        document.head.appendChild(f)
      }
      document.head.appendChild(s)
    }catch(e){
      const f = document.createElement('script')
      f.src = cdn
      if(onload) f.onload = onload
      document.head.appendChild(f)
    }
  }

  // Bootstrap Icons (necessário para os ícones do dashboard)
  loadCSS('assets/vendor/bootstrap-icons.min.css', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css')

  // Carrega os scripts do Firebase em sequência (app -> auth -> firestore)
  loadScript('assets/vendor/firebase-app-compat.js','https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js', function(){
    loadScript('assets/vendor/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js', function(){
      loadScript('assets/vendor/firebase-firestore-compat.js','https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js', function(){
        // sinaliza que os vendors foram carregados
        window._vendorsReady = true
        console.info('Vendors carregados')
      })
    })
  })

})();
