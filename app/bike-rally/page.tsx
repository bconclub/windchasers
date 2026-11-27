"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bike, Calendar, CheckCircle2, Coffee, Loader2, MapPin, Users } from "lucide-react";
import { BLOOD_GROUPS, RALLY, TSHIRT_SIZES, rallyFeeLabel } from "@/lib/bike-rally";
import {
  captureAndStoreUTMParams, deriveTrafficSource, getLandingPage, getStoredClickIds, getStoredReferrer, getStoredUTMParamsFull,
} from "@/lib/tracking";

/**
 * Aviators of Bengaluru bike rally + networking breakfast, 13 Dec 2026.
 * Copy rules: no em dashes, no "top/best" claims, no DGCA, no invented numbers.
 * Anything not confirmed in lib/bike-rally.ts shows as "to be announced".
 */

const WHO = ["Airline pilots", "General aviation pilots", "Student pilots", "Flight instructors", "Engineers", "Ground professionals", "Aviation enthusiasts"];
const ROLES = ["Airline pilot", "General aviation pilot", "Student pilot", "Flight instructor", "Engineer", "Ground professional", "Aviation enthusiast"];
const WA = `https://wa.me/919035098424?text=${encodeURIComponent(`Hi WindChasers, I want to know more about the aviators bike rally on ${RALLY.dateShort}.`)}`;

const PLAN = [
  { icon: Bike, title: "Ride together", text: "A relaxed group ride across Bengaluru, ending at the Moxy Hotel." },
  { icon: Coffee, title: "Breakfast at 10 am", text: "Breakfast and good conversations once everyone rolls in." },
  { icon: Users, title: "Meet aviation people", text: "Pilots, instructors, students, engineers and ground crew, outside the usual work setting." },
];

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
const FEE = rallyFeeLabel(); // null = free registration
const VALUE = RALLY.feePaise ? RALLY.feePaise / 100 : 0;
const ITEM = { item_id: RALLY.slug, item_name: RALLY.formType, price: VALUE, quantity: 1 };

// DRAFT, for Z to approve: a short standard rider declaration.
const DECLARATION = [
  "I am 18 or older and hold a valid driving licence for the bike I will ride.",
  "My bike is registered, insured and roadworthy, and I will wear a helmet and riding gear for the whole ride.",
  "I will follow traffic rules and the ride marshals' instructions, and ride at a safe speed.",
  "I take part at my own risk and am responsible for myself and my bike.",
];

const viewSent = { fb: false, ga: false };

const EMPTY = {
  name: "", phone: "", email: "", age: "", blood_group: "", area: "", emergency_name: "", emergency_phone: "",
  bike: "", bike_reg: "", licence_no: "", licence_valid_till: "", riding_years: "", tshirt: "", role: "",
  consent: false, participate: false,
};

export default function BikeRallyPage() {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const formRef = useRef<HTMLElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    captureAndStoreUTMParams();
    // ViewContent / view_item once per page view; pixel and gtag load late, so retry briefly.
    let tries = 0;
    const fire = () => {
      if (!viewSent.fb && typeof window.fbq === "function") { window.fbq("track", "ViewContent", { content_name: RALLY.formType, content_ids: [RALLY.slug], content_type: "product", value: VALUE, currency: "INR" }); viewSent.fb = true; }
      if (!viewSent.ga && typeof window.gtag === "function") { window.gtag("event", "view_item", { value: VALUE, currency: "INR", items: [ITEM] }); viewSent.ga = true; }
      return viewSent.fb && viewSent.ga;
    };
    if (fire()) return;
    const t = window.setInterval(() => { if (fire() || ++tries > 20) window.clearInterval(t); }, 500);
    return () => window.clearInterval(t);
  }, []);
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

  const goToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const ten = (v: string) => v.replace(/\D/g, "").slice(-10);
    if (form.name.trim().length < 2) return setErr("Please enter your full name as on your ID.");
    if (!/^[6-9]\d{9}$/.test(ten(form.phone))) return setErr("Please enter a valid 10-digit mobile number.");
    if (!form.consent) return setErr("Please accept the safety declaration.");
    if (!form.participate) return setErr("Please confirm you will ride in the rally.");
    setBusy(true);
    const r = await fetch("/api/bike-rally", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, ...getStoredUTMParamsFull(), ...getStoredClickIds(),
        traffic_source: deriveTrafficSource(), referrer: getStoredReferrer(), landing_page: getLandingPage(),
      }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (!r || !r.ok) { setBusy(false); return setErr(j.error || "Could not register. Please try again."); }
    const firstName = form.name.trim().split(" ")[0];
    const finish = (name: string) => { setDone(name || firstName); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

    if (!j.order_id) { // free registration
      setBusy(false);
      if (typeof window.fbq === "function") window.fbq("track", "CompleteRegistration", { content_name: RALLY.formType, value: 0, currency: "INR" });
      if (typeof window.gtag === "function") window.gtag("event", "sign_up", { method: RALLY.slug });
      return finish(j.name);
    }

    // Paid registration (RALLY.feePaise set): Razorpay Checkout, UPI first.
    if (!window.Razorpay) { setBusy(false); return setErr("The payment window is still loading. Try again in a moment."); }
    const rzp = new window.Razorpay({
      key: j.key, order_id: j.order_id, amount: j.amount, currency: j.currency,
      name: "Windchasers", description: `Aviators bike rally, ${RALLY.dateShort}`,
      prefill: { name: form.name, contact: `+91${form.phone.replace(/\D/g, "").slice(-10)}`, email: form.email || undefined },
      theme: { color: "#C5A572" },
      config: { display: { blocks: { upi: { name: "Pay with UPI", instruments: [{ method: "upi", flows: ["intent"], apps: ["google_pay", "phonepe", "paytm"] }, { method: "upi" }] } }, sequence: ["block.upi"], preferences: { show_default_blocks: true } } },
      modal: { ondismiss: () => setBusy(false) },
      handler: async (resp: RazorpayResponse) => {
        const v = await fetch("/api/bike-rally/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp) }).catch(() => null);
        const vj = v ? await v.json().catch(() => ({})) : {};
        setBusy(false);
        if (!v || !v.ok || !vj.ok) return setErr(vj.error || "We could not confirm the payment. If money left your account, message us on WhatsApp.");
        // Purchase once per payment, even if verify is retried.
        const key = `bike_rally_purchase_${resp.razorpay_payment_id}`;
        let fresh = true;
        try { fresh = !localStorage.getItem(key); localStorage.setItem(key, "1"); } catch { /* fire anyway */ }
        if (fresh) {
          if (typeof window.fbq === "function") window.fbq("track", "Purchase", { value: VALUE, currency: "INR", content_name: RALLY.formType, content_ids: [RALLY.slug], content_type: "product" }, { eventID: resp.razorpay_order_id });
          if (typeof window.gtag === "function") window.gtag("event", "purchase", { transaction_id: resp.razorpay_payment_id, value: VALUE, currency: "INR", items: [ITEM] });
        }
        finish(vj.name);
      },
    });
    rzp.on("payment.failed", () => setErr("The payment did not go through. You can try again; nothing was charged for a failed attempt."));
    if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout", { value: VALUE, currency: "INR", content_name: RALLY.formType, content_ids: [RALLY.slug], content_type: "product", num_items: 1 }, { eventID: j.order_id });
    if (typeof window.gtag === "function") window.gtag("event", "begin_checkout", { value: VALUE, currency: "INR", items: [ITEM] });
    rzp.open();
  }

  const input = "h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-gold";
  const label = "mb-1.5 block text-[13px] font-medium text-white/70";
  const group = "space-y-4 rounded-2xl border border-white/[0.08] bg-[#151515] p-5";
  const legend = "text-[13px] font-semibold tracking-[0.06em] text-gold";

  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white">
      {FEE && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/bike-rally/captain-smiling.webp" alt="" fill priority sizes="100vw" className="object-cover object-[50%_20%] opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/70 via-[#0E0E0E]/55 to-[#0E0E0E]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-[96px] sm:px-6 lg:pb-20 lg:pt-36">
          <p className="text-[12px] font-medium tracking-[0.08em] text-gold sm:text-[13px]">BENGALURU · {RALLY.dateShort.toUpperCase()} · BY WINDCHASERS</p>
          <h1 className="mt-3 text-[38px] font-bold leading-[1.05] tracking-tight sm:text-[56px]">Aviators of Bengaluru, let&apos;s meet!</h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/80 sm:text-[18px]">
            A fun bike rally and networking breakfast for everyone who flies, fixes or loves aircraft.
          </p>
          <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-2 text-[15px] text-white/90">
            <Calendar size={17} className="mt-0.5 text-gold" /><span>{RALLY.dateLabel}</span>
            <MapPin size={17} className="mt-0.5 text-gold" /><span>Ends at {RALLY.finish}, breakfast at {RALLY.time}</span>
          </div>
          <button onClick={goToForm}
            className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold px-8 text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 sm:w-auto">
            Register to ride <ArrowRight size={18} strokeWidth={2.4} />
          </button>
          <p className="mt-2 text-center text-[12.5px] text-white/55 sm:text-left">Bring your bike. Riders 18 and over with a valid licence.{FEE ? ` Registration ${FEE}.` : ""}</p>
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

      {/* Video */}
      <section className="border-t border-white/[0.08] px-5 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">Hear it from our pilots</h2>
          <div className="relative mx-auto mt-6 aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video src="/bike-rally/announcement.mp4" poster="/bike-rally/announcement.jpg" controls playsInline preload="none" className="h-full w-full object-cover" aria-label="Windchasers pilots announce the bike rally" />
          </div>
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

      {/* Register */}
      <section ref={formRef} id="register" className="scroll-mt-20 border-t border-white/[0.08] px-5 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">{done ? "You are registered" : "Register to ride"}</h2>
          {done ? (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#151515] p-6 text-center">
              <CheckCircle2 size={44} className="mx-auto text-gold" />
              <p className="mt-4 text-[18px] font-semibold">Thanks, {done}. See you on {RALLY.dateShort}.</p>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
                {FEE ? `Your ${FEE} payment is confirmed. ` : ""}We will message you on WhatsApp with the start point and ride details, and ask for a copy of your driving licence and ID proof there.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-6 space-y-5">
              <fieldset className={group}>
                <legend className={legend}>YOU</legend>
                <div><label className={label} htmlFor="br-name">Full name, as on your ID proof</label><input id="br-name" className={input} autoComplete="name" value={form.name} onChange={set("name")} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={label} htmlFor="br-phone">Mobile number</label><input id="br-phone" className={input} inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} /></div>
                  <div><label className={label} htmlFor="br-email">Email</label><input id="br-email" className={input} type="email" autoComplete="email" value={form.email} onChange={set("email")} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={label} htmlFor="br-age">Age</label><input id="br-age" className={input} inputMode="numeric" value={form.age} onChange={set("age")} /></div>
                  <div><label className={label} htmlFor="br-blood">Blood group</label>
                    <select id="br-blood" className={input} value={form.blood_group} onChange={set("blood_group")}>
                      <option value="">Select</option>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
                    </select></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={label} htmlFor="br-area">City / area you live in</label><input id="br-area" className={input} autoComplete="address-level2" placeholder="e.g. Hebbal, Bengaluru" value={form.area} onChange={set("area")} /></div>
                  <div><label className={label} htmlFor="br-role">You are a</label>
                    <select id="br-role" className={input} value={form.role} onChange={set("role")}>
                      <option value="">Select</option>{ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select></div>
                </div>
              </fieldset>

              <fieldset className={group}>
                <legend className={legend}>EMERGENCY CONTACT</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={label} htmlFor="br-ename">Name</label><input id="br-ename" className={input} value={form.emergency_name} onChange={set("emergency_name")} /></div>
                  <div><label className={label} htmlFor="br-ephone">Mobile number</label><input id="br-ephone" className={input} inputMode="tel" value={form.emergency_phone} onChange={set("emergency_phone")} /></div>
                </div>
              </fieldset>

              <fieldset className={group}>
                <legend className={legend}>BIKE AND LICENCE</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={label} htmlFor="br-bike">Bike make and model</label><input id="br-bike" className={input} placeholder="e.g. Royal Enfield Classic 350" value={form.bike} onChange={set("bike")} /></div>
                  <div><label className={label} htmlFor="br-reg">Bike registration number</label><input id="br-reg" className={`${input} uppercase`} placeholder="KA 01 AB 1234" value={form.bike_reg} onChange={set("bike_reg")} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={label} htmlFor="br-dl">Driving licence number</label><input id="br-dl" className={`${input} uppercase`} value={form.licence_no} onChange={set("licence_no")} /></div>
                  <div><label className={label} htmlFor="br-dlv">Licence valid till</label><input id="br-dlv" className={input} type="date" value={form.licence_valid_till} onChange={set("licence_valid_till")} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={label} htmlFor="br-yrs">Riding experience (years)</label><input id="br-yrs" className={input} inputMode="numeric" value={form.riding_years} onChange={set("riding_years")} /></div>
                  <div><label className={label} htmlFor="br-tee">T-shirt size</label>
                    <select id="br-tee" className={input} value={form.tshirt} onChange={set("tshirt")}>
                      <option value="">Select</option>{TSHIRT_SIZES.map((t) => <option key={t}>{t}</option>)}
                    </select></div>
                </div>
                <p className="text-[13px] leading-relaxed text-white/55">We will ask for a copy of your driving licence and ID proof on WhatsApp after you register.</p>
              </fieldset>

              <fieldset className={group}>
                <legend className={legend}>SAFETY DECLARATION</legend>
                <ul className="space-y-2 text-[14px] leading-relaxed text-white/75">
                  {DECLARATION.map((d) => <li key={d} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{d}</li>)}
                </ul>
                <label className="flex cursor-pointer items-start gap-3 text-[14.5px]">
                  <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#C5A572]" checked={form.consent} onChange={set("consent")} />
                  <span>I have read and accept the safety declaration.</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-[14.5px]">
                  <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#C5A572]" checked={form.participate} onChange={set("participate")} />
                  <span>I confirm I will ride in the rally on {RALLY.dateLabel}.</span>
                </label>
                {FEE && <p className="text-[13.5px] text-white/60">The {FEE} registration fee is paid on the next step through Razorpay (UPI, card or netbanking). Your registration is confirmed once it is paid.</p>}
              </fieldset>

              {err && <p className="text-[14px] text-red-400">{err}</p>}
              <button disabled={busy}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 disabled:opacity-50">
                {busy && <Loader2 size={17} className="animate-spin" />} {FEE ? `Pay ${FEE} and register` : "Register to ride"}
              </button>
              <p className="text-center text-[13px] text-white/50">
                Questions? <a href={WA} target="_blank" rel="noopener noreferrer" className="text-white/80 underline-offset-4 hover:underline">Message us on WhatsApp</a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* WhatsApp button */}
      <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="Ask us on WhatsApp"
        className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-[bottom] duration-200 sm:right-6 ${barVisible && !done ? "bottom-[calc(88px+env(safe-area-inset-bottom))]" : "bottom-[calc(16px+env(safe-area-inset-bottom))]"}`}>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.45-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 0 1 2.77 6.68c0 5.2-4.24 9.43-9.45 9.43zm8.04-17.47A11.3 11.3 0 0 0 12.05.7C5.78.7.68 5.8.68 12.06c0 2 .52 3.96 1.52 5.68L.58 23.7l6.1-1.6a11.33 11.33 0 0 0 5.37 1.37h.01c6.26 0 11.36-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z"/></svg>
      </a>

      {/* Bottom bar */}
      <div aria-hidden={!barVisible || !!done}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-[#0E0E0E]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-200 ${barVisible && !done ? "translate-y-0" : "translate-y-full"}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-[16px] font-bold leading-tight">Aviators bike rally</p>
            <p className="mt-0.5 truncate text-[12.5px] text-white/60">{RALLY.dateShort} · {RALLY.time} · Moxy Hotel</p>
          </div>
          <button onClick={goToForm} tabIndex={barVisible ? 0 : -1}
            className="flex h-12 shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 text-[15px] font-semibold text-[#0E0E0E] hover:opacity-90">
            Register <ArrowRight size={17} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </main>
  );
}
