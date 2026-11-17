"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Calendar, CheckCircle2, Clock, Copy, Loader2, MapPin, MessageCircle, Navigation, Share2 } from "lucide-react";
import { SEMINAR } from "@/lib/australia-seminar";
import { PAST_EVENTS, PAST_PHOTOS } from "@/lib/australia-seminar-past";
import { TEAM } from "@/lib/team";
import {
  captureAndStoreUTMParams, deriveTrafficSource, getLandingPage, getStoredClickIds, getStoredReferrer, getStoredUTMParamsFull,
} from "@/lib/tracking";

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

// Licensed stock (Pexels) of flying in Australia, shown as short silent loops.
const AU_CLIPS = [
  { src: "/australia-seminar/au/sydney.mp4", poster: "/australia-seminar/au/sydney.jpg", caption: "Sydney from the air" },
  { src: "/australia-seminar/au/grass-strip.mp4", poster: "/australia-seminar/au/grass-strip.jpg", caption: "A small aircraft on a grass strip" },
  { src: "/australia-seminar/au/islands.mp4", poster: "/australia-seminar/au/islands.jpg", caption: "An island airstrip, Whitsundays" },
  { src: "/australia-seminar/au/cockpit.mp4", poster: "/australia-seminar/au/cockpit.jpg", caption: "From the cockpit" },
];

const FAQ = [
  { q: "Who can attend?", a: "Anyone who dreams of a pilot career: students and parents. There are no prerequisites." },
  { q: "What does the ₹99 cover?", a: "It confirms your registration for the seminar. You pay on this page through Razorpay (UPI, card or netbanking) and get a receipt." },
  { q: "When and where is it?", a: `${SEMINAR.dateLabel}, ${SEMINAR.time}, at ${SEMINAR.venue}, ${SEMINAR.city}.` },
  { q: "Who is speaking?", a: `${SEMINAR.speaker.name}, ${SEMINAR.speaker.role} and ${SEMINAR.speaker.also}. The Windchasers team will be there too.` },
  { q: "I have a question before I register.", a: "Message us on WhatsApp or call +91 95910 04043." },
];

const PAGE_URL = "https://windchasers.in/australia-seminar";
const SHARE_URL = `${PAGE_URL}?utm_source=share&utm_medium=referral&utm_campaign=basair_seminar_28nov`;
const SHARE_TEXT = `Pilot training in Australia? Seminar with ${SEMINAR.speaker.name}, ${SEMINAR.speaker.role}. ${SEMINAR.dateShort}, ${SEMINAR.time}, ${SEMINAR.venue}, ${SEMINAR.city}. Register for ${SEMINAR.feeLabel}:`;
// Phones: one swipeable row that peeks the next card. md and up: the normal grid.
const ROW = "-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 sm:scroll-px-6 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";
const SLIDE = "shrink-0 snap-start md:w-auto";
const WA_ASK = `https://wa.me/919035098424?text=${encodeURIComponent(`Hi WindChasers, I want to know more about the Australia pilot training seminar with Basair Aviation College on ${SEMINAR.dateShort} at ${SEMINAR.venue}, ${SEMINAR.city}.`)}`;
const MAP_QUERY = encodeURIComponent(`${SEMINAR.venue} ${SEMINAR.city}`);

// Funnel tracking: Meta pixel 1097272771358425 and GA4 G-3THNVEDJK8, both loaded
// site-wide. ViewContent / view_item on load, InitiateCheckout / begin_checkout
// when Razorpay opens, Purchase / purchase after the server verifies the
// payment. No pixel Lead here: the Form campaign counts leads from instant forms.
const VALUE = SEMINAR.feePaise / 100;
const ITEM = { item_id: SEMINAR.slug, item_name: SEMINAR.formType, price: VALUE, quantity: 1 };
function fb(event: string, params: Record<string, unknown>, eventID?: string) {
  if (typeof window.fbq !== "function") return false;
  if (eventID) window.fbq("track", event, params, { eventID });
  else window.fbq("track", event, params);
  return true;
}
function ga(event: string, params: Record<string, unknown>) {
  if (typeof window.gtag !== "function") return false;
  window.gtag("event", event, params);
  return true;
}
const viewSent = { fb: false, ga: false };
// Purchase fires once per payment, even if verify is retried or the tab reloads.
function firePurchaseOnce(orderId: string, paymentId: string, role: string) {
  const key = `aus_seminar_purchase_${paymentId}`;
  try { if (localStorage.getItem(key)) return; localStorage.setItem(key, "1"); } catch { /* storage blocked: fire anyway */ }
  fb("Purchase", { value: VALUE, currency: "INR", content_name: SEMINAR.formType, content_ids: [SEMINAR.slug], content_type: "product", role }, orderId);
  ga("purchase", { transaction_id: paymentId, value: VALUE, currency: "INR", role, items: [ITEM] });
}

function Seats({ className = "" }: { className?: string }) {
  const [seats, setSeats] = useState<{ capacity: number; taken: number | null; left: number | null } | null>(null);
  useEffect(() => {
    fetch("/api/australia-seminar/seats", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then(setSeats).catch(() => {});
  }, []);
  const capacity = seats?.capacity ?? SEMINAR.capacity;
  const taken = seats?.taken ? seats.taken : null; // real paid count only; nothing shown until someone has paid
  if (taken === null) return null;
  const pct = Math.min(100, Math.round((taken / capacity) * 100));
  return (
    <div className={className}>
      <p className="text-[14px] text-white/75">{taken >= capacity ? "All seats taken" : `${capacity - taken} of ${capacity} seats left`}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={taken} aria-valuemin={0} aria-valuemax={capacity}>
        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ShareRow({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: SEMINAR.title, text: SHARE_TEXT, url: SHARE_URL }); return; } catch { /* closed */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`, "_blank", "noopener");
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(SHARE_URL); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ }
  };
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button onClick={share} className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[13.5px] text-white/85 hover:bg-white/5">
        <Share2 size={15} /> Share<span className="hidden sm:inline">&nbsp;with someone who wants to fly</span>
      </button>
      <button onClick={copy} className="flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[13.5px] text-white/85 hover:bg-white/5">
        <Copy size={15} /> {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}

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

  useEffect(() => {
    captureAndStoreUTMParams();
    // utm_content=parents (or parent) opens the form on "I am a parent".
    const c = new URLSearchParams(window.location.search).get("utm_content")?.toLowerCase() || "";
    const role = c.startsWith("parent") ? "parent" : "student";
    if (role === "parent") setForm((f) => ({ ...f, role }));
    // Pixel and gtag load after the page; retry for a few seconds, fire once each.
    // Module-level flags: one ViewContent per page view, even if the effect runs twice.
    let tries = 0;
    const fire = () => {
      if (!viewSent.fb) viewSent.fb = fb("ViewContent", { content_name: SEMINAR.formType, content_ids: [SEMINAR.slug], content_type: "product", value: VALUE, currency: "INR", role });
      if (!viewSent.ga) viewSent.ga = ga("view_item", { value: VALUE, currency: "INR", role, items: [ITEM] });
      return viewSent.fb && viewSent.ga;
    };
    if (fire()) return;
    const t = window.setInterval(() => { if (fire() || ++tries > 20) window.clearInterval(t); }, 500);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => { if (typeof window !== "undefined" && window.Razorpay) setRzpReady(true); }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const goToForm = () => setModalOpen(true);

  // Bottom bar: shows once the hero has scrolled away, hides while the form is on screen.
  const [barVisible, setBarVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const f = formRef.current?.getBoundingClientRect();
      const formOnScreen = !!f && f.top < window.innerHeight && f.bottom > 0;
      setBarVisible(window.scrollY > 480 && !formOnScreen);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const showBar = barVisible && !done && !modalOpen;

  // This page has its own WhatsApp button instead of the chat bubble. SiteChrome
  // skips the chat script here; this also hides a widget an earlier page in
  // the same visit already loaded.
  useEffect(() => {
    const hide = () => { const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = "none"; };
    hide();
    const t = window.setInterval(hide, 1000);
    return () => { window.clearInterval(t); const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = ""; };
  }, []);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [modalOpen]);

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
      // Lead with UPI apps (Google Pay, PhonePe, Paytm) so a phone user pays in one tap.
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
        firePurchaseOnce(resp.razorpay_order_id, resp.razorpay_payment_id, form.role);
        setDone({ name: vj.name || form.name.split(" ")[0] });
      },
    });
    rzp.on("payment.failed", () => setErr("The payment did not go through. You can try again; nothing was charged for a failed attempt."));
    fb("InitiateCheckout", { value: VALUE, currency: "INR", content_name: SEMINAR.formType, content_ids: [SEMINAR.slug], content_type: "product", num_items: 1, role: form.role }, j.order_id);
    ga("begin_checkout", { value: VALUE, currency: "INR", role: form.role, items: [ITEM] });
    rzp.open();
  }

  const input = "h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-gold";

  const formPanel = (
    done ? (
              <div className="py-6 text-center">
                <CheckCircle2 size={44} className="mx-auto text-gold" />
                <h3 className="mt-4 text-[22px] font-bold">You are registered{done.name ? `, ${done.name}` : ""}</h3>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
                  Your {SEMINAR.feeLabel} payment is confirmed and Razorpay has sent you a receipt. See you on {SEMINAR.dateShort}, {SEMINAR.time}, at {SEMINAR.venue}, {SEMINAR.city}.
                </p>
                <ShareRow className="mt-6 justify-center" />
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
                <input className={input} placeholder="Email (optional, for the receipt)" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-label="Email" />
                <input className={input} placeholder="City (optional)" autoComplete="address-level2" value={form.city} onChange={set("city")} aria-label="City" />
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
                <p className="text-center text-[12px] text-white/40">Pay by UPI (Google Pay, PhonePe, Paytm), card or netbanking through Razorpay</p>
              </form>
            )
  );

  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRzpReady(true)} />

      {/* Hero: on a phone the whole first screen is what, who, when and one button */}
      <section className="relative overflow-hidden px-5 pb-14 pt-[88px] sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <p className="text-[12px] font-medium tracking-[0.08em] text-gold sm:text-[13px]">{SEMINAR.city.toUpperCase()} · {SEMINAR.dateShort.toUpperCase()} · IN PERSON</p>
            <h1 className="mt-3 text-[36px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px]">Pilot training in Australia?</h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/75 sm:text-[18px]">
              Ask the people who run a flight school there. Training, timelines and what to weigh before you choose a country, answered in person.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/40">
                <Image src="/australia-seminar/david-trevelyan.webp" alt={SEMINAR.speaker.name} fill sizes="48px" className="object-cover" priority />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold leading-tight">{SEMINAR.speaker.name}</p>
                <p className="text-[13px] leading-snug text-white/60">{SEMINAR.speaker.role}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1.5 text-[14.5px] text-white/85">
              <Calendar size={16} className="mt-0.5 text-gold" /><span>{SEMINAR.dateShort} · {SEMINAR.time}</span>
              <MapPin size={16} className="mt-0.5 text-gold" /><span>{SEMINAR.venue}, {SEMINAR.city}</span>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button onClick={goToForm} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold px-7 text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 sm:w-auto">
                Reserve my seat · {SEMINAR.feeLabel} <ArrowRight size={18} strokeWidth={2.4} />
              </button>
              <span className="text-center text-[12.5px] text-white/50 sm:text-left">Students and parents welcome · Pay by UPI</span>
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[320px] lg:block">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video src="/australia-seminar/seminar-reel.mp4" poster="/australia-seminar/seminar-reel-poster.jpg"
                controls playsInline preload="metadata" className="h-full w-full object-cover" aria-label="Seminar video" />
            </div>
          </div>
        </div>
      </section>

      {/* What you will learn: short numbered rows */}
      <section className="border-t border-white/[0.08] bg-[#131313] px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">What you will learn</h2>
          <ol className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08] md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
            {TOPICS.map((t, i) => (
              <li key={t.title} className="flex gap-4 py-5 md:flex-col md:gap-2 md:px-6 md:first:pl-0">
                <span className="text-[13px] font-semibold tabular-nums text-gold">0{i + 1}</span>
                <div>
                  <h3 className="text-[16.5px] font-semibold leading-snug">{t.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-white/65">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[14.5px] leading-relaxed text-white/70">
            <span className="font-semibold text-white">Who should come:</span> students who want to fly, from school or college, and parents who want answers. No prerequisites.
          </p>
        </div>
      </section>

      {/* Seminar video, phones only (desktop has it in the hero) */}
      <section className="px-5 pt-14 lg:hidden">
        <h2 className="text-[26px] font-bold leading-tight tracking-tight">Watch</h2>
        <div className="relative mx-auto mt-6 aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-black">
          <video src="/australia-seminar/seminar-reel.mp4" poster="/australia-seminar/seminar-reel-poster.jpg"
            controls playsInline preload="none" className="h-full w-full object-cover" aria-label="Seminar video" />
        </div>
      </section>

      {/* Australia */}
      <section className="px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Why is Australia the place to fly?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
            That is the question {SEMINAR.speaker.name} will answer in person. A first look at flying in Australia:
          </p>
          <div className={`mt-6 ${ROW} md:grid-cols-4`}>
            {AU_CLIPS.map((c) => (
              <figure key={c.src} className={`${SLIDE} w-[60%] overflow-hidden rounded-xl border border-white/10 bg-black`}>
                <video src={c.src} poster={c.poster} autoPlay muted loop playsInline preload="metadata" className="aspect-[9/16] w-full object-cover" />
                <figcaption className="px-3 py-2 text-[12.5px] text-white/60">{c.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Speaker */}
      <section className="border-t border-white/[0.08] px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">About the speaker</h2>
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
      </section>

      {/* Past seminars */}
      <section className="border-t border-white/10 bg-[#131313] px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Windchasers seminars so far</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Colleges, students and parents we have met, from Mangalore to Bengaluru.
          </p>
          <div className={`mt-6 ${ROW} md:grid-cols-2 lg:grid-cols-3`}>
            {PAST_EVENTS.map((e) => (
              <figure key={e.src} className={`${SLIDE} w-[78%] overflow-hidden rounded-xl border border-white/[0.08] bg-[#191919]`}>
                <div className="relative aspect-[4/3]">
                  <Image src={e.src} alt={`${e.what}, ${e.place}`} fill sizes="(min-width: 1024px) 33vw, 80vw" className="object-cover" style={e.pos ? { objectPosition: e.pos } : undefined} />
                </div>
                <figcaption className="px-3 py-3 sm:px-4">
                  <p className="text-[14px] font-semibold leading-snug sm:text-[15px]">{e.place}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-white/60">{e.what}{e.when ? ` · ${e.when}` : ""}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 hidden columns-3 gap-3 md:block">
            {PAST_PHOTOS.map((p) => (
              <figure key={p.src} className="mb-3 break-inside-avoid overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.caption} loading="lazy" className="w-full" />
                <figcaption className="px-3 py-2 text-[12.5px] text-white/60">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Host */}
      <section className="border-t border-white/10 px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Hosted by Windchasers</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Windchasers is a pilot training academy in Kothanur, Bengaluru. We guide students and families from the first question to flying schools in India and abroad.
          </p>
          <div className={`mt-6 ${ROW} md:grid-cols-3 md:gap-4`}>
            {[
              { src: "/facility/DSC_0549.JPG.webp", alt: "A Windchasers session with students and parents" },
              { src: "/facility/DSC_0481.JPG.webp", alt: "Students at the Windchasers simulator" },
              { src: "/facility/DSC05362.JPG.webp", alt: "Windchasers cadets in uniform" },
            ].map((p) => (
              <div key={p.src} className={`${SLIDE} relative aspect-[4/3] w-[82%] overflow-hidden rounded-xl border border-white/10`}>
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 33vw, 82vw" className="object-cover" />
              </div>
            ))}
          </div>

          {/* The people who run Windchasers (same roster as the homepage, lib/team).
              Names and roles only: the bios mention exams this page stays off. */}
          <h3 className="mt-12 text-[20px] font-bold tracking-tight sm:text-[24px]">The people you will meet</h3>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/70">The Windchasers team will be at the seminar with {SEMINAR.speaker.name}.</p>
          <div className={`mt-6 ${ROW} md:grid-cols-3 lg:grid-cols-5`}>
            {TEAM.map((t) => (
              <figure key={t.name} className={`${SLIDE} w-[46%] overflow-hidden rounded-xl border border-white/[0.08] bg-[#191919]`}>
                <div className="relative aspect-square">
                  <Image src={t.image} alt={t.name} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="px-3 py-3">
                  <p className="text-[14.5px] font-semibold leading-snug">{t.name}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-white/60">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="border-t border-white/10 bg-[#131313] px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">The venue</h2>
            <p className="mt-4 text-[17px] font-semibold">{SEMINAR.venue}, {SEMINAR.city}</p>
            <p className="mt-1 text-[15px] text-white/70">{SEMINAR.dateLabel}, {SEMINAR.time}</p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`} target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[14px] text-white/90 hover:bg-white/5">
              <Navigation size={16} /> Get directions
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <iframe title={`Map: ${SEMINAR.venue}, ${SEMINAR.city}`} src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
              className="h-[340px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Questions</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold">
                  {f.q}<span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
          <a href={WA_ASK} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-[14px] font-semibold text-white hover:opacity-90">
            <MessageCircle size={16} /> Ask on WhatsApp
          </a>
        </div>
      </section>

      {/* Register */}
      <section ref={formRef} id="register" className="scroll-mt-20 border-t border-white/10 bg-[#131313] px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Register your seat</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              The {SEMINAR.feeLabel} registration confirms your place at the seminar. Students and parents are both welcome.
            </p>
            <Facts className="mt-6 flex-col !gap-y-3" />
            <Seats className="mt-6 max-w-sm" />
            <ShareRow className="mt-6" />
            <p className="mt-8 text-[13.5px] text-white/50">
              Questions? Call <a href="tel:+919591004043" className="text-white/80 underline-offset-4 hover:underline">+91 95910 04043</a>.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0E0E0E] p-6 sm:p-8">
            {formPanel}
          </div>
        </div>
      </section>

      {/* WhatsApp button: sits above the bottom bar while it shows, hidden under the pop-up */}
      {!modalOpen && (
        <a href={WA_ASK} target="_blank" rel="noopener noreferrer" aria-label="Ask us on WhatsApp"
          className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-[bottom] duration-200 hover:brightness-105 sm:right-6 ${showBar ? "bottom-[calc(88px+env(safe-area-inset-bottom))]" : "bottom-[calc(16px+env(safe-area-inset-bottom))]"}`}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.45-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.77 6.68c0 5.2-4.24 9.43-9.45 9.43zm8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.33 11.33 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z"/></svg>
        </a>
      )}
      {/* Bottom bar */}
      <div aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-[#0E0E0E]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-transform duration-200 ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[16px] font-bold leading-tight sm:text-[18px]">Register for <span className="text-gold">{SEMINAR.feeLabel}</span></p>
            <p className="mt-0.5 truncate text-[12.5px] leading-snug text-white/60 sm:text-[13.5px]">
              {SEMINAR.dateShort} · {SEMINAR.time}<span className="hidden sm:inline"> · {SEMINAR.venue}, {SEMINAR.city}</span>
            </p>
          </div>
          <button onClick={goToForm} tabIndex={showBar ? 0 : -1}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 text-[15px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 sm:px-7 sm:text-[16px]">
            Register now <ArrowRight size={17} strokeWidth={2.4} />
          </button>
        </div>
      </div>
      {/* Register pop-up */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setModalOpen(false)} role="dialog" aria-modal="true" aria-label="Register your seat">
          <div onClick={(e) => e.stopPropagation()}
            className="max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-[#0E0E0E] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:max-w-md sm:rounded-3xl sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[18px] font-bold">{done ? "Registration confirmed" : "Register your seat"}</p>
                <p className="mt-1 text-[13px] text-white/60">{SEMINAR.dateShort} · {SEMINAR.time} · {SEMINAR.venue}</p>
              </div>
              <button onClick={() => setModalOpen(false)} aria-label="Close"
                className="-mr-2 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-[22px] leading-none text-white/60 hover:bg-white/10 hover:text-white">×</button>
            </div>
            {formPanel}
          </div>
        </div>
      )}
    </main>
  );
}
