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
      event: RALLY.slug,
      event_date: RALLY.dateIso,
      event_venue: RALLY.finish,
      attendee_type: r.role,
      rally_stage: "interested",
    },
  });
}

// Step 2 on /bike-rally/register: the full rider registration.
export async function rallyToProxe(r: RallyRegistration, data: Record<string, unknown> = {}) {
  return forwardLeadToProxe({
    name: r.name,
    phone: r.phone,
    email: r.email,
    city: r.area,
    source: "event",
    formType: RALLY.formType,
    data,
    fields: {
      event: RALLY.slug,
      event_date: RALLY.dateIso,
      event_venue: RALLY.finish,
      attendee_type: r.role,
      rally_stage: "registered",
      age: r.age,
      blood_group: r.blood_group,
      emergency_contact_name: r.emergency_name,
      emergency_contact_phone: r.emergency_phone,
      bike_make_model: r.bike,
      bike_registration: r.bike_reg,
      driving_licence_no: r.licence_no,
      driving_licence_valid_till: r.licence_valid_till,
      riding_experience_years: r.riding_years,
      tshirt_size: r.tshirt,
      safety_declaration: "accepted",
      rally_participation: "confirmed",
      documents: "licence and ID to collect on WhatsApp",
    },
  });
}
