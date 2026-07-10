/** Live webinar start - "2026 Pilot Career Blueprint", 18 July 2026 · 11:30 AM IST. */
export const WEBINAR_START_ISO = "2026-07-18T11:30:00+05:30";

/** Official Zoom registration page - attendees register here to receive the join link by email.
 *  2026 Pilot Career Blueprint, 18 Jul 2026 11:30 AM IST. */
export const WEBINAR_ZOOM_REGISTER_URL =
  "https://us06web.zoom.us/meeting/register/JGMzDhBqTJC635lNAhxx5w";

/**
 * Parents webinar CTA. Today this is the same session as the student roadmap webinar; point this
 * to a separate Zoom registration URL if you run a dedicated parents-only meeting.
 */
export const WEBINAR_PARENT_ZOOM_REGISTER_URL = WEBINAR_ZOOM_REGISTER_URL;

/** Vimeo ID for the marketing preview next to the countdown (player embed). */
export const WEBINAR_PROMO_VIMEO_ID = "1184303137";

/**
 * Webinar titles stored on the PROXe lead (unified_context.windchasers.webinar_name)
 * and used in the WhatsApp confirmation/reminder copy. Parents & students are the
 * SAME session today — the two names just distinguish which funnel registered them
 * (different ads + different welcome message per audience). Update alongside the
 * Zoom URL + date when a new session is scheduled.
 */
export const WEBINAR_NAME_PARENTS = "2026 Pilot Career Blueprint (Parents)";
export const WEBINAR_NAME_STUDENTS = "2026 Pilot Career Blueprint";

/**
 * Neat "18 July 2026 at 11:30 AM IST" label — stored on the lead + shown in the
 * register modal. ASCII-only ("at", not a middle-dot) so it never mojibakes in
 * the dashboard or WhatsApp.
 */
export function webinarDateTimeLabel(): string {
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(WEBINAR_START_ISO));
  return `${date} at ${formatWebinarTimeDisplay()}`;
}

/** Parents webinar landing - exclusive parents WhatsApp community. */
export const WEBINAR_PARENT_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/ChCxl1miiSN1WS2S4oGpAZ";

/** Pilot roadmap webinar - student & aspirant WhatsApp group. */
export const WEBINAR_STUDENT_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/IEi11O7U90T88K2d7YMOxx";

/** Short marketing date, e.g. "April 25, 2026" (hero eyebrow lines). */
export function formatWebinarDateShortDisplay(): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(WEBINAR_START_ISO));
}

export function formatWebinarDateDisplay(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(WEBINAR_START_ISO));
}

/** Compact "18 July" (day + month, no year) for the hero meta row. */
export function formatWebinarDayMonthDisplay(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
  }).format(new Date(WEBINAR_START_ISO));
}

export function formatWebinarTimeDisplay(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(WEBINAR_START_ISO)) + " IST";
}
