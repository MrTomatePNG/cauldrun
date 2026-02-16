# 2. Arquitetura de Dados

A camada de persistência do Cauldron é projetada para ser robusta, escalável e fácil de manter, utilizando ferramentas modernas do ecossistema TypeScript.

## 2.1 Tecnologias Escolhidas

*   **PostgreSQL:** Continua sendo a **fonte da verdade** principal do sistema. Sua robustez, confiabilidade e suporte a tipos de dados avançados o tornam a escolha ideal para armazenar os dados relacionais da aplicação (usuários, posts, comentários, etc.).

*   **Prisma:** É o ORM (Object-Relational Mapper) que faz a ponte entre a aplicação Node.js (SvelteKit) e o banco de dados PostgreSQL.
    *   **Por que Prisma?**
        1.  **Segurança de Tipos:** Gera um cliente TypeScript totalmente tipado a partir do seu schema, o que elimina uma classe inteira de erros em tempo de desenvolvimento e habilita o autocompletar.
        2.  **Schema Declarativo:** O `schema.prisma` é uma forma intuitiva e clara de modelar seus dados e relacionamentos em um único lugar.
        3.  **Abstração Segura:** Previne SQL Injection por padrão e simplifica a escrita de queries complexas.
        4.  **Ecossistema:** Inclui ferramentas para migração de banco de dados (`prisma migrate`) e um estúdio visual para explorar os dados (`prisma studio`).

*   **Object Storage (Compatível com S3):** Para o armazenamento de arquivos de mídia (imagens e vídeos).
    *   **Por que não no banco de dados ou sistema de arquivos local?**
        1.  **Escalabilidade:** Serviços como AWS S3, Cloudflare R2 ou Minio são projetados para armazenar petabytes de dados de forma barata e eficiente.
        2.  **Performance:** Servir arquivos diretamente de um serviço de object storage (especialmente com um CDN na frente) é muito mais rápido e eficiente do que através da aplicação.
        3.  **Separação de Interesses:** Mantém o servidor da aplicação focado na lógica de negócio e o banco de dados focado em metadados, enquanto o armazenamento de blobs fica a cargo de um serviço especializado.

## 2.2 Modelagem de Dados (schema.prisma)

O `schema.prisma` é o coração da nossa camada de dados. Abaixo, um exemplo da estrutura inicial:

```prisma
// datasource e generator
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// models
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String   // Armazenará o hash da senha
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  comments  Comment[]
  likes     Like[]
}

model Post {
  id        String   @id @default(cuid())
  mediaUrl  String   // URL do arquivo no serviço S3
  mediaType String   // 'IMAGE' ou 'VIDEO'
  caption   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  comments  Comment[]
  likes     Like[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())

  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
}

model Like {
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@id([userId, postId]) // Chave primária composta
}
```
