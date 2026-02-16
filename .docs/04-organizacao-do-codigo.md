# 4. Organização do Código

A estrutura do projeto segue as convenções e melhores práticas do **SvelteKit**, que promove uma organização lógica, modular e fácil de navegar, ideal para aplicações full-stack.

## 4.1 Estrutura de Diretórios Principal

```
/
├── prisma/                 # Schema e migrações do Prisma.
│   └── schema.prisma
├── src/
│   ├── app.d.ts            # Definições de tipos globais para o SvelteKit.
│   ├── app.html            # Template HTML principal.
│   ├── app.scss            # Estilos globais.
│   ├── components/         # Componentes Svelte reutilizáveis.
│   ├── lib/                # Módulos e utilitários da aplicação.
│   │   ├── server/         # Código que executa APENAS no servidor.
│   │   └── client/         # Código que executa APENAS no cliente (browser).
│   └── routes/             # Estrutura de arquivos que define as páginas e APIs.
├── static/                 # Arquivos estáticos (ex: favicon, robots.txt).
├── svelte.config.js        # Configuração do SvelteKit.
├── tsconfig.json           # Configuração do TypeScript.
└── package.json
```

## 4.2 Detalhamento dos Diretórios

### `src/routes/`
Este é o diretório mais importante do SvelteKit. Ele usa um sistema de roteamento baseado em arquivos para definir tanto as páginas da sua aplicação quanto os endpoints da sua API.

*   **Páginas:** Um diretório como `src/routes/profile/[username]/` conterá um arquivo `+page.svelte` (a UI da página) e, opcionalmente, um `+page.server.ts` para carregar dados (`load`) no servidor antes da renderização.
*   **API Endpoints:** Um arquivo como `src/routes/api/posts/upload/+server.ts` define um endpoint de API. Ele exporta funções que correspondem aos métodos HTTP (`GET`, `POST`, `DELETE`, etc.).

### `src/lib/`
Este diretório é para todos os seus módulos e utilitários. O SvelteKit fornece um atalho de importação `$lib/` para facilitar o acesso.

*   **`$lib/server/`:** Código que só deve ser executado no servidor. Este é o local perfeito para colocar o seu **cliente Prisma**, a lógica para se comunicar com o S3, e qualquer outra coisa que contenha segredos ou que não deva ser exposta ao browser. O SvelteKit garante que o código neste diretório nunca seja incluído no bundle do cliente.
    *   `$lib/server/prisma.ts`
    *   `$lib/server/s3.ts`
*   **`$lib/client/`:** Código que só pode ser executado no browser. Útil para bibliotecas que dependem de APIs do DOM (como `window`).
*   **Módulos compartilhados:** Arquivos diretamente dentro de `$lib/` (ou em outros subdiretórios) podem ser executados tanto no servidor quanto no cliente. Ótimo para validação de dados, stores, ou tipos compartilhados.
    *   `$lib/stores/`
    *   `$lib/utils.ts`

### `src/components/`
Aqui ficam os seus componentes Svelte reutilizáveis que não são rotas. Por exemplo:
*   `Header.svelte`
*   `PostCard.svelte`
*   `CommentList.svelte`
*   `UploadModal.svelte`

### `prisma/`
Este diretório é dedicado à configuração do Prisma.
*   **`schema.prisma`:** Onde você define seus modelos de dados e a conexão com o banco.
*   **`migrations/`:** O Prisma gera e armazena os scripts de migração SQL neste subdiretório, permitindo o versionamento do schema do seu banco de dados.
