import { NextResponse } from "next/server";
import { auth, isSuperAdmin } from "@/lib/auth";

/**
 * Guards an admin API route. Returns the session user, or a NextResponse
 * (401/403) that the caller should return immediately.
 */
export async function guardAdmin(opts: { superOnly?: boolean } = {}) {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (opts.superOnly && !isSuperAdmin(session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user: session.user };
}
