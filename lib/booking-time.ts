// Past-time guard for the demo booking flow.
//
// All math anchors to Asia/Kolkata (IST), not the browser's local timezone:
// our counsellors are in India and the WhatsApp follow-up is sent in IST,
// so a user in another timezone shouldn't be able to grab a slot that's
// already passed for the local team.
//
// No external dep — uses `Intl.DateTimeFormat` which is in the standard
// runtime on Node 14+ / every modern browser. Date string format
// throughout is `YYYY-MM-DD` (matches `<input type="date">` value),
// and time is `HH:MM` 24-hour (matches the existing `timeSlots` values
// like `"11:00"`).

/**
 * Minimum number of minutes between "now" (IST) and a bookable slot.
 * Gives the user time to actually reach the call / set up Google Meet.
 */
export const BOOKING_BUFFER_MINUTES = 60;

interface ISTNow {
  /** Today's date in IST, as `YYYY-MM-DD`. */
  dateStr: string;
  /** Minutes past midnight in IST (0–1439). */
  timeMins: number;
}

/** Read the current wall clock in Asia/Kolkata as date + minutes-past-midnight. */
export function getISTNow(now: Date = new Date()): ISTNow {
  // `en-CA` happens to format dates as `YYYY-MM-DD`, which we need to
  // compare against `<input type="date">` values without juggling locales.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const dateStr = `${get("year")}-${get("month")}-${get("day")}`;
  const hour = parseInt(get("hour"), 10) || 0;
  const minute = parseInt(get("minute"), 10) || 0;
  return { dateStr, timeMins: hour * 60 + minute };
}

/**
 * True when the slot is already in the past (or within the 60-minute buffer)
 * relative to the current IST wall clock.
 *
 * Same function runs in the browser (filter) AND on the server (validate)
 * so a clever client can't bypass it.
 */
export function isSlotInPast(
  dateStr: string,
  timeStr: string,
  now: Date = new Date()
): boolean {
  if (!dateStr || !timeStr) return false;

  const ist = getISTNow(now);

  // Different calendar day in IST. If the day is before today → past.
  // If after → definitely not past (full slot list is bookable).
  if (dateStr !== ist.dateStr) {
    return dateStr < ist.dateStr;
  }

  // Same day in IST — compare the slot's minute-of-day against now + buffer.
  const [hourPart, minutePart = "0"] = timeStr.split(":");
  const slotHour = parseInt(hourPart, 10);
  const slotMinute = parseInt(minutePart, 10);
  if (!Number.isFinite(slotHour) || !Number.isFinite(slotMinute)) return false;

  const slotMins = slotHour * 60 + slotMinute;
  return slotMins <= ist.timeMins + BOOKING_BUFFER_MINUTES;
}

/**
 * Today's date in IST as a `YYYY-MM-DD` string. Use for the
 * `<input type="date" min={...}>` attribute so the native picker
 * blocks past dates from the get-go (timezone-aware).
 */
export function getMinBookingDateIST(now: Date = new Date()): string {
  return getISTNow(now).dateStr;
}
