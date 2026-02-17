# TASK-05: Implementação do Fluxo de Upload

## 1. Objetivo

O objetivo desta tarefa é implementar a funcionalidade completa de upload de arquivos, desde a interface do usuário até o armazenamento do arquivo no MinIO e a criação do registro correspondente no banco de dados.

## 2. Componentes a Implementar

### 2.1. Modal de Upload (Componente Svelte)
Criar um componente de UI reutilizável para o upload de posts.
*   **Requisito:** O componente deve conter um formulário que permita ao usuário selecionar um arquivo e adicionar uma legenda.
*   **Especificação:**
    *   Criar um componente Svelte (e.g., `src/components/UploadModal.svelte`).
    *   O formulário deve ser `multipart/form-data` e usar `method="POST"`.
    *   Incluir um `<input type="file" name="media" />` para a seleção do arquivo.
    *   Incluir um `<textarea name="caption"></textarea>` para a legenda.
    *   A `action` do formulário deve apontar para um endpoint de `Form Action` dedicado (e.g., `?/createPost`).

### 2.2. Lógica de Upload (Form Action)
Implementar a `Form Action` que orquestra o processo de upload no lado do servidor.
*   **Requisito:** Criar uma `action` (e.g., `createPost`) em um `+page.server.ts` apropriado (pode ser no layout principal ou em uma rota específica de "criação").
*   **Especificação:**
    1.  **Autenticação:** A `action` deve primeiro verificar se há um usuário autenticado em `event.locals.user`. Se não, deve retornar um erro de não autorizado.
    2.  **Extração de Dados:** Extrair o arquivo e a legenda do `FormData`. O arquivo será um objeto do tipo `File`.
    3.  **Upload para o S3:**
        *   Instalar `uuid` (`npm install uuid @types/uuid`) para gerar nomes de arquivo únicos.
        *   Usar o cliente S3 (`s3Client`) e o comando `PutObjectCommand` para enviar o arquivo para o MinIO. O `Body` do comando pode ser o `Buffer` do arquivo.
        *   O `Key` (nome do arquivo no bucket) deve ser único, por exemplo, usando `uuidv4()`.
    4.  **Criação do Registro no Banco de Dados:**
        *   Após o upload bem-sucedido, construir a URL pública do arquivo no MinIO.
        *   Usar o `prisma.post.create` para salvar os metadados do post, incluindo `mediaUrl`, `caption`, e o `authorId` do usuário logado.
    5.  **Resposta:** Em caso de sucesso, a `action` deve invalidar os dados do feed (para que ele seja recarregado) e/ou retornar uma mensagem de sucesso.

## 3. Critérios de Aceitação

*   **CA-1:** O usuário pode selecionar um arquivo e escrever uma legenda no modal de upload e submeter o formulário.
*   **CA-2:** A `Form Action` no servidor recebe o arquivo e a legenda.
*   **CA-3:** O arquivo é enviado com sucesso para o bucket do MinIO com um nome de arquivo único.
*   **CA-4:** Um novo registro é criado na tabela `Post` do banco de dados, contendo a URL correta do arquivo no MinIO e os outros metadados.
*   **CA-5:** A interface do usuário é notificada do sucesso (e.g., o modal fecha, uma mensagem aparece).

## 4. Referências Técnicas

*   **AWS SDK v3 - `PutObjectCommand`:** [https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/classes/_aws_sdk_client_s3.PutObjectCommand.html](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/classes/_aws_sdk_client_s3.PutObjectCommand.html)
*   **SvelteKit - `FormData` em Form Actions:** A documentação das `Form Actions` mostra como acessar os dados do formulário, incluindo arquivos. [https://kit.svelte.dev/docs/form-actions#handling-files](https://kit.svelte.dev/docs/form-actions#handling-files)
*   **Node.js `Buffer`:** Para converter o arquivo em um buffer para o SDK da AWS. [https://nodejs.org/api/buffer.html](https://nodejs.org/api/buffer.html)
*   **Package `uuid`:** [https://www.npmjs.com/package/uuid](https://www.npmjs.com/package/uuid)