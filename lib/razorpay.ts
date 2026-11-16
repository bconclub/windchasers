// =============================================================================
// Razorpay, server side only. Orders API + signature checks, no SDK.
//
// Env (set on the server, never in the repo):
//   RAZORPAY_KEY_ID          rzp_live_... (or rzp_test_... while testing)
//   RAZORPAY_KEY_SECRET      the key's secret
//   RAZORPAY_WEBHOOK_SECRET  the secret typed into Razorpay > Webhooks
// =============================================================================
import { createHmac, timingSafeEqual } from "crypto";

const API = "https://api.razorpay.com/v1";

export function razorpayConfigured(): boolean {
  return !!(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

export function razorpayKeyId(): string {
  return (process.env.RAZORPAY_KEY_ID ?? "").trim();
}

function auth(): string {
  const id = razorpayKeyId();
  const secret = (process.env.RAZORPAY_KEY_SECRET ?? "").trim();
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt: string | null;
  status: string;
  notes: Record<string, string>;
};

/** amount is in paise (₹99 = 9900). Notes: at most 15 keys, 256 chars each. */
export async function createOrder(amount: number, receipt: string, notes: Record<string, string>): Promise<RazorpayOrder> {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(notes).slice(0, 15)) if (v) clean[k] = String(v).slice(0, 250);
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { Authorization: auth(), "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: "INR", receipt: receipt.slice(0, 40), notes: clean }),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.description || `Razorpay ${res.status}`);
  return json as RazorpayOrder;
}

export async function fetchOrder(orderId: string): Promise<RazorpayOrder> {
  const res = await fetch(`${API}/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: auth() },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.description || `Razorpay ${res.status}`);
  return json as RazorpayOrder;
}

/**
 * Paid orders created by this site for one event (notes.event === key).
 * Walks the order list newest first, 100 at a time, up to 2,000 orders.
 * Returns null when Razorpay is not configured.
 */
export async function countPaidOrders(eventKey: string): Promise<number | null> {
  if (!razorpayConfigured()) return null;
  let paid = 0;
  for (let skip = 0; skip < 2000; skip += 100) {
    const res = await fetch(`${API}/orders?count=100&skip=${skip}`, { headers: { Authorization: auth() }, cache: "no-store" });
    if (!res.ok) throw new Error(`Razorpay ${res.status}`);
    const json = (await res.json()) as { items?: RazorpayOrder[] };
    const items = json.items || [];
    for (const o of items) if (o.status === "paid" && o.notes?.event === eventKey) paid++;
    if (items.length < 100) break;
  }
  return paid;
}

function safeEqualHex(a: string, b: string): boolean {
  if (!/^[0-9a-f]+$/i.test(a) || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

/** Checkout success: signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = (process.env.RAZORPAY_KEY_SECRET ?? "").trim();
  if (!secret || !orderId || !paymentId || !signature) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(signature, expected);
}

/** Webhook: X-Razorpay-Signature = HMAC_SHA256(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = (process.env.RAZORPAY_WEBHOOK_SECRET ?? "").trim();
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(signature, expected);
}
