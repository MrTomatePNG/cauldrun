import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { sendVerificationEmail } from "./server/email";
import prisma from "./prisma";

// Helper para envs compatível com CLI
const getEnv = (key: string) => {
  if (typeof process !== "undefined" && process.env[key])
    return process.env[key];
  return "";
};

// Plugin SvelteKit condicional (previne erro no CLI/Generate)
let sveltekitPlugin: any[] = [];
try {
  // @ts-ignore
  const { getRequestEvent } = await import("$app/server");
  sveltekitPlugin = [sveltekitCookies(getRequestEvent)];
} catch (e) {}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Mudar para 8080 para bater com o Caddy e evitar o 403 Forbidden
  baseURL: getEnv("BETTER_AUTH_BASE_URL") || "http://localhost:8080",
  secret: getEnv("BETTER_AUTH_SECRET"),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  rateLimit: {
    storage: "memory",
    enabled: true,
    window: 60,
    max: 30,
  },
  user: {
    fields: {
      name: "username",
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      displayUsername: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },
  plugins: [...sveltekitPlugin, username()],
});
