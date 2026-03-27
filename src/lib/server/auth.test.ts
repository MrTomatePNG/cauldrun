import { describe, it, expect, beforeAll } from "vitest";

describe("Fluxo de Autenticação", () => {
	const BASE_URL = "http://localhost:8080/api/auth";

	it("deve tentar criar um usuário e retornar sucesso ou erro específico", async () => {
		const testEmail = `test-${Date.now()}@example.com`;

		const response = await fetch(`${BASE_URL}/sign-up/email`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Origin": "http://localhost:8080"
			},
			body: JSON.stringify({
				email: testEmail,
				password: "Password123!",
				username: `user_${Date.now()}`,
				displayUsername: "Test User"
			})
		});

		const data = await response.json();

		console.log("Status da Resposta:", response.status);
		console.log("Corpo da Resposta:", JSON.stringify(data, null, 2));

		if (response.status === 403) {
			throw new Error("ERRO 403: Problema de CSRF ou ORIGIN no Better Auth/Caddy.");
		}

		if (response.status === 500) {
			throw new Error("ERRO 500: Provavelmente falha ao enviar e-mail ou erro no Prisma.");
		}

		expect(response.status).toBe(200);
	});
});
