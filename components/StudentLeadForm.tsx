"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  getStoredUTMParams,
  getStoredClickIds,
  getLandingPage,
  getStoredReferrer,
  deriveTrafficSource,
} from "@/lib/tracking";
import { track, trackLead, EVENTS } from "@/lib/analytics/events";

export type LeadFormName =
  | "student_hero"
  | "student_modal"
  | "student_apply"
  | "student_visit"
  | "student_final";

interface StudentLeadFormProps {
  formName: LeadFormName;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  city: string;
  completed12th: "yes" | "no" | "";
  flyPreference: "india" | "abroad" | "not_sure" | "";
  why: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  completed12th: "",
  flyPreference: "",
  why: "",
};

export default function StudentLeadForm({
  formName,
  title = "Unlock Your Personalized Pilot Plan",
  subtitle = "Get expert guidance on your pilot journey.",
  submitLabel = "Get My Plan",
  compact = false,
  onSuccess,
}: StudentLeadFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isValid =
    form.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    /^\d{10}$/.test(form.phone.replace(/\D/g, "")) &&
    form.city.trim().length >= 2 &&
    form.completed12th !== "" &&
    form.flyPreference !== "";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) next.phone = "Enter a 10-digit phone number.";
    if (form.city.trim().length < 2) next.city = "Please enter your city.";
    if (!form.completed12th) next.completed12th = "Please choose one.";
    if (!form.flyPreference) next.flyPreference = "Please choose one.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setErrorMessage("");

    // First-touch UTMs (survives in-tab nav + tab restart via localStorage),
    // plus ad-network click IDs, the original landing URL, the first-touch
    // referrer, and a derived channel — so PROXe never falls back to DIRECT
    // when the visit actually came from an ad / referral.
    const utm = getStoredUTMParams();
    const clickIds = getStoredClickIds();
    const payload = {
      type: "page" as const,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: `+91${form.phone.replace(/\D/g, "")}`,
      city: form.city.trim(),
      audience: "student" as const,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      utm: {
        source: utm.utm_source,
        medium: utm.utm_medium,
        campaign: utm.utm_campaign,
        term: utm.utm_term,
        content: utm.utm_content,
      },
      click_ids: clickIds,
      landing_url: getLandingPage(),
      referrer: getStoredReferrer(),
      traffic_source: deriveTrafficSource(),
      data: {
        form_name: formName,
        completed_12th: form.completed12th,
        fly_preference: form.flyPreference,
        why: form.why.trim(),
      },
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed. Please try again.");
      }

      // Named lead conversion (GA4 student_lead + Meta Lead). The class-12
      // "not completed" branch fires early_stage_lead instead so the two are
      // separable in reporting.
      if (form.completed12th === "no") {
        trackLead(EVENTS.EARLY_STAGE_LEAD, { form_name: formName, audience: "student" });
      } else {
        trackLead(EVENTS.STUDENT_LEAD, { form_name: formName, audience: "student" });
      }

      setStatus("success");
      onSuccess?.();

      const firstName = form.name.trim().split(/\s+/)[0];
      const target =
        form.completed12th === "no"
          ? `/assessment/early?name=${encodeURIComponent(firstName)}`
          : `/thank-you?type=lead&name=${encodeURIComponent(firstName)}`;

      setTimeout(() => router.push(target), 800);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-[#1A1A1A] border border-gold/30 rounded-2xl p-6 md:p-8 ${
        compact ? "" : "shadow-xl shadow-black/40"
      }`}
      noValidate
    >
      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/60 mb-6">{subtitle}</p>

      <div className="space-y-4">
        <div>
          <label htmlFor={`name-${formName}`} className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
            Name <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            id={`name-${formName}`}
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.name}
            className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg px-4 h-11 text-white placeholder-white/30 focus:border-gold focus:outline-none transition-colors"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`email-${formName}`} className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
              Email <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <input
              id={`email-${formName}`}
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-required="true"
              aria-invalid={!!errors.email}
              className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg px-4 h-11 text-white placeholder-white/30 focus:border-gold focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor={`phone-${formName}`} className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
              Phone <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium pointer-events-none">
                +91
              </span>
              <input
                id={`phone-${formName}`}
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                aria-required="true"
                aria-invalid={!!errors.phone}
                className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg pl-12 pr-4 h-11 text-white placeholder-white/30 focus:border-gold focus:outline-none transition-colors"
                placeholder="9876543210"
              />
            </div>
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor={`city-${formName}`} className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
            City <span className="text-red-400" aria-hidden="true">*</span>
          </label>
          <input
            id={`city-${formName}`}
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.city}
            className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg px-4 h-11 text-white placeholder-white/30 focus:border-gold focus:outline-none transition-colors"
            placeholder="Bengaluru"
          />
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
        </div>

        <fieldset>
          <legend className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Have you completed Class 12 (Science)? <span className="text-red-400" aria-hidden="true">*</span>
          </legend>
          <div className="flex gap-3">
            {[
              { v: "yes", label: "Yes" },
              { v: "no", label: "No" },
            ].map((o) => (
              <label
                key={o.v}
                className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium text-center transition-colors ${
                  form.completed12th === o.v
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                <input
                  type="radio"
                  name={`completed12th-${formName}`}
                  value={o.v}
                  checked={form.completed12th === o.v}
                  onChange={() => update("completed12th", o.v as "yes" | "no")}
                  className="sr-only"
                />
                {o.label}
              </label>
            ))}
          </div>
          {errors.completed12th && <p className="text-red-400 text-xs mt-1">{errors.completed12th}</p>}
        </fieldset>

        <fieldset>
          <legend className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
            Where do you plan to fly in? <span className="text-red-400" aria-hidden="true">*</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {[
              { v: "india", label: "India" },
              { v: "abroad", label: "Abroad" },
              { v: "not_sure", label: "Not sure" },
            ].map((o) => (
              <label
                key={o.v}
                className={`flex-1 min-w-[100px] cursor-pointer rounded-lg border px-3 py-2.5 text-sm font-medium text-center transition-colors ${
                  form.flyPreference === o.v
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/15 text-white/70 hover:border-white/30"
                }`}
              >
                <input
                  type="radio"
                  name={`flyPreference-${formName}`}
                  value={o.v}
                  checked={form.flyPreference === o.v}
                  onChange={() => update("flyPreference", o.v as "india" | "abroad" | "not_sure")}
                  className="sr-only"
                />
                {o.label}
              </label>
            ))}
          </div>
          {errors.flyPreference && <p className="text-red-400 text-xs mt-1">{errors.flyPreference}</p>}
        </fieldset>

        <div>
          <label htmlFor={`why-${formName}`} className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-1.5">
            Why do you want to become a pilot? <span className="text-white/40 normal-case font-normal">(optional)</span>
          </label>
          <textarea
            id={`why-${formName}`}
            value={form.why}
            onChange={(e) => update("why", e.target.value)}
            rows={3}
            className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-gold focus:outline-none transition-colors resize-none"
            placeholder="A few sentences is plenty."
          />
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{errorMessage}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-400 text-sm">Thanks. Redirecting you now...</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || status === "submitting" || status === "success"}
          className="w-full bg-gold hover:bg-gold/90 text-dark font-bold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            submitLabel
          )}
        </button>

        <p className="text-xs text-white/45 text-center leading-relaxed">
          By submitting, you agree to receive a counsellor call within 24 hours.
        </p>
      </div>
    </form>
  );
}
