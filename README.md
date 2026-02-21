# Projeto Sewer Comedy 🔥: Roteiro Técnico

## 1. Introdução

Este documento delineia o plano de desenvolvimento estratégico para o projeto **Sewer Comedy**. O objetivo é fornecer uma estrutura de marcos e tarefas sequenciais para a construção de uma plataforma de mídia social ácida. A metodologia foca em entregas incrementais com critérios de aceitação claros para cada fase.

### 1.1. Status de Lançamento
*   **Versão Atual:** `v0.1.0-alpha`
*   **Ambiente:** Produção (Magalu Cloud) + Dev (MinIO Docker)
*   **Status Geral:** Core funcional, feed interativo e auditoria humana ativos.

### 1.2. Stack Tecnológica
*   **Framework:** SvelteKit (Svelte 5 - Runas)
*   **Autenticação:** Better Auth + Resend (E-mail Verification)
*   **Banco de Dados:** PostgreSQL + Prisma ORM
*   **Armazenamento:** S3 Compatible + Caddy Cache (Edge)
*   **Observabilidade:** Pino Structured Logging

## 2. Roteiro de Desenvolvimento

### Milestone 1: Infraestrutura de Autenticação e Acesso
**Status:** 100% ✅

| ID | Tarefa | Critérios de Aceitação | Status |
| :-- | :--- | :--- | :--- |
| 01 | Core de Autenticação | Better Auth integrado ao Prisma. | ✅ |
| 02 | UI de Autenticação | Login/Cadastro minimalista em Svelte 5. | ✅ |
| 03 | Controle de Acesso | Redirecionamentos e Auditoria Humana funcional. | ✅ |

### Milestone 2: Gestão de Conteúdo Multimídia
**Status:** 100% ✅

| ID | Tarefa | Critérios de Aceitação | Status |
| :-- | :--- | :--- | :--- |
| 04 | Object Storage | Integração S3 (MinIO/Magalu) com Caddy Cache. | ✅ |
| 05 | Fluxo de Upload | Studio com preview e validação MIME/Size. | ✅ |
| 06 | Feed Principal | Navegação tátil/mouse/teclado fluida. | ✅ |

### Milestone 3: Refinamento e Observabilidade (Fase Alpha)
**Status:** 90% 🔄

| ID | Tarefa | Critérios de Aceitação | Status |
| :-- | :--- | :--- | :--- |
| 07 | Otimização UI/UX | Feedbacks de loading e transições de estado. | ✅ |
| 08 | Observabilidade | Logs estruturados (Pino) e Request Tracking. | ✅ |
| 09 | Verificação de E-mail | Fluxo obrigatório via Resend para uploads. | ✅ |

### Milestone 4: Engajamento e Comunidade (Fase Beta)
**Status:** 0% 🔲

| ID | Tarefa | Critérios de Aceitação | Status |
| :-- | :--- | :--- | :--- |
| 10 | Sistema de Likes | Curtir/Descurtir posts com persistência. | ✅ |
| 11 | Comentários | Discussão ácida em cada post. | [ ] |
| 12 | Seguidores | Rede de conexões entre usuários. | [ ] |
| 13 | Notificações | Avisos de interações em tempo real. | [ ] |

---

## 3. Metodologia de Trabalho

Conforme definido no `AGENTS.md`, todas as alterações devem ser propostas, auditadas para segurança e validadas antes da implementação. A integridade dos dados e a performance do feed são prioridades máximas.
