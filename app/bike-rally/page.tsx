"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bike, Calendar, Coffee, Loader2, MapPin, Users } from "lucide-react";
import { INTEREST_KEY, RALLY, RALLY_WA, ROLES } from "@/lib/bike-rally";
import {
  captureAndStoreUTMParams, deriveTrafficSource, getLandingPage, getStoredClickIds, getStoredReferrer, getStoredUTMParamsFull,
} from "@/lib/tracking";

/**
 * Aviators of Bengaluru bike rally + networking breakfast, 13 Dec 2026.
 * Interest page: step 1 is a short "I'm in" (name, mobile, role) that goes to
 * PROXe straight away, then /bike-rally/register takes the rider details.
 * Copy rules: no em dashes, no "top/best" claims, no DGCA, no invented numbers.
 */

const WHO = ["Airline pilots", "General aviation pilots", "Student pilots", "Flight instructors", "Engineers", "Ground professionals", "Aviation enthusiasts"];

const PLAN = [
  { icon: Bike, title: "Ride together", text: "A relaxed group ride across Bengaluru, ending at the Moxy Hotel." },
  { icon: Coffee, title: "Breakfast at 10 am", text: "Breakfast and good conversations once everyone rolls in." },
  { icon: Users, title: "Meet aviation people", text: "Pilots, instructors, students, engineers and ground crew, outside the usual work setting." },
];

// Free, open event: no payment step.
const ITEM = { item_id: RALLY.slug, item_name: RALLY.formType, quantity: 1 };
const viewSent = { fb: false, ga: false };

function InviteVideo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10 bg-black ${className}`}>
      <video src="/bike-rally/invite.mp4" poster="/bike-rally/invite.jpg" controls playsInline preload="none" className="h-full w-full object-cover"
        aria-label="Windchasers pilots invite the Bengaluru aviation community to the bike rally" />
    </div>
  );
}

export default function BikeRallyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", role: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const formRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    captureAndStoreUTMParams();
    // Direct link to the "I'm in" form: /bike-rally?register or #register (utm params still work).
    const q = new URLSearchParams(window.location.search);
    if (window.location.hash === "#register" || q.has("register")) {
      // Twice: once after first paint, once after images settle the layout.
      [150, 800].forEach((ms) => window.setTimeout(() => formRef.current?.scrollIntoView({ block: "start" }), ms));
    }
    router.prefetch("/bike-rally/register");
    // ViewContent / view_item once per page view; pixel and gtag load late, so retry briefly.
    let tries = 0;
    const fire = () => {
      if (!viewSent.fb && typeof window.fbq === "function") { window.fbq("track", "ViewContent", { content_name: RALLY.formType, content_ids: [RALLY.slug], content_type: "product" }); viewSent.fb = true; }
      if (!viewSent.ga && typeof window.gtag === "function") { window.gtag("event", "view_item", { items: [ITEM] }); viewSent.ga = true; }
      return viewSent.fb && viewSent.ga;
    };
    if (fire()) return;
    const t = window.setInterval(() => { if (fire() || ++tries > 20) window.clearInterval(t); }, 500);
    return () => window.clearInterval(t);
  }, [router]);
  useEffect(() => {
    const update = () => {
      const f = formRef.current?.getBoundingClientRect();
      setBarVisible(window.scrollY > 420 && !(f && f.top < window.innerHeight && f.bottom > 0));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  // This page has its own WhatsApp button; hide the chat bubble if an earlier page loaded it.
  useEffect(() => {
    const hide = () => { const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = "none"; };
    hide();
    const t = window.setInterval(hide, 1000);
    return () => { window.clearInterval(t); const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = ""; };
  }, []);

  const goToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 600);
  };
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const phone = form.phone.replace(/\D/g, "").slice(-10);
    if (form.name.trim().length < 2) return setErr("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone)) return setErr("Please enter a valid 10-digit mobile number.");
    if (!form.role) return setErr("Please tell us what you do in aviation.");
    setBusy(true);
    const r = await fetch("/api/bike-rally/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, ...getStoredUTMParamsFull(), ...getStoredClickIds(),
        traffic_source: deriveTrafficSource(), referrer: getStoredReferrer(), landing_page: getLandingPage(),
      }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (!r || !r.ok) { setBusy(false); return setErr(j.error || "Could not save that. Please try again."); }
    if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: RALLY.formType });
    if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { method: RALLY.slug, attendee_type: form.role });
    try { sessionStorage.setItem(INTEREST_KEY, JSON.stringify({ name: form.name.trim(), phone, role: form.role })); } catch { /* step 2 asks again */ }
    router.push("/bike-rally/register");
  }

  const input = "h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-gold";
  const label = "mb-1.5 block text-[13px] font-medium text-white/70";

  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white">
      {/* Hero: text on the left; on desktop the invite video sits on the right */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/bike-rally/captain-smiling.webp" alt="" fill priority sizes="100vw" className="object-cover object-[50%_20%] opacity-55 lg:opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/70 via-[#0E0E0E]/55 to-[#0E0E0E]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-[96px] sm:px-6 lg:grid lg:max-w-6xl lg:grid-cols-[1fr_340px] lg:items-center lg:gap-16 lg:pb-20 lg:pt-32">
          <div>
            <p className="text-[12px] font-medium tracking-[0.08em] text-gold sm:text-[13px]">BENGALURU · {RALLY.dateShort.toUpperCase()} · BY WINDCHASERS</p>
            <h1 className="mt-3 text-[38px] font-bold leading-[1.05] tracking-tight sm:text-[56px]">Aviators of Bengaluru, let&apos;s meet!</h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
              A fun bike rally and networking breakfast for everyone who flies, fixes or loves aircraft.
            </p>
            <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-2 text-[15px] text-white/90 sm:text-[16px]">
              <Calendar size={17} className="mt-0.5 text-gold" /><span>{RALLY.dateLabel}</span>
              <MapPin size={17} className="mt-0.5 text-gold" /><span>Ends at {RALLY.finish}, breakfast at {RALLY.time}</span>
            </div>
            <button onClick={goToForm}
              className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold px-8 text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 sm:w-auto">
              I&apos;m in <ArrowRight size={18} strokeWidth={2.4} />
            </button>
            <p className="mt-2 text-center text-[12.5px] text-white/55 sm:text-left">Free and open to all. Bring your bike; riders 18 and over with a valid licence.</p>
          </div>
          <InviteVideo className="hidden lg:block" />
        </div>
      </section>

      {/* Plan */}
      <section className="border-t border-white/[0.08] px-5 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">The day</h2>
          <ol className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08] md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
            {PLAN.map((p) => (
              <li key={p.title} className="flex gap-4 py-5 md:flex-col md:gap-3 md:px-6 md:first:pl-0">
                <p.icon size={22} className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="text-[16.5px] font-semibold">{p.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-white/65">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <dl className="mt-8 grid gap-4 text-[15px] sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.08] bg-[#191919] p-5">
              <dt className="text-[13px] text-white/55">Start point and ride-out time</dt>
              <dd className="mt-1 font-semibold">{RALLY.start ? `${RALLY.start}${RALLY.startTime ? `, ${RALLY.startTime}` : ""}` : "Shared on WhatsApp after registration"}</dd>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-[#191919] p-5">
              <dt className="text-[13px] text-white/55">Finish and breakfast</dt>
              <dd className="mt-1 font-semibold">{RALLY.finish}, {RALLY.time}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Video (phones and tablets; desktop has it in the hero) */}
      <section className="border-t border-white/[0.08] px-5 py-14 sm:px-6 lg:hidden">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Hear it from our pilots</h2>
          <InviteVideo className="mx-auto mt-6 max-w-[320px]" />
        </div>
      </section>

      {/* Who */}
      <section className="border-t border-white/[0.08] bg-[#131313] px-5 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">You are welcome</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {WHO.map((w) => (
                <li key={w} className="rounded-full border border-gold/30 px-3.5 py-1.5 text-[14px] text-white/85">{w}</li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] leading-relaxed text-white/70">Talk flying outside the usual work environment, with people from every corner of aviation in Bengaluru.</p>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/10">
            <Image src="/bike-rally/captain-riding.webp" alt="A Windchasers captain in uniform riding her bike through Bengaluru" fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Step 1: I'm in */}
      <section ref={formRef} id="register" className="scroll-mt-20 border-t border-white/[0.08] px-5 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-md">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Count me in</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/70">Free to join. Leave your name and number, then lock your spot with your rider details.</p>
          <form onSubmit={submit} noValidate className="mt-6 space-y-4 rounded-2xl border border-white/[0.08] bg-[#151515] p-5">
            <div><label className={label} htmlFor="in-name">Your name</label><input id="in-name" ref={nameRef} className={input} autoComplete="name" value={form.name} onChange={set("name")} /></div>
            <div><label className={label} htmlFor="in-phone">Mobile number (WhatsApp)</label><input id="in-phone" className={input} inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} /></div>
            <div><label className={label} htmlFor="in-role">You are a</label>
              <select id="in-role" className={input} value={form.role} onChange={set("role")}>
                <option value="">Select</option>{ROLES.map((r) => <option key={r}>{r}</option>)}
              </select></div>
            {err && <p className="text-[14px] text-red-400">{err}</p>}
            <button disabled={busy}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 disabled:opacity-50">
              {busy ? <Loader2 size={17} className="animate-spin" /> : null} I&apos;m in {!busy && <ArrowRight size={18} strokeWidth={2.4} />}
            </button>
            <p className="text-center text-[12.5px] text-white/50">Next: lock your spot, 2 minutes for rider details.</p>
          </form>
          <p className="mt-4 text-center text-[13px] text-white/50">
            Questions? <a href={RALLY_WA} target="_blank" rel="noopener noreferrer" className="text-white/80 underline-offset-4 hover:underline">Message us on WhatsApp</a>
          </p>
        </div>
      </section>

      {/* WhatsApp button */}
      <a href={RALLY_WA} target="_blank" rel="noopener noreferrer" aria-label="Ask us on WhatsApp"
        className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-[bottom] duration-200 sm:right-6 ${barVisible ? "bottom-[calc(88px+env(safe-area-inset-bottom))]" : "bottom-[calc(16px+env(safe-area-inset-bottom))]"}`}>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.45-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.77 6.68c0 5.2-4.24 9.43-9.45 9.43zm8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.33 11.33 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z"/></svg>
      </a>

      {/* Bottom bar */}
      <div aria-hidden={!barVisible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-[#0E0E0E]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-200 ${barVisible ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold leading-tight">Aviators bike rally</p>
            <p className="mt-0.5 truncate text-[12.5px] text-white/60">{RALLY.dateShort} · {RALLY.time} · Moxy Hotel</p>
          </div>
          <button onClick={goToForm} tabIndex={barVisible ? 0 : -1}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 text-[15px] font-semibold text-[#0E0E0E] hover:opacity-90">
            I&apos;m in <ArrowRight size={17} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </main>
  );
}
