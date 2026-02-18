import { sequence } from "@sveltejs/kit/hooks";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "$lib/auth";
import { building } from "$app/environment";
import type { Handle } from "@sveltejs/kit";

// Handler de autenticação
const authHandler = (async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  event.locals.session = session?.session;
  event.locals.user = session?.user;

  return svelteKitHandler({ event, resolve, auth, building });
}) satisfies Handle;

// Handler de logging
const loggingHandler = (async ({ event, resolve }) => {
  const start = Date.now();

  const response = await resolve(event);

  const end = Date.now();
  console.log(
    `${event.request.method} ${event.url.pathname} - ${end - start}ms`,
  );

  return response;
}) satisfies Handle;

// Handler de segurança
const securityHandler = (async ({ event, resolve }) => {
  // Adicionar headers de segurança
  const response = await resolve(event);

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}) satisfies Handle;

// Handler de redirecionamento
const redirectHandler = (async ({ event, resolve }) => {
  // Redirecionar usuários não autenticados de rotas protegidas
  if (event.url.pathname.startsWith("/dashboard") && !event.locals.user) {
    return new Response(null, {
      status: 302,
      headers: { location: "/login" },
    });
  }

  return resolve(event);
}) satisfies Handle;

export const handle = sequence(
  authHandler, // Primeiro: auth e session
  redirectHandler, // Segundo: redirecionamentos baseados em auth
  loggingHandler, // Terceiro: logging
  securityHandler, // Quarto: headers de segurança
) satisfies Handle;
