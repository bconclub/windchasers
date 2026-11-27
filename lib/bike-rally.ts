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
  // NOT CONFIRMED yet: start point, start time, fee.
  start: null as string | null,
  startTime: null as string | null,
  // Registration fee in paise. null = free registration (no payment step).
  // Set a number (e.g. 49900 for ₹499) to switch on Razorpay checkout; the
  // page, the API and the tracking all follow this one value.
  feePaise: null as number | null,
} as const;

export const rallyFeeLabel = () => (RALLY.feePaise ? `₹${RALLY.feePaise / 100}` : null);

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

export type RallyPayment = { status: "free" | "pending" | "paid"; order_id?: string; payment_id?: string };

export async function rallyToProxe(r: Pick<RallyRegistration, "name" | "phone"> & Partial<RallyRegistration>, payment: RallyPayment, data: Record<string, unknown> = {}) {
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
      safety_declaration: r.licence_no ? "accepted" : undefined,
      rally_participation: r.licence_no ? "confirmed" : undefined,
      documents: r.licence_no ? "licence and ID to collect on WhatsApp" : undefined,
      payment_status: payment.status,
      payment_amount: RALLY.feePaise ? RALLY.feePaise / 100 : 0,
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.payment_id,
    },
  });
}
