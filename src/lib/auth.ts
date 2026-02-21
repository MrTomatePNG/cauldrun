import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { BETTER_AUTH_BASE_URL } from "$env/static/private";
import prisma from "./prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	baseURL: BETTER_AUTH_BASE_URL,
	emailAndPassword: {
		enabled: true,
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
	plugins: [sveltekitCookies(getRequestEvent), username()],
});

export type Auth = typeof auth;
