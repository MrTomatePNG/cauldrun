import type { Logger } from "$lib/server/logger";
import type { Session, User } from "$lib/types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			logger: Logger;
			requestId: string;
		}
		// interface PageData {
		// 	user?: import("$lib/types").PublicUser;
		// 	session?: import("$lib/types").PublicSession;
		// }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
