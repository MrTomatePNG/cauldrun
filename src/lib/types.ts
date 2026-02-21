import type { auth } from "./auth";

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;

export type PublicUser = Omit<User, "createdAt" | "updatedAt">;

export type PublicSession = Omit<
	Session,
	"token" | "ipAddress" | "userAgent" | "userId"
>;
