"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Calendar, CheckCircle2, Loader2, MapPin } from "lucide-react";
import { BLOOD_GROUPS, INTEREST_KEY, RALLY, RALLY_WA, ROLES, TSHIRT_SIZES } from "@/lib/bike-rally";
import {
  captureAndStoreUTMParams, deriveTrafficSource, getLandingPage, getStoredClickIds, getStoredReferrer, getStoredUTMParamsFull,
} from "@/lib/tracking";

/**
 * Bike rally step 2: the full rider registration. Reached after "I'm in" on
 * /bike-rally (name, mobile and role prefilled), or sent directly on WhatsApp
 * to people who are already interested. Updates the same PROXe lead (by phone).
 * Copy rules: no em dashes, no "top/best" claims, no DGCA, no invented numbers.
 */

// DRAFT, for Z to approve: a short standard rider declaration.
const DECLARATION = [
  "I am 18 or older and hold a valid driving licence for the bike I will ride.",
  "My bike is registered, insured and roadworthy, and I will wear a helmet and riding gear for the whole ride.",
  "I will follow traffic rules and the ride marshals' instructions, and ride at a safe speed.",
  "I take part at my own risk and am responsible for myself and my bike.",
];

const EMPTY = {
  name: "", phone: "", email: "", age: "", blood_group: "", area: "", emergency_name: "", emergency_phone: "",
  bike: "", bike_reg: "", licence_no: "", licence_valid_till: "", riding_years: "", tshirt: "", role: "",
  consent: false, participate: false,
};

export default function BikeRallyRegisterPage() {
  const [form, setForm] = useState(EMPTY);
  const [first, setFirst] = useState<string | null>(null); // came from step 1
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    captureAndStoreUTMParams();
    try {
      const saved = JSON.parse(sessionStorage.getItem(INTEREST_KEY) || "null") as { name?: string; phone?: string; role?: string } | null;
      if (saved?.phone) {
        setForm((f) => ({ ...f, name: saved.name || "", phone: saved.phone || "", role: saved.role || "" }));
        setFirst((saved.name || "").trim().split(" ")[0] || "");
      }
    } catch { /* no step 1 data */ }
    // Hide the chat bubble if an earlier page loaded it; this page has its own WhatsApp link.
    const hide = () => { const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = "none"; };
    hide();
    const t = window.setInterval(hide, 1000);
    return () => { window.clearInterval(t); const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = ""; };
  }, []);

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
    setBusy(false);
    if (!r || !r.ok) return setErr(j.error || "Could not register. Please try again.");
    if (typeof window.fbq === "function") window.fbq("track", "CompleteRegistration", { content_name: RALLY.formType });
    if (typeof window.gtag === "function") window.gtag("event", "sign_up", { method: RALLY.slug });
    try { sessionStorage.removeItem(INTEREST_KEY); } catch { /* ignore */ }
    setDone(j.name || form.name.trim().split(" ")[0]);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const input = "h-12 w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none placeholder:text-white/35 focus:border-gold";
  const label = "mb-1.5 block text-[13px] font-medium text-white/70";
  const group = "space-y-4 rounded-2xl border border-white/[0.08] bg-[#151515] p-5";
  const legend = "text-[13px] font-semibold tracking-[0.06em] text-gold";

  return (
    <main className="min-h-screen bg-[#0E0E0E] px-5 pb-16 pt-[92px] text-white sm:px-6 lg:pt-32">
      <div ref={topRef} className="mx-auto max-w-2xl scroll-mt-24">
        <Link href="/bike-rally" className="inline-flex items-center gap-1.5 text-[13.5px] text-white/60 hover:text-white">
          <ArrowLeft size={15} /> Aviators bike rally
        </Link>
        <p className="mt-5 text-[12px] font-medium tracking-[0.08em] text-gold sm:text-[13px]">STEP 2 OF 2 · RIDER DETAILS</p>
        <h1 className="mt-2 text-[30px] font-bold leading-tight tracking-tight sm:text-[40px]">
          {done ? "You are registered" : first ? `Lock your spot, ${first}` : "Lock your spot"}
        </h1>
        {!done && <p className="mt-2 text-[16px] text-white/75">2 minutes for rider details, so we can plan a safe ride.</p>}
        <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1.5 text-[14.5px] text-white/80">
          <Calendar size={16} className="mt-0.5 text-gold" /><span>{RALLY.dateLabel}</span>
          <MapPin size={16} className="mt-0.5 text-gold" /><span>Ends at {RALLY.finish}, breakfast at {RALLY.time}</span>
        </div>

        {done ? (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#151515] p-6 text-center">
            <CheckCircle2 size={44} className="mx-auto text-gold" />
            <p className="mt-4 text-[18px] font-semibold">Thanks, {done}. See you on {RALLY.dateShort}.</p>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              We will message you on WhatsApp with the start point and ride details, and ask for a copy of your driving licence and ID proof there.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-8 space-y-5">
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
            </fieldset>

            {err && <p className="text-[14px] text-red-400">{err}</p>}
            <button disabled={busy}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 disabled:opacity-50">
              {busy && <Loader2 size={17} className="animate-spin" />} Register to ride
            </button>
            <p className="text-center text-[13px] text-white/50">
              Questions? <a href={RALLY_WA} target="_blank" rel="noopener noreferrer" className="text-white/80 underline-offset-4 hover:underline">Message us on WhatsApp</a>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
