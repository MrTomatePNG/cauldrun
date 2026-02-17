# TASK-04: Integração com Object Storage (MinIO)

## 1. Objetivo

O objetivo desta tarefa é estabelecer a conexão entre o backend da aplicação (SvelteKit) e o serviço de armazenamento de objetos MinIO. Esta configuração é um pré-requisito para a implementação do upload de arquivos.

## 2. Componentes a Implementar

### 2.1. Configuração de Variáveis de Ambiente
As credenciais e os detalhes de conexão do MinIO devem ser gerenciados de forma segura através de variáveis de ambiente.
*   **Requisito:** Criar um arquivo `.env` (ou similar) para armazenar as configurações do MinIO.
*   **Especificação:** O arquivo `.env` deve conter, no mínimo, as seguintes variáveis:
    *   `S3_ENDPOINT`: A URL do servidor MinIO.
    *   `S3_ACCESS_KEY_ID`: A chave de acesso.
    *   `S3_SECRET_ACCESS_KEY`: A chave secreta.
    *   `S3_BUCKET_NAME`: O nome do bucket que será utilizado para armazenar os arquivos.

### 2.2. Módulo Cliente do S3 (`src/lib/server/s3.ts`)
Criar um módulo singleton no lado do servidor para encapsular a configuração e a instância do cliente S3.
*   **Requisito:** Instalar e configurar o SDK da AWS para JavaScript (`@aws-sdk/client-s3`).
*   **Especificação:**
    *   Instalar a dependência: `npm install @aws-sdk/client-s3`.
    *   Criar o arquivo `src/lib/server/s3.ts`.
    *   Dentro deste arquivo, importar o SvelteKit `env` para ler as variáveis de ambiente privadas (`$env/static/private`).
    *   Inicializar e exportar uma instância do `S3Client`. A configuração do cliente deve incluir:
        *   `endpoint`: `S3_ENDPOINT`
        *   `region`: Uma string genérica, como `"auto"`. MinIO não utiliza regiões da mesma forma que a AWS, mas o campo é frequentemente necessário.
        *   `credentials`: Um objeto contendo `accessKeyId` e `secretAccessKey` lidos das variáveis de ambiente.
        *   `forcePathStyle`: `true`. Essencial para que o SDK funcione com a estrutura de URL do MinIO.

## 3. Critérios de Aceitação

*   **CA-1:** O SDK `@aws-sdk/client-s3` está listado como uma dependência no `package.json`.
*   **CA-2:** As variáveis de ambiente do MinIO estão definidas e são carregadas corretamente pelo SvelteKit.
*   **CA-3:** O módulo `src/lib/server/s3.ts` foi criado e exporta uma instância configurada do `S3Client` sem erros de compilação.
*   **CA-4 (Validação Funcional):** É possível criar uma rota de API temporária para testar a conexão. Por exemplo, em um `+server.ts`, importar o cliente S3 e executar um comando simples como `ListBucketsCommand`.

    ```typescript
    // Exemplo de rota de teste
    import { s3Client } from '$lib/server/s3';
    import { ListBucketsCommand } from '@aws-sdk/client-s3';

    export async function GET() {
        try {
            const data = await s3Client.send(new ListBucketsCommand({}));
            console.log('Success', data.Buckets);
            return new Response(JSON.stringify(data.Buckets));
        } catch (err) {
            console.error('Error', err);
            return new Response('Error connecting to S3', { status: 500 });
        }
    }
    ```
    Acessar esta rota deve resultar em uma lista de buckets do seu servidor MinIO sendo exibida no console do SvelteKit, confirmando que a conexão e a autenticação foram bem-sucedidas.

## 4. Referências Técnicas

*   **Documentação do AWS SDK v3 - S3 Client:** [https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html)
*   **Guia do MinIO para AWS SDK for JavaScript:** [https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html](https://min.io/docs/minio/linux/developers/javascript/minio-javascript.html)
*   **Documentação SvelteKit - Variáveis de Ambiente:** [https://kit.svelte.dev/docs/modules#env-static-private](https://kit.svelte.dev/docs/modules#env-static-private)