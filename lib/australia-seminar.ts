// Australia seminar (Basair Aviation College x Windchasers), 28 Nov 2026.
// Every fact on the page and in the payment flow comes from here. Sources: the
// founder's brief (13-14 Nov) and the venue from Windchasers, WhatsApp 16 Nov.
import { forwardLeadToProxe } from "@/lib/proxe";
import type { RazorpayOrder } from "@/lib/razorpay";

export const SEMINAR = {
  slug: "australia-seminar",
  title: "Pilot training in Australia: seminar with Basair Aviation College",
  dateLabel: "Saturday 28 November 2026",
  dateShort: "Sat 28 Nov",
  time: "3 to 6 pm",
  venue: "Radisson City Centre",
  city: "Bengaluru",
  feePaise: 9900,
  capacity: 50,
  feeLabel: "₹99",
  formType: "Australia Seminar 28 Nov",
  speaker: {
    name: "David Trevelyan",
    role: "CEO, Basair Aviation College",
    also: "Director, Regional Aviation Association of Australia",
  },
} as const;

export type SeminarRole = "student" | "parent";

/** Sends one registration to PROXe. Called on order (pending) and again once paid. */
export async function seminarToProxe(
  person: { name: string; phone: string; email?: string; city?: string; role?: string; with_parent?: string },
  payment: { status: "pending" | "paid" | "failed"; order_id: string; payment_id?: string },
  data: Record<string, unknown> = {},
) {
  return forwardLeadToProxe({
    name: person.name,
    phone: person.phone,
    email: person.email,
    city: person.city,
    source: "event",
    formType: SEMINAR.formType,
    data,
    fields: {
      event: SEMINAR.slug,
      event_date: "2026-11-28",
      event_venue: `${SEMINAR.venue}, ${SEMINAR.city}`,
      attendee_type: person.role || undefined,
      user_type: person.role === "parent" ? "parent" : person.role ? "student" : undefined,
      with_parent: person.with_parent || undefined,
      payment_status: payment.status,
      payment_amount: SEMINAR.feePaise / 100,
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.payment_id || undefined,
      // Only a PAID registration is tagged as an offline-event registrant in
      // PROXe: that tag triggers PROXe's "you're registered" WhatsApp and the
      // event reminders, which must never reach someone who has not paid.
      // Off until PROXe's offline-event registry has the australia-seminar
      // entry (set PROXE_SEMINAR_EVENT_TAG=1 on the server to switch it on).
      ...(payment.status === "paid" && process.env.PROXE_SEMINAR_EVENT_TAG === "1"
        ? {
            lead_type: "offline_event",
            offline_event_key: SEMINAR.slug,
            offline_event_name: "Australia Pilot Training Seminar with Basair Aviation College",
            offline_event_date: "28 November 2026",
            offline_event_location: `${SEMINAR.venue}, ${SEMINAR.city}`,
            offline_event_coming_with: person.with_parent === "yes" ? "parent" : undefined,
          }
        : {}),
    },
  });
}

/** The person as stored in the order's notes (set server-side when the order was made). */
export function personFromOrder(order: RazorpayOrder) {
  const n = order.notes || {};
  return {
    name: n.name || "",
    phone: n.phone || "",
    email: n.email || undefined,
    city: n.city || undefined,
    role: n.role || undefined,
    with_parent: n.with_parent || undefined,
  };
}

/**
 * Orders from the pay-only page (/australia-seminar/pay) carry no name or phone:
 * Razorpay Checkout collects the phone and email, so fill them in from the payment.
 */
export function fillFromPayment<T extends { name: string; phone: string; email?: string }>(
  person: T,
  payment: { contact?: string; email?: string } | null | undefined,
): T {
  if (person.phone || !payment) return person;
  const phone = String(payment.contact || "").replace(/\D/g, "").slice(-10);
  const email = person.email || (payment.email && !/void@razorpay/.test(payment.email) ? payment.email : undefined);
  // PROXe needs a name; a phone number in its place is dropped there, so an
  // existing lead keeps its real name and a new one shows by number.
  return { ...person, phone, email, name: person.name || phone };
}

/** Attribution fields we keep in the order notes so the paid update keeps the ad source. */
export const ATTR_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "fbclid"] as const;
