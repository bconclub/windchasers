// Australia seminar: step 1 of 2. Takes the form, records the person in PROXe as
// "payment pending", and opens a ₹99 Razorpay order for the checkout.
//
// POST { name, phone, email, city, role, with_parent, ...attribution }
//   -> { order_id, amount, currency, key }
import { NextResponse } from "next/server";
import { countPaidOrders, createOrder, razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";
import { ATTR_KEYS, SEMINAR, seminarToProxe } from "@/lib/australia-seminar";

export const dynamic = "force-dynamic";

const s = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

export async function POST(request: Request) {
  if (!razorpayConfigured()) {
    return NextResponse.json({ error: "Payments are not switched on yet. Please call us on +91 95910 04043." }, { status: 503 });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = s(body.name, 80);
  const phone = s(body.phone, 20).replace(/[^\d+]/g, "");
  const email = s(body.email, 120);
  const city = s(body.city, 60);
  const role = body.role === "parent" ? "parent" : "student";
  const withParent = s(body.with_parent, 10);

  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
  if (!/^(91)?[6-9]\d{9}$/.test(digits)) return NextResponse.json({ error: "Please enter a valid 10-digit mobile number." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please check your email address." }, { status: 400 });

  // Stop taking payments once every seat is paid for.
  const taken = await countPaidOrders(SEMINAR.slug).catch(() => null);
  if (taken !== null && taken >= SEMINAR.capacity) {
    return NextResponse.json({ error: `All ${SEMINAR.capacity} seats are taken. Message us on WhatsApp to join the waiting list.` }, { status: 409 });
  }

  const notes: Record<string, string> = {
    event: SEMINAR.slug, name, phone: digits.slice(-10), email, city, role, with_parent: withParent,
  };
  for (const k of ATTR_KEYS) {
    const v = s(body[k], 200);
    if (v) notes[k] = v;
  }

  let order;
  try {
    order = await createOrder(SEMINAR.feePaise, `aus-${Date.now()}`, notes);
  } catch (e) {
    console.error("Australia seminar: order failed", (e as Error).message);
    return NextResponse.json({ error: "Could not start the payment. Please try again in a minute." }, { status: 502 });
  }

  // Record the person even if they never pay, so the team can follow up.
  const proxe = await seminarToProxe(
    { name, phone: digits.slice(-10), email, city, role, with_parent: withParent },
    { status: "pending", order_id: order.id },
    body,
  );
  if (!proxe.ok) console.error("Australia seminar: PROXe (pending) failed", proxe.error);

  return NextResponse.json({ order_id: order.id, amount: order.amount, currency: order.currency, key: razorpayKeyId() });
}
