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
// and time is `HH:MM` 24-hour.

/**
 * Minimum number of minutes between "now" (IST) and a bookable slot.
 * Gives the user time to actually reach the call / set up Google Meet.
 */
export const BOOKING_BUFFER_MINUTES = 60;
export const BOOKING_SLOT_INTERVAL_MINUTES = 30;

export type BookingDemoType = "online" | "offline";

export interface BookingTimeSlot {
  value: string;
  label: string;
}

interface BookingWindow {
  startMins: number;
  endMins: number;
  label: string;
}

const BOOKING_WINDOWS: Record<BookingDemoType, BookingWindow> = {
  online: {
    startMins: 15 * 60,
    endMins: 18 * 60 + 30,
    label: "Online sessions: Monday to Saturday, 3:00 PM - 6:30 PM",
  },
  offline: {
    startMins: 11 * 60,
    endMins: 19 * 60,
    label: "Offline sessions: Monday to Saturday, 11:00 AM - 7:00 PM",
  },
};

interface ISTNow {
  /** Today's date in IST, as `YYYY-MM-DD`. */
  dateStr: string;
  /** Minutes past midnight in IST (0–1439). */
  timeMins: number;
}

function toTimeValue(totalMins: number): string {
  const hour = Math.floor(totalMins / 60);
  const minute = totalMins % 60;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function toTimeLabel(totalMins: number): string {
  const hour = Math.floor(totalMins / 60);
  const minute = totalMins % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

function parseTimeToMins(timeStr: string): number | null {
  const [hourPart, minutePart = "0"] = timeStr.split(":");
  const slotHour = parseInt(hourPart, 10);
  const slotMinute = parseInt(minutePart, 10);

  if (
    !Number.isFinite(slotHour) ||
    !Number.isFinite(slotMinute) ||
    slotHour < 0 ||
    slotHour > 23 ||
    slotMinute < 0 ||
    slotMinute > 59
  ) {
    return null;
  }

  return slotHour * 60 + slotMinute;
}

export function isValidBookingDemoType(
  demoType: unknown
): demoType is BookingDemoType {
  return demoType === "online" || demoType === "offline";
}

export function getBookingTimeSlots(
  demoType: BookingDemoType
): BookingTimeSlot[] {
  const window = BOOKING_WINDOWS[demoType];
  const slots: BookingTimeSlot[] = [];

  for (
    let mins = window.startMins;
    mins <= window.endMins;
    mins += BOOKING_SLOT_INTERVAL_MINUTES
  ) {
    slots.push({
      value: toTimeValue(mins),
      label: toTimeLabel(mins),
    });
  }

  return slots;
}

export function getBookingWindowLabel(demoType: BookingDemoType): string {
  return BOOKING_WINDOWS[demoType].label;
}

export function isAllowedBookingTime(
  demoType: BookingDemoType,
  timeStr: string
): boolean {
  const slotMins = parseTimeToMins(timeStr);
  if (slotMins === null) return false;

  const window = BOOKING_WINDOWS[demoType];
  return (
    slotMins >= window.startMins &&
    slotMins <= window.endMins &&
    (slotMins - window.startMins) % BOOKING_SLOT_INTERVAL_MINUTES === 0
  );
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
  const slotMins = parseTimeToMins(timeStr);
  if (slotMins === null) return false;

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
