import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";
import { sendVerificationEmail } from "$lib/server/email";
import { rateLimit } from "better-auth-rate-limit";
import prisma from "$lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: env.BETTER_AUTH_BASE_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Bloqueia login sem verificação se desejado
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url);
    },
  },
  user: {
    fields: {
      name: "username", // Mapeia o campo 'name' do Better Auth para 'username' no banco
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      displayUsername: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [
    sveltekitCookies(getRequestEvent),
    username(),
    rateLimit({
      window: 60, // 1 minuto
      max: 30, // Máximo 30 requests globais/min por IP
      customRules: {
        "/sign-in": {
          window: 60,
          max: 5, // Apenas 5 tentativas de login por minuto
        },
        "/sign-up": {
          window: 3600, // 1 hora
          max: 10, // Apenas 10 cadastros por hora por IP
        },
        "/verify-email": {
          window: 3600,
          max: 5, // Apenas 5 reenvios de e-mail por hora
        },
      },
    }),
  ],
});

export type Auth = typeof auth;
