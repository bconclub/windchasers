// Razorpay webhook (Dashboard > Developers > Webhooks):
//   URL     https://windchasers.in/api/razorpay/webhook
//   Secret  same value as RAZORPAY_WEBHOOK_SECRET on the server
//   Events  payment.captured, order.paid, payment.failed
//
// Backup for the browser step: a payment counts even if the person closes the
// tab before /api/australia-seminar/verify runs. Only events for orders this
// site created (notes.event) are acted on; everything else is acknowledged.
import { NextResponse } from "next/server";
import { verifyWebhookSignature, type RazorpayOrder } from "@/lib/razorpay";
import { SEMINAR, fillFromPayment, personFromOrder, seminarToProxe } from "@/lib/australia-seminar";

export const dynamic = "force-dynamic";

type Payment = { id: string; order_id: string; amount: number; status: string; contact?: string; email?: string; notes?: Record<string, string> };

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("x-razorpay-signature") || "")) {
    return NextResponse.json({ error: "bad signature" }, { status: 401 });
  }
  let evt: { event?: string; payload?: { payment?: { entity?: Payment }; order?: { entity?: RazorpayOrder } } };
  try {
    evt = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  const payment = evt.payload?.payment?.entity;
  const order = evt.payload?.order?.entity;
  const notes = order?.notes || payment?.notes || {};
  if (notes.event !== SEMINAR.slug) return NextResponse.json({ ok: true, ignored: true });

  const status = evt.event === "payment.failed" ? "failed" : evt.event === "payment.captured" || evt.event === "order.paid" ? "paid" : null;
  if (!status || !payment) return NextResponse.json({ ok: true, ignored: true });
  if (status === "paid" && payment.amount !== SEMINAR.feePaise) return NextResponse.json({ ok: true, ignored: true });

  const person = fillFromPayment(personFromOrder({ ...(order || ({} as RazorpayOrder)), notes } as RazorpayOrder), payment);
  if (!person.phone) return NextResponse.json({ ok: true, ignored: true });
  const res = await seminarToProxe(person, { status, order_id: payment.order_id, payment_id: payment.id }, notes);
  if (!res.ok) {
    console.error("Razorpay webhook: PROXe failed", res.error);
    // 500 makes Razorpay retry later.
    return NextResponse.json({ error: "proxe" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
