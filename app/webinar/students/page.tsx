"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Award,
  Briefcase,
  GitCompare,
  GraduationCap,
  Route,
  Users,
  Wallet,
} from "lucide-react";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WebinarHeroDetails from "@/components/webinar/WebinarHeroDetails";
import WebinarCountdownVideoSection from "@/components/webinar/WebinarCountdownVideoSection";
import {
  WEBINAR_START_ISO,
  WEBINAR_ZOOM_REGISTER_URL,
  formatWebinarDateDisplay,
  formatWebinarDateShortDisplay,
  formatWebinarTimeDisplay,
} from "@/lib/webinar";

/** Same card pattern as ATC “What the program includes”: badge, icon, bullet list. */
const WEBINAR_COVER_BLOCKS = [
  {
    badge: "Roadmap",
    Icon: Route,
    items: [
      "Exact path from completing 12th to holding a CPL",
      "DGCA steps in order, no gaps",
    ],
  },
  {
    badge: "After CPL",
    Icon: Award,
    items: [
      "What happens the day you get your licence",
      "Real timelines and real expectations",
    ],
  },
  {
    badge: "Careers",
    Icon: Briefcase,
    items: [
      "Airlines, charters, cargo, instructing",
      "What each path looks like in practice",
    ],
  },
  {
    badge: "Routes",
    Icon: GitCompare,
    items: [
      "Cadet programme vs self-funded CPL",
      "Two routes to the cockpit: which fits you",
    ],
  },
  {
    badge: "Investment",
    Icon: Wallet,
    items: [
      "Full cost picture: training, exams, medicals",
      "Everything on the table. No vague numbers.",
    ],
  },
  {
    badge: "Pitfalls",
    Icon: AlertTriangle,
    items: [
      "Mistakes that trip most aspirants up",
      "How to avoid them before you commit",
    ],
  },
] as const;

const WHO_SHOULD_ATTEND = [
  {
    Icon: GraduationCap,
    headline: "Students ready to fly",
    subtext: "Completed 12th or in final year. Serious about CPL training and want a clear 2026 plan.",
    bullets: ["Want a full roadmap after +2", "Need cost clarity", "Exploring cadet vs CPL routes"],
  },
  {
    Icon: Users,
    headline: "Parents supporting their child",
    subtext: "Want to understand investment, timelines, and career outlook before your child commits.",
    bullets: ["Honest cost picture", "Career stability context", "What to ask in the live Q&A"],
  },
];

export default function WebinarStudentsPage() {
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;

  /** While the hero Register CTA is in view, hide the mobile sticky bar so only one CTA shows. */
  const heroRegisterRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const dateLine = formatWebinarDateDisplay();
  const dateShortLine = formatWebinarDateShortDisplay();
  const timeLine = formatWebinarTimeDisplay();

  useEffect(() => {
    const el = heroRegisterRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero: full-bleed facility photo + overlay, same pattern as /summercamp */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/facility/WC1.webp"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/90 to-dark" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-0 md:mx-auto md:max-w-[700px] pt-4 pb-12 sm:pt-6">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.8 }}
            className="relative bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[24px] p-8 md:p-12 lg:p-[48px_64px] shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent rounded-t-[24px]" />
            <div className="absolute top-5 left-5 w-5 h-5">
              <div className="absolute top-0 left-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>
            <div className="absolute bottom-5 right-5 w-5 h-5">
              <div className="absolute bottom-0 right-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>

            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
              className="text-[#C5A572] text-xs uppercase tracking-[3px] mb-6 text-center font-medium"
            >
              {dateShortLine} · Live on Zoom
            </motion.p>

            <motion.h1
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-[26px] md:text-[44px] font-bold leading-[1.12] text-white text-center"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              <span className="block">Pilot Training after +2</span>
              <span className="block text-[#C5A572] mt-1">Complete Roadmap 2026</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
              className="text-base md:text-lg text-gray-300 font-normal text-center mt-5 max-w-xl mx-auto leading-relaxed"
            >
              Free live session for aspiring pilots and families: DGCA pathway, real costs, cadet vs CPL, and your plan for 2026.
            </motion.p>

            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.4 }}
              className="w-full"
            >
              <WebinarHeroDetails dateLine={dateLine} timeLine={timeLine} />
            </motion.div>

            <motion.div
              ref={heroRegisterRef}
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.5 }}
              className="text-center"
            >
              <a
                href={WEBINAR_ZOOM_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center bg-[#C5A572] text-[#1A1A1A] px-8 md:px-10 py-4 rounded-full font-semibold text-base hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-[0_10px_30px_rgba(197,165,114,0.3)] w-full md:w-auto"
              >
                Register for the webinar →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WebinarCountdownVideoSection targetIso={WEBINAR_START_ISO} />

      {/* What we'll cover: matches ATC program-includes pattern */}
      <section
        id="webinar-topics"
        className="py-20 px-6 lg:px-8 bg-[#1A1A1A] border-t border-white/5 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
          >
            What we&apos;ll cover
          </motion.h2>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-2xl mx-auto"
          >
            The same depth you expect from WindChasers, in one focused webinar.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEBINAR_COVER_BLOCKS.map(({ badge, Icon, items }, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.1 }}
                className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 min-h-[220px] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
              >
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {badge}
                  </span>
                </div>
                <div className="mb-5 mt-2">
                  <Icon className="w-8 h-8 text-[#C5A572]" aria-hidden />
                </div>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A572] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who should attend */}
      <section className="py-20 px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A572] mt-1.5 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WindChasersPastOpenHousesGallery
        id="windchasers-events"
        heading="Events at WindChasers"
        description="Open houses, simulator time, and community mornings with our team. The same highlights we feature on our in-person open house page."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <a
            href={WEBINAR_ZOOM_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center bg-[#C5A572] text-[#1A1A1A] py-3.5 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(197,165,114,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            Register for the webinar →
          </a>
        </div>
      )}
    </>
  );
}
