// Events shown on the HOMEPAGE.
// EDIT THIS FILE to add / remove events. Past events are detected by date and
// shown in a separate "Past events" row (with their clips) for social proof.
// Set `date` as an ISO string (YYYY-MM-DD).

export type WindEvent = {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-07-15". Determines upcoming vs past. */
  date: string;
  /** Human label shown on the card, e.g. "Sat, 15 Jul · 6:00 PM IST". */
  when: string;
  mode: "Online Webinar" | "Open House" | "Seminar" | "Workshop";
  blurb: string;
  /** Vimeo numeric ID for the teaser clip (optional). */
  vimeoId?: string;
  /** Fallback poster image if no vimeoId (optional). */
  image?: string;
  /** Where the "Register" / "Watch" button goes. */
  registerHref: string;
};

// --- EDIT THESE. Two upcoming + two past. ---
export const events: WindEvent[] = [
  // ---------- UPCOMING ----------
  {
    id: "pilot-career-webinar",
    title: "WindChasers Pilot Career Webinar",
    date: "2099-01-01", // TODO: set the real date
    when: "Set date & time",
    mode: "Online Webinar",
    blurb:
      "A free online session on how to plan your route to the cockpit, with a live Q&A with our instructors.",
    vimeoId: "1160946921",
    registerHref: "/webinar",
  },
  {
    id: "airport-operations-webinar",
    title: "Airport Operations Webinar",
    date: "2099-01-02", // TODO: set the real date
    when: "Set date & time",
    mode: "Online Webinar",
    blurb:
      "Understand how airport operations work and the career paths inside aviation beyond the cockpit.",
    vimeoId: "1191576047",
    registerHref: "/webinar",
  },

  // ---------- PAST (kept for social proof; shown as 'Past events') ----------
  {
    id: "past-pilot-career-webinar",
    title: "WindChasers Pilot Career Webinar",
    date: "2025-09-01",
    when: "Held September 2025",
    mode: "Online Webinar",
    blurb:
      "Our last Pilot Career Webinar walked aspirants through eligibility, costs, and the DGCA path. Watch the highlights.",
    vimeoId: "1150072244",
    registerHref: "/webinar",
  },
  {
    id: "past-open-house",
    title: "WindChasers Bengaluru Open House",
    date: "2025-08-01",
    when: "Held August 2025",
    mode: "Open House",
    blurb:
      "Students and parents visited our campus, sat in the simulator, and met the team. Here is a look back.",
    image: "/facility/WC1.webp",
    registerHref: "/open-house",
  },
];

function startOfToday(now: Date): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/** Future events, soonest first. */
export function getUpcomingEvents(now: Date = new Date()): WindEvent[] {
  const t = startOfToday(now);
  return events
    .filter((e) => {
      const d = new Date(e.date).getTime();
      return !isNaN(d) && d >= t;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** Past events, most recent first. */
export function getPastEvents(now: Date = new Date()): WindEvent[] {
  const t = startOfToday(now);
  return events
    .filter((e) => {
      const d = new Date(e.date).getTime();
      return !isNaN(d) && d < t;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
