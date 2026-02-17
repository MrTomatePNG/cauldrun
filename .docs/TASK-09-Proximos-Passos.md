# TASK-09: Planejamento de Novas Features

## 1. Objetivo

O objetivo desta tarefa é analisar e definir as especificações técnicas para o próximo conjunto de funcionalidades a serem implementadas no Cauldron. Esta é uma tarefa de planejamento estratégico, não de codificação.

## 2. Processo de Análise e Especificação

Para cada funcionalidade futura, o seguinte processo deve ser seguido:

### 2.1. Definição da Funcionalidade
Descrever em alto nível o que a funcionalidade faz e qual valor ela agrega ao usuário.

*   **Exemplo (Comentários):** "Permitir que usuários autenticados adicionem comentários de texto a um post existente. Isso aumenta o engajamento do usuário com o conteúdo."

### 2.2. Modificações no Schema de Dados (`prisma/schema.prisma`)
Identificar e definir quaisquer novos modelos ou modificações nos modelos existentes.

*   **Exemplo (Comentários):**
    *   Criar um novo modelo `Comment`.
    *   **Campos:** `id`, `content` (String), `createdAt`.
    *   **Relações:**
        *   Um `Comment` pertence a um `User` (o autor do comentário).
        *   Um `Comment` pertence a um `Post`.
        *   Atualizar `User` e `Post` para incluir uma relação de `Comment[]`.

### 2.3. Endpoints de API / Form Actions
Definir as novas rotas de API ou `Form Actions` necessárias para suportar a funcionalidade.

*   **Exemplo (Comentários):**
    *   **`POST /posts/[postId]/comments` (Form Action `?/addComment`):**
        *   **Entrada:** `content`.
        *   **Lógica:** Validar autenticação. Criar um novo registro `Comment` associado ao `postId` e ao `userId` do usuário logado.
        *   **Saída:** Sucesso ou erro.
    *   **`DELETE /comments/[commentId]` (Form Action `?/deleteComment`):**
        *   **Entrada:** N/A.
        *   **Lógica:** Validar que o usuário logado é o autor do comentário. Deletar o registro `Comment`.
        *   **Saída:** Sucesso ou erro.

### 2.4. Modificações na Interface do Usuário (UI)
Descrever os novos componentes ou alterações nos componentes existentes.

*   **Exemplo (Comentários):**
    *   **Componente `CommentList.svelte`:** Recebe um `postId`, busca e exibe uma lista de comentários.
    *   **Componente `AddCommentForm.svelte`:** Um formulário com um `textarea` e um botão de `submit` que utiliza a `Form Action` `?/addComment`.
    *   **Integração:** Adicionar `CommentList` e `AddCommentForm` ao componente `Post.svelte` ou a uma visão detalhada do post.

## 3. Funcionalidades Propostas para Avaliação

A seguir, uma lista de funcionalidades candidatas para especificação:

| Funcionalidade      | Descrição Breve                                                   |
| :------------------ | :---------------------------------------------------------------- |
| **Comentários**     | Permitir que usuários comentem nos posts.                         |
| **Likes/Curtidas**  | Permitir que usuários curtam ou descurtam posts.                  |
| **Perfis de Usuário**| Expandir a página de perfil para exibir os posts de um usuário.   |
| **Tags/Categorias** | Permitir a associação de tags aos posts e a filtragem por tag.    |
| **Seguidores**      | Implementar um sistema de "seguir" outros usuários.               |
| **Notificações**    | Notificar usuários sobre novas curtidas, comentários ou seguidores.|

## 4. Critérios de Aceitação

*   **CA-1:** Para pelo menos **duas** das funcionalidades propostas acima (e.g., Comentários e Likes), um documento de especificação técnica foi criado.
*   **CA-2:** Cada especificação detalha os quatro pontos descritos na Seção 2 (Definição, Schema, API, UI).
*   **CA-3:** As modificações propostas no schema são consistentes e as relações entre os modelos estão corretamente definidas.

*Nota: O resultado desta tarefa não é código, mas sim os documentos de planejamento que guiarão o desenvolvimento futuro.*