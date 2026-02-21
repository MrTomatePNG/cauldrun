import prisma from "@/lib/prisma";
import type { PublicSession, PublicUser } from "@/lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user || !locals.session) {
    return { user: undefined, session: undefined };
  }

  const { createdAt, updatedAt, ...safeUser } = locals.user;
  const { token, ipAddress, userAgent, userId, ...safeSession } =
    locals.session;

  return { user: safeUser, session: safeSession };
};
