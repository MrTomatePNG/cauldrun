# 3. Fluxo de Upload Simplificado

Diferente da arquitetura original, o Cauldron adota um fluxo de upload de mídia muito mais direto e simplificado, que é robusto e ideal para ambientes de desenvolvimento web modernos como o SvelteKit. A complexidade de workers, filas e processos de manutenção (`janitor`) é removida em favor da simplicidade e da delegação a serviços externos.

## 3.1 O Fluxo de Upload

O processo ocorre em uma única sequência lógica, iniciada pelo usuário e orquestrada pelo backend do SvelteKit.

---

**`[CLIENTE (Browser)]` ---> `[BACKEND (SvelteKit)]` ---> `[OBJECT STORAGE (S3)]`**

---

### **Etapa 1: Cliente (Componente Svelte)**

1.  **Seleção do Arquivo:** O usuário seleciona uma imagem ou vídeo através de um `<input type="file">` em um componente Svelte (ex: `UploadModal.svelte`).
2.  **(Opcional) Otimização no Cliente:** Para melhorar a performance e reduzir o consumo de dados, o cliente pode realizar otimizações antes do upload:
    *   **Imagens:** Gerar um thumbnail usando a API do Canvas.
    *   **Vídeos:** Capturar o primeiro frame como thumbnail.
3.  **Envio para a API:** O arquivo é enviado para um endpoint de API do SvelteKit via uma requisição `POST` (`multipart/form-data`). A requisição inclui o cookie de sessão para autenticação.

### **Etapa 2: Backend (Endpoint de API do SvelteKit)**

Este é o "cérebro" do processo. Ele é responsável por validar a requisição e coordenar a operação.

1.  **Autenticação e Autorização:** O endpoint primeiro verifica se o usuário está autenticado, usando os cookies de sessão do SvelteKit. Se não estiver, a requisição é rejeitada.
2.  **Recebimento do Arquivo:** O servidor recebe o stream do arquivo.
3.  **Proxy para o Object Storage:** Em vez de salvar o arquivo no disco local, o backend atua como um proxy. Ele utiliza um SDK (ex: `aws-sdk`) para fazer o **stream do arquivo diretamente para o bucket** no serviço de Object Storage (Minio, AWS S3, etc.).
    *   **Vantagem:** O arquivo não precisa ser totalmente carregado na memória ou no disco do servidor, tornando o processo eficiente em termos de recursos.
4.  **Recebimento da URL:** Após o upload ser concluído com sucesso, o serviço de Object Storage retorna a URL pública (ou o identificador) do arquivo.

### **Etapa 3: Persistência no Banco de Dados**

1.  **Criação do Registro:** Com a URL da mídia em mãos, o endpoint do SvelteKit usa o **Prisma Client** para criar um novo registro na tabela `Post`.
2.  **Dados Salvos:** O registro conterá:
    *   `mediaUrl`: A URL do arquivo no S3.
    *   `mediaType`: O tipo de mídia ('IMAGE' ou 'VIDEO').
    *   `authorId`: O ID do usuário autenticado.
    *   Qualquer outra informação relevante (ex: legenda).
3.  **Resposta ao Cliente:** O backend retorna uma resposta de sucesso (`201 Created`) para o cliente, possivelmente com os dados do novo post criado. A interface do usuário pode então ser atualizada para exibir o novo post no feed.

Este fluxo é significativamente mais simples de implementar e manter, ao mesmo tempo em que é altamente escalável e robusto, pois depende de serviços especializados para o armazenamento de arquivos.
