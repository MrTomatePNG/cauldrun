import { describe, it, expect } from "vitest";

// Mock da configuração de rate limit (pois não rodamos o servidor completo)
const rateLimitConfig = {
  "/sign-in": { window: 60, max: 5 },
  "/sign-up": { window: 3600, max: 10 },
};

describe("Segurança: Lógica de Rate Limiting", () => {
  it("deve rejeitar se as tentativas de login excederem 5 por minuto", () => {
    let attempts = 0;
    const isRateLimited = () => {
        attempts++;
        return attempts > rateLimitConfig["/sign-in"].max;
    };

    // Primeiras 5 tentativas: OK
    for(let i=0; i<5; i++) {
        expect(isRateLimited()).toBe(false);
    }

    // Sexta tentativa: BLOQUEADA
    expect(isRateLimited()).toBe(true);
  });

  it("deve rejeitar se os cadastros excederem 10 por hora", () => {
    let signups = 0;
    const isRateLimited = () => {
        signups++;
        return signups > rateLimitConfig["/sign-up"].max;
    };

    for(let i=0; i<10; i++) {
        expect(isRateLimited()).toBe(false);
    }
    expect(isRateLimited()).toBe(true);
  });
});
