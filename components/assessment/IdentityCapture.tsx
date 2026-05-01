"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { User, Mail, Phone, MapPin } from "lucide-react";

export interface IdentityFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
}

export type IdentityMode = "mini" | "full";

export interface IdentityCaptureProps {
  /**
   * mini  - Only `firstName`. Shown right after the eligibility gate so we can
   *         personalise the test and have a name on the row even if the user
   *         abandons mid-test.
   * full  - `lastName`, `email`, `phone`, `city`. Shown after the last question,
   *         before the scorecard reveal. firstName is greeted in the heading.
   */
  mode: IdentityMode;
  initial: Partial<IdentityFields>;
  onSubmit: (fields: Partial<IdentityFields>) => void;
}

const PHONE_RE = /^[+]?[0-9\s-]{10,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function IdentityCapture({ mode, initial, onSubmit }: IdentityCaptureProps) {
  const reduceMotion = useReducedMotion();
  const fade = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [errors, setErrors] = useState<Partial<Record<keyof IdentityFields, string>>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Partial<Record<keyof IdentityFields, string>> = {};

    if (mode === "mini") {
      if (!firstName.trim()) next.firstName = "Name is required";
    } else {
      if (!email.trim()) next.email = "Email is required";
      else if (!EMAIL_RE.test(email.trim())) next.email = "Enter a valid email";
      if (!phone.trim()) next.phone = "Phone is required";
      else if (!PHONE_RE.test(phone.trim().replace(/\s/g, "")))
        next.phone = "Enter a valid phone number";
      if (!city.trim()) next.city = "City is required";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (mode === "mini") {
      // We capture a single name field; backend keeps the firstName slot for
      // historical reasons. lastName intentionally stays empty.
      onSubmit({ firstName: firstName.trim() });
    } else {
      onSubmit({
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
      });
    }
  }

  // Greet by the first word of the captured name so "John Doe" reads as "John"
  // in the headline.
  const greetingName = (initial.firstName ?? firstName).trim().split(/\s+/)[0];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        {...fade}
        transition={{ duration: 0.5 }}
        className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8"
      >
        <div className="absolute -top-3 left-6">
          <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            {mode === "mini" ? "Welcome" : "Almost done"}
          </span>
        </div>

        {mode === "mini" ? (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-2">
              What should we call you?
            </h2>
            <p className="text-white/60 mb-8">
              Just your first name to start. We will ask for the rest after the
              test so we can send your scorecard.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-2">
              {greetingName ? `Almost done, ${greetingName}.` : "Almost done."}
            </h2>
            <p className="text-white/60 mb-8">
              A few more details so we can send your scorecard and personalised
              guidance from our team.
            </p>
          </>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {mode === "mini" ? (
            <Field
              id="name"
              label="Name"
              icon={<User className="w-4 h-4 text-white/40" />}
              required
              value={firstName}
              onChange={(v) => {
                setFirstName(v);
                setErrors((p) => ({ ...p, firstName: undefined }));
              }}
              error={errors.firstName}
              placeholder="Your name"
              autoComplete="name"
              autoFocus
            />
          ) : (
            <>
              <Field
                id="email"
                label="Email"
                type="email"
                icon={<Mail className="w-4 h-4 text-white/40" />}
                required
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setErrors((p) => ({ ...p, email: undefined }));
                }}
                error={errors.email}
                placeholder="you@email.com"
                autoComplete="email"
                autoFocus
              />
              <Field
                id="phone"
                label="Phone (with country code)"
                type="tel"
                icon={<Phone className="w-4 h-4 text-white/40" />}
                required
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  setErrors((p) => ({ ...p, phone: undefined }));
                }}
                error={errors.phone}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
              <Field
                id="city"
                label="City"
                icon={<MapPin className="w-4 h-4 text-white/40" />}
                required
                value={city}
                onChange={(v) => {
                  setCity(v);
                  setErrors((p) => ({ ...p, city: undefined }));
                }}
                error={errors.city}
                placeholder="Bangalore"
                autoComplete="address-level2"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-[#C5A572] text-[#1A1A1A] py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            {mode === "mini" ? "Start the PAT" : "View my scorecard"}
          </button>

          <p className="text-white/40 text-xs text-center">
            {mode === "mini"
              ? "20 questions, about 3 minutes. Your answers are private."
              : "Your information is secure and will not be shared with third parties."}
          </p>
        </form>
      </motion.div>
    </div>
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
  autoFocus?: boolean;
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
  autoFocus,
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
          autoFocus={autoFocus}
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
