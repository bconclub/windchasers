"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Plane,
  Video,
} from "lucide-react";
import WebinarCountdown from "@/components/webinar/WebinarCountdown";
import {
  WEBINAR_START_ISO,
  WEBINAR_ZOOM_REGISTER_URL,
  formatWebinarDateDisplay,
  formatWebinarDateShortDisplay,
  formatWebinarTimeDisplay,
} from "@/lib/webinar";

const WHATSAPP_ICON = (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export interface WebinarLandingProps {
  webinarTitle: string;
  heroSubtitle: string;
  eyebrow?: string;
  learnItems: readonly string[];
  learnColumnTitle?: string;
  heroBgSrc?: string;
  heroVisualSrc?: string;
  heroVisualAlt?: string;
  /** Default portrait card; use "banner" for wide promo art (object-contain). */
  heroVisualLayout?: "card" | "banner";
  visualTagline?: string;
  whatsappGroupUrl: string;
  whatsappGroupLabel: string;
  whatsappBody?: string;
  /** Zoom registration URL (default: shared WindChasers webinar registration). */
  zoomRegisterUrl?: string;
}

export default function WebinarLanding({
  webinarTitle,
  heroSubtitle,
  eyebrow,
  learnItems,
  learnColumnTitle = "What you'll learn",
  heroBgSrc = "/WC HEro.webp",
  heroVisualSrc,
  heroVisualAlt,
  heroVisualLayout = "card",
  visualTagline,
  whatsappGroupUrl,
  whatsappGroupLabel,
  whatsappBody = `Hi WindChasers, I registered for the webinar: ${webinarTitle}`,
  zoomRegisterUrl = WEBINAR_ZOOM_REGISTER_URL,
}: WebinarLandingProps) {
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;

  const stickyHideRef = useRef<HTMLElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(true);

  useEffect(() => {
    const section = stickyHideRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.12 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const resolvedWa = whatsappGroupUrl.startsWith("https://chat.whatsapp.com/")
    ? whatsappGroupUrl
    : whatsappGroupUrl.startsWith("https://wa.me/")
      ? whatsappGroupUrl
      : `https://wa.me/919591004043?text=${encodeURIComponent(whatsappBody)}`;

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
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-[#1a1205]/92 to-[#1A1A1A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(197,165,114,0.18),transparent_55%)]" />
        </div>
        <div className="absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.25)_0%,_rgba(0,0,0,0.5)_70%)]" />
        <div className="absolute inset-0 z-[5] bg-black/15" />

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
              className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mt-8 mb-10"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C5A572] shrink-0" aria-hidden />
                <span className="text-sm text-white">{dateLine}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A572] shrink-0" aria-hidden />
                <span className="text-sm text-white">{timeLine}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#C5A572] shrink-0" aria-hidden />
                <span className="text-sm text-white">Zoom (link after registration)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: transitionDuration ?? 0.8, delay: shouldReduceMotion ? 0 : 0.5 }}
              className="text-center space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <a
                  href={zoomRegisterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center bg-[#C5A572] text-[#1A1A1A] px-8 md:px-10 py-4 rounded-full font-semibold text-base hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black shadow-[0_10px_30px_rgba(197,165,114,0.3)]"
                >
                  Register on Zoom →
                </a>
                <a
                  href={resolvedWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-8 py-4 font-semibold text-base hover:bg-[#1ebe5d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {WHATSAPP_ICON}
                  Join WhatsApp group
                </a>
              </div>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Register on Zoom to get your join link by email · WhatsApp for reminders and updates
              </p>
            </motion.div>

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
                <Phone className="w-4 h-4 shrink-0" aria-hidden />
                <span>+91 95910 04043</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 bg-[#1A1A1A] border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <WebinarCountdown targetIso={WEBINAR_START_ISO} />
        </div>
      </section>

      <section
        ref={stickyHideRef}
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

              <div className="rounded-2xl border border-[#C5A572]/40 bg-black/40 backdrop-blur-md p-6 sm:p-8">
                <h2 className="text-[#C5A572] text-xl font-semibold border-b border-[#C5A572]/30 pb-3 mb-5">
                  {learnColumnTitle}
                </h2>
                <ol className="space-y-3 text-white/90 text-sm sm:text-base leading-relaxed list-decimal list-inside marker:text-[#C5A572]">
                  {learnItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#C5A572]/40 bg-black/40 backdrop-blur-md p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[#C5A572] mb-3">
                  <Plane className="w-5 h-5" aria-hidden />
                  <span className="font-semibold text-lg">{whatsappGroupLabel}</span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Spots are limited - join the group for reminders, worksheets, and Q&amp;A updates before we go live.
                </p>
                <a
                  href={resolvedWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] text-white py-3.5 font-semibold hover:bg-[#1ebe5d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]"
                >
                  {WHATSAPP_ICON}
                  Join WhatsApp group
                </a>
              </div>

              <div className="rounded-2xl border border-[#C5A572]/40 bg-black/40 backdrop-blur-md p-6 sm:p-8">
                <h2 className="text-[#C5A572] text-lg font-semibold mb-6 flex items-center gap-2">
                  <Video className="w-5 h-5" aria-hidden />
                  Webinar details
                </h2>
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
                      Zoom emails your link after you register · Same WhatsApp group as above
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#141414]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 flex gap-2">
          <a
            href={zoomRegisterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center bg-[#C5A572] text-[#1A1A1A] py-3 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(197,165,114,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            Zoom
          </a>
          <a
            href={resolvedWa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] text-white py-3 font-semibold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          >
            {WHATSAPP_ICON}
            WA
          </a>
        </div>
      )}
    </>
  );
}
