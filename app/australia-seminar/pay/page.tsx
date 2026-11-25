"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, Clock, Loader2, MapPin, MessageCircle } from "lucide-react";
import { SEMINAR } from "@/lib/australia-seminar";
import { captureAndStoreUTMParams, getStoredClickIds, getStoredUTMParamsFull } from "@/lib/tracking";

/**
 * /australia-seminar/pay: the link the team sends people who already know about
 * the seminar. One button, Razorpay opens, they pay ₹99. Razorpay collects the
 * phone and email; the server reads them from the payment and marks the person
 * paid in PROXe (verify route, with the webhook as backup).
 */

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void };
  }
}

const VALUE = SEMINAR.feePaise / 100;
const WA_WAITLIST = `https://wa.me/919035098424?text=${encodeURIComponent(`Hi WindChasers, please add me to the waiting list for the Australia pilot training seminar with Basair Aviation College on ${SEMINAR.dateShort} at ${SEMINAR.venue}, ${SEMINAR.city}.`)}`;
const ITEM = { item_id: SEMINAR.slug, item_name: SEMINAR.formType, price: VALUE, quantity: 1 };
function fb(event: string, params: Record<string, unknown>, eventID?: string) {
  if (typeof window.fbq !== "function") return;
  if (eventID) window.fbq("track", event, params, { eventID });
  else window.fbq("track", event, params);
}
function ga(event: string, params: Record<string, unknown>) {
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}

export default function SeminarPayPage() {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [paid, setPaid] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  useEffect(() => {
    captureAndStoreUTMParams();
    if (window.Razorpay) setReady(true);
    // Check seats before showing a Pay button. Unknown (null) keeps the button:
    // the order route still refuses once every seat is paid for.
    fetch("/api/australia-seminar/seats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j && j.left === 0) setSoldOut(true); })
      .catch(() => {});
  }, []);

  // No chat bubble here: it covered the payment note. SiteChrome skips the
  // script on this path; this hides one an earlier page already loaded.
  useEffect(() => {
    const hide = () => { const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = "none"; };
    hide();
    const t = window.setInterval(hide, 1000);
    return () => { window.clearInterval(t); const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = ""; };
  }, []);

  async function pay() {
    setErr("");
    if (!window.Razorpay) return setErr("The payment window is still loading. Try again in a moment.");
    setBusy(true);
    const r = await fetch("/api/australia-seminar/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quick: true, ...getStoredUTMParamsFull(), ...getStoredClickIds() }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r && r.status === 409) { setBusy(false); return setSoldOut(true); }
    if (!r || !r.ok) { setBusy(false); return setErr(j.error || "Could not start the payment. Please try again."); }

    const rzp = new window.Razorpay({
      key: j.key,
      order_id: j.order_id,
      amount: j.amount,
      currency: j.currency,
      name: "Windchasers",
      description: `Australia seminar, ${SEMINAR.dateShort}`,
      theme: { color: "#C5A572" },
      config: {
        display: {
          blocks: {
            upi: { name: "Pay with UPI", instruments: [{ method: "upi", flows: ["intent"], apps: ["google_pay", "phonepe", "paytm"] }, { method: "upi" }] },
          },
          sequence: ["block.upi"],
          preferences: { show_default_blocks: true },
        },
      },
      modal: { ondismiss: () => setBusy(false) },
      handler: async (resp: RazorpayResponse) => {
        const v = await fetch("/api/australia-seminar/verify", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp),
        }).catch(() => null);
        const vj = v ? await v.json().catch(() => ({})) : {};
        setBusy(false);
        if (!v || !v.ok || !vj.ok) return setErr(vj.error || "We could not confirm the payment. If money left your account, call +91 95910 04043.");
        const key = `aus_seminar_purchase_${resp.razorpay_payment_id}`;
        let first = true;
        try { first = !localStorage.getItem(key); localStorage.setItem(key, "1"); } catch { /* storage blocked */ }
        if (first) {
          fb("Purchase", { value: VALUE, currency: "INR", content_name: SEMINAR.formType, content_ids: [SEMINAR.slug], content_type: "product" }, resp.razorpay_order_id);
          ga("purchase", { transaction_id: resp.razorpay_payment_id, value: VALUE, currency: "INR", items: [ITEM] });
        }
        setPaid(true);
      },
    });
    rzp.on("payment.failed", () => setErr("The payment did not go through. You can try again; nothing was charged for a failed attempt."));
    fb("InitiateCheckout", { value: VALUE, currency: "INR", content_name: SEMINAR.formType, content_ids: [SEMINAR.slug], content_type: "product", num_items: 1 }, j.order_id);
    ga("begin_checkout", { value: VALUE, currency: "INR", items: [ITEM] });
    rzp.open();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0E0E0E] px-5 pb-28 pt-[96px] text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setReady(true)} />
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-center gap-3 border-b border-white/10 pb-6 sm:gap-4">
          <Image src="/Windchasers-Logo.png" alt="Windchasers" width={500} height={134} className="h-auto w-[44%] max-w-[170px] min-w-0" priority />
          <span className="shrink-0 text-[16px] text-white/35" aria-hidden>×</span>
          <Image src="/australia-seminar/basair-logo.png" alt="Basair Aviation College" width={553} height={142} className="h-auto w-[38%] max-w-[150px] min-w-0" priority />
        </div>
        {paid ? (
          <div className="py-4 text-center">
            <CheckCircle2 size={44} className="mx-auto text-gold" />
            <h1 className="mt-4 text-[24px] font-bold">Your seat is reserved</h1>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
              Your {SEMINAR.feeLabel} payment is confirmed and Razorpay has sent you a receipt. See you on {SEMINAR.dateShort}, {SEMINAR.time}, at {SEMINAR.venue}, {SEMINAR.city}.
            </p>
          </div>
        ) : (
          <>
            <p className="text-[12px] font-medium tracking-[0.08em] text-gold">{SEMINAR.city.toUpperCase()} · IN PERSON</p>
            <h1 className="mt-3 text-[26px] font-bold leading-tight sm:text-[30px]">Pilot training in Australia: seminar with Basair Aviation College</h1>
            <ul className="mt-5 space-y-2 text-[15px] text-white/85">
              <li className="flex items-center gap-2"><Calendar size={16} className="text-gold" /> {SEMINAR.dateLabel}</li>
              <li className="flex items-center gap-2"><Clock size={16} className="text-gold" /> {SEMINAR.time}</li>
              <li className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {SEMINAR.venue}, {SEMINAR.city}</li>
            </ul>
            {soldOut ? (
              <>
                <p className="mt-7 text-center"><span className="inline-block rounded-full border border-gold/40 px-3 py-1 text-[12px] font-medium tracking-[0.08em] text-gold">SOLD OUT · {SEMINAR.capacity} OF {SEMINAR.capacity} SEATS TAKEN</span></p>
                <a href={WA_WAITLIST} target="_blank" rel="noopener noreferrer"
                  className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90">
                  <MessageCircle size={18} /> Join the waiting list on WhatsApp
                </a>
                <p className="mt-3 text-center text-[12px] text-white/50">No payment now. We message you if a seat opens up.</p>
              </>
            ) : (
              <>
              <button onClick={pay} disabled={busy || !ready}
                className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 disabled:opacity-50">
                {busy && <Loader2 size={18} className="animate-spin" />} Pay {SEMINAR.feeLabel}
              </button>
              {err && <p className="mt-3 text-center text-[13.5px] text-red-400">{err}</p>}
              <p className="mt-3 text-center text-[12px] text-white/40">UPI, card or netbanking through Razorpay. You get a receipt by email.</p>
              </>
            )}
            <p className="mt-5 text-center text-[13px] text-white/55">
              Want the details first? <a href="/australia-seminar" className="text-gold underline-offset-2 hover:underline">See the seminar page</a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
