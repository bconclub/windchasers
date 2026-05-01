// Google Analytics + Google Ads event helpers.
//
// gtag() and fbq() are loaded globally in app/layout.tsx + components/Analytics.tsx
// (GA4 ID G-3WDV2V65F5, Meta Pixel 1431602295033185). These helpers no-op when
// the globals are missing (SSR, blocked by ad blocker, etc).

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// TODO: add Google Ads conversion ID + label when Marketing supplies them.
// Format: "AW-XXXXXXXXXX/aBcDeFgHiJkLmNoPqRs". Until set, the conversion call
// is a no-op (no traffic sent).
const GOOGLE_ADS_CONVERSION_ID: string | null = null;

function gtagSafe(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  gtag(...args);
}

// ---------------------------------------------------------------------------
// Generic helpers used across the site

export const trackKeyPageView = (pageName: string) => {
  gtagSafe("event", "Key Page View", {
    page_title: pageName,
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};

export const trackPilotLead = (source: string, formType: string) => {
  const eventMap: Record<string, string> = {
    dgca: "DGCA Pilot Lead",
    helicopter: "Heli Pilot Lead",
    abroad: "Pilot Abroad Lead",
  };

  const eventName = eventMap[source] || "Pilot Web Lead";

  gtagSafe("event", eventName, {
    form_type: formType,
    source,
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};

// ---------------------------------------------------------------------------
// PAT-specific events

export interface AssessmentStartedParams {
  audience: "student" | "early_stage";
}

export interface AssessmentCompletedParams {
  tier: string;
  total_score: number;
  audience: "student" | "early_stage";
}

export const trackAssessmentStarted = (params: AssessmentStartedParams) => {
  gtagSafe("event", "assessment_started", {
    audience: params.audience,
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};

export const trackAssessmentCompleted = (params: AssessmentCompletedParams) => {
  gtagSafe("event", "assessment_completed", {
    tier: params.tier,
    total_score: params.total_score,
    audience: params.audience,
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};

export const trackEarlyStageLead = () => {
  gtagSafe("event", "early_stage_lead", {
    audience: "early_stage",
    page_location: typeof window !== "undefined" ? window.location.href : "",
  });
};

// ---------------------------------------------------------------------------
// Google Ads conversion

export interface GoogleAdsConversionParams {
  // Conversion-specific value (e.g. lead value or score). Optional.
  value?: number;
  currency?: string;
  // Optional transaction id for de-duping in the Google Ads UI.
  transactionId?: string;
}

/**
 * Fire a Google Ads conversion. No-ops (with a console.info breadcrumb) until
 * GOOGLE_ADS_CONVERSION_ID is configured at the top of this file.
 */
export const trackGoogleAdsConversion = (params: GoogleAdsConversionParams = {}) => {
  if (!GOOGLE_ADS_CONVERSION_ID) {
    if (typeof window !== "undefined") {
      console.info(
        "[ads] conversion suppressed - GOOGLE_ADS_CONVERSION_ID not set",
        params
      );
    }
    return;
  }

  gtagSafe("event", "conversion", {
    send_to: GOOGLE_ADS_CONVERSION_ID,
    value: params.value,
    currency: params.currency || "INR",
    transaction_id: params.transactionId,
  });
};
