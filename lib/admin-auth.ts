// Shared admin-session helpers — used by middleware (Edge) and the login API
// route, so both must stick to Web Crypto (no node:crypto).

export function adminCredentials() {
  return {
    user: process.env.ADMIN_USER || "admin",
    pass: process.env.ADMIN_PASSWORD || "windchasers2024",
  };
}

export const ADMIN_COOKIE = "wc_admin";

/**
 * The session cookie value: SHA-256 of the credentials + a version salt.
 * Deterministic, so the middleware can verify without any session store;
 * rotating ADMIN_PASSWORD invalidates every existing session.
 */
export async function adminSessionToken(): Promise<string> {
  const { user, pass } = adminCredentials();
  const data = new TextEncoder().encode(`${user}:${pass}:wc-admin-v1`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
