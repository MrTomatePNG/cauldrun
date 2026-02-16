# 7. Principais Recursos do Svelte e SvelteKit

Este documento serve como uma referência rápida para as funcionalidades mais importantes do Svelte e SvelteKit que utilizamos no desenvolvimento.

---

### Recursos do Svelte (O Compilador de UI)

O Svelte é a base para a construção dos nossos componentes de interface.

#### Reatividade com Runas (Svelte 5)

A "magia" do Svelte de atualizar a interface automaticamente quando os dados mudam. As Runas tornam esse processo mais explícito e poderoso.

*   **`$state()`**: Declara uma variável como uma fonte de estado reativo.
    ```svelte
    let count = $state(0);
    ```
*   **`$derived()`**: Cria um valor derivado de outro(s) estado(s). Ele é recalculado automaticamente.
    ```svelte
    let double = $derived(count * 2);
    ```
*   **`$effect()`**: Executa um código sempre que uma de suas dependências reativas mudar. Útil para interagir com o mundo exterior (ex: `localStorage`).
    ```javascript
    $effect(() => {
      console.log('O contador agora é:', count);
    });
    ```
*   **[Leia mais sobre Runas na documentação oficial](https://svelte.dev/docs/runes)**

#### Stores (Lojas de Estado)

Para compartilhar estado entre componentes que não têm uma relação direta.

*   **Conceito:** São simplesmente objetos com um método `subscribe`. São ótimos para guardar informações globais, como o usuário logado.
    ```javascript
    // src/lib/stores/userStore.js
    import { writable } from 'svelte/store';
    export const currentUser = writable(null);
    ```
*   **[Leia mais sobre Stores](https://svelte.dev/docs/svelte-store)**

#### Diretivas

Atributos especiais que você adiciona aos elementos HTML para dar-lhes comportamento extra.

*   **`bind:property`**: Sincroniza uma variável e uma propriedade de um elemento (ex: o `value` de um input).
    ```svelte
    <input bind:value={userName} />
    ```
*   **`class:name={condition}`**: Adiciona ou remove uma classe CSS com base em uma condição.
    ```svelte
    <div class:active={isActive}>...</div>
    ```
*   **`style:property={value}`**: Aplica estilos CSS dinamicamente.
    ```svelte
    <div style:color={userColor}>...</div>
    ```
*   **`transition:fn` / `in:fn` / `out:fn`**: Anima a entrada e/ou saída de um elemento do DOM.
    ```svelte
    {#if isVisible}
      <div transition:fade>Aparece suavemente</div>
    {/if}
    ```
*   **[Leia mais sobre Diretivas de Template](https://svelte.dev/docs/template-syntax)**

---

### Recursos do SvelteKit (O Framework Full-Stack)

O SvelteKit usa o Svelte para construir aplicações completas, com roteamento, renderização no servidor e muito mais.

#### Roteamento Baseado em Arquivos

A estrutura de pastas em `src/routes/` define automaticamente as rotas da sua aplicação.
*   `src/routes/about/+page.svelte` -> cria a página `/about`.
*   `src/routes/api/posts/+server.ts` -> cria o endpoint de API `/api/posts`.
*   **[Leia mais sobre Roteamento](https://kit.svelte.dev/docs/routing)**

#### `load` Functions

A forma canônica de carregar dados para uma página. Roda no servidor antes da renderização.
*   **Local:** Dentro de um arquivo `+page.server.ts`.
*   **Função:** Busca dados do banco de dados ou de uma API externa e os entrega ao componente da página como `props`.
*   **[Leia mais sobre Carregamento de Dados](https://kit.svelte.dev/docs/load)**

#### Form Actions

A forma segura e integrada de lidar com submissões de formulários HTML.
*   **Local:** Funções exportadas de `+page.server.ts`.
*   **Função:** Recebe os dados do formulário, realiza mutações no banco de dados e pode retornar dados para a página.
*   **[Leia mais sobre Forms e Actions](https://kit.svelte.dev/docs/form-actions)**

#### Hooks (`hooks.server.ts`)

Permite interceptar todas as requisições que chegam ao servidor.
*   **Função:** É o "middleware" do SvelteKit. Perfeito para lógica de autenticação, logging e manipulação de cookies.
*   **[Leia mais sobre Hooks](https://kit.svelte.dev/docs/hooks)**
