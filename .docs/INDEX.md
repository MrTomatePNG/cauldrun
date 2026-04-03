# Documentação Técnica - Buero

Bem-vindo à documentação oficial do projeto Buero. Esta estrutura foi desenhada para fornecer uma visão clara e técnica dos componentes, fluxos e infraestrutura do sistema.

## 📂 Navegação por Tópicos

### 🏗️ [Arquitetura Global](./ARCHITECTURE.md)
Visão geral do ecossistema, stack tecnológica e integração entre serviços.

### 🔐 [Fluxo de Autenticação](./AUTH.md)
Detalhes sobre a implementação do Better Auth, ciclo de vida da sessão e segurança.

### 📽️ [Pipeline de Mídia](./MEDIA_PIPELINE.md)
Entenda como os uploads são processados de forma assíncrona via BullMQ e Workers.

### 🌐 [Infraestrutura e Observabilidade](./INFRA.md)
Informações sobre Proxy (Caddy), Cache (Varnish) e Monitoramento (Loki/Prometheus/Grafana).

---
*Esta documentação é atualizada conforme a evolução do projeto, servindo como a fonte única da verdade para decisões arquiteturais.*
