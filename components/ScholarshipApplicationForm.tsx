"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Send } from "lucide-react";
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
 * Long-form answers are plain textareas: the academy's process expects written
 * answers (one runs to ~200 words), and there is no file-upload infrastructure
 * anywhere on this site to accept a document instead.
 */
export default function ScholarshipApplicationForm({ config }: { config: ScholarshipFormConfig }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [declared, setDeclared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const allFields = useMemo(() => config.sections.flatMap((s) => s.fields), [config]);

  const set = (name: string, v: string) => {
    setValues((p) => ({ ...p, [name]: v }));
    if (error) setError(null);
  };

  async function submit() {
    if (submitting) return;

    for (const f of allFields) {
      if (f.required && !String(values[f.name] || "").trim()) {
        setError(`Please fill in ${f.label}.`);
        document.getElementById(`f-${f.name}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
    }
    const phone = String(values.mobile || "").replace(/\D/g, "");
    if (phone.length < 10) return setError("Please enter a valid mobile number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email || "")))
      return setError("Please enter a valid email address.");
    for (const q of config.questions) {
      if (q.required && !String(values[q.name] || "").trim()) {
        setError("Please answer every question.");
        document.getElementById(`f-${q.name}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
    }
    if (!declared) return setError("Please accept the declaration to submit.");

    setSubmitting(true);
    setError(null);

    const utm = getStoredUTMParamsFull();
    const clickIds = getStoredClickIds();

    // Answers ride as one object rather than 20 loose keys, so PROXe stores a
    // readable application instead of custom_fields sprawl.
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
            // Stored verbatim so there is a record of exactly what was agreed to.
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
        initial={{ opacity: 0, y: 12 }}
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

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
        {config.academy}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">{config.title}</h1>
      <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
      <p className="mt-3 text-[14px] leading-relaxed text-gray-400">{config.processNote}</p>

      {config.sections.map((section) => (
        <section key={section.heading} className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E7D5B3]">
            {section.heading}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {section.fields.map((f) => (
              <div key={f.name} id={`f-${f.name}`} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
                <label htmlFor={f.name} className="mb-1.5 block text-[13px] text-white/70">
                  {f.label}
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
                      value={values[f.name] || ""}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                      style={f.type === "date" ? { colorScheme: "dark" } : undefined}
                      className={inputCls}
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
      ))}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
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
              {/* A live count, because two of these state a word target. */}
              <p className="mt-1 text-right text-[11px] text-white/30">
                {String(values[q.name] || "").trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#C5A572]/25 bg-[#C5A572]/[0.04] p-5 sm:p-6">
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

      {error && <p className="mt-4 text-[13px] text-red-400" role="alert">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#C5A572] text-[15px] font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789] disabled:opacity-60 disabled:hover:translate-y-0"
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
      <p className="mt-3 pb-4 text-center text-[11px] text-white/35">
        Stage 1 of the selection process. Our team will contact you about what follows.
      </p>
    </div>
  );
}
