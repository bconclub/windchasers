"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle2, Clock, Loader2, MapPin } from "lucide-react";
import { SEMINAR } from "@/lib/australia-seminar";
import {
  captureAndStoreUTMParams, deriveTrafficSource, getLandingPage, getStoredClickIds, getStoredReferrer, getStoredUTMParamsFull,
} from "@/lib/tracking";
import { trackMetaLead } from "@/lib/metaPixel";

/**
 * Australia seminar landing page and ₹99 registration.
 * Copy rules (playbook): no course fees, no "seats limited", no visa or job
 * promises, nothing on where Basair is based, and "why Australia" stays a question.
 */

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: () => void) => void };
  }
}

const TOPICS = [
  { title: "The aviation industry today", text: "Where pilot training and airline flying stand now, from someone who works across both in Australia." },
  { title: "What's out there for Indian pilots", text: "The options open to students in India who want to fly professionally." },
  { title: "Why is Australia the place to fly?", text: "Commercial pilot training in Australia, and what to weigh before you choose a country." },
];

const WHO = [
  { title: "Students", text: "Planning to start flying next year, or ready to start right away." },
  { title: "Parents", text: "Hear the route first-hand and ask the questions you have before your child commits." },
];

const BIO = [
  "CEO of Basair Aviation College",
  "Director of the Regional Aviation Association of Australia",
  "Senior executive and board roles across aviation training, airline operations and regional aviation in Australia",
  "Postgraduate research in safety governance at Lund University, Sweden",
];

function Facts({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/85 ${className}`}>
      <li className="flex items-center gap-2"><Calendar size={16} className="text-gold" /> {SEMINAR.dateLabel}</li>
      <li className="flex items-center gap-2"><Clock size={16} className="text-gold" /> {SEMINAR.time}</li>
      <li className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> {SEMINAR.venue}, {SEMINAR.city}</li>
    </ul>
  );
}

export default function AustraliaSeminarPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", role: "student", with_parent: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ name: string } | null>(null);
  const [rzpReady, setRzpReady] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => { captureAndStoreUTMParams(); }, []);
  useEffect(() => { if (typeof window !== "undefined" && window.Razorpay) setRzpReady(true); }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const goToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (form.name.trim().length < 2) return setErr("Please enter your full name.");
    if (!/^(\+?91)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) return setErr("Please enter a valid 10-digit mobile number.");
    if (!window.Razorpay) return setErr("The payment window is still loading. Try again in a moment.");

    setBusy(true);
    const utm = getStoredUTMParamsFull();
    const click = getStoredClickIds();
    const r = await fetch("/api/australia-seminar/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, ...utm, ...click,
        traffic_source: deriveTrafficSource(), referrer: getStoredReferrer(), landing_page: getLandingPage(),
      }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (!r || !r.ok) { setBusy(false); return setErr(j.error || "Could not start the payment. Please try again."); }

    const rzp = new window.Razorpay({
      key: j.key,
      order_id: j.order_id,
      amount: j.amount,
      currency: j.currency,
      name: "Windchasers",
      description: `Australia seminar, ${SEMINAR.dateShort}`,
      prefill: { name: form.name, contact: `+91${form.phone.replace(/\D/g, "").slice(-10)}`, email: form.email || undefined },
      theme: { color: "#C5A572" },
      modal: { ondismiss: () => setBusy(false) },
      handler: async (resp: RazorpayResponse) => {
        const v = await fetch("/api/australia-seminar/verify", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp),
        }).catch(() => null);
        const vj = v ? await v.json().catch(() => ({})) : {};
        setBusy(false);
        if (!v || !v.ok || !vj.ok) return setErr(vj.error || "We could not confirm the payment. If money left your account, call +91 95910 04043.");
        trackMetaLead({ content_name: SEMINAR.formType, value: SEMINAR.feePaise / 100, currency: "INR" });
        if (typeof window.fbq === "function") window.fbq("track", "Purchase", { value: SEMINAR.feePaise / 100, currency: "INR", content_name: SEMINAR.formType });
        setDone({ name: vj.name || form.name.split(" ")[0] });
      },
    });
    rzp.on("payment.failed", () => setErr("The payment did not go through. You can try again; nothing was charged for a failed attempt."));
    rzp.open();
  }

  const input = "h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-gold";

  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRzpReady(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[13px] tracking-wide text-gold">Basair Aviation College · Hosted by Windchasers</p>
            <h1 className="mt-4 text-[40px] font-bold leading-[1.08] tracking-tight sm:text-[56px]">Pilot training in Australia?</h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-white/75">
              Hear it from {SEMINAR.speaker.name}, {SEMINAR.speaker.role}, in person in {SEMINAR.city}. Bring your questions, and bring your parents.
            </p>
            <Facts className="mt-7" />
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button onClick={goToForm} className="h-12 rounded-full bg-gold px-7 text-[15px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90">
                Register for {SEMINAR.feeLabel}
              </button>
              <span className="text-[13px] text-white/50">Paid securely through Razorpay</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video src="/australia-seminar/seminar-reel.mp4" poster="/australia-seminar/seminar-reel-poster.jpg"
                controls playsInline preload="metadata" className="h-full w-full object-cover" aria-label="Seminar video" />
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="border-t border-white/10 bg-[#131313] px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-bold tracking-tight sm:text-[32px]">What he will cover</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {TOPICS.map((t) => (
              <div key={t.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-[17px] font-semibold text-gold">{t.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaker + who */}
      <section className="px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight sm:text-[32px]">About the speaker</h2>
            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10">
                <Image src="/australia-seminar/david-trevelyan.webp" alt={SEMINAR.speaker.name} fill sizes="80px" className="object-cover" />
              </div>
              <div>
                <p className="text-[17px] font-semibold">{SEMINAR.speaker.name}</p>
                <p className="text-[13.5px] text-white/60">{SEMINAR.speaker.role}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {BIO.map((b) => (
                <li key={b} className="flex gap-3 text-[15px] leading-relaxed text-white/75">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[26px] font-bold tracking-tight sm:text-[32px]">Who should come</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {WHO.map((w) => (
                <div key={w.title} className="rounded-xl border border-white/10 p-6">
                  <h3 className="text-[17px] font-semibold">{w.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Register */}
      <section ref={formRef} id="register" className="scroll-mt-20 border-t border-white/10 bg-[#131313] px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight sm:text-[32px]">Register for {SEMINAR.feeLabel}</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              The {SEMINAR.feeLabel} registration confirms your place at the seminar. A parent coming with a registered student does not need a separate registration.
            </p>
            <Facts className="mt-6 flex-col !gap-y-3" />
            <p className="mt-8 text-[13.5px] text-white/50">
              Questions? Call <a href="tel:+919591004043" className="text-white/80 underline-offset-4 hover:underline">+91 95910 04043</a>.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-6 sm:p-8">
            {done ? (
              <div className="py-6 text-center">
                <CheckCircle2 size={44} className="mx-auto text-gold" />
                <h3 className="mt-4 text-[22px] font-bold">You are registered{done.name ? `, ${done.name}` : ""}</h3>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
                  Your {SEMINAR.feeLabel} payment is confirmed and Razorpay has sent you a receipt. See you on {SEMINAR.dateShort}, {SEMINAR.time}, at {SEMINAR.venue}, {SEMINAR.city}.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-full border border-white/15 p-1">
                  {(["student", "parent"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setForm((f) => ({ ...f, role: r }))}
                      className={`h-10 rounded-full text-[14px] font-medium ${form.role === r ? "bg-gold text-[#0E0E0E]" : "text-white/70 hover:text-white"}`}>
                      I am a {r}
                    </button>
                  ))}
                </div>
                <input className={input} placeholder="Full name" autoComplete="name" value={form.name} onChange={set("name")} aria-label="Full name" />
                <input className={input} placeholder="Mobile number" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-label="Mobile number" />
                <input className={input} placeholder="Email (for the receipt)" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-label="Email" />
                <input className={input} placeholder="City" autoComplete="address-level2" value={form.city} onChange={set("city")} aria-label="City" />
                {form.role === "student" && (
                  <select className={input} value={form.with_parent} onChange={set("with_parent")} aria-label="Coming with a parent?">
                    <option value="">Coming with a parent?</option>
                    <option value="yes">Yes, with a parent</option>
                    <option value="no">No, on my own</option>
                  </select>
                )}
                {err && <p className="text-[13.5px] text-red-400">{err}</p>}
                <button disabled={busy || !rzpReady}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-[15px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 disabled:opacity-50">
                  {busy && <Loader2 size={16} className="animate-spin" />} Pay {SEMINAR.feeLabel} and register
                </button>
                <p className="text-center text-[12px] text-white/40">UPI, cards and netbanking through Razorpay</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
