import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Profile, UserRole } from "@/lib/types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/**
 * Server Supabase client bound to the request cookies. RLS enforced as the
 * signed in user.
 */
export function getServerClient(): SupabaseClient {
  const cookieStore = cookies();
  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component. The middleware refreshes the
            // session, so ignoring this is safe.
          }
        },
      },
    }
  );
}

let cachedService: SupabaseClient | null = null;

/**
 * Service role client. Bypasses RLS. Use only inside API routes that have
 * already verified the caller is staff. Never import into a client component.
 */
export function getServiceClient(): SupabaseClient {
  if (cachedService) return cachedService;
  cachedService = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application": "windchasers-exams-admin" } },
    }
  );
  return cachedService;
}

export interface SessionUser {
  id: string;
  email: string;
  profile: Profile;
}

/** Signed in user plus profile, or null when there is no valid session. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (!profile || !profile.is_active) return null;
  return { id: user.id, email: user.email ?? profile.email, profile };
}

export function isStaffRole(role: UserRole): boolean {
  return role === "admin" || role === "instructor";
}
