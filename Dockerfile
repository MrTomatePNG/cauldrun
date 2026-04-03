# Base stage: Imagem Alpine padronizada
FROM oven/bun:1-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl

# Dependencies stage: Instala todas as dependências (dev + prod)
FROM base AS deps
COPY package.json bun.lock ./
COPY prisma ./prisma/
RUN bun install --frozen-lockfile

# Builder stage: Gera o Prisma Client e compila o SvelteKit
FROM deps AS builder
COPY . .
RUN bun run prisma generate
RUN bun run build

# Development stage: Usado apenas no perfil "dev" do Docker Compose
FROM deps AS development
COPY . .
RUN bun run prisma generate
CMD ["bun", "run", "dev"]

# Runner stage: Imagem final otimizada para produção
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Dependências de runtime (FFmpeg para processamento de vídeo)
RUN apk add --no-cache ffmpeg openssl ca-certificates

# Copia apenas os artefatos necessários do builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Instala apenas dependências de produção e gera o Prisma Client para o runtime
RUN bun install --production
RUN bun run prisma generate

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Executa o entrypoint gerado pelo adapter-bun
CMD ["bun", "./build/index.js"]
