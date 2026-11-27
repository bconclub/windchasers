"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Pencil } from "lucide-react";
import {
  BLOOD_GROUPS, INTEREST_KEY, RALLY, RALLY_WA, REG_STEPS, ROLES, TSHIRT_SIZES, cleanRally, rallyErrors,
  type RegField,
} from "@/lib/bike-rally";
import {
  captureAndStoreUTMParams, deriveTrafficSource, getLandingPage, getStoredClickIds, getStoredReferrer, getStoredUTMParamsFull,
} from "@/lib/tracking";

/**
 * Bike rally rider details, one short screen at a time (5 screens). Every
 * Continue saves to PROXe (same lead, matched on phone), so partial details are
 * kept if someone drops off. The screen is in the URL (?step=3) and the answers
 * in localStorage on the rider's own phone, so the WhatsApp link resumes where
 * they left off. Reached after "I'm in" on /bike-rally (name, mobile and role
 * prefilled) or directly.
 * Copy rules: no em dashes, no "top/best" claims, no DGCA, no invented numbers.
 */

// DRAFT, for Z to approve: a short standard rider declaration.
const DECLARATION = [
  "I am 18 or older and hold a valid driving licence for the bike I will ride.",
  "My bike is registered, insured and roadworthy, and I will wear a helmet and riding gear for the whole ride.",
  "I will follow traffic rules and the ride marshals' instructions, and ride at a safe speed.",
  "I take part at my own risk and am responsible for myself and my bike.",
];

const SAVE_KEY = "bike_rally_register";
const LAST = REG_STEPS.length;

const EMPTY = {
  name: "", phone: "", email: "", age: "", blood_group: "", area: "", role: "",
  emergency_name: "", emergency_phone: "", bike: "", bike_reg: "", riding_years: "",
  licence_no: "", licence_valid_till: "", tshirt: "", consent: false, participate: false,
};
type Form = typeof EMPTY;
type Errors = Partial<Record<RegField, string>>;

const stepOf = (f: string) => REG_STEPS.findIndex((s) => (s.fields as readonly string[]).includes(f)) + 1;
/** First screen (1-based) that still has a problem, or LAST + 1 if all done. */
const firstOpenStep = (form: Form) => {
  const c = cleanRally(form);
  for (let i = 1; i <= LAST; i++) if (Object.keys(rallyErrors(c, REG_STEPS[i - 1].fields)).length) return i;
  return LAST + 1;
};
const urlStep = () => Number(new URLSearchParams(window.location.search).get("step")) || 0;

// Outside the page component so inputs keep focus while typing.
function Field({ f, text, error, children }: { f: RegField; text: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13.5px] font-medium text-white/75" htmlFor={`br-${f}`}>{text}</label>
      {children}
      {error && <p id={`br-${f}-err`} className="mt-1.5 text-[13.5px] text-red-400">{error}</p>}
    </div>
  );
}

export default function BikeRallyRegisterPage() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [step, setStep] = useState(1);
  const [ready, setReady] = useState(false);
  const [editId, setEditId] = useState(true); // show name/mobile inputs
  const [errors, setErrors] = useState<Errors>({});
  const [formErr, setFormErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number, mode: "push" | "replace" = "push") => {
    const u = new URL(window.location.href);
    u.searchParams.set("step", String(n));
    window.history[mode === "push" ? "pushState" : "replaceState"]({ step: n }, "", u.toString());
    setStep(n);
    setErrors({});
    setFormErr("");
    window.scrollTo({ top: 0 });
  }, []);

  // Restore: saved answers, then step 1 hand-off from /bike-rally, then the screen from the URL.
  useEffect(() => {
    captureAndStoreUTMParams();
    let f: Form = EMPTY;
    let savedStep = 1;
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null") as { form?: Partial<Form>; step?: number } | null;
      if (saved?.form) f = { ...f, ...saved.form };
      if (saved?.step) savedStep = saved.step;
    } catch { /* nothing saved */ }
    try {
      const hand = JSON.parse(sessionStorage.getItem(INTEREST_KEY) || "null") as { name?: string; phone?: string; role?: string } | null;
      if (hand?.phone) {
        if (hand.phone !== f.phone) { f = { ...EMPTY }; savedStep = 1; } // someone else on this device
        f = { ...f, name: hand.name || f.name, phone: hand.phone, role: f.role || hand.role || "" };
      }
    } catch { /* no hand-off */ }
    const c = cleanRally(f);
    setEditId(Object.keys(rallyErrors(c, ["name", "phone"])).length > 0);
    setForm(f);
    const want = urlStep() || savedStep;
    go(Math.max(1, Math.min(want, firstOpenStep(f), LAST)), "replace");
    setReady(true);

    const onPop = () => setStep(Math.max(1, Math.min(urlStep() || 1, LAST)));
    window.addEventListener("popstate", onPop);
    // Hide the chat bubble if an earlier page loaded it; this page has its own WhatsApp link.
    const hide = () => { const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = "none"; };
    hide();
    const t = window.setInterval(hide, 1000);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.clearInterval(t);
      const w = document.getElementById("wc-chat-widget"); if (w) w.style.display = "";
    };
  }, [go]);

  // Keep answers and screen on this device so the link resumes where they left off.
  useEffect(() => {
    if (!ready || done) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ form, step })); } catch { /* private mode */ }
  }, [form, step, ready, done]);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k as RegField]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const focusField = (f: string) => window.setTimeout(() => document.getElementById(`br-${f}`)?.focus(), 50);

  async function next(e: React.FormEvent) {
    e.preventDefault();
    setFormErr("");
    const fields = REG_STEPS[step - 1].fields;
    const local = rallyErrors(cleanRally(form), fields);
    const bad = Object.keys(local)[0];
    if (bad) {
      setErrors(local);
      if (bad === "name" || bad === "phone") setEditId(true);
      return focusField(bad);
    }
    setBusy(true);
    const r = await fetch("/api/bike-rally", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, step, ...getStoredUTMParamsFull(), ...getStoredClickIds(),
        traffic_source: deriveTrafficSource(), referrer: getStoredReferrer(), landing_page: getLandingPage(),
      }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(false);
    if (!r || !r.ok) {
      if (j.field) {
        const s = stepOf(j.field);
        if (s && s !== step) go(s);
        setErrors(j.errors || { [j.field]: j.error });
        if (j.field === "name" || j.field === "phone") setEditId(true);
        return focusField(j.field);
      }
      return setFormErr(j.error || "Could not save that. Please check your connection and try again.");
    }
    if (typeof window.gtag === "function") window.gtag("event", "rally_details_step", { step, step_name: REG_STEPS[step - 1].title });
    if (step < LAST) return go(step + 1);
    if (typeof window.fbq === "function") window.fbq("track", "CompleteRegistration", { content_name: RALLY.formType });
    if (typeof window.gtag === "function") window.gtag("event", "sign_up", { method: RALLY.slug });
    try { localStorage.removeItem(SAVE_KEY); sessionStorage.removeItem(INTEREST_KEY); } catch { /* ignore */ }
    setDone(j.name || form.name.trim().split(" ")[0]);
    window.scrollTo({ top: 0 });
  }

  const input = (bad?: string) =>
    `h-12 w-full rounded-lg border bg-white/[0.04] px-4 text-[16px] text-white outline-none placeholder:text-white/35 focus:border-gold ${bad ? "border-red-400/80" : "border-white/15"}`;

  const a11y = (f: RegField) => ({ id: `br-${f}`, "aria-invalid": !!errors[f], "aria-describedby": errors[f] ? `br-${f}-err` : undefined });

  const pct = Math.round(((done ? LAST : step - 1) / LAST) * 100);
  const current = REG_STEPS[step - 1];

  return (
    <main className="min-h-screen bg-[#0E0E0E] px-5 pb-32 pt-[88px] text-white sm:px-6 sm:pb-16 lg:pt-28">
      <div ref={topRef} className="mx-auto max-w-xl">
        <Link href="/bike-rally" className="inline-flex items-center gap-1.5 text-[13.5px] text-white/60 hover:text-white">
          <ArrowLeft size={15} /> Aviators bike rally · {RALLY.dateShort} · Moxy Hotel
        </Link>

        {done ? (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#151515] p-6 text-center">
            <CheckCircle2 size={44} className="mx-auto text-gold" />
            <h1 className="mt-4 text-[24px] font-bold">You are registered</h1>
            <p className="mt-2 text-[17px] font-semibold">Thanks, {done}. See you on {RALLY.dateShort}.</p>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              We will message you on WhatsApp with the start point and ride details, and ask for a copy of your driving licence and ID proof there.
            </p>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-baseline justify-between text-[13px]">
                <span className="font-semibold tracking-[0.06em] text-gold">STEP {step} OF {LAST}</span>
                <span className="text-white/50">About 2 minutes</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={LAST} aria-valuenow={step - 1} aria-label={`Step ${step} of ${LAST}`}>
                <div className="h-full rounded-full bg-gold transition-[width] duration-300" style={{ width: `${Math.max(pct, 4)}%` }} />
              </div>
            </div>

            <h1 className="mt-6 text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">{current.title}</h1>

            <form onSubmit={next} noValidate className="mt-5">
              <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#151515] p-5">
                {step === 1 && (
                  <>
                    {editId ? (
                      <>
                        <Field f="name" error={errors.name} text="Full name, as on your ID proof"><input {...a11y("name")} className={input(errors.name)} autoComplete="name" value={form.name} onChange={set("name")} /></Field>
                        <Field f="phone" error={errors.phone} text="Mobile number (WhatsApp)"><input {...a11y("phone")} className={input(errors.phone)} type="tel" inputMode="numeric" autoComplete="tel" maxLength={14} value={form.phone} onChange={set("phone")} /></Field>
                      </>
                    ) : (
                      <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-[15px] font-semibold">{form.name}</p>
                          <p className="text-[13.5px] text-white/60">{form.phone}</p>
                        </div>
                        <button type="button" onClick={() => { setEditId(true); focusField("name"); }} className="flex shrink-0 items-center gap-1.5 text-[13.5px] text-gold hover:underline">
                          <Pencil size={14} /> Edit
                        </button>
                      </div>
                    )}
                    <Field f="email" error={errors.email} text="Email"><input {...a11y("email")} className={input(errors.email)} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={form.email} onChange={set("email")} /></Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field f="age" error={errors.age} text="Age"><input {...a11y("age")} className={input(errors.age)} inputMode="numeric" pattern="[0-9]*" maxLength={2} value={form.age} onChange={set("age")} /></Field>
                      <Field f="blood_group" error={errors.blood_group} text="Blood group">
                        <select {...a11y("blood_group")} className={input(errors.blood_group)} value={form.blood_group} onChange={set("blood_group")}>
                          <option value="">Select</option>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </Field>
                    </div>
                    <Field f="area" error={errors.area} text="Area you live in"><input {...a11y("area")} className={input(errors.area)} autoComplete="address-level2" placeholder="e.g. Hebbal, Bengaluru" value={form.area} onChange={set("area")} /></Field>
                    <Field f="role" error={errors.role} text="You are a">
                      <select {...a11y("role")} className={input(errors.role)} value={form.role} onChange={set("role")}>
                        <option value="">Select</option>{ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="text-[14.5px] leading-relaxed text-white/65">Someone we can call on the day if needed. Not you.</p>
                    <Field f="emergency_name" error={errors.emergency_name} text="Their name"><input {...a11y("emergency_name")} className={input(errors.emergency_name)} autoComplete="off" value={form.emergency_name} onChange={set("emergency_name")} /></Field>
                    <Field f="emergency_phone" error={errors.emergency_phone} text="Their mobile number"><input {...a11y("emergency_phone")} className={input(errors.emergency_phone)} type="tel" inputMode="numeric" autoComplete="off" maxLength={14} value={form.emergency_phone} onChange={set("emergency_phone")} /></Field>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Field f="bike" error={errors.bike} text="Bike make and model"><input {...a11y("bike")} className={input(errors.bike)} placeholder="e.g. Royal Enfield Classic 350" value={form.bike} onChange={set("bike")} /></Field>
                    <Field f="bike_reg" error={errors.bike_reg} text="Registration number"><input {...a11y("bike_reg")} className={`${input(errors.bike_reg)} uppercase`} autoCapitalize="characters" autoComplete="off" placeholder="KA 01 AB 1234" value={form.bike_reg} onChange={set("bike_reg")} /></Field>
                    <Field f="riding_years" error={errors.riding_years} text="Riding experience (years)"><input {...a11y("riding_years")} className={input(errors.riding_years)} inputMode="numeric" pattern="[0-9]*" maxLength={2} value={form.riding_years} onChange={set("riding_years")} /></Field>
                  </>
                )}

                {step === 4 && (
                  <>
                    <Field f="licence_no" error={errors.licence_no} text="Driving licence number"><input {...a11y("licence_no")} className={`${input(errors.licence_no)} uppercase`} autoCapitalize="characters" autoComplete="off" placeholder="KA01 20201234567" value={form.licence_no} onChange={set("licence_no")} /></Field>
                    <Field f="licence_valid_till" error={errors.licence_valid_till} text="Valid till"><input {...a11y("licence_valid_till")} className={input(errors.licence_valid_till)} type="date" min={RALLY.dateIso} value={form.licence_valid_till} onChange={set("licence_valid_till")} /></Field>
                    <p className="text-[13.5px] leading-relaxed text-white/55">We will ask for a copy of your licence and ID proof on WhatsApp after you register.</p>
                  </>
                )}

                {step === 5 && (
                  <>
                    <Field f="tshirt" error={errors.tshirt} text="T-shirt size">
                      <select {...a11y("tshirt")} className={input(errors.tshirt)} value={form.tshirt} onChange={set("tshirt")}>
                        <option value="">Select</option>{TSHIRT_SIZES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </Field>
                    <div>
                      <h2 className="text-[15px] font-semibold">Safety declaration</h2>
                      <ul className="mt-2 space-y-2 text-[14px] leading-relaxed text-white/75">
                        {DECLARATION.map((d) => <li key={d} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{d}</li>)}
                      </ul>
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-[15px]">
                        <input {...a11y("consent")} type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#C5A572]" checked={form.consent} onChange={set("consent")} />
                        <span>I have read and accept the safety declaration.</span>
                      </label>
                      {errors.consent && <p id="br-consent-err" className="ml-8 mt-1 text-[13.5px] text-red-400">{errors.consent}</p>}
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-[15px]">
                        <input {...a11y("participate")} type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#C5A572]" checked={form.participate} onChange={set("participate")} />
                        <span>I confirm I will ride in the rally on {RALLY.dateLabel}.</span>
                      </label>
                      {errors.participate && <p id="br-participate-err" className="ml-8 mt-1 text-[13.5px] text-red-400">{errors.participate}</p>}
                    </div>
                  </>
                )}
              </div>

              {formErr && <p className="mt-4 text-[14px] text-red-400">{formErr}</p>}

              {/* Back / Continue: pinned to the bottom of the screen on phones */}
              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0E0E0E]/95 px-5 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
                <div className="mx-auto flex max-w-xl gap-3">
                  {step > 1 ? (
                    <button type="button" onClick={() => go(step - 1)} disabled={busy}
                      className="flex h-14 items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 text-[15px] font-medium text-white/85 hover:border-white/40">
                      <ArrowLeft size={17} /> Back
                    </button>
                  ) : (
                    <Link href="/bike-rally" className="flex h-14 items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 text-[15px] font-medium text-white/85 hover:border-white/40">
                      <ArrowLeft size={17} /> Back
                    </Link>
                  )}
                  <button type="submit" disabled={busy}
                    className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-gold text-[16px] font-semibold text-[#0E0E0E] transition-opacity hover:opacity-90 disabled:opacity-60">
                    {busy ? <Loader2 size={18} className="animate-spin" /> : null}
                    {step === LAST ? "Lock my spot" : "Continue"}
                    {!busy && step < LAST && <ArrowRight size={18} strokeWidth={2.4} />}
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-6 text-center text-[13px] text-white/50">
              Your answers are saved as you go. Questions? <a href={RALLY_WA} target="_blank" rel="noopener noreferrer" className="text-white/80 underline-offset-4 hover:underline">Message us on WhatsApp</a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
