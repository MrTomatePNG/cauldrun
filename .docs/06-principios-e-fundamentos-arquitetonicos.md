# 6. Princípios e Fundamentos Arquitetônicos

As decisões de design e arquitetura do Cauldron são baseadas em princípios modernos de desenvolvimento de software e nas melhores práticas do ecossistema Svelte, TypeScript e Node.js.

## 6.1 Design de Aplicação (Princípios)

*   **[The Twelve-Factor App](https://12factor.net/pt_br/)**
    *   **O que é?** Uma metodologia para construir aplicações SaaS (Software as a Service) robustas e escaláveis. Muitos de seus princípios são diretamente aplicáveis ao Cauldron.
    *   **Como aplicamos?**
        *   **III. Configurações:** Todas as configurações sensíveis (chaves de API, URL do banco de dados) são injetadas através de variáveis de ambiente (`.env`), nunca escritas diretamente no código. O SvelteKit facilita isso com seu [módulo de environment](https://kit.svelte.dev/docs/modules#$env-static-private).
        *   **VI. Processos:** A aplicação é executada como um ou mais processos *stateless*. O estado da sessão do usuário é gerenciado por cookies, permitindo a escalabilidade horizontal.
        *   **VII. Backing Services:** Serviços como o banco de dados PostgreSQL e o Object Storage S3 são tratados como recursos externos, acessados via rede. Suas configurações podem ser trocadas facilmente entre ambientes (desenvolvimento, produção).

## 6.2 Fontes de Verdade e Documentação

O conhecimento sobre como construir e manter o Cauldron está centralizado nas documentações das ferramentas que o compõem.

*   **[SvelteKit Docs](https://kit.svelte.dev/docs/introduction)**
    *   **Por que ler?** É a "bíblia" do projeto. Entender os conceitos fundamentais do SvelteKit é crucial: Roteamento, `load`, `actions`, `hooks`, e a distinção entre código de servidor e cliente.

*   **[Prisma Docs](https://www.prisma.io/docs/)**
    *   **Por que ler?** Essencial para entender como modelar dados no `schema.prisma`, como usar o Prisma Client para fazer queries seguras e eficientes, e como gerenciar o ciclo de vida do banco de dados com `prisma migrate`.

*   **[MDN Web Docs](https://developer.mozilla.org/en-US/)**
    *   **Por que ler?** Para qualquer dúvida sobre APIs do browser, HTML, CSS ou JavaScript. É a referência definitiva para tecnologias web padrão.

## 6.3 Ferramentas e Padrões Chave

*   **TypeScript (`strict` mode)**
    *   **Por que?** Garante a máxima segurança de tipos, prevenindo bugs comuns em JavaScript e melhorando a manutenibilidade do código. O SvelteKit tem suporte de primeira classe para TypeScript.

*   **ESLint e Prettier (com `biomejs` como alternativa)**
    *   **Por que?** Para manter um padrão de código consistente e limpo em todo o projeto. A automação da formatação e da detecção de erros de estilo economiza tempo e evita debates desnecessários.

*   **Validação de Dados com [Zod](https://zod.dev/)**
    *   **Por que?** Essencial para validar os dados que chegam em seus endpoints de API e formulários. O Zod se integra perfeitamente com TypeScript, permitindo que você defina um schema de validação e infira o tipo TypeScript a partir dele, evitando duplicação de código. Ferramentas como `sveltekit-superforms` o utilizam intensivamente.
