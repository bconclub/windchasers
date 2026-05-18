"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  AlertTriangle,
  Route,
  Award,
  Briefcase,
  Wallet,
  GraduationCap,
  Users,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Compass,
} from "lucide-react";
import Head from "next/head";
import { useTracking } from "@/hooks/useTracking";
import { getTrackingData, getLandingPage, getStoredReferrer } from "@/lib/tracking";

const TOPICS = [
  { Icon: Compass, image: "/unsplash/nz-aviation-CjpAnjRn.jpg", title: "Why New Zealand for flight training", desc: "ICAO-recognised CAA standards, year-round flying weather, and a pipeline trusted by global airlines." },
  { Icon: Route, image: "/unsplash/cockpit-training-dI284PFy.jpg", title: "Fastest route from 12th to CPL", desc: "Exact path, exam-by-exam. Zero gaps between Class 12, NZ CPL, and the right-seat job." },
  { Icon: Wallet, image: "/unsplash/financial-planning-heiYgqp0.jpg", title: "Full cost breakdown in INR", desc: "Tuition, hours, accommodation, exams, visa, medicals. Every rupee mapped before you commit." },
  { Icon: ShieldCheck, image: "/unsplash/flight-instructor-MKh27bPC.jpg", title: "How NZ standards protect your investment", desc: "Why CAA training holds value globally and where Indian families lose money picking the wrong country." },
  { Icon: Briefcase, image: "/unsplash/airline-pilot-QtXNsDcO.jpg", title: "Career path after CPL", desc: "Returning to India, conversion to DGCA, airline cadetships, and instructor hours in NZ." },
  { Icon: AlertTriangle, image: "/nz-seminar/Parent image.webp", title: "Biggest mistakes families make", desc: "Cheap schools, missing accreditations, visa traps. What to verify before you wire a single rupee." },
];

const WHO_SHOULD_ATTEND = [
  {
    Icon: GraduationCap,
    headline: "Students Serious About Flying",
    subtext: "Completed 12th grade or in final year. Considering New Zealand for CPL training.",
    bullets: ["Want a clear NZ roadmap", "Need real cost clarity", "Want to meet schools in person"],
  },
  {
    Icon: Users,
    headline: "Parents Funding the Journey",
    subtext: "Want to understand the investment, safety record, and ROI before signing off.",
    bullets: ["Full cost & timeline breakdown", "NZ safety & training standards", "Career stability after CPL"],
  },
];

const HIGHLIGHTS = [
  { Icon: Plane, title: "Meet NZ's top flying schools", desc: "Talk directly to flight school representatives flown in for this seminar." },
  { Icon: Award, title: "1:1 sessions", desc: "Private 1:1 conversations with school heads. Your questions, your child, your budget." },
  { Icon: Compass, title: "Walk out with a plan", desc: "Leave with clarity on country, school, timeline, and the next 30 days." },
];

const SPEAKERS: Array<{
  name: string;
  role: string;
  school: string;
  initials: string;
  image: string | null;
}> = [
  {
    name: "Irene King",
    role: "CEO",
    school: "Ardmore Flying School",
    initials: "IK",
    image: "/nz-seminar/Irene King.png",
  },
  {
    name: "Anton Ramenskiy",
    role: "Senior Manager",
    school: "Auckland International Pilot Academy",
    initials: "AR",
    image: "/nz-seminar/Antony.png",
  },
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

export default function NzSeminarPage() {
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
  const registerRef = useRef<HTMLElement>(null);
  // Sticky CTA shows only between the hero and the register section. Never
  // both at the same time as the hero CTA or the form's submit button.
  const [stickyVisible, setStickyVisible] = useState(false);
  const showStickyBar = stickyVisible && !blocked;

  useEffect(() => {
    if (!blocked) return;
    // Below-12 students go to the early-stage flow instead of the seminar.
    const t = setTimeout(() => router.push("/assessment/early"), 6000);
    return () => clearTimeout(t);
  }, [blocked, router]);

  useEffect(() => {
    const updateSticky = () => {
      const register = registerRef.current;
      const heroBottom = window.innerHeight; // hero is min-h-screen, so it ends at ~viewport height from page top
      const scrolled = window.scrollY;
      // Show sticky only after the user has scrolled past the hero CTA but
      // before the register form's submit button is on screen.
      let pastHero = scrolled > heroBottom * 0.6;
      let registerVisible = false;
      if (register) {
        const r = register.getBoundingClientRect();
        registerVisible = r.top < window.innerHeight - 80 && r.bottom > 80;
      }
      setStickyVisible(pastHero && !registerVisible);
    };
    updateSticky();
    window.addEventListener("scroll", updateSticky, { passive: true });
    window.addEventListener("resize", updateSticky);
    return () => {
      window.removeEventListener("scroll", updateSticky);
      window.removeEventListener("resize", updateSticky);
    };
  }, []);

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

    // This seminar is built around what to do AFTER 12th. Students still in
    // school or below get routed to the early-stage path instead.
    if (
      role === "student" &&
      (form.status === "Below 12th" || form.status === "Pursuing 12th")
    ) {
      setBlocked(true);
      return;
    }

    setSubmitting(true);
    try {
      const trackingData = getTrackingData();
      const res = await fetch("/api/nz-seminar", {
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
          source: "nz-seminar",
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

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.success === false) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Submission failed");
      }

      const thankYouData = {
        program: "NZ Seminar",
        role,
        name: form.name.trim(),
        city: form.city.trim(),
      };
      router.push(
        `/thank-you?type=nz-seminar&data=${encodeURIComponent(JSON.stringify(thankYouData))}`
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const transitionDuration = shouldReduceMotion ? 0 : undefined;
  const { ref: heroRef } = useInView<HTMLElement>();

  return (
    <>
      <Head>
        <title>Train where the world&apos;s best pilots train · NZ Flight Training Seminar · Bangalore, May 29 · WindChasers</title>
        <meta
          name="description"
          content="Meet the New Zealand flight schools turning students into commercial pilots faster than anywhere else. Free in-person seminar, Bangalore, Fri May 29, 2026 · 3:00 PM. Only 30 seats."
        />
        <meta property="og:title" content="Train where the world&apos;s best pilots train · NZ Flight Training Seminar · Bangalore" />
        <meta
          property="og:description"
          content="Meet the New Zealand flight schools turning students into commercial pilots faster than anywhere else. Free seminar in Bangalore on May 29, 2026."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Train where the world&apos;s best pilots train · NZ Flight Training Seminar" />
        <meta
          name="twitter:description"
          content="Meet the New Zealand flight schools turning students into commercial pilots faster than anywhere else. Bangalore, May 29. Only 30 seats."
        />
      </Head>

      {/* Hero - Glass Morphism Design */}
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background. New Zealand still */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          <Image
            src="/nz-seminar/NEw Zealand.avif"
            alt="New Zealand landscape"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.25)_0%,_rgba(0,0,0,0.65)_75%)] z-10" />
        <div className="absolute inset-0 bg-black/30 z-10" />

        {/* Glass Container */}
        <div className="relative z-20 w-full px-4 md:px-0 md:mx-auto md:max-w-[720px] pt-20">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8 }}
            className="relative bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-8 md:p-12 lg:p-[48px_64px] shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent rounded-t-[24px]" />

            {/* Corner Accents */}
            <div className="absolute top-5 left-5 w-5 h-5">
              <div className="absolute top-0 left-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>
            <div className="absolute bottom-5 right-5 w-5 h-5">
              <div className="absolute bottom-0 right-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>

            {/* NZ Flag Accent */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: transitionDuration ?? 0.6 }}
              className="flex justify-center mb-5"
            >
              <div className="relative w-16 h-10 rounded-md overflow-hidden border border-white/20 shadow-lg">
                <Image
                  src="/images/flags/new-zealand-flag-png-large.png"
                  alt="New Zealand flag"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Top Label */}
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
              className="text-[#C5A572] text-xs uppercase tracking-[3px] mb-6 text-center font-medium"
            >
              May 29, 2026 · Free In-Person Seminar
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-[28px] md:text-[44px] font-bold leading-[1.15] text-white text-center"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              Train where the world&apos;s best{" "}
              <span className="text-[#C5A572]">pilots train.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
              className="text-base md:text-lg text-gray-300 font-normal text-center mt-4"
            >
              Meet the New Zealand flight schools turning students into commercial pilots faster than anywhere else.
            </motion.p>

            {/* Event Details Row */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.4 }}
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-8 mb-10"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A572]" />
                <span className="text-sm text-white">Fri, May 29, 2026</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A572]" />
                <span className="text-sm text-white">3:00 PM onwards</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A572]" />
                <span className="text-sm text-white">WindChasers, Bangalore</span>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.5 }}
              className="text-center"
            >
              <button
                onClick={scrollToRegister}
                className="bg-[#C5A572] text-[#1A1A1A] px-8 md:px-10 py-4 rounded-full font-semibold text-base hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-[0_10px_30px_rgba(197,165,114,0.3)] w-full md:w-auto"
              >
                Secure Your Seat →
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Only 30 seats · Free · Registration required
              </p>
            </motion.div>

            {/* Phone Number */}
            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.6 }}
              className="flex items-center justify-center gap-2 mt-6"
            >
              <a
                href="tel:+919591004043"
                className="flex items-center gap-2 text-white/60 hover:text-[#C5A572] transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>+91 95910 04043</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why this seminar matters */}
      <section className="py-20 px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-[1100px] mx-auto text-center">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-5 text-white"
          >
            You&apos;ll spend lakhs on flight training.
          </motion.h2>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.15 }}
            className="text-[#C5A572] text-2xl md:text-3xl font-semibold mb-8"
          >
            Spend 2 hours getting it right first.
          </motion.p>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.25 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto"
          >
            The wrong country can cost you years and a crore. This seminar exists so you walk in unsure and walk out with the right country, school, and decision.
          </motion.p>
        </div>
      </section>

      {/* Meet the speakers */}
      <section className="py-20 px-6 lg:px-8 bg-[#131313]">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-[#C5A572] text-xs uppercase tracking-[3px] font-medium mb-4">Flown in for the seminar</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#C5A572] mb-4">
              Meet the speakers
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Talk in person to the heads of two of New Zealand&apos;s top flying schools. Ask them everything about NZ.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPEAKERS.map(({ name, role, school, initials, image }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="bg-[#1A1A1A] border border-[#C5A572]/30 rounded-2xl p-8 hover:border-[#C5A572] transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-[#C5A572]/50 bg-[#252525] flex items-center justify-center flex-shrink-0">
                    {image ? (
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[#C5A572] font-bold text-2xl">{initials}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white text-xl font-bold leading-tight mb-1">{name}</h3>
                    <p className="text-[#C5A572] text-sm font-semibold mb-1">{role}</p>
                    <p className="text-gray-400 text-sm leading-snug">{school}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.25 }}
            className="text-center text-gray-500 text-sm mt-8"
          >
            More NZ flying school representatives joining the panel. Full list shared closer to the date.
          </motion.p>
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
            What we&apos;ll cover
          </motion.h2>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.15 }}
            className="text-gray-400 text-center text-lg mb-14"
          >
            Every answer you need before you wire a single rupee.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.map(({ title, desc, Icon, image }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="group bg-[#1F1F1F] border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/30 hover:-translate-y-1 hover:border-[#C5A572]/60 hover:shadow-2xl hover:shadow-[#C5A572]/10 transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-black">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center justify-center w-11 h-11 rounded-full bg-[#1F1F1F]/85 backdrop-blur-sm border border-[#C5A572]/40">
                    <Icon className="w-5 h-5 text-[#C5A572]" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white font-semibold text-lg mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What you walk out with */}
      <section className="py-20 px-6 lg:px-8 bg-[#131313]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-[#C5A572]"
          >
            What you&apos;ll walk out with
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HIGHLIGHTS.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="bg-[#252525] border-l-4 border-[#C5A572] rounded-r-lg p-8"
              >
                <Icon className="w-10 h-10 text-[#C5A572] mb-4" />
                <h3 className="text-white font-semibold text-xl mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
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
            Who should attend
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
        ref={registerRef}
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
              Only 30 seats · Fri, May 29, 2026 · 3:00 PM · WindChasers Bangalore
            </p>

            {/* Scarcity bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Seats filling fast</span>
                <span>68% full</span>
              </div>
              <div className="h-2 w-full bg-[#333] rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-[#C5A572] rounded-full" />
              </div>
            </div>

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
                  <p className="text-gray-500 text-xs mt-1.5">We&apos;ll send venue details and a reminder on WhatsApp</p>
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
                          const next = e.target.value as Status;
                          setForm((f) => ({ ...f, status: next }));
                          setErrors((prev) => ({ ...prev, status: undefined }));
                          // Pursuing/Below 12th. Open the redirect modal immediately,
                          // no need to wait for the user to fill the rest of the form.
                          if (next === "Below 12th" || next === "Pursuing 12th") {
                            setBlocked(true);
                          }
                        }}
                        aria-invalid={errors.status ? "true" : "false"}
                        aria-describedby={errors.status ? "status-error" : undefined}
                        className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-12 text-white focus:outline-none focus:border-[#C5A572] transition-colors appearance-none pr-10"
                      >
                        <option value="" disabled>
                          Select your status
                        </option>
                        <option value="Below 12th">Below 12th</option>
                        <option value="Pursuing 12th">Pursuing 12th</option>
                        <option value="Completed 12th">Completed 12th</option>
                        <option value="Graduate or above">Graduate or above</option>
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
                  {submitting ? "Registering..." : "Confirm Your Seat"}
                </button>

                <p className="text-white/50 text-xs text-center">
                  No spam. We&apos;ll only send you event details and a reminder.
                </p>
              </form>
          </motion.div>
        </div>
      </section>

      {/* Sticky mobile CTA. Hidden when hero or register CTA is on screen. */}
      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <button
            onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" })}
            className="w-full bg-[#C5A572] text-black py-3 rounded-lg font-semibold text-base hover:bg-[#C5A572]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
          >
            Secure Your Seat
          </button>
        </div>
      )}

      {/* Early-stage redirect modal. Fires when the student picks Pursuing
          or Below 12th. The seminar is post-12th; we route those leads to
          /assessment/early instead. */}
      {blocked && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nz-block-title"
        >
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="w-full max-w-[480px] rounded-2xl border border-[#C5A572]/40 bg-[#1A1A1A] p-7 text-center shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
          >
            <h3 id="nz-block-title" className="text-2xl font-bold text-[#C5A572] mb-3">
              We have a better fit for you.
            </h3>
            <p className="text-white/85 text-base leading-relaxed mb-2">
              This seminar is built around what to do{" "}
              <span className="font-semibold">after 12th</span>. Picking the
              right country, costs, and the fastest path to CPL.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              You&apos;re earlier in the journey. We have a dedicated
              early-stage path with the roadmap, costs, and a counsellor
              to talk to.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="/assessment/early"
                className="w-full bg-[#C5A572] text-black h-12 rounded-lg font-semibold text-base inline-flex items-center justify-center hover:bg-[#C5A572]/90 transition-colors"
              >
                Get the early-stage roadmap →
              </a>
              <a
                href="https://wa.me/919591004043?text=Hi%20WindChasers%2C%20I%27m%20still%20in%20school%20and%20interested%20in%20pilot%20training.%20Please%20guide%20me."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-white h-12 rounded-lg font-semibold text-base inline-flex items-center justify-center hover:bg-[#1ebe5d] transition-colors"
              >
                Chat with us on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => {
                  setBlocked(false);
                  setForm((f) => ({ ...f, status: "" }));
                }}
                className="text-white/50 hover:text-white/80 text-xs underline-offset-2 hover:underline transition-colors mt-1"
              >
                I picked the wrong status, go back
              </button>
            </div>

            <p className="text-white/40 text-xs mt-5">
              We&apos;ll take you to the early-stage path in a moment.
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
}
