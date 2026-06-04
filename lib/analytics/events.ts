// =============================================================================
// WindChasers — Central GA4 event registry.
//
// ONE place that defines every analytics event the site fires. All event names
// are GA4-standard snake_case. Fire events via `track(EVENTS.x, params)` so we
// never have stray inline gtag() calls with inconsistent names again.
//
// GA4 property: G-3THNVEDJK8 (loaded in components/Analytics.tsx).
// Meta Pixel: 1097272771358425 (Lead also mirrored to fbq where relevant).
// =============================================================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Every analytics event name, grouped by category. Keep snake_case.
 * If you add an event, add it here first, then fire it via track().
 */
export const EVENTS = {
  // ---- Leads & conversions (each named for its SOURCE, so the GA4 event
  //      itself tells you what happened — no digging into params) -----------
  DEMO_BOOKED: "demo_booked",                  // demo / counsellor session booked (/demo)
  PAT_COMPLETED: "pat_completed",              // Pilot Aptitude Test finished (a lead)
  WHATSAPP_LEAD: "whatsapp_lead",              // WhatsApp capture submitted (name + phone)
  PILOT_TRAINING_LEAD: "pilot_training_lead",  // /pilot-training hero callback form
  STUDENT_LEAD: "student_lead",                // student lead form
  EARLY_STAGE_LEAD: "early_stage_lead",        // class-12 "not completed" branch
  CABIN_CREW_LEAD: "cabin_crew_lead",          // cabin-crew enquiry form
  ATC_LEAD: "atc_lead",                        // ATC enquiry form
  SUMMERCAMP_LEAD: "summercamp_lead",          // summer-camp enrolment form
  NZ_SEMINAR_LEAD: "nz_seminar_lead",          // NZ seminar registration
  FLIGHT_SCHOOL_LEAD: "flight_school_lead",    // flight-schools directory enquiry

  // ---- Engagement (intent signals, NOT confirmed leads) -------------------
  WHATSAPP_OPEN: "whatsapp_open",              // WhatsApp button tapped / capture opened
  CALL_CLICK: "call_click",                    // phone / call button tapped
  PAT_STARTED: "pat_started",                  // PAT assessment started
  BOOK_DEMO_CLICK: "book_demo_click",          // "Book a Demo" tapped in the menu
  BOOK_DEMO_STICKY: "book_demo_sticky",        // the floating sticky "Book a Demo" button
  MENU_OPEN: "menu_open",                       // slide-in nav menu opened
  NAV_CLICK: "nav_click",                       // a nav / menu link clicked
  VIDEO_PLAY: "video_play",                     // a Vimeo reel / gallery video played
  GALLERY_INTERACT: "gallery_interact",         // gallery next/prev / image open
  SCROLL_DEPTH: "scroll_depth",                 // 25/50/75/100% scroll milestones

  // ---- Page / section views ----------------------------------------------
  KEY_PAGE_VIEW: "key_page_view",               // a high-value program page viewed
  SECTION_VIEW: "section_view",                 // a tracked section scrolled into view
  PROGRAM_VIEW: "program_view",                 // program/course page viewed (with course)

  // ---- Form funnel detail -------------------------------------------------
  FORM_START: "form_start",                     // user focused the first field
  FORM_STEP: "form_step",                       // multi-step form advanced a step
  FORM_ERROR: "form_error",                     // a validation error shown
  FORM_ABANDON: "form_abandon",                 // left with a partially-filled form
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

type Params = Record<string, string | number | boolean | undefined>;

function pageLocation(): string {
  return typeof window !== "undefined" ? window.location.href : "";
}
function pagePath(): string {
  return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * Fire a GA4 event. Safe to call anywhere — no-ops on SSR or when gtag is
 * blocked. Always stamps page_location + page_path so every event is
 * attributable to a page without each caller repeating it.
 */
export function track(event: EventName, params: Params = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, {
    page_location: pageLocation(),
    page_path: pagePath(),
    ...params,
  });
}

/** Fire a Meta Pixel standard/custom event (no-ops if fbq missing). */
export function trackMeta(event: string, params: Params = {}): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

// ---------------------------------------------------------------------------
// Google Ads conversions.
//
// The GA4 tag (G-3THNVEDJK8) is linked to the Google Ads account
// AW-16491316479 in Google's tag settings, so Ads Page View + Remarketing
// already fire sitewide via the on-page gtag('config') — nothing to add for
// that.
//
// A CONVERSION (e.g. "Cabin Crew Lead") still needs its own per-action snippet:
//   gtag('event', 'conversion', { send_to: 'AW-16491316479/<label>' })
// Paste each conversion's LABEL below (Google Ads → Goals → Conversions → the
// action → "Tag setup" → the part after AW-16491316479/). Leave "" to skip —
// the GA4 event still fires, so you can alternatively import it as a conversion
// via the GA4 ↔ Ads link instead of using a label here.
// ---------------------------------------------------------------------------
export const GOOGLE_ADS_ID = "AW-16491316479";

const ADS_CONVERSION_LABELS: Partial<Record<EventName, string>> = {
  // [EVENTS.CABIN_CREW_LEAD]: "PASTE_LABEL_HERE",   // ← "Cabin Crew Lead" action
  // [EVENTS.DEMO_BOOKED]: "...",
  // [EVENTS.PAT_COMPLETED]: "...",
  // [EVENTS.WHATSAPP_LEAD]: "...",
  // [EVENTS.PILOT_TRAINING_LEAD]: "...",
  // [EVENTS.STUDENT_LEAD]: "...",
};

/** Fire the Google Ads conversion for a lead event, if a label is configured. */
export function trackAdsConversion(event: EventName, params: Params = {}): void {
  const label = ADS_CONVERSION_LABELS[event];
  if (!label) return; // no label set → skip (use GA4-import instead, or add one)
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    ...params,
  });
}

/**
 * Lead helper — fires ONE clearly-named GA4 lead event (pass the source event,
 * e.g. EVENTS.DEMO_BOOKED) plus the Meta Pixel "Lead" event AND the Google Ads
 * conversion (if a label is configured above) in one call. The GA4 event name
 * says what kind of lead it is; no more generic lead_submit / generate_lead.
 */
export function trackLead(event: EventName, params: Params = {}): void {
  track(event, params);
  trackMeta("Lead", {
    content_name: (params.form_name as string) || event,
  });
  trackAdsConversion(event);
}
