/**
 * Meta (Facebook) Pixel - fbq is injected in app/layout.tsx
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type MetaLeadPayload = Record<string, string | number | undefined>;

/**
 * Standard event for form / lead capture. Call after a successful conversion
 * (e.g. thank-you page) so it aligns with submitted leads.
 */
export function trackMetaLead(payload?: MetaLeadPayload): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }
  window.fbq("track", "Lead", payload ?? {});
}
