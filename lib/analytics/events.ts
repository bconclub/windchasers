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
  // ---- Leads & conversions (the money events) -----------------------------
  LEAD_SUBMIT: "lead_submit",                 // any lead form submitted
  DEMO_BOOK: "demo_book",                      // demo / counsellor session booked
  ASSESSMENT_START: "assessment_start",        // PAT started
  ASSESSMENT_COMPLETE: "assessment_complete",  // PAT finished (with tier/score)
  EARLY_STAGE_LEAD: "early_stage_lead",        // class-12 "no" branch lead
  CONTACT_CALL: "contact_call",                // tapped the phone/call button
  CONTACT_WHATSAPP: "contact_whatsapp",        // tapped WhatsApp / opened WA capture
  GENERATE_LEAD: "generate_lead",              // GA4 recommended alias for a lead

  // ---- Engagement ---------------------------------------------------------
  CTA_CLICK: "cta_click",                      // any primary CTA button click
  STICKY_CTA_CLICK: "sticky_cta_click",        // the floating "Book a Demo" button
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

/**
 * Lead helper — fires GA4 lead_submit + generate_lead AND the Meta Lead event
 * in one call, so every lead form is consistent.
 */
export function trackLead(params: { form_name: string; page?: string; audience?: string }): void {
  track(EVENTS.LEAD_SUBMIT, params);
  track(EVENTS.GENERATE_LEAD, params);
  trackMeta("Lead", { content_name: params.form_name });
}
