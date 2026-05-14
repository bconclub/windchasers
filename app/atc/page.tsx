"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Clock,
  User,
  Calculator,
  Building,
  BookOpen,
  Mic,
  GraduationCap,
  Radio,
  Signal,
  BarChart,
  ClipboardList,
  Headphones,
  ChevronDown,
  MessageSquare,
  Target,
  FlaskConical,
  Cpu,
  CalendarCheck,
  Phone,
} from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { getTrackingData, getLandingPage, getStoredReferrer } from "@/lib/tracking";

const PROGRAM_CATEGORIES = [
  {
    badge: "Foundation",
    icon: BookOpen,
    items: [
      "150 hours structured prep",
      "Aviation Physics and Maths",
      "Strong foundation with PYQ mastery",
    ],
  },
  {
    badge: "Language and Communication",
    icon: MessageSquare,
    items: [
      "Cambridge Aviation English Trainer",
      "Voice test training",
      "RTR Fundamentals",
    ],
  },
  {
    badge: "Expert Instruction",
    icon: GraduationCap,
    items: [
      "Expert SME Trainers",
      "Live interactive classes (no recordings)",
      "ATC Facility Visit",
    ],
  },
  {
    badge: "Exam Readiness",
    icon: Target,
    items: [
      "Mock tests and intensive revisions",
      "Practice system and performance tracking",
      "Personal mentorship and 24/7 accessibility",
    ],
  },
];

const ELIGIBILITY = [
  {
    icon: FlaskConical,
    title: "B.Sc graduates",
    subtext: "Physics and Mathematics background required.",
  },
  {
    icon: Cpu,
    title: "B.E / B.Tech graduates",
    subtext: "Any branch. Physics and Maths at 10+2 level.",
  },
  {
    icon: CalendarCheck,
    title: "Final-year students",
    subtext: "Applications accepted before graduation.",
  },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  qualification: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function ATCPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { sessionId, utmParams } = useTracking();
  const formRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLIFrameElement>(null);
  const mobileVideoRef = useRef<HTMLIFrameElement>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  const sendVimeoCommand = (iframeRef: React.RefObject<HTMLIFrameElement>, method: string, value?: number) => {
    if (!iframeRef.current?.contentWindow) return;
    const msg: Record<string, unknown> = { method };
    if (value !== undefined) msg.value = value;
    iframeRef.current.contentWindow.postMessage(JSON.stringify(msg), "https://player.vimeo.com");
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncViewport = () => setIsDesktopViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useEffect(() => {
    const activeRef = isDesktopViewport ? desktopVideoRef : mobileVideoRef;
    const inactiveRef = isDesktopViewport ? mobileVideoRef : desktopVideoRef;

    sendVimeoCommand(activeRef, "setVolume", isMuted ? 0 : 1);
    sendVimeoCommand(inactiveRef, "setVolume", 0);
    sendVimeoCommand(inactiveRef, "pause");
  }, [isMuted, isDesktopViewport]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    qualification: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const scrollToHighlights = () => {
    const highlights = document.getElementById("program-highlights");
    highlights?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[/+]?[0-9\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const trackingData = getTrackingData();
      // Dedicated route → Google Sheet tab "ATC Web Lead" (A:I) + Proxe backup (see app/api/atc/route.ts)
      const res = await fetch("/api/atc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          qualification: formData.qualification,
          sessionId,
          utmParams,
          referrer: getStoredReferrer(),
          landingPage: getLandingPage(),
          pageViews: trackingData.pageViews,
          formSubmissions: trackingData.formSubmissions,
        }),
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok || payload.success === false) {
        throw new Error(
          typeof payload.error === "string" ? payload.error : "Submission failed. Please try again."
        );
      }

      if (typeof payload.warning === "string" && payload.warning.length > 0) {
        // Keep the UX unblocked when backup save succeeds but Sheets is unavailable.
        console.warn("ATC submission warning:", payload.warning);
      }

      const thankYouData = {
        program: "ATC",
        name: formData.name.trim(),
        city: formData.city.trim(),
        qualification: formData.qualification,
      };
      router.push(
        `/thank-you?type=atc&data=${encodeURIComponent(JSON.stringify(thankYouData))}`
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again or contact us on WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const transitionDuration = shouldReduceMotion ? 0 : undefined;

  return (
    <>
      {/* Section 1: Hero */}
      <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/facility/WC1.webp"
            alt="ATC Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/90 to-dark" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left order-1">
              <motion.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
                className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2 mb-4"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-400 text-sm font-medium">Admissions Open</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                Become an Air Traffic Controller.
              </motion.h1>

              <motion.p
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
                className="text-lg text-gray-400 mb-10 max-w-lg mx-auto md:mx-0"
              >
                Structured ATC preparation with expert trainers, live classes, and a clear path to one of aviation&apos;s most critical careers.
              </motion.p>

              <motion.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
                className="flex justify-center md:justify-start"
              >
                <button
                  onClick={scrollToForm}
                  className="bg-[#C5A572] text-[#1A1A1A] px-8 py-4 rounded-lg font-semibold text-base hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
                >
                  Check Eligibility
                </button>
              </motion.div>
            </div>

            {/* Right Content - Vimeo Video (Desktop) */}
            <div className="hidden md:flex order-2 justify-center">
              <div className="w-[340px] h-[600px] rounded-[24px] overflow-hidden relative shadow-2xl">
                <iframe
                  ref={desktopVideoRef}
                  className="w-full h-full object-cover rounded-[24px]"
                  src="https://player.vimeo.com/video/1181225660?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&loop=1&background=1"
                  title="ATC Training Video"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="eager"
                  style={{ pointerEvents: "none" }}
                />
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Video */}
          <div className="md:hidden w-full max-w-[340px] h-[520px] rounded-[24px] overflow-hidden mx-auto mt-12 relative shadow-2xl">
            <iframe
              ref={mobileVideoRef}
              className="w-full h-full object-cover rounded-[24px]"
              src="https://player.vimeo.com/video/1181225660?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&loop=1&background=1"
              title="ATC Training Video"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              style={{ pointerEvents: "none" }}
            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Program Highlights */}
      <section id="program-highlights" className="py-20 px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
          >
            What the program includes
          </motion.h2>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-2xl mx-auto"
          >
            Comprehensive training designed to prepare you for a successful ATC career
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6">
            {PROGRAM_CATEGORIES.map(({ badge, icon: Icon, items }, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.1 }}
                className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 min-h-[240px] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
              >
                {/* Gold Badge */}
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {badge}
                  </span>
                </div>

                {/* Primary Icon */}
                <div className="mb-5 mt-2">
                  <Icon className="w-8 h-8 text-[#C5A572]" />
                </div>

                {/* Items List */}
                <ul className="space-y-3">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A572] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Eligibility */}
      <section className="py-20 px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-white"
          >
            Who can apply
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {ELIGIBILITY.map(({ icon: Icon, title, subtext }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.1 }}
                className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 min-h-[200px] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-[#C5A572]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#C5A572] transition-colors">
                  {title}
                </h3>

                {/* Subtext */}
                <p className="text-white/60 text-sm leading-relaxed">
                  {subtext}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Program Fee */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A]">
        <motion.div
          initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: transitionDuration ?? 0.6 }}
          className="text-center"
        >
          <p className="text-[#C5A572] text-xs uppercase tracking-[3px] mb-4 font-medium">Investment</p>
          <p className="text-4xl md:text-6xl font-bold text-[#C5A572] mb-4">
            Program Fee: ₹75,000
          </p>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
            Limited seats available. Start your ATC preparation with the right guidance.
          </p>
          <button
            onClick={scrollToHighlights}
            className="bg-[#C5A572] text-[#1A1A1A] px-12 py-4 rounded-lg font-semibold text-lg hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            See What&apos;s Included
          </button>
        </motion.div>
      </section>

      {/* Section 5: Lead Form */}
      <section ref={formRef} id="atc-form" className="py-20 px-6 lg:px-8 bg-[#1A1A1A] scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              Check Eligibility
            </h2>
            <p className="text-gray-400 text-center mb-10">
              Fill in your details and we will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} noValidate className="bg-[#252525] border border-white/10 rounded-xl p-8 space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((f) => ({ ...f, name: e.target.value }));
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={errors.name ? "true" : "false"}
                    className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1.5" role="alert">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-300 mb-2">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((f) => ({ ...f, phone: e.target.value }));
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    aria-invalid={errors.phone ? "true" : "false"}
                    className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1.5" role="alert">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((f) => ({ ...f, email: e.target.value }));
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={errors.email ? "true" : "false"}
                    className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1.5" role="alert">{errors.email}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Bangalore"
                    value={formData.city}
                    onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                    className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label htmlFor="qualification" className="block text-sm text-gray-300 mb-2">
                    Current Qualification
                  </label>
                  <div className="relative">
                    <select
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => setFormData((f) => ({ ...f, qualification: e.target.value }))}
                      className="w-full bg-[#1A1A1A] border border-[#444] rounded-lg px-4 h-12 text-white focus:outline-none focus:border-[#C5A572] transition-colors appearance-none pr-10"
                    >
                      <option value="">Select your qualification</option>
                      <option value="B.Sc Physics/Maths">B.Sc Physics/Maths</option>
                      <option value="B.E/B.Tech">B.E/B.Tech</option>
                      <option value="Final year student">Final year student</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-200">
                    <p className="mb-2">{submitError}</p>
                    <a
                      href={`https://wa.me/919591004043?text=${encodeURIComponent("Hi WindChasers, I want to know more about ATC at your academy")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#C5A572] hover:underline font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.35-.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contact us on WhatsApp
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C5A572] text-[#1A1A1A] h-12 rounded-lg font-semibold text-lg hover:bg-[#C5A572]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#252525]"
                >
                  {isSubmitting ? "Submitting..." : "Check Eligibility"}
                </button>

                <p className="text-white/40 text-xs text-center">
                  Your information is secure and will not be shared with third parties.
                </p>
              </form>
          </motion.div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <button
          onClick={scrollToForm}
          className="w-full bg-[#C5A572] text-black py-3 rounded-lg font-semibold text-base hover:bg-[#C5A572]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
        >
          Check Eligibility
        </button>
      </div>

    </>
  );
}
