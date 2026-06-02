// Upcoming events shown on the homepage.
// EDIT THIS FILE to add / remove events. The homepage section auto-hides when
// there are no active (future) events. Set `date` as an ISO string (YYYY-MM-DD)
// or any string Date can parse; past events are filtered out automatically.

export type WindEvent = {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-07-15". Past events are hidden automatically. */
  date: string;
  /** Human label shown on the card, e.g. "Sat, 15 Jul · 6:00 PM IST". */
  when: string;
  mode: "Online Webinar" | "Open House" | "Seminar" | "Workshop";
  blurb: string;
  /** Vimeo numeric ID for the teaser clip (optional). */
  vimeoId?: string;
  /** Fallback poster image if no vimeoId (optional). */
  image?: string;
  /** Where the "Register" button goes. */
  registerHref: string;
};

// --- SAMPLE EVENTS — replace with real ones. ---
export const events: WindEvent[] = [
  {
    id: "airport-ops-webinar",
    title: "Airport Operations & Pilot Career Webinar",
    date: "2099-01-01", // placeholder future date so the sample shows; set a real date
    when: "Set date & time",
    mode: "Online Webinar",
    blurb:
      "A free online session on how airport operations work and how to plan your route to the cockpit. Live Q&A with our instructors.",
    vimeoId: "1160946921",
    registerHref: "/webinar",
  },
  {
    id: "bengaluru-open-house",
    title: "WindChasers Bengaluru Open House",
    date: "2099-01-02", // placeholder future date; set a real date
    when: "Set date & time",
    mode: "Open House",
    blurb:
      "Visit our campus, sit in the simulator, and meet the team. Bring your parents — all your questions answered in person.",
    image: "/facility/WC1.webp",
    registerHref: "/open-house",
  },
];

/** Returns only future events, soonest first. */
export function getUpcomingEvents(now: Date = new Date()): WindEvent[] {
  return events
    .filter((e) => {
      const d = new Date(e.date);
      return !isNaN(d.getTime()) && d.getTime() >= now.getTime() - 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
