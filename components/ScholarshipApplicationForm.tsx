"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Send, ChevronLeft, ChevronRight } from "lucide-react";
import type { ScholarshipFormConfig } from "@/lib/scholarship-forms";
import {
  getStoredUTMParamsFull,
  getStoredClickIds,
  getLandingPage,
  getStoredReferrer,
  deriveTrafficSource,
} from "@/lib/tracking";

/**
 * Renders a scholarship application exactly as its PDF prints it.
 *
 * Everything shown comes from lib/scholarship-forms.ts, which is a verbatim
 * transcription. This component adds no fields and no copy of its own, so the
 * two tracks stay as different as their source documents.
 *
 * STEPPED, not one long scroll: the paper form runs to three field blocks plus
 * eight written answers, which on a phone is a wall nobody finishes. One block
 * per step means each screen is short, errors surface next to the field that
 * caused them, and progress is visible. The final step carries the questions
 * and the declaration together, because the declaration covers the answers.
 */
/** Nobody applying was born before this. */
const DATE_MIN = "1950-01-01";

/** Today in YYYY-MM-DD. Client-only: rendering "now" on a statically built page
 *  would bake the build date into the HTML and mismatch on hydration. */
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ScholarshipApplicationForm({ config }: { config: ScholarshipFormConfig }) {
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState<Record<string, string>>({});
  const [declared, setDeclared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [step, setStep] = useState(0);
  const [dateMax, setDateMax] = useState<string | undefined>(undefined);

  // Field blocks become steps, then one final step for the written answers.
  const steps = useMemo(
    () => [...config.sections.map((s) => s.heading), "Your answers"],
    [config],
  );
  const lastStep = steps.length - 1;
  const allFields = useMemo(() => config.sections.flatMap((s) => s.fields), [config]);

  // The event confirmation links here as ?n=<name>&p=<phone>, so the applicant
  // doesn't retype what they just gave us, and the application joins back to
  // the registration on the same number. Read off window rather than
  // useSearchParams: both pages are statically generated, and useSearchParams
  // would force the whole form into a Suspense boundary for two strings.
  // Seeded once on mount, never overwriting anything already typed.
  useEffect(() => {
    setDateMax(todayISO());
    const q = new URLSearchParams(window.location.search);
    const seed: Record<string, string> = {};
    const name = q.get("n")?.trim();
    const phone = q.get("p")?.replace(/\D/g, "");
    if (name) seed.full_name = name;
    if (phone && phone.length >= 10) seed.mobile = phone;
    if (Object.keys(seed).length) setValues((p) => ({ ...seed, ...p }));
  }, []);

  const set = (name: string, v: string) => {
    setValues((p) => ({ ...p, [name]: v }));
    if (error) setError(null);
  };

  const focusField = (name: string) =>
    document.getElementById(`f-${name}`)?.scrollIntoView({ block: "center", behavior: "smooth" });

  /** True once they've answered the gated field with something the programme
   *  cannot accept. Blank is not ineligible, it's just unanswered. */
  const gate = config.eligibility;
  const gateValue = gate ? String(values[gate.field] || "").trim() : "";
  const ineligible = Boolean(gate && gateValue && !gate.allowed.includes(gateValue));

  /** Validates only the step being left, so errors always point at what's on screen. */
  function validateStep(i: number): string | null {
    // Backstop for the eligibility gate - the continue button is already
    // replaced when it trips, but submit() re-runs every step.
    if (ineligible && gate) {
      focusField(gate.field);
      return gate.message;
    }
    if (i < config.sections.length) {
      for (const f of config.sections[i].fields) {
        if (f.required && !String(values[f.name] || "").trim()) {
          focusField(f.name);
          return `Please fill in ${f.label}.`;
        }
        if (f.type === "tel" && String(values[f.name] || "").replace(/\D/g, "").length < 10) {
          focusField(f.name);
          return "Please enter a valid mobile number.";
        }
        if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values[f.name] || ""))) {
          focusField(f.name);
          return "Please enter a valid email address.";
        }
        // The date picker's year segment accepts six digits and future years,
        // so the typed value is checked, not just the input's own bounds.
        if (f.type === "date" && values[f.name]) {
          const v = String(values[f.name]);
          if (v < DATE_MIN || v > todayISO()) {
            focusField(f.name);
            return `Please enter a valid ${f.label.toLowerCase()}.`;
          }
        }
      }
      return null;
    }
    for (const q of config.questions) {
      if (q.required && !String(values[q.name] || "").trim()) {
        focusField(q.name);
        return "Please answer every question.";
      }
    }
    if (!declared) return "Please accept the declaration to submit.";
    return null;
  }

  function goNext() {
    const problem = validateStep(step);
    if (problem) return setError(problem);
    setError(null);
    setStep((s) => Math.min(lastStep, s + 1));
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  async function submit() {
    if (submitting) return;
    // Re-check every step, not just the last: someone can reach the end with an
    // earlier field emptied after the fact.
    for (let i = 0; i <= lastStep; i++) {
      const problem = validateStep(i);
      if (problem) {
        setStep(i);
        setError(problem);
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    const utm = getStoredUTMParamsFull();
    const clickIds = getStoredClickIds();

    const answers: Record<string, string> = {};
    for (const q of config.questions) answers[q.name] = String(values[q.name] || "").trim();
    const details: Record<string, string> = {};
    for (const f of allFields) details[f.name] = String(values[f.name] || "").trim();

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          type: "scholarship_application",
          name: details.full_name,
          phone: details.mobile,
          email: details.email,
          page_url: typeof window !== "undefined" ? window.location.href : undefined,
          landing_url: getLandingPage() || undefined,
          referrer: getStoredReferrer() || undefined,
          traffic_source: deriveTrafficSource() || undefined,
          utm: {
            source: utm.utm_source || undefined,
            medium: utm.utm_medium || undefined,
            campaign: utm.utm_campaign || undefined,
            term: utm.utm_term || undefined,
            content: utm.utm_content || undefined,
          },
          click_ids: Object.keys(clickIds).length > 0 ? clickIds : undefined,
          data: {
            scholarship_track: config.track,
            scholarship_form_title: config.title,
            application_details: details,
            application_answers: answers,
            declaration_text: config.declaration,
            declaration_accepted: true,
            declaration_accepted_at: new Date().toISOString(),
          },
        }),
      });
    } catch {
      /* Never block the applicant on a network hiccup - the record is the ask. */
    }

    setSubmitting(false);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A572]/40 bg-[#C5A572]/15">
          <Check className="h-6 w-6 text-[#C5A572]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Application received</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-gray-400">
          {config.processNote} Our team will be in touch about the next stage.
        </p>
      </motion.div>
    );
  }

  const inputCls =
    "h-11 w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 text-[14px] text-white placeholder:text-white/25 focus:border-[#C5A572] focus:outline-none";
  const onQuestions = step === lastStep;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
        {config.academy}
      </p>
      <h1 className="mt-2 text-[26px] font-bold leading-[1.15] text-white sm:text-3xl md:text-4xl">
        {config.title}
      </h1>
      <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
      <p className="mt-3 text-[13.5px] leading-relaxed text-gray-400">{config.processNote}</p>

      {/* Stepper. Completed steps are clickable so corrections don't mean
          starting over; forward steps are not, since they may be unvalidated. */}
      <div className="mt-7 flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((label, i) => {
          const state = i === step ? "current" : i < step ? "done" : "todo";
          return (
            <button
              key={label}
              type="button"
              disabled={i > step}
              onClick={() => { if (i < step) { setError(null); setStep(i); } }}
              aria-current={state === "current" ? "step" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                state === "current"
                  ? "border-[#C5A572]/50 bg-[#C5A572]/12 text-[#E7D5B3]"
                  : state === "done"
                    ? "cursor-pointer border-white/10 bg-white/[0.03] text-white/60 hover:text-white/90"
                    : "border-white/5 bg-transparent text-white/25"
              }`}
            >
              <span className="tabular-nums">{state === "done" ? "✓" : i + 1}</span>
              <span className="whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduceMotion ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
        >
          {!onQuestions ? (
            <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E7D5B3]">
                {config.sections[step].heading}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {config.sections[step].fields.map((f) => (
                  <div key={f.name} id={`f-${f.name}`} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
                    <label htmlFor={f.name} className="mb-1.5 block text-[13px] text-white/70">
                      {f.label}
                      {/* Unit in the label, not only inside the field: the
                          browser's number spinner sits exactly where the in-field
                          suffix renders and hides it once the field is focused,
                          so "Height" alone would be a guess between cm and feet. */}
                      {f.suffix && <span className="text-white/45"> ({f.suffix})</span>}
                      {f.required && <span className="text-[#C5A572]"> *</span>}
                    </label>

                    {f.type === "textarea" ? (
                      <textarea
                        id={f.name}
                        rows={2}
                        value={values[f.name] || ""}
                        onChange={(e) => set(f.name, e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-[14px] text-white placeholder:text-white/25 focus:border-[#C5A572] focus:outline-none"
                      />
                    ) : f.type === "select" ? (
                      <select
                        id={f.name}
                        value={values[f.name] || ""}
                        onChange={(e) => set(f.name, e.target.value)}
                        style={{ colorScheme: "dark" }}
                        className={inputCls}
                      >
                        <option value="">Select</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          id={f.name}
                          type={f.type}
                          inputMode={f.type === "number" ? "numeric" : undefined}
                          value={values[f.name] || ""}
                          placeholder={f.placeholder}
                          onChange={(e) => set(f.name, e.target.value)}
                          // A bare date input lets the year segment run to six
                          // digits (typing gives you 111989), and accepts dates
                          // in the future. Bounds cap the year picker at
                          // something a person could be born in.
                          min={f.type === "date" ? DATE_MIN : undefined}
                          max={f.type === "date" ? dateMax : undefined}
                          style={f.type === "date" ? { colorScheme: "dark" } : undefined}
                          className={
                            f.suffix
                              ? `${inputCls} pr-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`
                              : inputCls
                          }
                        />
                        {f.suffix && (
                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-white/35">
                            {f.suffix}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E7D5B3]">
                  Your answers
                </h2>
                <div className="mt-4 space-y-5">
                  {config.questions.map((q, i) => (
                    <div key={q.name} id={`f-${q.name}`}>
                      <label htmlFor={q.name} className="mb-1.5 block text-[14px] leading-snug text-white/85">
                        {i + 1}. {q.question}
                        {q.required && <span className="text-[#C5A572]"> *</span>}
                      </label>
                      {q.hint && <p className="mb-1.5 text-[12px] text-white/40">{q.hint}</p>}
                      <textarea
                        id={q.name}
                        rows={q.name === "q8_deserve" ? 7 : 4}
                        value={values[q.name] || ""}
                        onChange={(e) => set(q.name, e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 py-3 text-[14px] leading-relaxed text-white placeholder:text-white/25 focus:border-[#C5A572] focus:outline-none"
                      />
                      <p className="mt-1 text-right text-[11px] text-white/30">
                        {String(values[q.name] || "").trim().split(/\s+/).filter(Boolean).length} words
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-5 rounded-2xl border border-[#C5A572]/25 bg-[#C5A572]/[0.04] p-5 sm:p-6">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E7D5B3]">
                  Declaration
                </h2>
                <label className="mt-3 flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={declared}
                    onChange={(e) => { setDeclared(e.target.checked); if (error) setError(null); }}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#C5A572]"
                  />
                  <span className="text-[13px] leading-relaxed text-white/80">{config.declaration}</span>
                </label>
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-4 text-[13px] text-red-400" role="alert">{error}</p>}

      {/* Ineligible: say so here, at the field that decided it, instead of
          letting someone write eight essays for an application that cannot be
          considered. The form stays on screen and the answer stays changeable
          in case it was a mistap - only the way forward is closed. */}
      {ineligible ? (
        <div className="mt-6 rounded-2xl border border-[#C5A572]/30 bg-[#C5A572]/[0.05] p-5" role="alert">
          <p className="text-[13.5px] leading-relaxed text-white/80">{config.eligibility!.message}</p>
          <a
            href={`https://wa.me/919035098424?text=${encodeURIComponent(
              "Hi, I was looking at the Wind Chasers scholarship but it is women-only. What other courses do you have?",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-[#C5A572]/40 bg-[#C5A572]/10 px-5 text-[14px] font-semibold text-[#E7D5B3] transition-colors hover:border-[#C5A572]/70 hover:bg-[#C5A572]/20"
          >
            Talk to us on WhatsApp
          </a>
        </div>
      ) : (
      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-5 text-[14px] font-semibold text-white/70 transition-colors hover:border-white/25 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}
        {!onQuestions ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#C5A572] text-[15px] font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#C5A572] text-[15px] font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789] disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A]" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit application
              </>
            )}
          </button>
        )}
      </div>
      )}

      {!ineligible && (
        <p className="mt-3 pb-4 text-center text-[11px] text-white/35">
          Step {step + 1} of {steps.length}. Our team will contact you about what follows.
        </p>
      )}
    </div>
  );
}
