# 1. Visão Geral do Projeto "Cauldron"

**Stack Principal:** SvelteKit, TypeScript, PostgreSQL, Prisma, Object Storage (S3).

## 1.1 Objetivo Primário

Cauldron é projetado como uma plataforma de mídia social moderna, otimizada para o compartilhamento e consumo de conteúdo visual (imagens e vídeos curtos). O objetivo é criar uma experiência de usuário fluida, reativa e performática, aproveitando as vantagens de uma arquitetura web contemporânea.

Os pilares do projeto são:

*   **Experiência do Usuário (UX):** Construir uma interface rápida, intuitiva e agradável, com transições suaves e feedback instantâneo, utilizando a reatividade do Svelte.
*   **Desenvolvimento Ágil:** Utilizar o SvelteKit para unificar o desenvolvimento de frontend e backend, acelerando a implementação de novas funcionalidades.
*   **Arquitetura Simplificada:** Adotar uma abordagem direta para funcionalidades complexas como o upload de mídia, delegando o armazenamento a serviços de object storage robustos e escaláveis.
*   **Performance:** Tirar proveito da renderização no servidor (SSR) e hidratação do SvelteKit para garantir que o conteúdo seja carregado rapidamente e que a aplicação tenha boa performance de SEO.

## 1.2 O Desafio: Upload de Mídia em um Ambiente Web Moderno

O principal desafio técnico em uma aplicação de mídia social é gerenciar o upload de arquivos de forma eficiente sem degradar a experiência do usuário.

Em vez de construir um pipeline de processamento complexo e assíncrono no backend (como na arquitetura original em Go), a abordagem do Cauldron é simplificar e otimizar o fluxo:

1.  **Interface Reativa:** O frontend, construído em Svelte, oferece uma experiência de upload interativa, possivelmente com pré-visualização e otimizações no lado do cliente (como geração de thumbnails).
2.  **Backend como Proxy Inteligente:** O backend do SvelteKit atua como um intermediário seguro. Ele autentica o usuário e faz o stream do arquivo diretamente para um serviço de armazenamento externo (S3/Minio).
3.  **Fonte da Verdade Centralizada:** O banco de dados PostgreSQL, gerenciado pelo Prisma, armazena apenas os metadados dos posts (como a URL da mídia no serviço de armazenamento), mantendo o banco de dados leve e rápido.

## 1.3 Princípios Arquitetônicos

*   **Simplicidade e Pragmatismo:** A complexidade só é adicionada quando estritamente necessária. A arquitetura inicial é a mais simples possível para cumprir os requisitos.
*   **Componentização:** A UI é construída como uma coleção de componentes Svelte reutilizáveis e bem definidos, facilitando a manutenção e a consistência visual.
*   **Segurança em Primeiro Lugar:** Todas as operações de escrita (uploads, comentários) são protegidas por endpoints de API que validam a sessão do usuário e os dados de entrada.
*   **State Management Declarativo:** O estado da aplicação é gerenciado de forma declarativa usando as `stores` do Svelte, garantindo que a UI sempre reflita o estado atual dos dados de forma consistente.
