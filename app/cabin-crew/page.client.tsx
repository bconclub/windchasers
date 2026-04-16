"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Briefcase,
  BookOpen,
  ChevronDown,
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
  heroVideoEmbedSrc: string | null;
  galleryImages: string[];
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  highestEducation: "" | "12th pass" | "Bachelors Degree" | "Masters Degree" | "Other";
  englishCommunication: "" | "Yes, fluent" | "Yes, but need improvement" | "No";
  age: string;
  joiningTimeline: TimelineOption;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  highestEducation?: string;
  englishCommunication?: string;
  age?: string;
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

const CABIN_CREW_EXPERIENCE_CARDS = [
  {
    title: "High demand",
    text: "Airlines are actively hiring. Trained cabin crew get placed faster.",
    image: "/cabin%20crew/page%20images/cabin%20crew%201.webp",
  },
  {
    title: "Travel the world",
    text: "Fly domestic and international routes from day one.",
    image: "/cabin%20crew/page%20images/Cabin%20crew%202.webp",
  },
  {
    title: "Affordable training",
    text: "No debt required. Quality training at accessible fees.",
    image: "/cabin%20crew/page%20images/Cabin%20Crew%203.png",
  },
];

export default function CabinCrewPageClient({
  heroVideoSrc,
  heroVideoEmbedSrc,
  galleryImages,
}: CabinCrewPageClientProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    highestEducation: "",
    englishCommunication: "",
    age: "",
    joiningTimeline: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [isMuted, setIsMuted] = useState(true);
  const heroVideoFrameRef = useRef<HTMLIFrameElement>(null);

  const sendVimeoCommand = (method: string, value?: number) => {
    if (!heroVideoFrameRef.current?.contentWindow) return;
    const msg: Record<string, unknown> = { method };
    if (value !== undefined) msg.value = value;
    heroVideoFrameRef.current.contentWindow.postMessage(JSON.stringify(msg), "https://player.vimeo.com");
  };

  useEffect(() => {
    if (!heroVideoEmbedSrc) return;
    sendVimeoCommand("setVolume", isMuted ? 0 : 1);
  }, [isMuted, heroVideoEmbedSrc]);

  const scrollToForm = () => {
    document.getElementById("cabin-crew-form")?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  const validateStepOne = () => {
    const nextErrors: FormErrors = {};

    if (!formData.highestEducation) {
      nextErrors.highestEducation = "Please select your highest education.";
    }
    if (!formData.englishCommunication) {
      nextErrors.englishCommunication = "Please select your English communication level.";
    }
    if (!formData.age.trim()) {
      nextErrors.age = "Age is required.";
    } else if (!/^\d{1,2}$/.test(formData.age.trim())) {
      nextErrors.age = "Please enter a valid age.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStepTwo = () => {
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
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);
    setErrors({});

    if (currentStep === 1) {
      if (!validateStepOne()) {
        return;
      }
      setCurrentStep(2);
      return;
    }

    if (!validateStepTwo()) {
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
          highestEducation: formData.highestEducation,
          englishCommunication: formData.englishCommunication,
          age: formData.age.trim(),
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

      const thankYouData = {
        program: "Cabin Crew",
        name: formData.name.trim(),
        city: formData.city.trim(),
        highestEducation: formData.highestEducation,
      };
      setSubmitSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        city: "",
        highestEducation: "",
        englishCommunication: "",
        age: "",
        joiningTimeline: "",
      });
      setCurrentStep(1);
      router.push(
        `/thank-you?type=cabin-crew&data=${encodeURIComponent(JSON.stringify(thankYouData))}`
      );
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
      <section className="relative min-h-screen w-full pt-24 pb-12 px-6 lg:px-8 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/facility/WC1.webp"
            alt="Cabin Crew Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/90 to-dark" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full px-4 py-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-green-400 text-sm font-medium">Admissions Open</span>
            </div>
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
            className="w-full flex justify-center"
          >
            {heroVideoEmbedSrc ? (
              <div className="relative w-[340px] h-[600px] rounded-[24px] overflow-hidden shadow-2xl">
                <iframe
                  ref={heroVideoFrameRef}
                  src={heroVideoEmbedSrc}
                  title="Cabin crew training"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="eager"
                  className="w-full h-full object-cover rounded-[24px]"
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
            ) : heroVideoSrc ? (
              <video
                src={heroVideoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-[340px] h-[600px] object-cover rounded-[24px] shadow-2xl"
              />
            ) : (
              <div className="w-[340px] h-[600px] bg-black/30 rounded-[24px] flex items-center justify-center text-white/60 text-sm">
                Cabin crew video will appear here when a .mp4 file is added to public/cabin-crew.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {CABIN_CREW_EXPERIENCE_CARDS.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
              className="group bg-[#1A1A1A] border border-[#C5A572]/30 rounded-xl overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/35 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-[#C5A572] text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-3">What you learn</h2>
          <p className="text-center text-white/60 max-w-2xl mx-auto mb-12">
            Practical cabin crew skills taught through immersive sessions and real-world scenarios.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A572]/60 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(197,165,114,0.18),transparent_55%)]" />
                <div className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#C5A572]/35 bg-[#C5A572]/12">
                  <Icon className="h-5 w-5 text-[#E3C795]" />
                </div>
                <h3 className="relative text-white font-semibold mb-2 leading-snug">{title}</h3>
                <p className="relative text-white/70 text-sm leading-relaxed">{description}</p>
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
              {galleryImages.map((src, index) => {
                const collageClass =
                  index % 5 === 0
                    ? "md:col-span-2 md:row-span-2"
                    : index % 3 === 0
                      ? "md:row-span-2"
                      : "";

                return (
                  <motion.div
                    key={src}
                    initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: transitionDuration ?? 0.45,
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                    }}
                    className={`relative overflow-hidden rounded-xl ${collageClass}`}
                  >
                    <img
                      src={src}
                      alt="Life at WindChasers cabin crew training"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </motion.div>
                );
              })}
            </div>
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
            Join Cabin Crew Programme
          </h2>
          <p className="text-white/70 text-center mb-8">
            Fill in your details, our team will reach out to you
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-gradient-to-br from-[#242424] via-[#1f1f1f] to-[#1b1b1b] border border-white/15 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
          >
            <div className="flex items-center justify-center gap-3 pb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 1 ? "bg-[#C5A572] text-[#1A1A1A]" : "bg-white/20 text-white/70"
                }`}
              >
                1
              </div>
              <div className={`h-0.5 w-10 ${currentStep === 2 ? "bg-[#C5A572]" : "bg-white/20"}`} />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2 ? "bg-[#C5A572] text-[#1A1A1A]" : "bg-white/20 text-white/70"
                }`}
              >
                2
              </div>
            </div>

            {currentStep === 2 &&
              [
              { id: "name", label: "Name", type: "text", value: formData.name, error: errors.name },
              { id: "phone", label: "Phone", type: "tel", value: formData.phone, error: errors.phone },
              { id: "email", label: "Email", type: "email", value: formData.email, error: errors.email },
              { id: "city", label: "City", type: "text", value: formData.city, error: errors.city },
              ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm text-white/85 mb-2 font-medium">
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
                  className="w-full h-12 rounded-xl bg-black/25 border border-white/20 px-4 text-white placeholder:text-white/35 focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all"
                />
                {field.error && <p className="text-red-400 text-sm mt-1.5">{field.error}</p>}
              </div>
              ))}

            {currentStep === 1 && (
            <div>
              <p className="block text-sm text-white/85 mb-2 font-medium">
                What is your Highest Level of education? <span className="text-red-400">*</span>
              </p>
              <div className="relative">
                <select
                  required
                  value={formData.highestEducation}
                  onChange={(event) => {
                    setFormData((prev) => ({
                      ...prev,
                      highestEducation: event.target.value as FormData["highestEducation"],
                    }));
                    setErrors((prev) => ({ ...prev, highestEducation: undefined }));
                  }}
                  className="w-full h-12 rounded-xl bg-black/25 border border-white/20 px-4 pr-12 text-white appearance-none focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all"
                >
                  <option value="">Select education level</option>
                  <option value="12th pass">12th pass</option>
                  <option value="Bachelors Degree">Bachelors Degree</option>
                  <option value="Masters Degree">Masters Degree</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-5 h-5 text-white/60 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.highestEducation && (
                <p className="text-red-400 text-sm mt-1.5">{errors.highestEducation}</p>
              )}
            </div>
            )}

            {currentStep === 1 && (
            <div>
              <p className="block text-sm text-white/85 mb-2 font-medium">
                Do you have good communication skills in English?{" "}
                <span className="text-red-400">*</span>
              </p>
              <div className="relative">
                <select
                  required
                  value={formData.englishCommunication}
                  onChange={(event) => {
                    setFormData((prev) => ({
                      ...prev,
                      englishCommunication: event.target.value as FormData["englishCommunication"],
                    }));
                    setErrors((prev) => ({ ...prev, englishCommunication: undefined }));
                  }}
                  className="w-full h-12 rounded-xl bg-black/25 border border-white/20 px-4 pr-12 text-white appearance-none focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all"
                >
                  <option value="">Select communication level</option>
                  <option value="Yes, fluent">Yes, fluent</option>
                  <option value="Yes, but need improvement">Yes, but need improvement</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown className="w-5 h-5 text-white/60 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.englishCommunication && (
                <p className="text-red-400 text-sm mt-1.5">{errors.englishCommunication}</p>
              )}
            </div>
            )}

            {currentStep === 1 && (
            <div>
              <label htmlFor="age" className="block text-sm text-white/85 mb-2 font-medium">
                Your Age <span className="text-red-400">*</span>
              </label>
              <input
                id="age"
                type="text"
                inputMode="numeric"
                required
                value={formData.age}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^\d]/g, "");
                  setFormData((prev) => ({ ...prev, age: value }));
                  setErrors((prev) => ({ ...prev, age: undefined }));
                }}
                className="w-full h-12 rounded-xl bg-black/25 border border-white/20 px-4 text-white placeholder:text-white/35 focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all"
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-400 text-sm mt-1.5">{errors.age}</p>}
            </div>
            )}

            {currentStep === 2 && (
            <div>
              <label htmlFor="joiningTimeline" className="block text-sm text-white/85 mb-2 font-medium">
                When do you want to start? <span className="text-red-400">*</span>
              </label>
              <div className="relative">
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
                  className="w-full h-12 rounded-xl bg-black/25 border border-white/20 px-4 pr-12 text-white appearance-none focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all"
                >
                  <option value="">Select timeline</option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 3 months">Within 3 months</option>
                  <option value="3 to 6 months">3 to 6 months</option>
                  <option value="Not sure">Not sure</option>
                </select>
                <ChevronDown className="w-5 h-5 text-white/60 pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              {errors.joiningTimeline && (
                <p className="text-red-400 text-sm mt-1.5">{errors.joiningTimeline}</p>
              )}
            </div>
            )}

            {submitError && (
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

            <div className="flex gap-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 h-12 rounded-xl border border-white/20 bg-black/20 text-white font-semibold hover:border-white/35 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${currentStep === 2 ? "w-2/3" : "w-full"} h-12 rounded-xl bg-[#C5A572] text-[#1A1A1A] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C5A572]/90 transition-colors shadow-[0_10px_26px_rgba(197,165,114,0.25)]`}
              >
                {isSubmitting ? "Submitting..." : currentStep === 1 ? "Continue" : "Apply Now"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <button
          onClick={scrollToForm}
          className="w-full bg-[#C5A572] text-black py-3 rounded-lg font-semibold text-base hover:bg-[#C5A572]/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
        >
          Apply Now
        </button>
      </div>
    </>
  );
}
