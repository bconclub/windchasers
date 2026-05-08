"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Browser-side Supabase client. RLS-enforced.
 * Use only for reads gated by RLS or for inserting into anon-allowed tables
 * (e.g. analytics events). Lead capture should still go through /api/* routes.
 */
export function getBrowserClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)");
  }
  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
