# TASK-02: Desenvolvimento da UI de Autenticação

## 1. Objetivo

O objetivo desta tarefa é desenvolver os componentes de interface de usuário (UI) e a lógica de servidor necessários para o registro e login de usuários. A implementação utilizará as `Form Actions` do SvelteKit para um processamento de dados seguro e robusto no lado do servidor.

## 2. Componentes a Implementar

### 2.1. API de Autenticação (`src/routes/login/+server.ts` e `src/routes/register/+server.ts`)
Embora as `Form Actions` sejam o método preferencial, é útil criar endpoints de API para o registro e login. Estes endpoints serão responsáveis por:
*   **Registro (`/register`):**
    1.  Receber `username`, `email` e `password`.
    2.  Validar os dados (e.g., complexidade da senha, formato do e-mail).
    3.  Verificar se o usuário já existe.
    4.  Gerar o hash da senha.
    5.  Utilizar a Lucia para criar um `Key` e associá-lo a um novo `User`.
*   **Login (`/login`):**
    1.  Receber `email` e `password`.
    2.  Localizar o usuário pelo `Key` (email).
    3.  Verificar o hash da senha.
    4.  Se a verificação for bem-sucedida, criar uma sessão (`lucia.createSession`) e retornar um cookie de sessão para o cliente.

### 2.2. Componentes de Formulário (`src/routes/login/+page.svelte` e `src/routes/register/+page.svelte`)
Desenvolver os formulários Svelte que permitirão ao usuário interagir com o sistema.
*   **Requisito:** Criar dois formulários HTML distintos para login e registro.
*   **Especificação:**
    *   Utilizar o elemento `<form>` com o atributo `method="POST"`.
    *   Para o registro, a `action` do formulário deve apontar para `?/register`.
    *   Para o login, a `action` do formulário deve apontar para `?/login`.
    *   Os campos de entrada (`<input>`) devem ter os `name` apropriados (e.g., `name="email"`, `name="password"`).

### 2.3. Lógica do Servidor (`src/routes/login/+page.server.ts` e `src/routes/register/+page.server.ts`)
Implementar as `Form Actions` que processarão os dados submetidos pelos formulários.
*   **Requisito:** Exportar um objeto `actions` contendo as funções `register` e `login`.
*   **Especificação:**
    *   **Ação `register`:**
        1.  Extrair os dados do corpo da requisição.
        2.  Executar a lógica de criação de usuário (pode reutilizar a lógica do endpoint de API).
        3.  Em caso de sucesso, redirecionar o usuário para a página de login.
        4.  Em caso de erro (e.g., usuário já existe), retornar o estado de erro para o formulário para exibir uma mensagem ao usuário.
    *   **Ação `login`:**
        1.  Extrair os dados.
        2.  Executar a lógica de validação e criação de sessão.
        3.  Em caso de sucesso, a Lucia (via `event.cookies.set`) definirá o cookie, e a ação deve redirecionar o usuário para uma página protegida (e.g., `/feed` ou `/profile`).
        4.  Em caso de erro (credenciais inválidas), retornar o estado de erro para o formulário.

## 3. Critérios de Aceitação

*   **CA-1:** Um usuário pode preencher o formulário em `/register`, ser criado no banco de dados, e ser redirecionado para `/login`.
*   **CA-2:** Um usuário registrado pode preencher o formulário em `/login`, ter uma sessão criada no banco de dados (tabela `Session`), receber um cookie de sessão, e ser redirecionado para uma página de destino.
*   **CA-3:** Tentar registrar um e-mail/usuário que já existe resulta em uma mensagem de erro na UI, sem travar o servidor.
*   **CA-4:** Tentar fazer login com credenciais incorretas resulta em uma mensagem de erro na UI.

## 4. Referências Técnicas

*   **Documentação SvelteKit - Form Actions:** [https://kit.svelte.dev/docs/form-actions](https://kit.svelte.dev/docs/form-actions)
*   **Tutorial de Autenticação da Lucia (Username e Password):** [https://lucia-auth.com/tutorials/username-and-password/sveltekit](https://lucia-auth.com/tutorials/username-and-password/sveltekit)
*   **Validação de Dados com Zod (Recomendado):** [https://zod.dev/](https://zod.dev/)