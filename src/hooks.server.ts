import { auth } from "@/lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { sequence } from "@sveltejs/kit/hooks";
import { baseLogger } from "$lib/server/logger";
import type { Handle } from "@sveltejs/kit";

const logger: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const requestId = crypto.randomUUID();
	
	// Injetar logger contextualizado no locals
	const requestLogger = baseLogger.child({ 
		requestId,
		method: event.request.method,
		url: event.url.pathname 
	});
	
	event.locals.logger = requestLogger;
	event.locals.requestId = requestId;

	const response = await resolve(event);

	const duration = Date.now() - start;
	requestLogger.info({ status: response.status, duration: `${duration}ms` }, "Request completed");

	return response;
};

const authHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
		// Adiciona o userId ao log se disponível
		event.locals.logger.info({ userId: session.user.id }, "User session identified");
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle = sequence(logger, authHandle);
