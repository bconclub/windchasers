"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronDown,
  AlertTriangle,
  Route,
  Award,
  Briefcase,
  GitCompare,
  Wallet,
  GraduationCap,
  Users,
  CheckCircle,
} from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { getTrackingData, getLandingPage, getStoredReferrer } from "@/lib/tracking";
import oh1 from "@/public/open house/Open HOuse 1.jpg";
import oh2 from "@/public/open house/Open Houe 2.jpg";
import ohApr from "@/public/open house/WC Open house April 15.jpg";
import ohApr1 from "@/public/open house/WC Open house April 15 1.jpg";
import ohApr2 from "@/public/open house/WC Open house April 15 2.jpg";
import ohNov from "@/public/open house/WC November 2024.jpg";

// URL-encode filenames from public/open house/
const asset = (filename: string) =>
  `/open%20house/${encodeURIComponent(filename)}`;

const TOPICS = [
  { Icon: Route, title: "Step-by-step roadmap", desc: "The exact path from completing 12th to holding a CPL. No gaps." },
  { Icon: Award, title: "Life after CPL", desc: "What happens the day you get your licence. Real timelines, real expectations." },
  { Icon: Briefcase, title: "Career path after CPL", desc: "Airlines, charters, cargo, instructing. What each path looks like." },
  { Icon: GitCompare, title: "Cadet programme vs CPL", desc: "Two routes to the cockpit. Which one is right for you." },
  { Icon: Wallet, title: "Money talk: what is the real cost?", desc: "Full cost breakdown. Training, exams, medicals, everything." },
  { Icon: AlertTriangle, title: "Biggest mistakes student pilots make", desc: "What trips most aspirants up and how to avoid it." },
];

const INSTRUCTORS = [
  {
    initials: "SC",
    name: "Senior Captain",
    role: "Former Air India Captain",
    cred: "15,000+ hours",
    desc: "Active airline experience",
  },
  {
    initials: "DG",
    name: "DGCA Instructor",
    role: "DGCA Certified Instructor",
    cred: "Ground school specialist",
    desc: "Ground school specialists",
  },
  {
    initials: "SI",
    name: "Simulator Expert",
    role: "Simulator Instructor",
    cred: "Type-rated trainer",
    desc: "Hands-on training experts",
  },
];

const WHO_SHOULD_ATTEND = [
  {
    Icon: GraduationCap,
    headline: "Students Ready to Fly",
    subtext: "Completed 12th grade or in final year. Serious about starting CPL training in 2026.",
    bullets: ["Want clear roadmap", "Need cost clarity", "Exploring cadet vs CPL routes"],
  },
  {
    Icon: Users,
    headline: "Supportive Parents",
    subtext: "Want to understand investment, safety, and career prospects before your child commits.",
    bullets: ["Full cost breakdown", "Career stability info", "Training safety standards"],
  },
];

const TRUST_BADGES = [
  "DGCA Certified Training Organization",
  "500+ Commercial Pilots Trained",
  "FAA & Ex-Air Force Instructors",
];

const GALLERY_VIDEOS = [
  "Open hosue 5.mp4",
  "Open House May 4.mp4",
  "SnapInsta.to_AQON7tga2fQpN5m1Ud2WRyJKpvSyLHIidvDWsvuwpiCkZlV0-oAIHCUrfCjBi0pnxOD1ddsZQWYg71BiH30ZQEpYCzwwF-1YKkrWFY0.mp4",
  "WC Open House Nove 2024.mp4",
];

const GALLERY_IMAGES = [
  { src: oh1, alt: "Open house attendees listening to presentations", position: "center" },
  { src: oh2, alt: "Commercial pilot answering student questions", position: "center" },
  { src: ohApr, alt: "Students and parents at WindChasers open house", position: "center" },
  { src: ohApr1, alt: "Hands-on simulator experience at open house", position: "center" },
  { src: ohApr2, alt: "Instructor explaining career paths to attendees", position: "center" },
  { src: ohNov, alt: "November open house presentation session", position: "top center" },
];

type Role = "" | "student" | "parent";

type Status =
  | ""
  | "Completed 12th"
  | "Pursuing 12th"
  | "Graduate or above"
  | "Below 12th";

interface FormState {
  name: string;
  phone: string;
  email: string;
  status: Status;
  city: string;
  parentAttending: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  status?: string;
  city?: string;
  role?: string;
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

function GalleryVideo({ src, index }: { src: string; index: number }) {
  const { ref, isInView } = useInView<HTMLVideoElement>();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.video
      ref={ref}
      key={src}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: index * 0.1 }}
      src={asset(src)}
      autoPlay={!shouldReduceMotion && isInView}
      muted
      loop
      playsInline
      className="flex-none w-72 h-48 rounded-xl object-cover snap-start lg:w-full lg:h-64"
    />
  );
}

export default function OpenHousePage() {
  const router = useRouter();
  const { sessionId, utmParams } = useTracking();
  const shouldReduceMotion = useReducedMotion();

  const [role, setRole] = useState<Role>("");
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    status: "",
    city: "",
    parentAttending: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  useEffect(() => {
    document.title =
      "Pilot Career Open House Bangalore · April 11 · WindChasers";
  }, []);

  useEffect(() => {
    if (!blocked) return;
    const t = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(t);
  }, [blocked, router]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!role) {
      newErrors.role = "Please select whether you are a student or a parent.";
    }

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[/+]?[0-9\s-]{10,}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (role === "student" && !form.status) {
      newErrors.status = "Please select your current status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, role]);

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    if (!validateForm()) {
      return;
    }

    if (role === "student" && form.status === "Below 12th") {
      setBlocked(true);
      return;
    }

    setSubmitting(true);
    try {
      const trackingData = getTrackingData();
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          role,
          status: role === "student" ? form.status : "",
          parentAttending: role === "student" ? form.parentAttending : null,
          source: "open-house",
          sessionId,
          utmParams,
          ...utmParams,
          referrer: getStoredReferrer(),
          landing_page: getLandingPage(),
          pageViews: trackingData.pageViews,
          formSubmissions: trackingData.formSubmissions,
          userInfo: trackingData.userInfo,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      router.push("/thank-you?type=open-house");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };

  const transitionDuration = shouldReduceMotion ? 0 : undefined;
  const { ref: heroRef, isInView: heroInView } = useInView<HTMLElement>();

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          {heroInView && (
            <iframe
              className="absolute top-1/2 left-[70%] md:left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-0"
              src="https://player.vimeo.com/video/1160946921?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&background=1"
              title="Aviation Background"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              style={{ pointerEvents: "none" }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/60 to-black/80 z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-20">
          <motion.h1
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8 }}
            className="text-[32px] md:text-5xl lg:text-[48px] font-bold mb-6 leading-tight text-white"
          >
            Bangalore&apos;s Only{" "}
            <span className="text-[#C5A572]">Pilot Career Open House</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="text-base md:text-xl text-gray-300 mb-8 font-normal"
          >
            Where Bangalore&apos;s future pilots are made.
          </motion.p>

          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.35 }}
            className="text-base text-[#C5A572] mb-10 tracking-[1px]"
          >
            April 11, 2026 · 11:30 AM onwards · WindChasers HQ, Bangalore
          </motion.p>

          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.5 }}
          >
            <button
              onClick={scrollToRegister}
              className="bg-[#C5A572] text-black px-10 py-4 rounded-lg font-semibold text-lg hover:bg-[#C5A572]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Reserve Your Spot
            </button>
          </motion.div>
        </div>
      </section>

      {/* Topics covered */}
      <section className="py-20 px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#C5A572]"
          >
            Topics covered
          </motion.h2>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.15 }}
            className="text-gray-400 text-center text-lg mb-14"
          >
            One morning. Every answer you need.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.map(({ title, desc, Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-lg p-8 hover:-translate-y-1 hover:shadow-xl hover:border-t-[3px] transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-[#C5A572] mb-4" />
                <h3 className="text-white font-semibold text-lg mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Instructors */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-[#C5A572]"
          >
            Meet Our Instructors
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INSTRUCTORS.map(({ initials, name, role, cred, desc }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="rounded-lg p-10 text-center bg-[#1A1A1A]/60 border border-white/5"
              >
                <div className="w-[120px] h-[120px] mx-auto rounded-full bg-gradient-to-br from-[#C5A572] to-[#8a6d43] flex items-center justify-center text-black font-bold text-2xl mb-4">
                  {initials}
                </div>
                <h3 className="text-white font-semibold text-base mb-1">{name}</h3>
                <p className="text-[#C5A572] text-sm mb-1">{role}</p>
                <p className="text-gray-500 text-xs mb-4">{cred}</p>
                <p className="text-gray-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section className="py-20 px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-[#C5A572]"
          >
            Who Should Attend
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHO_SHOULD_ATTEND.map(({ Icon, headline, subtext, bullets }, i) => (
              <motion.div
                key={headline}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="bg-[#252525] border-l-4 border-[#C5A572] rounded-r-lg p-8"
              >
                <Icon className="w-10 h-10 text-[#C5A572] mb-4" />
                <h3 className="text-white font-semibold text-xl mb-2">{headline}</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">{subtext}</p>
                <ul className="space-y-2">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A572] mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section
        id="register"
        className="py-20 px-6 lg:px-8 bg-[#1A1A1A] scroll-mt-20"
      >
        <div className="max-w-[600px] mx-auto">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-3 text-[#C5A572]">
              Secure Your Seat
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Only 30 seats available · April 11, 2026 · 11:30 AM
            </p>

            {/* Scarcity bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Seats filling fast</span>
                <span>72% full</span>
              </div>
              <div className="h-2 w-full bg-[#333] rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-[#C5A572] rounded-full" />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {TRUST_BADGES.map((badge) => (
                <div key={badge} className="flex items-center gap-2 bg-[#252525] border border-white/10 rounded-full px-4 py-2 text-xs text-gray-300">
                  <CheckCircle className="w-4 h-4 text-[#C5A572]" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>

            {blocked ? (
              <motion.div
                initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : undefined }}
                className="rounded-lg border border-white/10 bg-[#252525] p-8 text-center"
                role="alert"
              >
                <p className="text-white/90 text-lg leading-relaxed mb-3">
                  This open house is exclusively for students who have completed
                  12th or above. Visit our homepage to explore how to prepare.
                </p>
                <p className="text-white/60 text-sm">
                  Redirecting you{" "}
                  <span className="text-[#C5A572]">shortly...</span>
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Role selector */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    I am a… <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Select your role">
                    {(["student", "parent"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setRole(r);
                          setErrors((prev) => ({ ...prev, role: undefined }));
                        }}
                        aria-checked={role === r}
                        role="radio"
                        className={`py-3 rounded-full font-medium text-sm capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 ${
                          role === r
                            ? "bg-[#C5A572] text-black"
                            : "bg-[#252525] border border-white/10 text-gray-300 hover:border-white/30"
                        }`}
                      >
                        {r === "student" ? "Student / Aspiring Pilot" : "Parent / Guardian"}
                      </button>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-red-400 text-sm mt-1.5" role="alert">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm text-gray-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-sm mt-1.5" role="alert">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-300 mb-1.5">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-1.5">We&apos;ll send venue details and reminder on WhatsApp</p>
                  {errors.phone && (
                    <p id="phone-error" className="text-red-400 text-sm mt-1.5" role="alert">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-300 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-400 text-sm mt-1.5" role="alert">{errors.email}</p>
                  )}
                </div>

                {role === "student" && (
                  <div>
                    <label htmlFor="status" className="block text-sm text-gray-300 mb-1.5">
                      Current Status <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="status"
                        required
                        value={form.status}
                        onChange={(e) => {
                          setForm((f) => ({
                            ...f,
                            status: e.target.value as Status,
                          }));
                          setErrors((prev) => ({ ...prev, status: undefined }));
                        }}
                        aria-invalid={errors.status ? "true" : "false"}
                        aria-describedby={errors.status ? "status-error" : undefined}
                        className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-12 text-white focus:outline-none focus:border-[#C5A572] transition-colors appearance-none pr-10"
                      >
                        <option value="" disabled>
                          Select your status
                        </option>
                        <option value="Completed 12th">Completed 12th</option>
                        <option value="Pursuing 12th">Pursuing 12th</option>
                        <option value="Graduate or above">Graduate or above</option>
                        <option value="Below 12th">Below 12th</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    </div>
                    {errors.status && (
                      <p id="status-error" className="text-red-400 text-sm mt-1.5" role="alert">{errors.status}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="city" className="block text-sm text-gray-300 mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    placeholder="Bangalore"
                    value={form.city}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, city: e.target.value }));
                      setErrors((prev) => ({ ...prev, city: undefined }));
                    }}
                    aria-invalid={errors.city ? "true" : "false"}
                    aria-describedby={errors.city ? "city-error" : undefined}
                    className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors"
                  />
                  {errors.city && (
                    <p id="city-error" className="text-red-400 text-sm mt-1.5" role="alert">{errors.city}</p>
                  )}
                </div>

                {role === "student" && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Will a parent or guardian be attending?
                    </label>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Parent attending">
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, parentAttending: false }))}
                        aria-checked={!form.parentAttending}
                        role="radio"
                        className={`py-3 rounded-full font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 ${
                          !form.parentAttending
                            ? "bg-[#C5A572] text-black"
                            : "bg-[#252525] border border-white/10 text-gray-300 hover:border-white/30"
                        }`}
                      >
                        Student Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, parentAttending: true }))}
                        aria-checked={form.parentAttending}
                        role="radio"
                        className={`py-3 rounded-full font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 ${
                          form.parentAttending
                            ? "bg-[#C5A572] text-black"
                            : "bg-[#252525] border border-white/10 text-gray-300 hover:border-white/30"
                        }`}
                      >
                        Student + Parent
                      </button>
                    </div>
                  </div>
                )}

                {submitError && (
                  <p className="text-red-400 text-sm text-center" role="alert">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#C5A572] text-black h-12 rounded-lg font-semibold text-lg hover:bg-[#C5A572]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
                >
                  {submitting ? "Registering..." : "Register for Free"}
                </button>

                <p className="text-white/50 text-xs text-center">
                  No spam. We&apos;ll only send you event details and a reminder.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Past open houses gallery */}
      <section className="py-20 px-6 lg:px-8 bg-[#111]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-[#C5A572]"
          >
            From our past open houses
          </motion.h2>

          {/* Videos: horizontal scroll on mobile, 2-col grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0 mb-10">
            {GALLERY_VIDEOS.map((v, i) => (
              <GalleryVideo key={v} src={v} index={i} />
            ))}
          </div>

          {/* Images: uniform 16:9 grid, lightbox on click */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {GALLERY_IMAGES.map(({ src, alt, position }, i) => (
              <motion.div
                key={src.src}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : i * 0.05 }}
                className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group focus-within:ring-2 focus-within:ring-[#C5A572]/60 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-shadow"
                onClick={() => openLightbox(src.src, alt)}
              >
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full p-0 border-0 bg-transparent"
                  onClick={() => openLightbox(src.src, alt)}
                  aria-label={`View larger image: ${alt}`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.03]"
                    style={{
                      objectPosition: position,
                      transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading={i < 3 ? "eager" : "lazy"}
                    priority={i < 3}
                    placeholder="blur"
                  />
                </button>
                <div className="absolute inset-0 z-10 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-[#C5A572] font-semibold">View</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : undefined }}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 rounded p-1"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: shouldReduceMotion ? 1 : 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: shouldReduceMotion ? 1 : 0.92 }}
              transition={{ duration: shouldReduceMotion ? 0 : undefined }}
              src={lightboxSrc}
              alt={lightboxAlt}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
