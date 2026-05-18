// First-touch UTM persistence in localStorage. Survives tab close + return
// visits (90 days, controlled by browser). Used for WhatsApp prelaunch
// capture and any future lead-capture surface where attribution matters
// beyond the current tab session.
//
// Note: this runs ALONGSIDE the existing sessionStorage capture in
// `lib/tracking.ts`. Sheet forms and PAT still read from sessionStorage
// (no migration needed). Net result: short-lived attribution stays in
// sessionStorage, long-lived attribution adds itself to localStorage.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

type UTMKey = (typeof UTM_KEYS)[number];

export interface AttrUTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

/** Run on every page load. First-touch wins; subsequent navigation does
 * NOT overwrite the original attribution. Safe in SSR (no-op when window
 * is undefined). */
export function captureAttributionToLocalStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v && !localStorage.getItem(`attr_${k}`)) {
        localStorage.setItem(`attr_${k}`, v);
      }
    }
  } catch {
    // localStorage can throw in private mode / sandboxed iframes. Silent.
  }
}

/** Read the persisted first-touch attribution. Always returns the
 * 5-key shape so callers don't have to undefined-check each one. */
export function getStoredAttribution(): Required<AttrUTMParams> {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_content: "",
      utm_term: "",
    };
  }
  const read = (k: UTMKey): string => {
    try {
      return localStorage.getItem(`attr_${k}`) ?? "";
    } catch {
      return "";
    }
  };
  return {
    utm_source: read("utm_source"),
    utm_medium: read("utm_medium"),
    utm_campaign: read("utm_campaign"),
    utm_content: read("utm_content"),
    utm_term: read("utm_term"),
  };
}
