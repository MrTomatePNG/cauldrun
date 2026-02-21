import { Session, User } from "@/lib/types";

declare global {
	namespace App {
		interface Locals {
			session?: Session;
			user?: User;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
