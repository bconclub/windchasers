// Aviators of Bengaluru bike rally + networking breakfast, Sunday 13 Dec 2026.
// Every fact on the page and in the registration comes from here. Source: Z's
// posters (15 Nov) and the brief relayed 27 Nov. Fields set to null are not
// confirmed yet; the page shows "to be announced" for them.
import { forwardLeadToProxe } from "@/lib/proxe";

export const RALLY = {
  slug: "bike-rally",
  formType: "Aviators Bike Rally 13 Dec",
  title: "Aviators of Bengaluru, let's meet!",
  dateLabel: "Sunday 13 December 2026",
  dateShort: "Sun 13 Dec",
  dateIso: "2026-12-13",
  time: "10 am",
  finish: "Moxy Hotel, Bengaluru",
  // Free, open event (Z, 27 Nov): registration required, no fee.
  // NOT CONFIRMED yet: start point and start time (shared on WhatsApp).
  start: null as string | null,
  startTime: null as string | null,
  // Route facts for "The day". Each shows on the page only once it is set here;
  // nothing is guessed. Maps links: a Google Maps URL for the exact place.
  startMapsUrl: null as string | null,
  finishMapsUrl: null as string | null, // which Moxy: not confirmed yet
  distanceKm: null as number | null,
  rideMinutes: null as number | null,
  // A real map of the route (image in /public, start and finish pins, route
  // line). When set it replaces the drawn path.
  routeMapImage: null as string | null,
} as const;

// PROXe files a lead under an offline event only when lead_type is
// "offline_event", and finds the event by offline_event_key. The key must match
// PROXe's registry entry "bike-rally" exactly (PROXe feat/windchasers-bike-rally).
export const RALLY_PROXE_EVENT = {
  lead_type: "offline_event",
  offline_event_key: "bike-rally",
  offline_event_name: "Aviators of Bengaluru Bike Rally",
  offline_event_date: "13 December 2026",
  offline_event_location: "Moxy Hotel, Bengaluru",
} as const;

export const ROLES = ["Airline pilot", "General aviation pilot", "Student pilot", "Flight instructor", "Engineer", "Ground professional", "Aviation enthusiast"];
export const RALLY_WA = `https://wa.me/919035098424?text=${encodeURIComponent(`Hi WindChasers, I want to know more about the aviators bike rally on ${RALLY.dateShort}.`)}`;
// Step 1 -> step 2 hand-off (name, mobile, role), kept in sessionStorage, never in the URL.
export const INTEREST_KEY = "bike_rally_interest";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;

export type RallyRegistration = {
  name: string;
  phone: string;
  email: string;
  age: number;
  blood_group: string;
  area: string;
  emergency_name: string;
  emergency_phone: string;
  bike: string;
  bike_reg: string;
  licence_no: string;
  licence_valid_till: string;
  riding_years: number;
  tshirt: string;
  role: string;
};

// The rider form on /bike-rally/register, one screen at a time. The same field
// lists and checks run in the browser (per screen) and on the server.
export const REG_STEPS = [
  { title: "About you", fields: ["name", "phone", "email", "age", "blood_group", "area", "role"] },
  { title: "Emergency contact", fields: ["emergency_name", "emergency_phone"] },
  { title: "Your bike", fields: ["bike", "bike_reg", "riding_years"] },
  { title: "Licence", fields: ["licence_no", "licence_valid_till"] },
  { title: "Lock your spot", fields: ["tshirt", "consent", "participate"] },
] as const;
export type RegField = (typeof REG_STEPS)[number]["fields"][number];

const txt = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : typeof v === "number" ? String(v) : "");
const phone10 = (v: unknown) => txt(v, 20).replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");

/** Normalise raw form input (strings from the browser) into clean values. */
export function cleanRally(b: Record<string, unknown>) {
  return {
    name: txt(b.name, 80),
    phone: phone10(b.phone),
    email: txt(b.email, 120),
    age: txt(b.age, 3),
    blood_group: txt(b.blood_group, 4),
    area: txt(b.area, 80),
    role: ROLES.includes(txt(b.role, 40)) ? txt(b.role, 40) : "",
    emergency_name: txt(b.emergency_name, 80),
    emergency_phone: phone10(b.emergency_phone),
    bike: txt(b.bike, 80),
    bike_reg: txt(b.bike_reg, 16).toUpperCase(),
    riding_years: txt(b.riding_years, 2),
    licence_no: txt(b.licence_no, 24).toUpperCase(),
    licence_valid_till: txt(b.licence_valid_till, 10),
    tshirt: txt(b.tshirt, 4),
    consent: b.consent === true,
    participate: b.participate === true,
  };
}
export type RallyClean = ReturnType<typeof cleanRally>;

/** Errors for the given fields, keyed by field. Empty object = all good. */
export function rallyErrors(c: RallyClean, fields: readonly string[]): Partial<Record<RegField, string>> {
  const e: Partial<Record<RegField, string>> = {};
  const has = (f: RegField) => fields.includes(f);
  const age = Number(c.age);
  const yrs = Number(c.riding_years);
  if (has("name") && c.name.length < 2) e.name = "Please enter your full name as on your ID.";
  if (has("phone") && !/^[6-9]\d{9}$/.test(c.phone)) e.phone = "Please enter a valid 10-digit mobile number.";
  if (has("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) e.email = "Please enter a valid email address.";
  if (has("age") && (!/^\d+$/.test(c.age) || age < 18 || age > 80)) e.age = "Riders must be 18 or older. Please check your age.";
  if (has("blood_group") && !(BLOOD_GROUPS as readonly string[]).includes(c.blood_group)) e.blood_group = "Please pick your blood group.";
  if (has("area") && c.area.length < 2) e.area = "Please enter the area you live in.";
  if (has("role") && !c.role) e.role = "Please tell us what you do in aviation.";
  if (has("emergency_name") && c.emergency_name.length < 2) e.emergency_name = "Please enter your emergency contact's name.";
  if (has("emergency_phone")) {
    if (!/^[6-9]\d{9}$/.test(c.emergency_phone)) e.emergency_phone = "Please enter a valid 10-digit mobile number.";
    else if (c.emergency_phone === c.phone) e.emergency_phone = "This should be someone else's number, not yours.";
  }
  if (has("bike") && c.bike.length < 2) e.bike = "Please enter your bike make and model.";
  if (has("bike_reg") && !/^[A-Z0-9 -]{6,16}$/.test(c.bike_reg)) e.bike_reg = "Please check the registration number, e.g. KA 01 AB 1234.";
  if (has("riding_years") && (!/^\d+$/.test(c.riding_years) || yrs > 70)) e.riding_years = "Please enter your riding experience in years.";
  if (has("licence_no") && !/^[A-Z0-9 -]{8,24}$/.test(c.licence_no)) e.licence_no = "Please check your driving licence number.";
  if (has("licence_valid_till")) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.licence_valid_till)) e.licence_valid_till = "Please pick the date your licence is valid till.";
    else if (c.licence_valid_till < RALLY.dateIso) e.licence_valid_till = "Your licence must be valid on the day of the rally.";
  }
  if (has("tshirt") && !(TSHIRT_SIZES as readonly string[]).includes(c.tshirt)) e.tshirt = "Please pick a T-shirt size.";
  if (has("consent") && !c.consent) e.consent = "Please accept the safety declaration.";
  if (has("participate") && !c.participate) e.participate = "Please confirm you will ride in the rally.";
  return e;
}

/** Fields of screens 1..n (1-based). */
export const fieldsUpTo = (n: number) => REG_STEPS.slice(0, n).flatMap((s) => s.fields as readonly string[]);

// Step 1 on /bike-rally: name, mobile, role. PROXe keys leads on phone, so the
// full registration (step 2) later updates this same lead to "registered".
export async function rallyInterestToProxe(r: { name: string; phone: string; role: string }, data: Record<string, unknown> = {}) {
  return forwardLeadToProxe({
    name: r.name,
    phone: r.phone,
    source: "event",
    formType: RALLY.formType,
    data,
    fields: {
      ...RALLY_PROXE_EVENT,
      event: RALLY.slug,
      event_date: RALLY.dateIso,
      event_venue: RALLY.finish,
      attendee_type: r.role,
      rally_stage: "interested",
    },
  });
}

// /bike-rally/register: saved after every screen ("details N of 5") and on the
// last one ("registered"). Always sends everything known so far, so PROXe keeps
// partial details if the rider drops off, on the same lead (matched on phone).
export async function rallyToProxe(c: RallyClean, stage: { done: number; registered: boolean }, data: Record<string, unknown> = {}) {
  const v = (x: string) => x || undefined;
  return forwardLeadToProxe({
    name: c.name,
    phone: c.phone,
    email: v(c.email),
    city: v(c.area),
    source: "event",
    formType: RALLY.formType,
    data,
    fields: {
      ...RALLY_PROXE_EVENT,
      event: RALLY.slug,
      event_date: RALLY.dateIso,
      event_venue: RALLY.finish,
      attendee_type: v(c.role),
      rally_stage: stage.registered ? "registered" : `details ${stage.done} of ${REG_STEPS.length}`,
      age: c.age ? Number(c.age) : undefined,
      blood_group: v(c.blood_group),
      emergency_contact_name: v(c.emergency_name),
      emergency_contact_phone: v(c.emergency_phone),
      bike_make_model: v(c.bike),
      bike_registration: v(c.bike_reg),
      riding_experience_years: c.riding_years ? Number(c.riding_years) : undefined,
      driving_licence_no: v(c.licence_no),
      driving_licence_valid_till: v(c.licence_valid_till),
      tshirt_size: v(c.tshirt),
      safety_declaration: stage.registered ? "accepted" : undefined,
      rally_participation: stage.registered ? "confirmed" : undefined,
      documents: stage.registered ? "licence and ID to collect on WhatsApp" : undefined,
    },
  });
}
