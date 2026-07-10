"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { Video, Calendar, Clock, Gift, MessageCircle, Users, ArrowRight } from "lucide-react";
import WebinarCountdown from "@/components/webinar/WebinarCountdown";
import WebinarVideoEmbed from "@/components/webinar/WebinarVideoEmbed";

const WEBINAR_PROMO_VIDEO = "/webinar/webinar-promo.mp4";

type Props = {
  targetIso: string;
  /** White first line of the headline. */
  headlineTop: string;
  /** Gold second line of the headline. */
  headlineAccent: string;
  /** "18 July" */
  dateShort: string;
  /** "11:30 AM IST" */
  timeText: string;
  videoSrc?: string;
  onReserve: () => void;
};

/**
 * Merged webinar hero (mockup 2): funnel step-strip, LIVE pill, two-line
 * headline, Zoom/date/time row, live countdown, Reserve CTA, and trust row on
 * the left; the promo video in a glowing framed player with an info card on the
 * right. Replaces the old separate hero + countdown/video sections.
 *
 * forwardRef exposes the Reserve CTA wrapper so the page's IntersectionObserver
 * can toggle the mobile sticky bar (only one Reserve CTA visible at a time).
 */
const WebinarHero = forwardRef<HTMLDivElement, Props>(function WebinarHero(
  { targetIso, headlineTop, headlineAccent, dateShort, timeText, videoSrc = WEBINAR_PROMO_VIDEO, onReserve },
  reserveRef,
) {
  return (
    <section className="relative overflow-hidden bg-[#0B0B0D] pt-24 pb-16 sm:pb-20">
      {/* faint facility backdrop + directional scrims */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image src="/facility/WC1.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/92 to-[#0B0B0D]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E7D5B3]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5A572] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C5A572]" />
              </span>
              Live Webinar
            </span>

            <h1 className="mt-5 text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-[54px]">
              {headlineTop} <span className="text-[#C5A572]">{headlineAccent}</span>
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2">
                <Video className="h-4 w-4 text-[#C5A572]" /> Live on Zoom
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#C5A572]" /> {dateShort}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C5A572]" /> {timeText}
              </span>
            </div>

            <div className="mt-7">
              <WebinarCountdown targetIso={targetIso} variant="compact" />
            </div>

            <div ref={reserveRef} className="mt-7">
              <button
                type="button"
                onClick={onReserve}
                className="group inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-8 py-4 text-base font-semibold text-[#1A1A1A] shadow-[0_12px_34px_rgba(197,165,114,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
              >
                Reserve My Free Seat
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-[#C5A572]" /> Free session
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-[#C5A572]" /> Live Q&amp;A
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#C5A572]" /> Parents welcome
              </span>
            </div>
          </div>

          {/* RIGHT — framed video with glow + info card */}
          <div className="relative flex justify-center lg:justify-end">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[360px] w-[360px] rounded-full bg-[#C5A572]/12 blur-[90px]" />
            </div>
            <div className="relative w-full max-w-[330px] pb-6">
              <div className="relative aspect-[9/16] overflow-hidden rounded-[26px] bg-black ring-1 ring-[#C5A572]/30 shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                <WebinarVideoEmbed src={videoSrc} />
              </div>
              <div className="absolute bottom-0 left-1/2 w-[88%] -translate-x-1/2 rounded-xl border border-white/10 bg-[#141416]/95 px-4 py-3 shadow-lg backdrop-blur">
                <p className="text-sm font-semibold text-white">Pilot Career Webinar 2026</p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {dateShort} at {timeText} · <span className="text-[#C5A572]">Mode: Online</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default WebinarHero;
