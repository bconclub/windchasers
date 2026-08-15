import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { UserRole } from "@/lib/types";

export interface SessionCheck {
  response: NextResponse;
  userId: string | null;
  role: UserRole | null;
  isActive: boolean;
  /** False when this account has since signed in somewhere else. */
  sessionCurrent: boolean;
}

interface SessionContext {
  role: UserRole | null;
  is_active: boolean;
  session_current: boolean;
}

/**
 * Refresh the auth cookies for this request and read the caller role.
 * Returns the response the middleware must forward so refreshed cookies stick.
 */
export async function refreshSession(request: NextRequest): Promise<SessionCheck> {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return { response, userId: null, role: null, isActive: false, sessionCurrent: true };
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { response, userId: null, role: null, isActive: false, sessionCurrent: true };
  }

  // One round trip for role, active flag and the single session check.
  const { data } = await supabase.rpc("get_session_context");
  const context = data as SessionContext | null;

  return {
    response,
    userId: user.id,
    role: context?.role ?? null,
    isActive: context?.is_active ?? false,
    // Default to true so a failed lookup never locks everyone out.
    sessionCurrent: context?.session_current ?? true,
  };
}
