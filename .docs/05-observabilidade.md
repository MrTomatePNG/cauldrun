# 5. Observabilidade

Observabilidade é a capacidade de entender o que está acontecendo dentro do sistema observando suas saídas externas (logs, métricas, traces). Em uma aplicação web moderna, ter uma boa estratégia de observabilidade é fundamental para depurar problemas, monitorar a performance e entender o comportamento do usuário.

## 5.1 Logs Estruturados (Structured Logging)

Logs em texto plano são difíceis de consultar e analisar. A melhor prática é gerar **logs estruturados em formato JSON**, que podem ser facilmente ingeridos, indexados e consultados por serviços de gerenciamento de logs (como Datadog, Grafana Loki, ou o ELK Stack).

*   **Ferramenta Recomendada:** [**Pino**](https://getpino.io/) é uma biblioteca de logging para Node.js extremamente performática e popular que gera logs em JSON por padrão.

**Exemplo de log estruturado vs. não estruturado:**

```typescript
// Não estruturado (ruim em produção)
console.log(`User ${userId} failed to upload file.`);

// Estruturado com Pino (bom)
import pino from 'pino';
const logger = pino();

logger.error({ userId, reason: 'Invalid file type' }, 'File upload failed');
```

**Saída JSON do log estruturado:**
```json
{
  "level": 50,
  "time": 1676563200000,
  "pid": 12345,
  "hostname": "server-name",
  "userId": "cuid-abcd-1234",
  "reason": "Invalid file type",
  "msg": "File upload failed"
}
```

## 5.2 Rastreabilidade com Request ID

Para conectar todos os logs gerados por uma única requisição HTTP, usamos um **Request ID** (também chamado de `Trace ID` ou `Correlation ID`).

O SvelteKit oferece um local perfeito para implementar isso: o hook `handle` no arquivo `src/hooks.server.ts`.

**Fluxo de Implementação:**

1.  **Gerar ID:** No início de cada requisição no hook `handle`, gere um ID único (usando `crypto.randomUUID()`).
2.  **Criar um Logger Contextualizado:** Crie uma instância do logger (Pino) específica para essa requisição, com o `requestId` como um campo padrão.
3.  **Anexar ao Evento:** Anexe a instância do logger ao objeto `event.locals` do SvelteKit. `event.locals` é o local projetado para armazenar dados durante o ciclo de vida de uma requisição.
4.  **Usar o Logger:** Em qualquer lugar no backend (funções `load`, endpoints de API), você pode acessar `event.locals.logger` para registrar eventos. Todos os logs gerados automaticamente incluirão o `requestId` correto.

**Exemplo (`src/hooks.server.ts`):**
```typescript
import { randomUUID } from 'crypto';
import type { Handle } from '@sveltejs/kit';
import pino from 'pino';

const baseLogger = pino();

export const handle: Handle = async ({ event, resolve }) => {
  const requestId = randomUUID();

  // Cria um logger filho com o requestId
  const logger = baseLogger.child({ requestId });
  event.locals.logger = logger;

  logger.info({ method: event.request.method, url: event.request.url }, 'Request received');

  const response = await resolve(event);
  return response;
};
```
**Exemplo de uso em um endpoint:**
```typescript
// src/routes/api/some-route/+server.ts
export async function POST({ locals, request }) {
  // O logger já vem com o requestId
  locals.logger.info('Handling POST request');
  
  // ... lógica ...

  return new Response('OK');
}
```

Com essa abordagem, você pode filtrar seus logs por um `requestId` específico para ver a "história" completa de como uma requisição foi processada pelo seu sistema.
