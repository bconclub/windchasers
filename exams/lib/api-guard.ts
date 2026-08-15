import { NextResponse } from "next/server";
import { getSessionUser, isStaffRole } from "@/lib/supabase/server";
import type { SessionUser } from "@/lib/supabase/server";

export interface GuardFailure {
  ok: false;
  response: NextResponse;
}

export interface GuardSuccess {
  ok: true;
  session: SessionUser;
}

/**
 * Every route that reaches for the service role client must call this first.
 * The service client bypasses RLS, so the caller has to be verified here.
 */
export async function requireStaff(): Promise<GuardSuccess | GuardFailure> {
  const session = await getSessionUser();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not signed in" }, { status: 401 }),
    };
  }
  if (!isStaffRole(session.profile.role)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Staff only" }, { status: 403 }),
    };
  }
  return { ok: true, session };
}

export async function requireAdmin(): Promise<GuardSuccess | GuardFailure> {
  const session = await getSessionUser();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not signed in" }, { status: 401 }),
    };
  }
  if (session.profile.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admins only" }, { status: 403 }),
    };
  }
  return { ok: true, session };
}
