"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import WebinarCountdownVideoSection from "@/components/webinar/WebinarCountdownVideoSection";
import WebinarHeroDetails from "@/components/webinar/WebinarHeroDetails";
import {
  WEBINAR_PARENT_ZOOM_REGISTER_URL,
  WEBINAR_START_ISO,
  formatWebinarDateDisplay,
  formatWebinarDateShortDisplay,
  formatWebinarTimeDisplay,
} from "@/lib/webinar";

/** Same grid pattern as students webinar; bullets written for parents and guardians. */
const WEBINAR_COVER_BLOCKS_PARENTS = [
  {
    badge: "Roadmap",
    Icon: Route,
    items: [
      "What happens from Class 12 through CPL, in plain order",
      "DGCA steps explained so you can coach and check progress with your child",
    ],
  },
  {
    badge: "After CPL",
    Icon: Award,
    items: [
      "What graduates realistically do next, in timelines you can plan around",
      "Expectations you and your child can align on before training starts",
    ],
  },
  {
    badge: "Careers",
    Icon: Briefcase,
    items: [
      "Airlines, charters, cargo, instructing: what each path means for stability",
      "The questions working parents usually ask first about job outcomes",
    ],
  },
  {
    badge: "Routes",
    Icon: GitCompare,
    items: [
      "Cadet programme vs self-funded CPL: how families usually decide",
      "How to weigh upfront cost, bond, and flexibility for your situation",
    ],
  },
  {
    badge: "Investment",
    Icon: Wallet,
    items: [
      "Full cost picture: training, exams, medicals, and the extras that add up",
      "A single grounded budget view you can take to your family or bank",
    ],
  },
  {
    badge: "Pitfalls",
    Icon: AlertTriangle,
    items: [
      "Where families lose time or money in pilot training choices",
      "What to verify before you pay deposits or sign long commitments",
    ],
  },
] as const;

const WHO_SHOULD_ATTEND_PARENTS = [
  {
    Icon: Users,
    headline: "Parents planning the investment",
    subtext:
      "You want honest numbers, timelines, and what commitment really looks like before your child enrols.",
    bullets: [
      "Full cost and milestone view in one sitting",
      "PSU-style roles vs airline/CPL routes in plain English",
      "What to listen for in the live Q&A",
    ],
  },
  {
    Icon: GraduationCap,
    headline: "Families with a child set on flying",
    subtext:
      "Your child is serious about CPL training and you want a roadmap everyone at home can align on for 2026.",
    bullets: [
      "How to support DGCA prep and medicals from home",
      "Cadet vs CPL: questions to decide together at the kitchen table",
      "Red flags to avoid when comparing schools and offers",
    ],
  },
] as const;

export default function WebinarParentsPage() {
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;

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
              {dateShortLine} · Live on Zoom · For parents
            </motion.p>

            <motion.h1
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-[26px] md:text-[44px] font-bold leading-[1.12] text-white text-center"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              <span className="block">Your child&apos;s pilot career</span>
              <span className="block text-[#C5A572] mt-1">Clear answers for parents · 2026</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
              className="text-sm sm:text-base md:text-lg text-gray-300 font-normal text-center mt-5 max-w-xl mx-auto leading-relaxed"
            >
              Free live Zoom built for moms and dads: real costs, timelines, cadet vs CPL, and how to plan with your
              child for 2026.
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
                href={WEBINAR_PARENT_ZOOM_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center bg-[#C5A572] text-[#1A1A1A] px-8 md:px-10 py-4 rounded-full font-semibold text-base hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-[0_10px_30px_rgba(197,165,114,0.3)] w-full md:w-auto"
              >
                Register for the parents webinar →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WebinarCountdownVideoSection targetIso={WEBINAR_START_ISO} />

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
            What we&apos;ll cover for you as parents
          </motion.h2>
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-gray-400 text-center mb-14 max-w-2xl mx-auto"
          >
            The same straight WindChasers depth you expect, framed for the decisions you are helping your child make.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WEBINAR_COVER_BLOCKS_PARENTS.map(({ badge, Icon, items }, i) => (
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

      <section className="py-20 px-6 lg:px-8 bg-[#1E1E1E]">
        <div className="max-w-[1200px] mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-14 text-[#C5A572]"
          >
            Who this parents session is for
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WHO_SHOULD_ATTEND_PARENTS.map(({ Icon, headline, subtext, bullets }, i) => (
              <motion.div
                key={headline}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: transitionDuration ?? 0.5, delay: shouldReduceMotion ? 0 : i * 0.07 }}
                className="bg-[#252525] border-l-4 border-[#C5A572] rounded-r-lg p-8"
              >
                <Icon className="w-10 h-10 text-[#C5A572] mb-4" aria-hidden />
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
        heading="Where parents and students meet us in person"
        description="Open houses and mornings at WindChasers: tour the school, meet instructors, and ask the same straight questions you will hear on this parents webinar."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <a
            href={WEBINAR_PARENT_ZOOM_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center bg-[#C5A572] text-[#1A1A1A] py-3.5 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(197,165,114,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            Register for the parents webinar →
          </a>
        </div>
      )}
    </>
  );
}
