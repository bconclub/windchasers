"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  CheckCircle2,
  Globe,
  MessageSquare,
  Plane,
  Shield,
  Sparkles,
  Star,
  User,
} from "lucide-react";

type TimelineOption =
  | ""
  | "Immediately"
  | "Within 3 months"
  | "3 to 6 months"
  | "Not sure";

interface CabinCrewPageClientProps {
  heroVideoSrc: string | null;
  galleryImages: string[];
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  completed12th: "Yes" | "No";
  age18plus: "Yes" | "No";
  joiningTimeline: TimelineOption;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  joiningTimeline?: string;
}

const HIGHLIGHTS = [
  {
    icon: Shield,
    title: "Safety and Survival Training",
    description: "Handle emergencies with confidence. DGCA-aligned safety protocols.",
  },
  {
    icon: Star,
    title: "Customer Service Mastery",
    description: "Deliver five-star in-flight experiences. Passenger handling and conflict resolution.",
  },
  {
    icon: Globe,
    title: "Global Awareness",
    description: "Navigate diverse cultures, languages, and international service standards.",
  },
  {
    icon: Sparkles,
    title: "Professional Image",
    description: "Grooming, posture, and presentation workshops. First impressions matter.",
  },
  {
    icon: Plane,
    title: "Mock Flights",
    description: "Simulate real cabin scenarios before your first actual flight.",
  },
  {
    icon: Briefcase,
    title: "Placement Assistance",
    description: "Direct connections to airline recruiters. Mock interviews and career prep.",
  },
];

const ELIGIBILITY = [
  {
    icon: User,
    title: "18 years and above",
    description: "Open to all genders.",
  },
  {
    icon: BookOpen,
    title: "Completed 12th",
    description: "Any stream. Science not required.",
  },
  {
    icon: MessageSquare,
    title: "English proficiency",
    description: "Conversational English required. Other languages are a plus.",
  },
];

export default function CabinCrewPageClient({
  heroVideoSrc,
  galleryImages,
}: CabinCrewPageClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    completed12th: "Yes",
    age18plus: "Yes",
    joiningTimeline: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const ineligible = useMemo(
    () => formData.completed12th === "No" || formData.age18plus === "No",
    [formData.completed12th, formData.age18plus]
  );

  const scrollToForm = () => {
    document.getElementById("cabin-crew-form")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (!/^[/+]?[0-9\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!formData.city.trim()) {
      nextErrors.city = "City is required.";
    }
    if (!formData.joiningTimeline) {
      nextErrors.joiningTimeline = "Please select when you want to start.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setErrors({});

    if (ineligible) {
      setSubmitError(
        "This program requires candidates who are 18 or above and have completed 12th. Explore our other programs at windchasers.in."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/cabin-crew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          completed12th: formData.completed12th,
          age18plus: formData.age18plus,
          joiningTimeline: formData.joiningTimeline,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.success === false) {
        throw new Error(
          typeof payload.error === "string"
            ? payload.error
            : "Submission failed. Please try again."
        );
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        completed12th: "Yes",
        age18plus: "Yes",
        joiningTimeline: "",
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please contact us on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="min-h-screen bg-[#1A1A1A] pt-24 pb-12 px-6 lg:px-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.6 }}
          >
            <p className="text-[#C5A572] text-xs uppercase tracking-[3px] font-semibold mb-4">
              AVIATION CAREERS
            </p>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Your career at 35,000 feet starts here.
            </h1>
            <p className="text-white/75 text-lg leading-relaxed max-w-xl mb-8">
              Cabin crew training designed to get you job-ready. Placement assistance. Airline
              connections. Real mock flights.
            </p>
            <button
              type="button"
              onClick={scrollToForm}
              className="bg-[#C5A572] text-[#1A1A1A] px-8 py-3.5 rounded-lg font-semibold hover:bg-[#C5A572]/90 transition-colors"
            >
              Apply Now
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="w-full"
          >
            {heroVideoSrc ? (
              <video
                src={heroVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-[58vh] md:h-[72vh] object-cover"
              />
            ) : (
              <div className="w-full h-[58vh] md:h-[72vh] bg-black/30 rounded-lg flex items-center justify-center text-white/60 text-sm">
                Cabin crew video will appear here when a .mp4 file is added to public/cabin-crew.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: "High demand",
              text: "Airlines are actively hiring. Trained cabin crew get placed faster.",
            },
            {
              title: "Travel the world",
              text: "Fly domestic and international routes from day one.",
            },
            {
              title: "Affordable training",
              text: "No debt required. Quality training at accessible fees.",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
              className="bg-[#1A1A1A] border border-[#C5A572]/40 rounded-xl p-6"
            >
              <h3 className="text-[#C5A572] text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-12">What you learn</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                className="bg-[#202020] border-t-2 border-[#C5A572] rounded-xl p-5 md:p-6"
              >
                <Icon className="w-7 h-7 text-[#C5A572] mb-4" />
                <h3 className="text-white font-semibold mb-2 leading-snug">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-12">Who this is for</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {ELIGIBILITY.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : index * 0.07 }}
                className="bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-6"
              >
                <Icon className="w-7 h-7 text-[#C5A572] mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
                <p className="text-white/70 text-sm">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#141414]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10">
            Life at WindChasers
          </h2>
          {galleryImages.length > 0 ? (
            <motion.div
              className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -400, right: 0 }}
              whileTap={{ cursor: "grabbing" }}
            >
              {galleryImages.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Life at WindChasers cabin crew training"
                  className="h-[260px] w-auto object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />
              ))}
            </motion.div>
          ) : (
            <p className="text-white/60 text-center">
              Add image files to public/cabin-crew to populate this gallery.
            </p>
          )}
        </div>
      </section>

      <section id="cabin-crew-form" className="py-20 px-6 lg:px-8 bg-[#1A1A1A] scroll-mt-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-3">
            Start your application.
          </h2>
          <p className="text-white/70 text-center mb-8">
            Fill in your details. Our team will reach out within 24 hours.
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-[#232323] border border-white/10 rounded-xl p-6 md:p-8 space-y-5"
          >
            {[
              { id: "name", label: "Name", type: "text", value: formData.name, error: errors.name },
              { id: "phone", label: "Phone", type: "tel", value: formData.phone, error: errors.phone },
              { id: "email", label: "Email", type: "email", value: formData.email, error: errors.email },
              { id: "city", label: "City", type: "text", value: formData.city, error: errors.city },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm text-white/80 mb-1.5">
                  {field.label} <span className="text-red-400">*</span>
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  required
                  value={field.value}
                  onChange={(event) => {
                    const value = event.target.value;
                    setFormData((prev) => ({ ...prev, [field.id]: value }));
                    setErrors((prev) => ({ ...prev, [field.id]: undefined }));
                  }}
                  className="w-full h-11 rounded-lg bg-[#1A1A1A] border border-white/20 px-4 text-white focus:outline-none focus:border-[#C5A572]"
                />
                {field.error && <p className="text-red-400 text-sm mt-1.5">{field.error}</p>}
              </div>
            ))}

            <div>
              <p className="block text-sm text-white/80 mb-2">Completed 12th</p>
              <div className="grid grid-cols-2 gap-3">
                {(["Yes", "No"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, completed12th: option }))}
                    className={`h-11 rounded-lg border transition-colors ${
                      formData.completed12th === option
                        ? "bg-[#C5A572] text-[#1A1A1A] border-[#C5A572]"
                        : "bg-[#1A1A1A] text-white border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="block text-sm text-white/80 mb-2">Age 18+</p>
              <div className="grid grid-cols-2 gap-3">
                {(["Yes", "No"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, age18plus: option }))}
                    className={`h-11 rounded-lg border transition-colors ${
                      formData.age18plus === option
                        ? "bg-[#C5A572] text-[#1A1A1A] border-[#C5A572]"
                        : "bg-[#1A1A1A] text-white border-white/20"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="joiningTimeline" className="block text-sm text-white/80 mb-1.5">
                When do you want to start? <span className="text-red-400">*</span>
              </label>
              <select
                id="joiningTimeline"
                required
                value={formData.joiningTimeline}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    joiningTimeline: event.target.value as TimelineOption,
                  }));
                  setErrors((prev) => ({ ...prev, joiningTimeline: undefined }));
                }}
                className="w-full h-11 rounded-lg bg-[#1A1A1A] border border-white/20 px-4 text-white focus:outline-none focus:border-[#C5A572]"
              >
                <option value="">Select timeline</option>
                <option value="Immediately">Immediately</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="3 to 6 months">3 to 6 months</option>
                <option value="Not sure">Not sure</option>
              </select>
              {errors.joiningTimeline && (
                <p className="text-red-400 text-sm mt-1.5">{errors.joiningTimeline}</p>
              )}
            </div>

            {ineligible && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
                This program requires candidates who are 18 or above and have completed 12th.
                Explore our other programs at windchasers.in.
              </div>
            )}

            {submitError && !ineligible && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
                <p className="mb-2">{submitError}</p>
                <a
                  href={`https://wa.me/919591004043?text=${encodeURIComponent(
                    "Hi WindChasers, I want to know more about the Cabin Crew program."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A572] hover:underline"
                >
                  Chat on WhatsApp
                </a>
              </div>
            )}

            {submitSuccess && (
              <div className="rounded-lg border border-[#C5A572]/40 bg-[#C5A572]/10 p-4 text-sm text-[#EED9B6] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#C5A572]" />
                <span>We&apos;ll reach out within 24 hours.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || ineligible}
              className="w-full h-12 rounded-lg bg-[#C5A572] text-[#1A1A1A] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C5A572]/90 transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Apply Now"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
