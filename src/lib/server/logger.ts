import pino from "pino";
import { dev } from "$app/environment";

// Configuração base do logger
export const baseLogger = pino({
    level: dev ? "debug" : "info",
    transport: dev ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "HH:MM:ss Z",
        }
    } : undefined, // Em prod, usa JSON puro para performance e ingestão facilitada
});

export type Logger = typeof baseLogger;
