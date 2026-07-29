"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { MapPin, Calendar, Clock, Gift, Sparkles, Wrench, ArrowRight } from "lucide-react";
import WebinarCountdown from "@/components/webinar/WebinarCountdown";
import VimeoReel from "@/components/VimeoReel";

/** Recent WindChasers event collage reel - same one the homepage uses. Swap
 *  this one line once a Wings-specific reel exists. */
const EVENT_REEL_VIMEO_ID = "1191491477";

type Props = {
  targetIso: string;
  /** "15 August" */
  dateShort: string;
  /** "11:00 AM - 3:30 PM IST" */
  timeText: string;
  location: string;
  cardTitle: string;
  facilityImage?: string;
  onReserve: () => void;
  /** Scrolls to the scholarship section rather than opening a second modal -
   *  nobody should reach an accept-terms checkbox without seeing the terms. */
  onScholarship: () => void;
};

/**
 * Wings of Freedom hero. Forked from OfflineEventHero rather than
 * parameterised: this one carries TWO CTAs (book + scholarship), which changes
 * the button block's shape, and every string differs. OfflineEventHero stays
 * untouched and live on the two demo-class pages.
 */
const WingsOfFreedomHero = forwardRef<HTMLDivElement, Props>(function WingsOfFreedomHero(
  { targetIso, dateShort, timeText, location, cardTitle, facilityImage = "/facility/WC1.webp", onReserve, onScholarship },
  reserveRef,
) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0B0B0D] pt-24 pb-16 sm:pb-20">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image src={facilityImage} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/92 to-[#0B0B0D]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* LEFT - content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E7D5B3]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5A572] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C5A572]" />
              </span>
              Women-Only · Independence Day Special
            </span>

            <h1 className="mt-5 text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-[54px]">
              Wings of <span className="text-[#C5A572]">Freedom</span>
            </h1>

            <p className="mt-4 max-w-lg text-base text-gray-300">
              An Independence Day aviation day built for women who want to fly. Real simulator
              time, a masterclass from a serving airline captain, and the reveal of the Freedom
              to Fly scholarship.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C5A572]" /> {location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#C5A572]" /> {dateShort}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#C5A572]" /> {timeText}
              </span>
            </div>

            <div className="mt-7">
              <WebinarCountdown targetIso={targetIso} label="Wings of Freedom opens in" variant="compact" />
            </div>

            {/* Two CTAs, deliberately asymmetric - booking is the primary act;
                the scholarship is revealed at the finale. */}
            <div ref={reserveRef} className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onReserve}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A572] px-8 py-4 text-base font-semibold text-[#1A1A1A] shadow-[0_12px_34px_rgba(197,165,114,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
              >
                Book My Slot
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onScholarship}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-4 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
              >
                Apply for a Scholarship
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-[#C5A572]" /> Free to attend
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#C5A572]" /> Women-only cohort
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-[#C5A572]" /> Simulator experience
              </span>
            </div>
          </div>

          {/* RIGHT - event reel, framed with glow + info card */}
          <div className="relative flex justify-center lg:justify-end">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[360px] w-[360px] rounded-full bg-[#C5A572]/12 blur-[90px]" />
            </div>
            <div className="relative w-full max-w-[330px] pb-6">
              <div className="overflow-hidden rounded-[26px] shadow-[0_30px_70px_rgba(0,0,0,0.6)] ring-1 ring-[#C5A572]/30">
                <VimeoReel
                  vimeoId={EVENT_REEL_VIMEO_ID}
                  title="Recent WindChasers event"
                  aspect="portrait"
                  zoom={1.5}
                />
              </div>
              <div className="absolute bottom-0 left-1/2 w-[88%] -translate-x-1/2 rounded-xl border border-white/10 bg-[#141416]/95 px-4 py-3 shadow-lg backdrop-blur">
                <p className="text-sm font-semibold text-white">{cardTitle}</p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  {dateShort} · <span className="text-[#C5A572]">In person</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default WingsOfFreedomHero;
