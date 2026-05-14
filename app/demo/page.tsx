"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { Monitor, Building2, CheckCircle } from "lucide-react";
import BookingForm from "@/components/BookingForm";

const manrope = Manrope({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-headline" });

const onlineFeatures = [
  "15–30 minute video consultation",
  "Career path discussion",
  "Complete cost breakdown",
  "Course structure overview",
  "Q&A with instructors",
];

const campusFeatures = [
  "30–60 minute campus tour",
  "Simulator experience session",
  "Meet instructors in person",
  "See training facilities",
  "Detailed course roadmap",
];

function DemoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.title = "Book Free Demo | WindChasers Aviation Academy";
  }, []);

  const handleCardClick = (demoType: "online" | "offline") => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("demoType", demoType);
    router.push(`/demo?${params.toString()}`, { scroll: false });
    setTimeout(() => {
      document.querySelector("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  return (
    <div
      className={`${manrope.variable} min-h-screen`}
      style={{ backgroundColor: "#131313" }}
    >
      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Vimeo background — desktop only */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <iframe
            src="https://player.vimeo.com/video/1191576047?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1"
            className="hidden md:block absolute w-full h-full scale-[1.15]"
            style={{ border: 0, top: 0, left: 0 }}
            allow="autoplay; fullscreen"
            title="Demo hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/60 via-[#131313]/50 to-[#131313]" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto text-center px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">
              WindChasers · Free Session
            </span>
            <h1
              className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-tight mb-5"
            >
              See our training{" "}
              <span className="text-[#C5A572] italic">first-hand.</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto">
              Visit the campus or join an online session — no commitment, no pressure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Demo type cards */}
      <section className="pb-20">
        {/* Mobile: horizontal scroll carousel; Desktop: 2-col grid */}
        <div className="md:hidden flex gap-5 overflow-x-auto px-6 pt-6 pb-3 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[
            { type: "online" as const, label: "Online", icon: <Monitor className="w-6 h-6 text-[#C5A572]" strokeWidth={1.5} />, title: "Online Demo", features: onlineFeatures },
            { type: "offline" as const, label: "In-Person", icon: <Building2 className="w-6 h-6 text-[#C5A572]" strokeWidth={1.5} />, title: "Campus Visit", features: campusFeatures },
          ].map((card) => (
            <button
              key={card.type}
              type="button"
              onClick={() => handleCardClick(card.type)}
              className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 text-left shrink-0 w-[82vw] snap-center"
            >
              <span className="absolute -top-3 left-6 bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {card.label}
              </span>
              <div className="w-12 h-12 rounded-xl bg-[#C5A572]/10 border border-[#C5A572]/20 flex items-center justify-center mb-6 mt-2">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{card.title}</h3>
              <ul className="space-y-2.5">
                {card.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-white/60 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#C5A572] mt-0.5 shrink-0" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Desktop: 2-col grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-12">
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => handleCardClick("online")}
            className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 w-full"
          >
            <span className="absolute -top-3 left-6 bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Online
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#C5A572]/10 border border-[#C5A572]/20 flex items-center justify-center mb-6 mt-2">
              <Monitor className="w-6 h-6 text-[#C5A572]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Online Demo</h3>
            <ul className="space-y-2.5">
              {onlineFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#C5A572] mt-0.5 shrink-0" strokeWidth={2} />
                  {f}
                </li>
              ))}
            </ul>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => handleCardClick("offline")}
            className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 text-left hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300 w-full"
          >
            <span className="absolute -top-3 left-6 bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              In-Person
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#C5A572]/10 border border-[#C5A572]/20 flex items-center justify-center mb-6 mt-2">
              <Building2 className="w-6 h-6 text-[#C5A572]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Campus Visit</h3>
            <ul className="space-y-2.5">
              {campusFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-white/60 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#C5A572] mt-0.5 shrink-0" strokeWidth={2} />
                  {f}
                </li>
              ))}
            </ul>
          </motion.button>
        </div>
      </section>

      {/* Booking Form */}
      <section
        className="pb-28 px-6 md:px-12"
        style={{ backgroundColor: "#0e0e0e" }}
      >
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center pt-20 mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
              Book your slot
            </span>
            <h2
              className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white"
            >
              Reserve a Demo Session
            </h2>
          </motion.div>
          <Suspense fallback={
            <div className="max-w-2xl mx-auto">
              <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            </div>
          }>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 px-6" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-[1400px] mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-14 bg-white/5 rounded w-1/2 mx-auto mb-4" />
            <div className="h-6 bg-white/5 rounded w-1/3 mx-auto" />
          </div>
        </div>
      </div>
    }>
      <DemoPageContent />
    </Suspense>
  );
}
