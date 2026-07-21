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

/**
 * TWO separate single-day sessions - an attendee picks ONE (not a 2-day
 * event). Same time both days. UPDATE dates/time here once re-confirmed;
 * everything else (hero, countdown, modal picker, confirmation) reads off
 * this list.
 */
export const DEMO_CLASS_SESSIONS = [
  { id: "27jul", iso: "2026-07-27T11:00:00+05:30", label: "27 July" },
  { id: "28jul", iso: "2026-07-28T11:00:00+05:30", label: "28 July" },
] as const;

export type DemoClassSessionId = (typeof DEMO_CLASS_SESSIONS)[number]["id"];

/** Countdown targets the NEAREST upcoming session (falls back to the last
 *  one if both are already past, so the countdown never goes negative-stale). */
export const DEMO_CLASS_START_ISO =
  DEMO_CLASS_SESSIONS.find((s) => new Date(s.iso).getTime() > Date.now())?.iso
  ?? DEMO_CLASS_SESSIONS[DEMO_CLASS_SESSIONS.length - 1].iso;

/** Title stored on the lead (unified_context.windchasers.offline_event_name)
 *  and shown in the register modal + confirmation. */
export const DEMO_CLASS_NAME = "WindChasers Demo Class";

/** Venue stored on the lead + shown in the modal. UPDATE once confirmed. */
export const DEMO_CLASS_LOCATION = "WindChasers HQ, Bengaluru (venue to be confirmed)";

/** "11:00 AM IST" - same time both sessions - mirrors formatWebinarTimeDisplay. */
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

/** "27 or 28 July" - hero meta row, both options at a glance. */
export function formatDemoClassDayMonthDisplay(): string {
  return DEMO_CLASS_SESSIONS.map((s) => s.label).join(" or ");
}

/** Neat "27 July 2026 at 11:00 AM IST" label for a SPECIFIC picked session -
 *  ASCII-only so it never mojibakes in the dashboard or WhatsApp. */
export function demoClassSessionDateTimeLabel(sessionId: DemoClassSessionId): string {
  const session = DEMO_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) return "";
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(session.iso));
  return `${date} at ${formatDemoClassTimeDisplay()}`;
}

/** Generic (no session picked yet) label for the hero/page-level copy -
 *  "27 July or 28 July at 11:00 AM IST". */
export function demoClassDateTimeLabel(): string {
  return `${formatDemoClassDayMonthDisplay()} at ${formatDemoClassTimeDisplay()}`;
}
