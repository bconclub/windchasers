"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle2, Clock, Copy, Loader2, MapPin, MessageCircle, Navigation, Share2 } from "lucide-react";
import { SEMINAR } from "@/lib/australia-seminar";
import { PAST_PHOTOS } from "@/lib/australia-seminar-past";
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
  { title: "Students who dream of flying", text: "Whether you plan to start next year or want to start right away, and wherever you are in school or college." },
  { title: "Parents", text: "Hear the route first-hand and ask your questions in person, together with your child." },
  { title: "Anyone curious about a pilot career", text: "No prerequisites. If you want to fly, you are welcome." },
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
const WA_ASK = `https://wa.me/919035098424?text=${encodeURIComponent(`Hi WindChasers, I want to know more about the Australia pilot training seminar with Basair Aviation College on ${SEMINAR.dateShort} at ${SEMINAR.venue}, ${SEMINAR.city}.`)}`;
const MAP_QUERY = encodeURIComponent(`${SEMINAR.venue} ${SEMINAR.city}`);

function Seats({ className = "" }: { className?: string }) {
  const [seats, setSeats] = useState<{ capacity: number; taken: number | null; left: number | null } | null>(null);
  useEffect(() => {
    fetch("/api/australia-seminar/seats", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then(setSeats).catch(() => {});
  }, []);
  const capacity = seats?.capacity ?? SEMINAR.capacity;
  const taken = seats?.taken ? seats.taken : null; // hide the count until someone has paid
  const pct = taken === null ? 0 : Math.min(100, Math.round((taken / capacity) * 100));
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3 text-[14px]">
        <span className="font-semibold text-white">{capacity} seats</span>
        {taken !== null && (
          <span className="text-white/65">{taken >= capacity ? "All seats taken" : `${taken} taken · ${capacity - taken} left`}</span>
        )}
      </div>
      {taken !== null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={taken} aria-valuemin={0} aria-valuemax={capacity}>
          <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
        </div>
      )}
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

  useEffect(() => { captureAndStoreUTMParams(); }, []);
  useEffect(() => { if (typeof window !== "undefined" && window.Razorpay) setRzpReady(true); }, []);

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
      <section className="relative overflow-hidden px-5 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <p className="text-[12.5px] tracking-wide text-gold sm:text-[13px]">Basair Aviation College · Hosted by Windchasers</p>
            <h1 className="mt-3 text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px]">Pilot training in Australia?</h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/75 sm:text-[18px]">
              Hear it from {SEMINAR.speaker.name}, {SEMINAR.speaker.role}, in person in {SEMINAR.city}. Bring your questions, and bring your parents.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <ul className="space-y-2.5 text-[15px] text-white/90">
                <li className="flex items-center gap-3"><Calendar size={17} className="shrink-0 text-gold" /> {SEMINAR.dateLabel}</li>
                <li className="flex items-center gap-3"><Clock size={17} className="shrink-0 text-gold" /> {SEMINAR.time}</li>
                <li className="flex items-center gap-3"><MapPin size={17} className="shrink-0 text-gold" /> {SEMINAR.venue}, {SEMINAR.city}</li>
              </ul>
              <Seats className="mt-4 border-t border-white/10 pt-4" />
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button onClick={goToForm} className="h-12 w-full rounded-full bg-gold px-7 text-[15.5px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 sm:w-auto">
                Register your seat
              </button>
              <span className="text-center text-[13px] text-white/55 sm:text-left">{SEMINAR.feeLabel} registration · paid securely through Razorpay</span>
            </div>
            <ShareRow className="mt-5" />
          </div>
          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[320px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/10 bg-black">
              <video src="/australia-seminar/seminar-reel.mp4" poster="/australia-seminar/seminar-reel-poster.jpg"
                controls playsInline preload="metadata" className="h-full w-full object-cover" aria-label="Seminar video" />
            </div>
          </div>
        </div>
      </section>

      {/* Australia */}
      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">Why is Australia the place to fly?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
            That is the question {SEMINAR.speaker.name} will answer in person. A first look at flying in Australia:
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {AU_CLIPS.map((c) => (
              <figure key={c.src} className="overflow-hidden rounded-xl border border-white/10 bg-black">
                <video src={c.src} poster={c.poster} autoPlay muted loop playsInline preload="metadata" className="aspect-[9/16] w-full object-cover" />
                <figcaption className="px-3 py-2 text-[12.5px] text-white/60">{c.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="border-t border-white/10 bg-[#131313] px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">What he will cover</h2>
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
      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">About the speaker</h2>
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
            <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">Who should come</h2>
            <div className="mt-6 grid gap-4">
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

      {/* Past seminars */}
      {PAST_PHOTOS.length > 0 && (
        <section className="border-t border-white/10 bg-[#131313] px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">Windchasers seminars so far</h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
              Students and parents at our earlier seminars and sessions.
            </p>
            <div className="mt-8 columns-2 gap-3 md:columns-3">
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
      )}

      {/* Host */}
      <section className="border-t border-white/10 px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">Hosted by Windchasers</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/70">
            Windchasers is a pilot training academy in Kothanur, Bengaluru. We guide students and families from the first question to flying schools in India and abroad.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { src: "/facility/DSC_0549.JPG.webp", alt: "A Windchasers session with students and parents" },
              { src: "/facility/DSC_0481.JPG.webp", alt: "Students at the Windchasers simulator" },
              { src: "/facility/DSC05362.JPG.webp", alt: "Windchasers cadets in uniform" },
            ].map((p) => (
              <div key={p.src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="border-t border-white/10 bg-[#131313] px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">The venue</h2>
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
      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">Questions</h2>
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
      <section ref={formRef} id="register" className="scroll-mt-20 border-t border-white/10 bg-[#131313] px-5 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-[24px] font-bold leading-tight tracking-tight sm:text-[32px]">Register your seat</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              The {SEMINAR.feeLabel} registration confirms your place at the seminar. Students and parents are both welcome.
            </p>
            <Facts className="mt-6 flex-col !gap-y-3" />
            <Seats className="mt-6 max-w-sm" />
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

      {/* Bottom bar */}
      <div aria-hidden={!barVisible || !!done}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0E0E0E]/95 backdrop-blur-md transition-transform duration-200 ${barVisible && !done ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 py-3 pl-4 pr-[68px] sm:gap-4 sm:px-6 sm:pr-24 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold sm:text-[14px]">{SEMINAR.dateShort} · {SEMINAR.time}</p>
            <p className="truncate text-[12.5px] text-white/60">{SEMINAR.venue}<span className="hidden sm:inline">, {SEMINAR.city} · Australia seminar with Basair</span></p>
          </div>
          <button onClick={goToForm} tabIndex={barVisible && !done ? 0 : -1}
            className="h-10 shrink-0 rounded-full bg-gold px-4 text-[13px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 sm:h-11 sm:px-5 sm:text-[14px]">
            Register
          </button>
        </div>
      </div>
    </main>
  );
}
