import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAnon: SupabaseClient | null = null;
let cachedService: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the anon key. RLS-enforced.
 * Use for public reads from Server Components / Route Handlers.
 *
 * Validation is deferred until the function is actually called so that
 * importing this module never crashes a build (e.g. an SSG render of an
 * unrelated route).
 */
export function getServerClient(): SupabaseClient {
  if (cachedAnon) return cachedAnon;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  cachedAnon = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { "x-application": "windchasers-website" },
      // Bypass Next.js's automatic fetch cache so admin curation /
      // re-imports show up on the next request without a manual revalidate.
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  return cachedAnon;
}

/**
 * Server-side Supabase client using the service-role key. Bypasses RLS.
 * Use ONLY in trusted server contexts (API routes, scripts, admin actions).
 * Never import into client components.
 */
export function getServiceClient(): SupabaseClient {
  if (cachedService) return cachedService;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  cachedService = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application": "windchasers-website-admin" } },
  });
  return cachedService;
}
