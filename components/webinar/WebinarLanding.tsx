"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Calendar, Clock, Video } from "lucide-react";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WebinarCountdownVideoSection from "@/components/webinar/WebinarCountdownVideoSection";
import WebinarHeroDetails from "@/components/webinar/WebinarHeroDetails";
import {
  WEBINAR_START_ISO,
  WEBINAR_ZOOM_REGISTER_URL,
  formatWebinarDateDisplay,
  formatWebinarDateShortDisplay,
  formatWebinarTimeDisplay,
} from "@/lib/webinar";

export interface WebinarLandingProps {
  webinarTitle: string;
  heroSubtitle: string;
  eyebrow?: string;
  learnItems: readonly string[];
  learnColumnTitle?: string;
  /** Full-bleed hero photo; defaults to same facility shot as /summercamp. */
  heroBgSrc?: string;
  heroVisualSrc?: string;
  heroVisualAlt?: string;
  /** Default portrait card; use "banner" for wide promo art (object-contain). */
  heroVisualLayout?: "card" | "banner";
  visualTagline?: string;
  /** Zoom registration URL (default: shared WindChasers webinar registration). */
  zoomRegisterUrl?: string;
  /** Past open house photos and recap videos (same grid as /open-house). */
  showPastEventsGallery?: boolean;
}

export default function WebinarLanding({
  webinarTitle,
  heroSubtitle,
  eyebrow,
  learnItems,
  learnColumnTitle = "What you'll learn",
  heroBgSrc = "/facility/WC1.webp",
  heroVisualSrc,
  heroVisualAlt,
  heroVisualLayout = "card",
  visualTagline,
  zoomRegisterUrl = WEBINAR_ZOOM_REGISTER_URL,
  showPastEventsGallery = true,
}: WebinarLandingProps) {
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;

  /** While the hero Register CTA is in view, hide the mobile sticky bar so only one CTA shows. */
  const heroRegisterRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

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

  const dateLine = formatWebinarDateDisplay();
  const timeLine = formatWebinarTimeDisplay();
  const eyebrowLine =
    eyebrow ?? `${formatWebinarDateShortDisplay()} · Live on Zoom`;

  return (
    <>
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBgSrc}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/90 to-dark" />
        </div>

        <div className="relative z-20 w-full px-4 md:px-0 md:mx-auto md:max-w-[700px]">
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
              {eyebrowLine}
            </motion.p>
            <motion.h1
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="text-[26px] md:text-[40px] lg:text-[44px] font-bold leading-[1.12] text-white text-center px-1"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              {webinarTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.3 }}
              className="text-base md:text-lg text-gray-300 font-normal text-center mt-5 max-w-xl mx-auto leading-relaxed"
            >
              {heroSubtitle}
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
                href={zoomRegisterUrl}
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

      <section
        id="webinar-actions"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] scroll-mt-24"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.05 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:gap-12 items-start"
          >
            {/* Left column */}
            <div className="space-y-6">
              <div
                className={
                  heroVisualLayout === "banner"
                    ? "relative rounded-2xl overflow-hidden border border-[#C5A572]/35 shadow-[0_24px_60px_rgba(0,0,0,0.45)] bg-black aspect-[4/5] sm:aspect-video w-full max-w-md sm:max-w-none max-h-[min(520px,78vh)] sm:max-h-[min(440px,70vh)] mx-auto"
                    : "relative rounded-2xl overflow-hidden border border-[#C5A572]/35 shadow-[0_24px_60px_rgba(0,0,0,0.45)] aspect-[4/5] max-h-[480px] mx-auto w-full max-w-md lg:max-w-none"
                }
              >
                {heroVisualSrc ? (
                  <Image
                    src={heroVisualSrc}
                    alt={heroVisualAlt ?? ""}
                    fill
                    className={heroVisualLayout === "banner" ? "object-contain" : "object-cover"}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={heroVisualLayout === "banner"}
                  />
                ) : null}
                {heroVisualLayout === "card" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                )}
                {visualTagline && (
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <p className="text-white text-lg font-medium drop-shadow-lg">{visualTagline}</p>
                  </div>
                )}
              </div>

              <div className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    This session
                  </span>
                </div>
                <div className="mb-4 mt-2">
                  <BookOpen className="w-8 h-8 text-[#C5A572]" aria-hidden />
                </div>
                <h2 className="text-lg font-bold text-white mb-4 leading-snug">{learnColumnTitle}</h2>
                <ul className="space-y-3">
                  {learnItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A572] mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Details
                  </span>
                </div>
                <div className="mb-5 mt-2 flex items-center gap-2">
                  <Video className="w-8 h-8 text-[#C5A572]" aria-hidden />
                  <h2 className="text-lg font-bold text-white">Webinar details</h2>
                </div>
                <div className="space-y-4 text-white/90">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#C5A572] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50">Date</p>
                      <p className="font-medium">{dateLine}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#C5A572] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/50">Time</p>
                      <p className="font-medium">{timeLine}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-[#2D8CFF] font-bold text-sm shadow-sm">
                      Zoom
                    </span>
                    <span className="text-white/60 text-sm">
                      Zoom emails your join link after you register
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {showPastEventsGallery ? (
        <WindChasersPastOpenHousesGallery
          id="windchasers-events"
          heading="Events at WindChasers"
          description="Open houses, simulator time, and community mornings with our team. The same highlights we feature on our in-person open house page."
          sectionClassName="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A] border-t border-white/5"
        />
      ) : null}

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141414]/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <a
            href={zoomRegisterUrl}
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
