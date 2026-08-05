/**
 * Wings of Freedom - Independence Day aviation day, 15 August 2026.
 *
 * A women-only in-person event at the Kothanur campus, ending with the reveal
 * of the "Freedom to Fly" scholarship. Sibling to lib/offline-events.ts rather
 * than an extension of it: every export there is a zero-arg closure over the
 * DEMO_CLASS_* constants, so there is nothing to parameterise.
 *
 * COUNTERPART: PROXe holds its own registry at
 * C:\GO PROXe\core\src\configs\offline-events.ts. Separate repo, separate
 * deploy. The contract between them is WINGS_EVENT_KEY - the register modal
 * submits it and PROXe resolves the authoritative date/venue/landing URL from
 * its own copy, so display drift here can never corrupt reminder scheduling.
 *
 * This module is deliberately React-free (icons are string keys, mapped to
 * lucide components inside the section files) so all the copy lives in one
 * plain file that can be edited without touching components.
 */

/** Must match the `key` of the PROXe registry entry. */
export const WINGS_EVENT_KEY = "wings-of-freedom";

export const WINGS_EVENT_NAME = "Wings of Freedom";
export const WINGS_EVENT_KICKER = "Independence Day Aviation Celebration & Seminar";

export const WINGS_START_ISO = "2026-08-15T11:00:00+05:30";
export const WINGS_END_ISO = "2026-08-15T15:30:00+05:30";

export const WINGS_LOCATION = "WindChasers Aviation Academy, Kothanur, Bengaluru, Karnataka 560077";
/** Short form for tight meta rows - the full address doesn't fit inline. */
export const WINGS_VENUE_SHORT = "WindChasers HQ, Bangalore";
export const WINGS_MAPS_URL = "https://maps.google.com/maps?q=WindChasers+Aviation+Academy+Kothanur+Bengaluru";

/** Structured address for the Event JSON-LD block. */
export const WINGS_ADDRESS = {
  streetAddress: "Kothanur",
  addressLocality: "Bengaluru",
  addressRegion: "Karnataka",
  postalCode: "560077",
  addressCountry: "IN",
} as const;

/** "15 August" */
export function formatWingsDayMonthDisplay(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
  }).format(new Date(WINGS_START_ISO));
}

/** "15 August 2026" */
export function formatWingsDateFullDisplay(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(WINGS_START_ISO));
}

/** "11:00 AM - 3:30 PM IST" - ASCII hyphen so it never mojibakes downstream. */
export function formatWingsTimeRangeDisplay(): string {
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  return `${fmt(WINGS_START_ISO)} - ${fmt(WINGS_END_ISO)} IST`;
}

/** "15 August 2026 at 11:00 AM IST" - stored on the lead, matches the shape
 *  PROXe's confirmation template splits on (" at "). */
export function wingsDateTimeLabel(): string {
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(WINGS_START_ISO));
  const time = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(WINGS_START_ISO));
  return `${date} at ${time} IST`;
}

// ── Last year's event media ─────────────────────────────────────────────────

/**
 * Real footage and photos from the previous Wings of Freedom. Shown directly
 * under the hero so a visitor sees what the day actually looks like before
 * being asked to commit to anything.
 *
 * Files live in public/wings-of-freedom/. Add more by appending here - the
 * carousel and its thumbnail strip are driven entirely off this list.
 */
export type WingsMediaItem =
  | { kind: "video"; src: string; poster: string; caption: string; alt: string }
  | { kind: "image"; src: string; caption: string; alt: string };

export const WINGS_LAST_TIME_MEDIA: WingsMediaItem[] = [
  {
    kind: "video",
    src: "/wings-of-freedom/recap.mp4",
    poster: "/wings-of-freedom/recap-poster.jpg",
    caption: "Inside last year's Wings of Freedom",
    alt: "Highlights reel from the previous Wings of Freedom event",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/flag-hoisting.jpg",
    caption: "The Independence Day flag hoisting on campus",
    alt: "Attendees and WindChasers cadets gathered around the Indian flag for the Independence Day ceremony",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/masterclass.jpg",
    caption: "The masterclass, front of the room",
    alt: "Two women presenting the WindChasers admissions process to a seated audience",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/workshop-build.jpg",
    caption: "Building model aircraft, hands-on",
    alt: "Attendees assembling wooden model aircraft around a long table",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/workshop-gallery.jpg",
    caption: "In the aviation gallery at the academy",
    alt: "Attendees building model aircraft in a room lined with framed aircraft photographs",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/simulator.jpg",
    caption: "Taking the controls in the simulator",
    alt: "An instructor guiding attendees at the flight simulator controls",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/certificate.jpg",
    caption: "Certificates at the end of the day",
    alt: "An attendee receiving her participation certificate",
  },
  {
    kind: "image",
    src: "/wings-of-freedom/group-photo.jpg",
    caption: "Everyone who showed up last year",
    alt: "Group photograph of all attendees and WindChasers staff at the end of the event",
  },
];

// ── Agenda ──────────────────────────────────────────────────────────────────

export type WingsAgendaBlock = {
  id: string;
  timeLabel: string;
  kicker: string;
  title: string;
  description: string;
  icon: "flag" | "book-open" | "plane" | "trophy";
  /** Masterclass splits into two parallel tracks. */
  tracks?: { title: string; points: string[] }[];
  /** The action zones are a rotation, not a talk - rendered as a nested grid. */
  zones?: { n: string; title: string; description: string; highlight: string }[];
};

export const WINGS_AGENDA: WingsAgendaBlock[] = [
  {
    id: "opening",
    timeLabel: "11:00 - 11:45 AM",
    kicker: "Grand Opening",
    title: "Flag hoisting, then the keynote",
    description:
      "We raise the flag together, then a serving female airline captain walks you through how she actually got to the left seat - the parts nobody puts on a brochure.",
    icon: "flag",
  },
  {
    id: "masterclass",
    timeLabel: "11:45 AM - 12:30 PM",
    kicker: "Masterclass",
    title: "The Blueprint to the Sky",
    description:
      "A clear, practical breakdown of both routes into the industry. Sit in on whichever one you're leaning towards.",
    icon: "book-open",
    tracks: [
      { title: "The Pilot Path", points: ["DGCA written exams", "Class 1 & Class 2 medicals", "Choosing a flight school"] },
      { title: "The Cabin Crew Path", points: ["Airline interviews", "Premium hospitality standards", "Travel and the roster"] },
    ],
  },
  {
    id: "zones",
    timeLabel: "12:30 - 2:45 PM",
    kicker: "The Action Zones",
    title: "Three zones, 45 minutes each",
    description:
      "You'll be split into groups and rotate through all three. This is the hands-on part of the day.",
    icon: "plane",
    zones: [
      { n: "01", title: "\"Top Gun\" Simulator", description: "Take the controls and fly it yourself.", highlight: "Smooth Landing Contest + live leaderboard" },
      { n: "02", title: "Cabin Crew Glam & Safety Lab", description: "The polished airline look and presentation, then a rapid-fire emergency exit drill.", highlight: "Rapid-fire exit drill" },
      { n: "03", title: "Radio Telephony Workshop", description: "Learn the coded language pilots use and get on the mic with Air Traffic Control.", highlight: "Live ATC phraseology" },
    ],
  },
  {
    id: "finale",
    timeLabel: "2:45 - 3:30 PM",
    kicker: "Grand Finale",
    title: "Awards and the scholarship reveal",
    description:
      "We crown the Simulator Landing Champion, then reveal the Freedom to Fly scholarships.",
    icon: "trophy",
  },
];

// ── Freedom to Fly scholarship ──────────────────────────────────────────────

export const WINGS_SCHOLARSHIP_NAME = "Freedom to Fly";

export const WINGS_SCHOLARSHIP_TRACKS = [
  {
    id: "pilot",
    label: "Pilot",
    amountLabel: "\u20b92,35,000",
    towards: "advanced flight training",
    waiverAppliesTo: "WindChasers DGCA Ground Classes",
    // Stage 1 form for this track - the slugs are the academy's two separate
    // application papers, see lib/scholarship-forms.ts.
    applicationPath: "/scholarship/pilot",
  },
  {
    id: "cabin_crew",
    label: "Cabin Crew",
    amountLabel: "\u20b980,000",
    towards: "cabin crew training",
    waiverAppliesTo: "the Cabin Crew Training Program",
    applicationPath: "/scholarship/cabin-crew",
  },
] as const;

export const WINGS_SCHOLARSHIP_TIERS = [
  { id: "elite", name: "The Elite Seat", waiver: "100%", seats: "1 candidate per track", blurb: "A full fee waiver.", featured: true },
  { id: "captains", name: "The Captain's Circle", waiver: "50%", seats: "2 candidates per track", blurb: "Half the programme fee.", featured: false },
  { id: "aviators", name: "The Aviator's Flight", waiver: "25%", seats: "Up to 3 per track", blurb: "A quarter off.", featured: false },
] as const;

export const WINGS_SCHOLARSHIP_BENEFITS = [
  { icon: "compass", title: "Career counselling", desc: "A one-to-one session and a written industry roadmap." },
  { icon: "stethoscope", title: "DGCA medical guidance", desc: "Class 1 and Class 2 - what to expect, and how to prepare." },
  { icon: "wallet", title: "Education loan help", desc: "Assistance putting a funding plan and loan file together." },
  { icon: "globe", title: "Visa guidance", desc: "For candidates whose flying phase is overseas." },
  { icon: "users", title: "One-year mentorship", desc: "Paired with an aviation industry veteran for twelve months." },
  { icon: "mic", title: "Interview & career prep", desc: "Mock interviews and airline-standard preparation." },
] as const;

/** The event's WhatsApp group. The aptitude test link, shortlist dates and
 *  day-of updates all go out here, so it doubles as the applicant channel.
 *  Kept in sync with core/src/configs/offline-events.ts on the PROXe side and
 *  with the site's /join/wings-of-freedom redirect. */
export const WINGS_WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/BiPGKSg03CzETSljBUO9sa";

/**
 * How a scholarship is actually won.
 *
 * The form on this page starts an application - it does not award anything,
 * and nothing on the page should imply a tick-box makes you eligible. These
 * are the stages every applicant goes through, stated up front so the
 * commitment is visible before anyone applies. Mirrors the "How to apply" and
 * "How it's decided" clauses in WINGS_TERMS - change them together.
 */
export const WINGS_SCHOLARSHIP_STAGES = [
  {
    n: "01",
    title: "Start your application",
    desc: "Register for 15 August and tick the scholarship box. Takes a minute.",
  },
  {
    n: "02",
    title: "Pilot Aptitude Test",
    desc: "A timed 20-minute online test, taken right after you apply.",
  },
  {
    n: "03",
    title: "Documents & motivation",
    desc: "Marksheets and ID, plus a short essay or video on why you want to fly, if we ask for one.",
  },
  {
    n: "04",
    title: "Interview & counselling",
    desc: "Shortlisted candidates attend a personal interview and a counselling session with a parent or guardian.",
  },
  {
    n: "05",
    title: "Final selection",
    desc: "Merit-based, on aptitude, motivation, interview and eligibility. The committee's decision is final.",
  },
] as const;

/** One-liner the register modal shows the moment the scholarship box is
 *  ticked, so nobody submits believing the tick is the whole application. */
export const WINGS_SCHOLARSHIP_PROCESS_NOTE =
  "This starts your application. Selection runs through the Pilot Aptitude Test, an interview and a counselling session.";

/** The exact sentence shown next to the eligibility checkbox. Stored verbatim
 *  on the lead, so reword it and bump WINGS_TERMS_VERSION together. */
export const WINGS_ELIGIBILITY_DECLARATION =
  "I confirm I am applying as a female candidate. Freedom to Fly is open to female applicants only.";

export const WINGS_TERMS_VERSION = "2026-08-15-v1";

/** The 17 clauses, grouped for readability rather than presented as a wall. */
export const WINGS_TERMS: { heading: string; clauses: string[] }[] = [
  {
    heading: "Who can apply",
    clauses: [
      "The scholarship is open exclusively to female applicants.",
      "Applicants must satisfy the minimum educational eligibility criteria required for pilot training.",
    ],
  },
  {
    heading: "How to apply",
    clauses: [
      "Applicants must complete the official scholarship application and submit all required documents before the closing deadline.",
      "Applicants may be asked to submit a thematic essay or a video recording explaining their motivation to become a professional pilot.",
      "Shortlisted candidates must attend a personal interview round and a dedicated counselling session.",
    ],
  },
  {
    heading: "How it's decided",
    clauses: [
      "Final selection is merit-based, evaluated on aptitude, motivation, interview performance and overall eligibility. The selection committee's decision is final.",
    ],
  },
  {
    heading: "What it covers",
    clauses: [
      "Scholarship benefits are non-transferable, cannot be exchanged for cash, and apply only to the designated WindChasers DGCA Ground Classes or Cabin Crew training tracks.",
      "The scholarship cannot be combined with any other running discount, promotional offer or fee concession unless approved in writing by WindChasers management.",
      "Selected candidates must complete all admission formalities within the stipulated timeline, failing which the offer may be withdrawn.",
    ],
  },
  {
    heading: "What you commit to",
    clauses: [
      "Applicants must demonstrate a realistic funding plan for pursuing CPL flight training after completing DGCA Ground Classes (education loan approval, family support, savings, sponsorship or other legitimate means).",
      "The applicant and at least one parent or legal guardian must attend a financial counselling session before final scholarship confirmation.",
      "Recipients must sign a declaration confirming their intention to pursue full CPL flight training within 12 months of completing DGCA Ground Classes, subject to funding and medical fitness.",
    ],
  },
  {
    heading: "What can void it",
    clauses: [
      "Submission of false information or forged documents will result in immediate cancellation of the scholarship and possible disciplinary action.",
      "WindChasers may revoke the scholarship at any stage for student misconduct, indiscipline, prolonged absenteeism or violation of academy rules.",
      "The scholarship is intended for genuinely committed aspiring aviators. Candidates who discontinue the programme without a valid documented reason may be ineligible for future WindChasers scholarships.",
      "Meeting the medical fitness requirements prescribed by the DGCA remains the sole responsibility of the candidate.",
      "WindChasers reserves the right to amend, restructure or discontinue the scholarship scheme at any time without prior notice.",
    ],
  },
];

// ── FAQ ─────────────────────────────────────────────────────────────────────

export const WINGS_FAQ: { q: string; a: string }[] = [
  {
    q: "Is it really free?",
    a: "Yes. Wings of Freedom is free to attend - the simulator time, the masterclass and the workshops are all included. Just reserve a slot so we know how many to expect.",
  },
  {
    q: "Why is this a women-only event?",
    a: "Women are roughly 5% of India's commercial pilots. For one day we're building a room where that isn't true, so the questions get asked out loud and the answers come from women already doing the job.",
  },
  {
    q: "Do I need any experience to fly the simulator?",
    a: "None at all. An instructor sits with you and talks you through it. Most people in the Smooth Landing Contest have never touched a flight deck before.",
  },
  {
    q: "Do I have to apply for the scholarship to attend?",
    a: "No. The scholarship is a separate, optional application - you can come for the day, see the simulator and the campus, and decide about it later.",
  },
  {
    q: "Who can apply for the Freedom to Fly scholarship?",
    a: "Female applicants who meet the minimum educational eligibility for pilot or cabin crew training. There are two tracks - Pilot and Cabin Crew - and three award tiers in each.",
  },
  {
    q: "When are the scholarship results announced?",
    a: "The scholarship is revealed live at the Grand Finale on 15 August. Shortlisted applicants are then contacted for an interview and counselling session before final selection.",
  },
  {
    q: "What should I bring?",
    a: "Just yourself and a government ID for campus entry. If you're applying for the scholarship, having your latest marksheet handy is useful but not required on the day.",
  },
];
