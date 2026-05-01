"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Phone,
  ArrowRight,
  User,
  MessageSquare,
  Download,
} from "lucide-react";

import {
  getStoredUTMParamsFull,
  getLandingPage,
  getStoredReferrer,
  getSessionId,
  trackFormSubmission,
} from "@/lib/tracking";
import { trackEarlyStageLead } from "@/lib/analytics";
import { writeEligibility } from "@/lib/pat-storage";

/**
 * /assessment/early
 *
 * Step 1 destination for sub-12 aspirants. The PAT is hidden from this
 * audience; instead they see three actions and a small lead form. All form
 * submissions land in Sheets + PROXe with audience=early_stage.
 */

const PHONE_RE = /^[+]?[0-9\s-]{10,}$/;

export default function AssessmentEarlyPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Persist the No answer if a user lands here directly.
  useEffect(() => {
    writeEligibility("no");
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    whatsapp?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!phone.trim()) next.phone = "Phone is required";
    else if (!PHONE_RE.test(phone.trim().replace(/\s/g, "")))
      next.phone = "Enter a valid phone number";
    if (whatsapp.trim() && !PHONE_RE.test(whatsapp.trim().replace(/\s/g, ""))) {
      next.whatsapp = "Enter a valid WhatsApp number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    const utm = getStoredUTMParamsFull();

    try {
      const res = await fetch("/api/assessment-early", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          audience: "early_stage",
          eligibility: "no",
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_term: utm.utm_term,
          utm_content: utm.utm_content,
          referrer: getStoredReferrer(),
          landing_page: getLandingPage(),
          sessionId: getSessionId(),
          timestamp: new Date().toISOString(),
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.success === false) {
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "We could not save your details. Please try again."
        );
      }

      trackEarlyStageLead();
      trackFormSubmission(
        "early_stage",
        { name: name.trim(), phone: phone.trim() },
        "assessment_early"
      );

      const data = encodeURIComponent(
        JSON.stringify({
          name: name.trim(),
          audience: "early_stage",
        })
      );
      router.push(`/thank-you?type=assessment-early&data=${data}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "We could not save your details. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  const fade = reduceMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-32 pb-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div {...fade} transition={{ duration: 0.5 }} className="text-center mb-12">
          <span className="inline-block bg-[#C5A572]/15 text-[#C5A572] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-[#C5A572]/40 mb-5">
            For aspirants in or before Class 12
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            PAT is built for{" "}
            <span className="text-[#C5A572]">Class 12 pass</span> aspirants.
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            You are earlier in your journey, which is great. Here is what to do
            now.
          </p>
        </motion.div>

        {/* 3 Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <ActionCard
            icon={Download}
            badge="Step 1"
            title="Download the Pilot Training Roadmap 2026"
            description="Understand the path, costs, and timelines before you commit."
            ctaLabel="Download Roadmap"
            ctaHref="/Pilot-Training-Roadmap-2026.pdf"
            ctaTarget="_blank"
            delay={0.1}
          />
          <ActionCard
            icon={GraduationCap}
            badge="Step 2"
            title="Explore the Pre-Cadet Program"
            description="Start preparing while you finish school."
            ctaLabel="Learn more"
            ctaHref="https://windchasers.in/pre-cadet-program/"
            ctaTarget="_blank"
            delay={0.2}
          />
          <ActionCard
            icon={MessageSquare}
            badge="Step 3"
            title="Talk to a counsellor"
            description="Get personalised guidance for your stage."
            ctaLabel="Book a call"
            ctaHref="/demo"
            delay={0.3}
          />
        </div>

        {/* Lead form */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8">
            <div className="absolute -top-3 left-6">
              <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Stay in touch
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-2">
              Want personalised guidance?
            </h2>
            <p className="text-white/60 mb-6">
              Drop your details and we will share resources tailored to your
              stage. No spam, no pressure.
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field
                id="early-name"
                label="Name"
                icon={<User className="w-4 h-4 text-white/40" />}
                required
                value={name}
                onChange={setName}
                error={errors.name}
                placeholder="Your full name"
                autoComplete="name"
              />
              <Field
                id="early-phone"
                label="Phone"
                type="tel"
                icon={<Phone className="w-4 h-4 text-white/40" />}
                required
                value={phone}
                onChange={setPhone}
                error={errors.phone}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
              <Field
                id="early-whatsapp"
                label="WhatsApp (if different from phone)"
                type="tel"
                icon={<Phone className="w-4 h-4 text-white/40" />}
                value={whatsapp}
                onChange={setWhatsapp}
                error={errors.whatsapp}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />

              {submitError ? (
                <div
                  className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 text-sm text-red-200"
                  role="alert"
                >
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#C5A572] text-[#1A1A1A] py-4 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
              >
                {isSubmitting ? "Sending..." : "Get personalised guidance"}
                {!isSubmitting ? <ArrowRight className="w-4 h-4" /> : null}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          {...fade}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center text-white/50 text-sm mt-12"
        >
          Come back and take the PAT once you complete Class 12.
        </motion.p>
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: typeof BookOpen;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaTarget?: string;
  delay?: number;
}

function ActionCard({
  icon: Icon,
  badge,
  title,
  description,
  ctaLabel,
  ctaHref,
  ctaTarget,
  delay = 0,
}: ActionCardProps) {
  const reduceMotion = useReducedMotion();
  const isExternal = ctaHref.startsWith("http");

  const button = (
    <span className="inline-flex items-center gap-1.5 bg-[#C5A572] text-[#1A1A1A] px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_30px_rgba(197,165,114,0.35)]">
      {ctaLabel}
      <ArrowRight className="w-3.5 h-3.5" />
    </span>
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-7 flex flex-col group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
    >
      <div className="absolute -top-3 left-6">
        <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {badge}
        </span>
      </div>
      <Icon className="w-8 h-8 text-[#C5A572] mt-2 mb-4" />
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed mb-6 flex-1">
        {description}
      </p>
      {isExternal ? (
        <a
          href={ctaHref}
          target={ctaTarget ?? "_blank"}
          rel="noopener noreferrer"
          className="inline-block w-fit"
        >
          {button}
        </a>
      ) : (
        <Link href={ctaHref} className="inline-block w-fit">
          {button}
        </Link>
      )}
    </motion.div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  autoComplete?: string;
}

function Field({
  id,
  label,
  type = "text",
  required,
  value,
  onChange,
  error,
  placeholder,
  icon,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-white/80 mb-2">
        {label}
        {required ? <span className="text-red-400 ml-1">*</span> : null}
      </label>
      <div className="relative">
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          className={`w-full bg-[#0D0D0D] border rounded-lg ${icon ? "pl-9" : "pl-4"} pr-4 h-12 text-white placeholder:text-white/40 focus:outline-none transition-colors ${
            error ? "border-red-500/60" : "border-[#444] focus:border-[#C5A572]"
          }`}
        />
      </div>
      {error ? (
        <p className="text-red-400 text-xs mt-1.5" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
