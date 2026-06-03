"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { getUTMParams } from "@/lib/tracking";
import { trackLead, track, EVENTS } from "@/lib/analytics/events";

/**
 * Lean 2-field lead capture (name + phone). Posts to the SAME endpoint the
 * assessment / demo forms use: POST /api/leads with type "page".
 * form_name distinguishes this capture (default "pilot_training_hero").
 */
export default function InlineLeadForm({
  formName = "pilot_training_hero",
  heading = "Talk to an aviation counsellor",
  subtext = "Leave your number and we will call you back. No spam.",
  submitLabel = "Request a Callback",
}: {
  formName?: string;
  heading?: string;
  subtext?: string;
  submitLabel?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [started, setStarted] = useState(false);

  const onFirstFocus = () => {
    if (!started) {
      setStarted(true);
      track(EVENTS.FORM_START, { form_name: formName });
    }
  };

  const isValid = name.trim().length >= 2 && /^\d{10}$/.test(phone.replace(/\D/g, ""));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const utm = getUTMParams();
    const payload = {
      type: "page" as const,
      name: name.trim(),
      phone: `+91${phone.replace(/\D/g, "")}`,
      audience: "student" as const,
      page_url: typeof window !== "undefined" ? window.location.href : "",
      utm: {
        source: utm.utm_source,
        medium: utm.utm_medium,
        campaign: utm.utm_campaign,
        term: utm.utm_term,
        content: utm.utm_content,
      },
      data: { form_name: formName },
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || body?.error || "Submission failed. Please try again.");
      }

      // Fire the unified lead conversion (GA4 lead_submit + generate_lead + Meta Lead).
      trackLead({ form_name: formName, audience: "student" });

      // Stay on the page so the visitor can keep exploring. The form is
      // replaced by an inline success state below; no redirect.
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  // On success the form is replaced by a tick so the visitor keeps exploring.
  if (status === "success") {
    return (
      <div className="bg-surface-container-low/90 backdrop-blur-md border border-green-500/40 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40 text-center">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border border-green-500/40 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white mb-1">
          You are on the list{name.trim() ? `, ${name.trim().split(/\s+/)[0]}` : ""}.
        </h3>
        <p className="text-sm text-on-surface-variant">
          Our team will call you back shortly. Meanwhile, keep exploring the page below.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-surface-container-low/90 backdrop-blur-md border border-primary/30 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/40"
    >
      <h3 className="text-lg md:text-xl font-bold text-white mb-1">{heading}</h3>
      <p className="text-sm text-on-surface-variant mb-4">{subtext}</p>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={onFirstFocus}
            aria-label="Your name"
            placeholder="Your name"
            className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg px-4 h-12 text-white placeholder-white/35 focus:border-primary focus:outline-none transition-colors"
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm font-medium pointer-events-none">
              +91
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              aria-label="Phone number"
              placeholder="Phone number"
              className="w-full bg-[#0D0D0D] border border-white/15 rounded-lg pl-12 pr-4 h-12 text-white placeholder-white/35 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!isValid || status === "submitting"}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-bold px-6 h-12 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending
            </>
          ) : (
            <>
              {submitLabel} <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 mt-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </form>
  );
}
