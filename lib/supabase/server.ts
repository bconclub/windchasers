import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");

let cachedAnon: SupabaseClient | null = null;
let cachedService: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the anon key. RLS-enforced.
 * Use for public reads from Server Components / Route Handlers.
 */
export function getServerClient(): SupabaseClient {
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  if (!cachedAnon) {
    cachedAnon = createClient(url!, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application": "windchasers-website" } },
    });
  }
  return cachedAnon;
}

/**
 * Server-side Supabase client using the service-role key. Bypasses RLS.
 * Use ONLY in trusted server contexts (API routes, scripts, admin actions).
 * Never import into client components.
 */
export function getServiceClient(): SupabaseClient {
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  if (!cachedService) {
    cachedService = createClient(url!, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { "x-application": "windchasers-website-admin" } },
    });
  }
  return cachedService;
}
