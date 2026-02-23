# Diretrizes para Agentes de IA - Projeto Sewer Comedy

Este documento define o protocolo de atuação, o contexto técnico e as responsabilidades de qualquer agente de IA que opere neste repositório. O objetivo é garantir a segurança, a integridade do código e a conformidade com as versões tecnológicas utilizadas.

## 1. Contexto Tecnológico

O projeto utiliza as seguintes tecnologias em suas versões estáveis mais recentes (conforme `package.json`):

*   **Framework:** SvelteKit (Svelte 5 - Uso obrigatório de Runas: `$state`, `$derived`, `$props`).
*   **Autenticação:** Better Auth (v1.1+).
*   **Banco de Dados:** PostgreSQL.
*   **ORM:** Prisma (v7.4+).
*   **Armazenamento:** Object Storage compatível com S3 (MinIO para desenvolvimento, Magalu Cloud para produção).
*   **Estilização:** SCSS (Sass) nativo via Vite.

## 2. Estrutura de Diretórios e Convenções

As responsabilidades devem ser isoladas conforme a estrutura abaixo:

*   `src/lib/server/`: Código exclusivo de servidor (Secrets, S3 Client, DB Client). **Nunca** importar no cliente.
*   `src/lib/auth.ts`: Configuração do servidor Better Auth.
*   `src/lib/auth-client.ts`: Configuração do cliente Better Auth. **Deve usar `import type { Auth }`** para evitar vazamento de código de servidor.
*   `prisma/schema.prisma`: Fonte da verdade do banco de dados. **Nunca alterar `generator` ou `output`** sem instrução explícita.
*   `src/routes/`: Definição de rotas e lógica de página.

## 3. Protocolo de Atuação do Agente

O agente deve seguir rigorosamente estes passos antes de qualquer modificação:

### 3.1. Pesquisa e Monitoramento
*   Sempre pesquisar por brechas de segurança (CVEs) e bugs conhecidos nas ferramentas listadas (especialmente Better Auth e Prisma).
*   Verificar atualizações de dependências antes de sugerir mudanças.

### 3.2. Proposta de Alteração (Obrigatório)
Antes de escrever ou alterar qualquer código, o agente **DEVE**:
1.  Identificar o problema ou a melhoria.
2.  Listar exatamente quais arquivos serão alterados.
3.  Descrever detalhadamente a lógica que será aplicada.
4.  **Pedir permissão explícita do usuário.**

### 3.3. Verificação e Validação
*   **Reverificação:** Antes de aplicar um `replace` ou `write_file`, ler o arquivo atual para garantir que o contexto e a indentação estão precisos.
*   **Segurança:** Auditar se a mudança expõe segredos (`$env/static/private`) ao cliente.
*   **Integridade:** Garantir que a mudança não quebra a tipagem do TypeScript.

## 4. Foco Prioritário: Segurança e Resiliência

O agente deve atuar como um auditor contínuo:
*   **Detecção de Brechas:** Verificar proteção de rotas, validação de inputs (Zod recomendado) e permissões de acesso ao S3.
*   **Performance:** Identificar consultas pesadas ao banco de dados ou vazamentos de memória.
*   **Tratamento de Erros:** Garantir que falhas de rede ou banco não exponham stack traces ao usuário final.

---

*Este documento é a base para a colaboração entre humanos e IA no Sewer Comedy. O não cumprimento destes protocolos deve ser reportado imediatamente.*
