# TASK-01: Implementação do Core de Autenticação

## 1. Objetivo

O objetivo desta tarefa é estabelecer a camada fundamental do sistema de autenticação utilizando Lucia Auth. A implementação se concentrará exclusivamente na lógica de backend, sem desenvolvimento de interface de usuário. Ao final, o sistema deverá ser capaz de gerenciar e validar sessões de usuários de forma programática.

## 2. Componentes a Implementar

### 2.1. Schema de Dados (`prisma/schema.prisma`)
O schema do Prisma deve ser estendido para suportar os modelos exigidos pela Lucia Auth.
*   **Requisito:** Os modelos `User`, `Session` e `Key` devem ser definidos ou ajustados.
*   **Especificação:** O tipo de dado para os campos de ID (`id`) deve ser `String`, utilizando `cuid()` como valor padrão para garantir identificadores únicos e não sequenciais. Chaves estrangeiras relacionadas devem ser atualizadas correspondentemente.

### 2.2. Singleton de Autenticação (`src/lib/server/auth.ts`)
Um módulo deve ser criado para centralizar a inicialização e configuração da instância da Lucia.
*   **Requisito:** Este arquivo deve exportar uma única instância `lucia`.
*   **Especificação:** O módulo deve utilizar o `PrismaAdapter` para conectar a Lucia ao banco de dados. A configuração deve definir os atributos do usuário a serem incluídos no objeto de sessão (e.g., `username`, `email`) e garantir que cookies seguros (`secure: true`) sejam utilizados em ambiente de produção (`!dev`).

### 2.3. Hook de Servidor (`src/hooks.server.ts`)
Este middleware é responsável por interceptar todas as requisições e validar a identidade do usuário.
*   **Requisito:** Implementar o hook `handle` para inspecionar o cookie de sessão em cada requisição.
*   **Especificação:** O hook deve:
    1.  Extrair o `sessionId` do cookie da requisição.
    2.  Utilizar `lucia.validateSession(sessionId)` para validar a sessão.
    3.  Se a sessão for válida, popular `event.locals.user` e `event.locals.session` com os dados retornados.
    4.  Se a sessão for válida e tiver sido atualizada (`session.fresh`), definir um novo cookie de sessão na resposta.
    5.  Se a sessão for inválida, limpar `event.locals` e, se necessário, o cookie no navegador.

## 3. Critérios de Aceitação

*   **CA-1:** O schema do Prisma foi migrado com sucesso para o banco de dados (`npx prisma migrate dev`), e os novos modelos existem na base de dados.
*   **CA-2:** O arquivo `src/lib/server/auth.ts` foi criado e não apresenta erros de compilação.
*   **CA-3:** O arquivo `src/hooks.server.ts` foi criado e não apresenta erros de compilação.
*   **CA-4 (Validação Funcional):** É possível adicionar o seguinte código a um endpoint de página (e.g., `src/routes/+page.server.ts`) para verificar o funcionamento do hook:

    ```typescript
    import type { PageServerLoad } from './$types';

    export const load: PageServerLoad = async ({ locals }) => {
        // Validação: O console do servidor deve exibir 'null' ao acessar a página.
        console.log('User from locals:', locals.user);
        return {
            user: locals.user
        };
    };
    ```
    Acessar a rota correspondente deve resultar na exibição de `User from locals: null` no console do processo do SvelteKit, confirmando que o hook foi executado e `locals.user` está sendo corretamente definido (como nulo, nesta fase).

## 4. Referências Técnicas

*   **Documentação Lucia Auth - SvelteKit:** [https://lucia-auth.com/getting-started/sveltekit](https://lucia-auth.com/getting-started/sveltekit)
*   **Documentação Lucia Auth - Prisma Adapter:** [https://lucia-auth.com/database/prisma](https://lucia-auth.com/database/prisma)
*   **Documentação SvelteKit - Hooks:** [https://kit.svelte.dev/docs/hooks](https://kit.svelte.dev/docs/hooks)
