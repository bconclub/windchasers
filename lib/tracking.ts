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
const LANDING_PAGE_KEY = "landing_page";
const REFERRER_KEY = "referrer";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

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

    if (!sessionStorage.getItem(LANDING_PAGE_KEY)) {
      sessionStorage.setItem(
        LANDING_PAGE_KEY,
        window.location.pathname + window.location.search
      );
    }

    if (!sessionStorage.getItem(REFERRER_KEY) && document.referrer) {
      sessionStorage.setItem(REFERRER_KEY, document.referrer);
    }
  } catch (error) {
    console.error("Error storing UTM params:", error);
  }
}

/** Stored first-touch UTM params, falling back to whatever is on the URL now. */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UTMParams;
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
