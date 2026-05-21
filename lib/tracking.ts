// Tracking utility for user journey, UTM capture, and form analytics.
//
// First-touch UTM logic is preserved: the first time a user lands on the
// site with UTM params, we snapshot all 5 fields plus the landing URL and
// referrer into sessionStorage. Subsequent navigations do not overwrite.
// All five UTM fields (utm_source / utm_medium / utm_campaign / utm_term /
// utm_content) are captured and surfaced to consumers like the PAT API.

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface PageView {
  path: string;
  timestamp: string;
  timeSpent?: number; // in seconds
  referrer?: string;
}

export interface AssessmentTracking {
  score: number;
  tier: string;
  readinessStatus: string;
  // Raw answers (questionId + answer) - opaque structure that downstream code
  // can re-score with lib/pat-scoring.ts.
  answers: { questionId: number; answer: string | number | null | undefined }[];
  timestamp: string;
}

export interface FormSubmission {
  type: "booking" | "assessment" | "lead" | "pricing" | "early_stage";
  source?: string;
  interest?: string;
  timestamp: string;
  data: any;
}

export interface TrackingData {
  sessionId: string;
  pageViews: PageView[];
  utmParams: UTMParams;
  // Original landing URL captured on first visit (full pathname + search).
  landingPage?: string;
  // First-touch document.referrer.
  referrer?: string;
  assessmentData?: AssessmentTracking;
  formSubmissions: FormSubmission[];
  userInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

const SESSION_ID_KEY = "windchasers_session_id";
const TRACKING_DATA_KEY = "windchasers_tracking_data";
const UTM_STORAGE_KEY = "utm_params";
const CLICK_ID_STORAGE_KEY = "click_ids";
const LANDING_PAGE_KEY = "landing_page";
const REFERRER_KEY = "referrer";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

// Ad-network click IDs we want to capture so paid traffic doesn't fall
// through to "DIRECT" in the CRM. Meta auto-tags with `fbclid`, Google Ads
// with `gclid`, Microsoft with `msclkid`, TikTok with `ttclid`, LinkedIn with
// `li_fat_id`. Most of these are added automatically when ad auto-tagging is
// on — they replace utm_* completely on Google Ads.
const CLICK_ID_KEYS = [
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "li_fat_id",
  "twclid",
  "wbraid",
  "gbraid",
] as const;

export type ClickIds = Partial<Record<(typeof CLICK_ID_KEYS)[number], string>>;

// ---------------------------------------------------------------------------
// Session id

export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// ---------------------------------------------------------------------------
// UTM capture (all 5 fields, first-touch)

export function getUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const out: UTMParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      out[key] = value;
    }
  }

  return out;
}

/** Pull any ad-network click IDs off the current URL. */
export function getClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: ClickIds = {};
  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

/**
 * Capture and persist UTM parameters, landing page, and referrer on initial
 * site load. First-touch wins - subsequent navigations do not overwrite the
 * stored snapshot. Safe to call on every page load.
 */
export function captureAndStoreUTMParams(): void {
  if (typeof window === "undefined") return;

  try {
    const existingUTM = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!existingUTM) {
      const utmParams = getUTMParams();
      if (Object.keys(utmParams).length > 0) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
      }
    }

    // Ad-network click IDs (gclid/fbclid/msclkid/etc). First-touch wins, same
    // as UTMs. Captured separately so we don't muddle the utm_* shape.
    const existingClickIds = sessionStorage.getItem(CLICK_ID_STORAGE_KEY);
    if (!existingClickIds) {
      const clickIds = getClickIds();
      if (Object.keys(clickIds).length > 0) {
        sessionStorage.setItem(CLICK_ID_STORAGE_KEY, JSON.stringify(clickIds));
      }
    }

    if (!sessionStorage.getItem(LANDING_PAGE_KEY)) {
      sessionStorage.setItem(
        LANDING_PAGE_KEY,
        window.location.pathname + window.location.search
      );
    }

    if (!sessionStorage.getItem(REFERRER_KEY) && document.referrer) {
      // Skip self-referrers — `pilot.windchasers.in → /pilot-training` is
      // internal navigation, not a marketing channel. Without this filter
      // any in-tab nav would store the site itself as the first-touch
      // referrer and the CRM would show `referral:pilot.windchasers.in`.
      try {
        const refHost = new URL(document.referrer)
          .hostname.toLowerCase()
          .replace(/^www\./, "");
        const currentHost = window.location.hostname
          .toLowerCase()
          .replace(/^www\./, "");
        const rootCurrent = currentHost.split(".").slice(-2).join(".");
        const rootRef = refHost.split(".").slice(-2).join(".");
        if (refHost !== currentHost && rootRef !== rootCurrent) {
          sessionStorage.setItem(REFERRER_KEY, document.referrer);
        }
      } catch {
        // Malformed referrer URL — be safe, just store it raw.
        sessionStorage.setItem(REFERRER_KEY, document.referrer);
      }
    }
  } catch (error) {
    console.error("Error storing UTM params:", error);
  }
}

/** Stored first-touch click IDs. */
export function getStoredClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem(CLICK_ID_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as ClickIds;
    return getClickIds();
  } catch {
    return getClickIds();
  }
}

/**
 * Derive a coarse traffic source when no UTM / click-ID is present. Only
 * returns RECOGNISED external networks. Anything else (self-referrer from
 * internal navigation, unknown sites, no referrer at all) returns "" so
 * the channel resolver falls through to "direct" instead of polluting
 * the CRM with `referral:pilot.windchasers.in` style values.
 */
export function deriveTrafficSource(): string {
  if (typeof window === "undefined") return "";
  try {
    const ref = sessionStorage.getItem(REFERRER_KEY) || document.referrer || "";
    if (!ref) return "";
    const host = new URL(ref).hostname.toLowerCase().replace(/^www\./, "");

    // Self-referrer (internal navigation) is not a marketing source.
    const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, "");
    if (host === currentHost) return "";
    // Also strip subdomain matches — pilot.windchasers.in → root domain
    // windchasers.in. A user bouncing between pilot.* and www.* is still
    // "us", not a referral.
    const rootCurrent = currentHost.split(".").slice(-2).join(".");
    const rootRef = host.split(".").slice(-2).join(".");
    if (rootRef === rootCurrent) return "";

    if (host.includes("google.")) return "google";
    if (host.includes("facebook.") || host === "fb.com" || host.endsWith(".fb.com"))
      return "facebook";
    if (host.includes("instagram.")) return "instagram";
    if (host.includes("youtube.")) return "youtube";
    if (host.includes("linkedin.") || host === "lnkd.in") return "linkedin";
    if (host.includes("twitter.") || host === "t.co" || host.includes("x.com"))
      return "twitter";
    if (host.includes("bing.")) return "bing";
    if (host.includes("duckduckgo.")) return "duckduckgo";
    if (host.includes("reddit.")) return "reddit";
    if (host.includes("tiktok.")) return "tiktok";

    // Unknown external referrer: don't make up a "referral:<host>" label.
    // Fall through to "direct" at the resolver layer.
    return "";
  } catch {
    return "";
  }
}

/**
 * Stored first-touch UTM params. Resolution order:
 *   1. sessionStorage utm_params (same-tab session)
 *   2. localStorage attr_utm_* (survives tab close, ~90 days)
 *   3. current URL search params (fresh landing)
 * The localStorage fallback means a user can land tagged, close the tab,
 * come back days later from a bookmark, complete a PAT, and still carry
 * the original campaign attribution. The localStorage values are written
 * by captureAttributionToLocalStorage() in lib/attribution.ts on every page
 * mount via TrackingProvider.
 */
function readLocalStorageAttr(): UTMParams {
  if (typeof window === "undefined") return {};
  try {
    const out: UTMParams = {};
    for (const k of UTM_KEYS) {
      const v = localStorage.getItem(`attr_${k}`);
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UTMParams;
      if (parsed && Object.keys(parsed).length > 0) return parsed;
    }
    // Tab restarted but localStorage still has the first-touch from the
    // original visit — use that before falling back to bare URL.
    const localAttr = readLocalStorageAttr();
    if (Object.keys(localAttr).length > 0) {
      // Hydrate sessionStorage so subsequent reads in this tab are fast.
      try {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(localAttr));
      } catch {
        /* sessionStorage write can fail in private mode — ignore */
      }
      return localAttr;
    }
    return getUTMParams();
  } catch (error) {
    console.error("Error reading stored UTM params:", error);
    return getUTMParams();
  }
}

/**
 * Convenience: returns all 5 UTM keys with empty-string defaults so callers
 * (Sheets writers, PROXe payload builders) get a flat predictable shape.
 */
export function getStoredUTMParamsFull(): Required<UTMParams> {
  const p = getStoredUTMParams();
  return {
    utm_source: p.utm_source ?? "",
    utm_medium: p.utm_medium ?? "",
    utm_campaign: p.utm_campaign ?? "",
    utm_term: p.utm_term ?? "",
    utm_content: p.utm_content ?? "",
  };
}

export function getLandingPage(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      sessionStorage.getItem(LANDING_PAGE_KEY) ||
      window.location.pathname + window.location.search
    );
  } catch (error) {
    console.error("Error reading landing page:", error);
    return window.location.pathname + window.location.search;
  }
}

export function getStoredReferrer(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(REFERRER_KEY) || document.referrer || "";
  } catch (error) {
    console.error("Error reading referrer:", error);
    return document.referrer || "";
  }
}

// ---------------------------------------------------------------------------
// Tracking data store (page views + form submissions)

export function getTrackingData(): TrackingData {
  const sessionId = getSessionId();
  const utmParams = getStoredUTMParams();

  const stored = typeof window !== "undefined" ? sessionStorage.getItem(TRACKING_DATA_KEY) : null;

  const baseData: TrackingData = {
    sessionId,
    pageViews: stored ? JSON.parse(stored).pageViews || [] : [],
    utmParams,
    landingPage: getLandingPage(),
    referrer: getStoredReferrer(),
    formSubmissions: stored ? JSON.parse(stored).formSubmissions || [] : [],
  };

  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.assessmentData) baseData.assessmentData = parsed.assessmentData;
    if (parsed.userInfo) baseData.userInfo = parsed.userInfo;
  }

  return baseData;
}

export function trackPageView(path: string, timeSpent?: number): void {
  if (typeof window === "undefined") return;

  const pageView: PageView = {
    path,
    timestamp: new Date().toISOString(),
    timeSpent,
    referrer: document.referrer || undefined,
  };

  const trackingData = getTrackingData();
  trackingData.pageViews.push(pageView);
  sessionStorage.setItem(TRACKING_DATA_KEY, JSON.stringify(trackingData));

  // Mirror into GA4 if gtag is present.
  const gtag = (window as any).gtag;
  if (typeof gtag === "function") {
    gtag("event", "page_view", {
      page_path: path,
      session_id: trackingData.sessionId,
    });
  }
}

export function trackFormSubmission(
  type: FormSubmission["type"],
  data: any,
  source?: string,
  interest?: string
): void {
  if (typeof window === "undefined") return;

  const submission: FormSubmission = {
    type,
    source,
    interest,
    timestamp: new Date().toISOString(),
    data,
  };

  const trackingData = getTrackingData();
  trackingData.formSubmissions.push(submission);

  if (data?.name || data?.email || data?.phone) {
    trackingData.userInfo = {
      name: data.name || trackingData.userInfo?.name,
      email: data.email || trackingData.userInfo?.email,
      phone: data.phone || trackingData.userInfo?.phone,
    };
  }

  sessionStorage.setItem(TRACKING_DATA_KEY, JSON.stringify(trackingData));
}

// ---------------------------------------------------------------------------
// Assessment session capture - opaque answers, server is the source of truth.

export function recordAssessmentSession(
  answers: AssessmentTracking["answers"],
  score: number,
  tier: string
): void {
  if (typeof window === "undefined") return;

  const data: AssessmentTracking = {
    score,
    tier,
    readinessStatus: tier,
    answers,
    timestamp: new Date().toISOString(),
  };

  const trackingData = getTrackingData();
  trackingData.assessmentData = data;
  sessionStorage.setItem(TRACKING_DATA_KEY, JSON.stringify(trackingData));
}

/**
 * Fire-and-forget POST that bundles the current tracking snapshot alongside a
 * caller-provided payload. Errors are swallowed so they do not block the user.
 *
 * NOTE: the PAT flow no longer uses this. The previous AssessmentForm called
 * this AFTER its main /api/assessment POST, which double-posted and 400'd.
 * Existing BookingForm / PricingFormModal still rely on it as a one-shot
 * tracking ping for their own endpoints.
 */
export async function sendTrackingData(
  endpoint: string,
  additionalData?: any
): Promise<void> {
  if (typeof window === "undefined") return;
  const trackingData = getTrackingData();

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...trackingData,
        ...additionalData,
      }),
    });
  } catch (error) {
    console.error("Error sending tracking data:", error);
  }
}

// NOTE: the previous getReadinessScore() / 4-tier text helper was removed.
// PAT tier copy now lives in lib/pat-scoring.ts (getTierCopy) so there is one
// source of truth across client preview and server response.
