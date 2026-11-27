// Bike rally, paid registration step 2 (only used when RALLY.feePaise is set).
// Checks the Razorpay signature, reads the rider from the order notes (never
// from the browser) and marks them paid in PROXe.
//
// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature } -> { ok, name }
import { NextResponse } from "next/server";
import { fetchOrder, verifyPaymentSignature } from "@/lib/razorpay";
import { RALLY, rallyToProxe } from "@/lib/bike-rally";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const b = (await request.json().catch(() => ({}))) as Record<string, string>;
  const orderId = String(b.razorpay_order_id || "");
  const paymentId = String(b.razorpay_payment_id || "");
  if (!verifyPaymentSignature(orderId, paymentId, String(b.razorpay_signature || ""))) {
    return NextResponse.json({ ok: false, error: "We could not confirm the payment. If money left your account, message us on WhatsApp." }, { status: 400 });
  }
  try {
    const order = await fetchOrder(orderId);
    if (order.notes?.event !== RALLY.slug || order.amount !== RALLY.feePaise) {
      return NextResponse.json({ ok: false, error: "That payment is not for the bike rally." }, { status: 400 });
    }
    const n = order.notes || {};
    const proxe = await rallyToProxe({ name: n.name || "", phone: n.phone || "", email: n.email, area: n.area }, { status: "paid", order_id: orderId, payment_id: paymentId }, n);
    if (!proxe.ok) console.error("Bike rally: PROXe (paid) failed", proxe.error);
    return NextResponse.json({ ok: true, name: (n.name || "").split(" ")[0] });
  } catch (e) {
    // Signature was valid, so the payment is real.
    console.error("Bike rally: verify follow-up failed", (e as Error).message);
    return NextResponse.json({ ok: true, name: "" });
  }
}
