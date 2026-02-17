# TASK-03: Controle de Acesso e Perfil Básico

## 1. Objetivo

O objetivo desta tarefa é implementar a lógica de controle de acesso para proteger rotas e criar uma página de perfil básica que exiba as informações do usuário autenticado. Adicionalmente, será implementada a funcionalidade de logout.

## 2. Componentes a Implementar

### 2.1. Lógica de Proteção de Rota (`load` functions)
Implementar a verificação de autenticação nas funções `load` do SvelteKit para rotas que exigem um usuário logado.
*   **Requisito:** Rotas como `/feed` ou `/profile` devem ser inacessíveis para usuários não autenticados.
*   **Especificação:**
    *   Em cada `+page.server.ts` de uma rota protegida, a função `load` deve inspecionar `event.locals.user`.
    *   Se `event.locals.user` for nulo, a função deve lançar um redirecionamento (`throw redirect(302, '/login')`) para a página de login.
    *   Se `event.locals.user` existir, a função deve prosseguir e, se necessário, carregar dados específicos do usuário para a página.

### 2.2. Página de Perfil (`src/routes/profile/+page.svelte` e `+page.server.ts`)
Criar uma página simples que exiba os dados do usuário atualmente logado.
*   **Requisito:** A página `/profile` deve exibir informações como `username` e `email`.
*   **Especificação:**
    *   O `+page.server.ts` da rota `/profile` deve ser protegido conforme o item 2.1.
    *   A função `load` deve retornar o objeto `user` de `event.locals` para o componente da página.
    *   O componente `+page.svelte` deve receber a prop `data` e renderizar os atributos do usuário (e.g., `data.user.username`).

### 2.3. Funcionalidade de Logout
Implementar uma `action` para invalidar a sessão do usuário e efetuar o logout.
*   **Requisito:** O usuário deve ser capaz de encerrar sua sessão de forma segura.
*   **Especificação:**
    *   Criar um formulário de logout. Este pode ser um simples botão dentro de um `<form method="POST" action="/logout">`.
    *   Criar um endpoint `src/routes/logout/+server.ts` que manipule a requisição `POST`.
    *   O manipulador `POST` deve:
        1.  Verificar se existe uma sessão (`event.locals.session`).
        2.  Se uma sessão existir, utilizar `lucia.invalidateSession(sessionId)` para removê-la do banco de dados.
        3.  Criar um `blank session cookie` com `lucia.createBlankSessionCookie()` para sobreescrever o cookie do cliente.
        4.  Redirecionar o usuário para a página inicial ou de login.

## 3. Critérios de Aceitação

*   **CA-1:** Acessar uma rota protegida (e.g., `/profile`) sem estar logado resulta em um redirecionamento imediato para `/login`.
*   **CA-2:** Um usuário logado que acessa a página `/profile` vê suas próprias informações (username, email) renderizadas na tela.
*   **CA-3:** Um usuário logado que aciona a ação de logout tem sua sessão invalidada no banco de dados, é deslogado e redirecionado para a página de login.
*   **CA-4:** Após o logout, o usuário não consegue mais acessar as páginas protegidas.

## 4. Referências Técnicas

*   **Documentação SvelteKit - `load` function:** [https://kit.svelte.dev/docs/load](https://kit.svelte.dev/docs/load)
*   **Documentação SvelteKit - Redirecionamentos:** [https://kit.svelte.dev/docs/load#redirects](https://kit.svelte.dev/docs/load#redirects)
*   **Tutorial da Lucia - Logout:** A documentação de `invalidateSession` e `createBlankSessionCookie` é encontrada nos guias de gerenciamento de sessão.
    *   [https://lucia-auth.com/basics/sessions](https://lucia-auth.com/basics/sessions)