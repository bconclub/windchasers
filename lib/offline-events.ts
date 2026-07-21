/**
 * Offline event config - demo classes, open houses, any in-person session.
 *
 * Distinct from lib/webinar.ts: no Zoom URL, no online redirect. A registrant
 * is captured into PROXe (tagged lead_type='offline_event') and shown an
 * in-page confirmation - there's no external step to send them to.
 *
 * PLACEHOLDER CONTENT: date/venue below are TBD until the real event details +
 * creatives arrive. Update this file (and nothing else) once they do - the
 * modal + page read everything from here.
 */

/** ISO start time. UPDATE when the real date is confirmed. */
export const DEMO_CLASS_START_ISO = "2026-08-02T11:00:00+05:30";

/** Title stored on the lead (unified_context.windchasers.offline_event_name)
 *  and shown in the register modal + confirmation. */
export const DEMO_CLASS_NAME = "WindChasers Demo Class";

/** Venue stored on the lead + shown in the modal. UPDATE once confirmed. */
export const DEMO_CLASS_LOCATION = "WindChasers HQ, Bengaluru (venue to be confirmed)";

/** Neat "2 August 2026 at 11:00 AM IST" label - ASCII-only so it never
 *  mojibakes in the dashboard or WhatsApp (mirrors webinarDateTimeLabel). */
export function demoClassDateTimeLabel(): string {
  return `${formatDemoClassDayMonthDisplay()} at ${formatDemoClassTimeDisplay()}`;
}

/** Compact "2 August" (day + month, no year) for the hero meta row - mirrors
 *  formatWebinarDayMonthDisplay. */
export function formatDemoClassDayMonthDisplay(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
  }).format(new Date(DEMO_CLASS_START_ISO));
}

/** "11:00 AM IST" - mirrors formatWebinarTimeDisplay. */
export function formatDemoClassTimeDisplay(): string {
  return (
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(DEMO_CLASS_START_ISO)) + " IST"
  );
}
