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
  Calendar,
  Clock,
  MapPin,
  Play,
  Phone,
} from "lucide-react";
import Head from "next/head";
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

const GALLERY_VIDEOS = [
  "Open hosue 5.mp4",
  "Open House May 4.mp4",
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

  const registerRef = useRef<HTMLElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(true);

  const handleImageClick = (src: string, alt: string) => {
    openLightbox(src, alt);
  };



  useEffect(() => {
    if (!blocked) return;
    const t = setTimeout(() => router.push("/"), 3000);
    return () => clearTimeout(t);
  }, [blocked, router]);

  useEffect(() => {
    const section = registerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStickyBar(false);
        } else {
          setShowStickyBar(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
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

    if (role === "student" && form.status === "Below 12th") {
      setBlocked(true);
      return;
    }

    setSubmitting(true);
    try {
      const trackingData = getTrackingData();
      const res = await fetch("/api/open-house", {
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

      const payload = await res.json().catch(() => ({}));
      if (!res.ok || payload.success === false) {
        throw new Error(typeof payload.error === "string" ? payload.error : "Submission failed");
      }

      const thankYouData = {
        program: "Open House",
        role,
        name: form.name.trim(),
        city: form.city.trim(),
      };
      router.push(
        `/thank-you?type=open-house&data=${encodeURIComponent(JSON.stringify(thankYouData))}`
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
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
      <Head>
        <title>Pilot Career Open House Bangalore · April 11, 2026 · WindChasers</title>
        <meta
          name="description"
          content="Join WindChasers' Pilot Career Open House in Bangalore on April 11, 2026. Meet airline captains, explore CPL training paths, get cost breakdowns, and secure your aviation career roadmap. Limited seats available."
        />
        <meta property="og:title" content="Pilot Career Open House Bangalore · April 11, 2026 · WindChasers" />
        <meta
          property="og:description"
          content="Join Bangalore's premier Pilot Career Open House. Meet airline captains, explore CPL training paths, and get expert guidance on your aviation career."
        />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero - Glass Morphism Design */}
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
          {heroInView && (
            <iframe
              className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-0"
              src="https://player.vimeo.com/video/1160946921?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&background=1"
              title="Aviation Background"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="eager"
              style={{ pointerEvents: "none" }}
            />
          )}
        </div>
        
        {/* Lighter Radial Gradient Overlay - improves cockpit visibility */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.2)_0%,_rgba(0,0,0,0.5)_70%)] z-10" />
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* Glass Container */}
        <div className="relative z-20 w-full px-4 md:px-0 md:mx-auto md:max-w-[700px] pt-20">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8 }}
            className="relative bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-8 md:p-12 lg:p-[48px_64px] shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent rounded-t-[24px]" />
            
            {/* Corner Accents - L-shapes */}
            <div className="absolute top-5 left-5 w-5 h-5">
              <div className="absolute top-0 left-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>
            <div className="absolute bottom-5 right-5 w-5 h-5">
              <div className="absolute bottom-0 right-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>

            {/* Top Label - Small Caps */}
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
              className="text-[#C5A572] text-xs uppercase tracking-[3px] mb-6 text-center font-medium"
            >
              April 11, 2026 · In-Person Event
            </motion.p>

            {/* Main Headline - Visual Hierarchy */}
            <motion.h1
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-[28px] md:text-[48px] font-bold leading-[1.1] text-white text-center"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              Bangalore Aviation Open House
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
              className="text-base md:text-lg text-gray-300 font-normal text-center mt-4"
            >
              Meet pilots. Tour the facility. Experience simulators. Get your CPL roadmap.
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
                <span className="text-sm text-white">April 11, 2026</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A572]" />
                <span className="text-sm text-white">11:30 AM onwards</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A572]" />
                <span className="text-sm text-white">WindChasers HQ, Bangalore</span>
              </div>
            </motion.div>

            {/* Premium Button Container */}
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
                Reserve Your Free Seat →
              </button>
              <p className="text-xs text-gray-400 mt-4">
                Limited to 30 seats · Registration required
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

      {/* Past open houses gallery */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-[#C5A572]"
          >
            Our Past Open Houses
          </motion.h2>

          {/* Two-row grid gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Videos - first row */}
            {GALLERY_VIDEOS.map((v, i) => (
              <motion.div
                key={v}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : i * 0.1 }}
                className="overflow-hidden rounded-lg bg-black"
                style={{ aspectRatio: '9/16' }}
              >
                <video
                  src={asset(v)}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain rounded-lg"
                >
                  <source src={asset(v)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            ))}
            {/* Images - fill remaining slots in two rows */}
            {GALLERY_IMAGES.slice(0, 6).map(({ src, alt, position }, i) => (
              <motion.div
                key={src.src}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : (GALLERY_VIDEOS.length + i) * 0.1 }}
                className="overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => handleImageClick(src.src, alt)}
              >
                <img
                  src={src.src}
                  alt={alt}
                  className="w-full h-[200px] md:h-[240px] object-cover rounded-lg transition-transform duration-[400ms] group-hover:scale-[1.05]"
                  style={{
                    objectPosition: position,
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  loading={i < 4 ? "eager" : "lazy"}
                />
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
                  {submitting ? "Registering..." : "Confirm Your Seat"}
                </button>

                <p className="text-white/50 text-xs text-center">
                  No spam. We&apos;ll only send you event details and a reminder.
                </p>
              </form>
            )}
          </motion.div>
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

      {/* Sticky mobile CTA */}
      {showStickyBar && !blocked && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <button
            onClick={() => document.getElementById("register")?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" })}
            className="w-full bg-[#C5A572] text-black py-3 rounded-lg font-semibold text-base hover:bg-[#C5A572]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
          >
            Confirm Your Seat
          </button>
        </div>
      )}

    </>
  );
}
