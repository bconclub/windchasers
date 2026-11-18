// Australia seminar: step 2 of 2. The browser hands back what Razorpay Checkout
// returned; we check the signature, read the person from the order itself (never
// from the browser), and mark them paid in PROXe. The webhook does the same in
// case the browser closes before this runs.
//
// POST { razorpay_order_id, razorpay_payment_id, razorpay_signature } -> { ok, name }
import { NextResponse } from "next/server";
import { fetchOrder, fetchPayment, verifyPaymentSignature } from "@/lib/razorpay";
import { SEMINAR, fillFromPayment, personFromOrder, seminarToProxe } from "@/lib/australia-seminar";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const b = (await request.json().catch(() => ({}))) as Record<string, string>;
  const orderId = String(b.razorpay_order_id || "");
  const paymentId = String(b.razorpay_payment_id || "");
  if (!verifyPaymentSignature(orderId, paymentId, String(b.razorpay_signature || ""))) {
    return NextResponse.json({ ok: false, error: "We could not confirm the payment. If money left your account, call us and we will sort it." }, { status: 400 });
  }
  try {
    const order = await fetchOrder(orderId);
    if (order.notes?.event !== SEMINAR.slug || order.amount !== SEMINAR.feePaise) {
      return NextResponse.json({ ok: false, error: "That payment is not for this seminar." }, { status: 400 });
    }
    let person = personFromOrder(order);
    if (!person.phone) person = fillFromPayment(person, await fetchPayment(paymentId).catch(() => null));
    const proxe = await seminarToProxe(person, { status: "paid", order_id: orderId, payment_id: paymentId }, order.notes);
    if (!proxe.ok) console.error("Australia seminar: PROXe (paid) failed", proxe.error);
    return NextResponse.json({ ok: true, name: person.name.split(" ")[0] });
  } catch (e) {
    // The signature was valid, so the payment is real; the webhook will still record it.
    console.error("Australia seminar: verify follow-up failed", (e as Error).message);
    return NextResponse.json({ ok: true, name: "" });
  }
}
