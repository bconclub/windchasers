"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { MapPin, Calendar, Clock, Gift, Users, Wrench, ArrowRight } from "lucide-react";
import WebinarCountdown from "@/components/webinar/WebinarCountdown";
import VimeoReel from "@/components/VimeoReel";

/** "Recent WindChasers event" collage reel - same one used on the homepage
 *  ("Building India's next generation of pilots" section). */
const EVENT_REEL_VIMEO_ID = "1191491477";

type Props = {
  targetIso: string;
  /** White first line of the headline. */
  headlineTop: string;
  /** Gold second line of the headline. */
  headlineAccent: string;
  /** One-line subtext under the headline. */
  subheadline?: string;
  /** "2 August" */
  dateShort: string;
  /** "11:00 AM IST" */
  timeText: string;
  /** Venue line, e.g. "WindChasers HQ, Bengaluru". */
  location: string;
  /** Card caption under the framed video, e.g. the event name. */
  cardTitle: string;
  facilityImage?: string;
  onReserve: () => void;
};

/**
 * In-person event hero - same layout language as WebinarHero (funnel
 * step-strip, two-line headline, date/time/venue row, live countdown,
 * Reserve CTA, trust row) but framed for a physical venue: no video embed,
 * a facility photo card instead, "In-Person Event" pill, venue in place of
 * "Live on Zoom" / "Mode: Online".
 */
const OfflineEventHero = forwardRef<HTMLDivElement, Props>(function OfflineEventHero(
  { targetIso, headlineTop, headlineAccent, subheadline, dateShort, timeText, location, cardTitle, facilityImage = "/facility/WC1.webp", onReserve },
  reserveRef,
) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0B0B0D] pt-24 pb-16 sm:pb-20">
      {/* faint facility backdrop + directional scrims */}
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
              In-Person Event
            </span>

            <h1 className="mt-5 text-[34px] font-bold leading-[1.05] text-white sm:text-5xl lg:text-[54px]">
              {headlineTop} <span className="text-[#C5A572]">{headlineAccent}</span>
            </h1>

            {subheadline && (
              <p className="mt-4 text-base text-gray-300 max-w-lg">{subheadline}</p>
            )}

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
              <WebinarCountdown targetIso={targetIso} label="Event starts in" variant="compact" />
            </div>

            <div ref={reserveRef} className="mt-7">
              <button
                type="button"
                onClick={onReserve}
                className="group inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-8 py-4 text-base font-semibold text-[#1A1A1A] shadow-[0_12px_34px_rgba(197,165,114,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
              >
                Reserve My Spot
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-[#C5A572]" /> Free to attend
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-[#C5A572]" /> Simulator experience
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#C5A572]" /> Parents welcome
              </span>
            </div>
          </div>

          {/* RIGHT - the same event-reel collage video used on the homepage, framed with glow + info card */}
          <div className="relative flex justify-center lg:justify-end">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[360px] w-[360px] rounded-full bg-[#C5A572]/12 blur-[90px]" />
            </div>
            <div className="relative w-full max-w-[330px] pb-6">
              <div className="rounded-[26px] ring-1 ring-[#C5A572]/30 shadow-[0_30px_70px_rgba(0,0,0,0.6)] overflow-hidden">
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
                  {dateShort} at {timeText} · <span className="text-[#C5A572]">In person</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default OfflineEventHero;
