# Plataforma de Cursos — Inclusão Digital

Projeto simples para trabalho de faculdade: plataforma com autenticação via Firebase (Email/Password) e módulos de treinamento sobre uso básico do Windows.

Arquivos principais:

- `index.html` — tela de login
- `signup.html` — tela de cadastro
- `dashboard.html` — dashboard com módulos e progresso
- `assets/js/auth.js` — scripts de login/cadastro (Firebase Auth)
- `assets/js/dashboard.js` — lógica do dashboard e progresso (Firestore)
- `firebase-config.example.js` — exemplo de configuração do Firebase

Configuração mínima do Firebase:

1. Crie um projeto no https://console.firebase.google.com
2. Registre um app web e copie as configurações (apiKey, authDomain, projectId, etc.).
3. Copie `firebase-config.example.js` para `firebase-config.js` e substitua os valores.

Firestore:

O frontend cria documentos em uma coleção `user_progress`. Habilite o Firestore no console do Firebase e configure regras de segurança para que apenas usuários autenticados leiam/escrevam seus próprios documentos (exemplo de regra abaixo).

Deploy na Vercel (rápido):

1. Crie um repositório git com estes arquivos e conecte ao Vercel.
2. Para segurança, prefira usar variáveis de ambiente no Vercel e gerar `firebase-config.js` no build, ou mantenha `firebase-config.js` em repositório privado.
3. Habilite Firestore e ajuste regras conforme necessário.

Exemplo de regras de segurança Firestore (console > Firestore > Rules):
```
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      match /user_progress/{docId} {
         allow read, write: if request.auth != null && request.auth.uid == request.resource.data.user_id;
      }
   }
}
```

Observações:

- Não implementamos recuperação de senha, perfis ou painel administrativo (conforme requisito).
- Os módulos são definidos diretamente em `assets/js/dashboard.js`.
- Para marcar o progresso corretamente, garanta que o Firestore esteja ativo e que as regras permitam que usuários autenticados escrevam seus próprios documentos.