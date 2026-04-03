import pino from "pino";

// Usar process.env para evitar dependência do runtime do SvelteKit em testes/CLI
const isDev =
  process.env.NODE_ENV !== "production" || process.env.VITEST === "true";

export const baseLogger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "HH:MM:ss Z",
        },
      }
    : undefined, // Em prod/docker, gera JSON puro para o Loki/Promtail capturar
});

export type Logger = typeof baseLogger;
