"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { MapPin, Calendar, Clock, Gift, Sparkles, Wrench, ArrowRight } from "lucide-react";
import WingsCountdown from "@/components/events/WingsCountdown";

/** Wings-specific hero loop (4s, silent, seamless). Replaced the generic
 *  homepage reel, which opened on a male presenter - the wrong first moving
 *  image on a women-only page. The source clip carried an "AI generated"
 *  watermark bottom-right; it's cropped out in the encoded file. */
const HERO_VIDEO = "/wings-of-freedom/hero-loop.mp4";
const HERO_POSTER = "/wings-of-freedom/hero-poster.jpg";

type Props = {
  targetIso: string;
  /** "15 August 2026" */
  dateFull: string;
  /** "11:00 am - 3:30 pm IST" */
  timeText: string;
  /** Short venue, e.g. "Kothanur, Bengaluru" - the full address won't fit inline. */
  venueShort: string;
  facilityImage?: string;
  onReserve: () => void;
  /** Scrolls to the scholarship section rather than opening a second modal -
   *  nobody should reach an accept-terms checkbox without seeing the terms. */
  onScholarship: () => void;
};

const TRUST = [
  { Icon: Gift, label: "Free to attend" },
  { Icon: Wrench, label: "Simulator experience" },
  { Icon: Sparkles, label: "Women-only cohort" },
];

/**
 * Wings of Freedom hero. Forked from OfflineEventHero rather than
 * parameterised: this one carries TWO CTAs, a meta row and a countdown panel,
 * so the structure differs throughout. OfflineEventHero stays untouched and
 * live on the two demo-class pages.
 */
const WingsOfFreedomHero = forwardRef<HTMLDivElement, Props>(function WingsOfFreedomHero(
  { targetIso, dateFull, timeText, venueShort, facilityImage = "/facility/WC1.webp", onReserve, onScholarship },
  reserveRef,
) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0B0B0D] pt-24 pb-16 sm:pb-20">
      <div className="absolute inset-0 z-0" aria-hidden>
        <Image src={facilityImage} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.18]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/94 to-[#0B0B0D]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          {/* LEFT */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E7D5B3]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5A572] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C5A572]" />
              </span>
              Women-Only · Independence Day
            </span>

            <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-tight text-white sm:text-[56px] lg:text-[64px]">
              Wings of
              <br />
              <span className="text-[#C5A572]">Freedom</span>
            </h1>

            <p className="mt-5 max-w-[30rem] text-[16px] leading-relaxed text-gray-300">
              One day at our Bengaluru campus. Fly the simulator, learn from a serving airline
              captain, and watch the Freedom to Fly scholarships announced live.
            </p>

            <div ref={reserveRef} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onReserve}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A572] px-8 py-4 text-[15px] font-semibold text-[#1A1A1A] shadow-[0_12px_34px_rgba(197,165,114,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
              >
                Book My Slot
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onScholarship}
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#C5A572]/45 bg-transparent px-7 py-4 text-[15px] font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/80 hover:bg-[#C5A572]/10"
              >
                Apply for a Scholarship
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Date / Time / Venue - divider-separated so it reads as one row of
                facts rather than three loose lines. */}
            {/* Inline 3-up with dividers from sm upward, as designed. Below
                that the cells fall to ~114px and values like "11:00 am - 3:30
                pm IST" wrap to three lines, so mobile gets one clean row per
                fact instead - readable beats cramped. */}
            {/* Icons sit in outlined badges. On mobile the three facts stack
                inside one panel with hairline dividers; from sm they become an
                inline 3-up, since the cells get too narrow below that and
                values like the time range wrap to three lines. */}
            <dl className="mt-9 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02] px-4 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-2 sm:py-1">
              {[
                { Icon: Calendar, label: "Date", value: dateFull },
                { Icon: Clock, label: "Time", value: timeText },
                { Icon: MapPin, label: "Venue", value: venueShort },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex min-w-0 items-center gap-2.5 py-3.5 sm:px-2.5 lg:px-3.5">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#C5A572]/30 bg-[#C5A572]/[0.07]"
                  >
                    <Icon className="h-[15px] w-[15px] text-[#C5A572]" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-500 sm:text-[9.5px]">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-[13px] font-medium leading-tight text-white sm:text-[11.5px] lg:text-[12.5px]">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* Fixed 3-up, not flex-wrap: at this column width "Women-only
                cohort" was dropping to a second row. Labels may run to two
                lines inside their own cell, but the three stay on one line. */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              {TRUST.map(({ Icon, label }) => (
                <span key={label} className="inline-flex min-w-0 items-center gap-2 text-[11px] leading-tight text-gray-300 sm:text-[11.5px]">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#C5A572]/30 bg-[#C5A572]/[0.07]"
                  >
                    <Icon className="h-[15px] w-[15px] text-[#C5A572]" />
                  </span>
                  <span className="min-w-0">{label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT - video, countdown docked beneath it */}
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[380px] w-[380px] rounded-full bg-[#C5A572]/12 blur-[100px]" />
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[20px] shadow-[0_30px_70px_rgba(0,0,0,0.65)] ring-1 ring-white/10">
                {/* Silent, seamless 4s loop - autoplay is only allowed while
                    muted, and the poster covers the first-frame decode gap. */}
                <video
                  src={HERO_VIDEO}
                  poster={HERO_POSTER}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="Wings of Freedom title sequence"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur sm:px-9 sm:py-6">
                <WingsCountdown targetIso={targetIso} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default WingsOfFreedomHero;
