# TASK-08: Implementação de Observabilidade

## 1. Objetivo

O objetivo desta tarefa é introduzir um sistema de logging estruturado no backend da aplicação para melhorar a capacidade de depuração, monitoramento e análise de comportamento em tempo de execução.

## 2. Componentes a Implementar

### 2.1. Configuração de Logger Estruturado
Integrar uma biblioteca de logging que produza logs em formato JSON.
*   **Requisito:** Substituir o uso de `console.log` por um logger dedicado.
*   **Especificação:**
    *   Instalar uma biblioteca de logging performática, como `pino`: `npm install pino`.
    *   Criar um módulo singleton para o logger (e.g., `src/lib/server/logger.ts`) que exporta uma instância base do `pino`.

### 2.2. Injeção de Logger com Request ID via Hooks
Utilizar o hook do servidor para criar um logger contextualizado para cada requisição, contendo um ID de rastreamento (Request ID).
*   **Requisito:** Todos os logs gerados durante o ciclo de vida de uma única requisição devem ser correlacionáveis.
*   **Especificação:**
    *   No `hooks.server.ts`, para cada requisição recebida:
        1.  Gerar um `requestId` único (e.g., usando `crypto.randomUUID()`).
        2.  Criar um "logger filho" a partir da instância base, injetando o `requestId` como um campo padrão: `baseLogger.child({ requestId })`.
        3.  Anexar esta instância de logger contextualizado ao `event.locals` (e.g., `event.locals.logger`).
        4.  Registrar um log inicial para marcar o recebimento da requisição, incluindo método e URL.

### 2.3. Utilização do Logger na Aplicação
Adotar o uso do logger injetado em todas as partes relevantes do código de servidor.
*   **Requisito:** Acessar o logger a partir do `event.locals` em `Form Actions` e funções `load`.
*   **Especificação:**
    *   Em qualquer `+page.server.ts` ou `+server.ts`, o logger estará disponível via `locals.logger`.
    *   Utilizar os diferentes níveis de log apropriadamente:
        *   `locals.logger.info()`: Para eventos de rotina (e.g., "Usuário X fez login").
        *   `locals.logger.warn()`: Para situações anormais que não são erros críticos (e.g., "Tentativa de upload de tipo de arquivo não suportado").
        *   `locals.logger.error()`: Para falhas de operação (e.g., "Falha ao conectar ao banco de dados", "Erro ao fazer upload para o S3"). Incluir o objeto de erro no log para capturar o stack trace: `locals.logger.error({ err: e }, 'Mensagem de erro')`.

## 3. Critérios de Aceitação

*   **CA-1:** A biblioteca `pino` está instalada e configurada.
*   **CA-2:** O `hooks.server.ts` injeta um logger com um `requestId` único no `event.locals` para cada requisição.
*   **CA-3:** Ao fazer uma requisição para qualquer rota, um log estruturado em JSON é impresso no console do servidor, contendo o `requestId`.
*   **CA-4:** Operações críticas (login, registro, upload) geram logs informativos ou de erro, todos contendo o mesmo `requestId` da requisição que as originou.
*   **Exemplo de Saída de Log (JSON):**
    ```json
    {"level":30,"time":1678886400000,"pid":123,"hostname":"server","requestId":"abc-123","msg":"User logged in","userId":"user-cuid"}
    {"level":50,"time":1678886401000,"pid":123,"hostname":"server","requestId":"def-456","err":{"stack":"..."},"msg":"Failed to upload to S3"}
    ```

## 4. Referências Técnicas

*   **PinoJS (Biblioteca de Logging):** [https://getpino.io/](https://getpino.io/)
*   **SvelteKit - `event.locals`:** [https://kit.svelte.dev/docs/hooks#server-hooks-handle](https://kit.svelte.dev/docs/hooks#server-hooks-handle) (seção sobre `event.locals`).
*   **Conceito de Request ID / Correlation ID:** [https://betterstack.com/community/guides/logging/how-to-implement-request-id-tracing-in-nodejs/](https://betterstack.com/community/guides/logging/how-to-implement-request-id-tracing-in-nodejs/)