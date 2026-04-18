/** Shared live webinar start - April 25, 2026 · 4:00 PM IST (marketing site, 2026 cohort). */
export const WEBINAR_START_ISO = "2026-04-25T16:00:00+05:30";

/** Official Zoom registration page - attendees register here to receive the join link by email. */
export const WEBINAR_ZOOM_REGISTER_URL =
  "https://us06web.zoom.us/meeting/register/WjrhvFLgSCy4H7xQUZ2urg";

/**
 * Parents webinar CTA. Today this is the same session as the student roadmap webinar; point this
 * to a separate Zoom registration URL if you run a dedicated parents-only meeting.
 */
export const WEBINAR_PARENT_ZOOM_REGISTER_URL = WEBINAR_ZOOM_REGISTER_URL;

/** Vimeo ID for the marketing preview next to the countdown (player embed). */
export const WEBINAR_PROMO_VIMEO_ID = "1184303137";

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

export function formatWebinarTimeDisplay(): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(WEBINAR_START_ISO)) + " IST";
}
