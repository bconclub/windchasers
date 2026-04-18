"use client";

import WebinarCountdown from "@/components/webinar/WebinarCountdown";
import WebinarVimeoEmbed from "@/components/webinar/WebinarVimeoEmbed";
import { WEBINAR_PROMO_VIMEO_ID } from "@/lib/webinar";

/**
 * Two-column strip: countdown (left) + Vimeo preview (right) on large screens;
 * stacks on small screens.
 */
export default function WebinarCountdownVideoSection({
  targetIso,
  vimeoId = WEBINAR_PROMO_VIMEO_ID,
  countdownLabel,
}: {
  targetIso: string;
  vimeoId?: string;
  countdownLabel?: string;
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#1A1A1A] border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
        <div className="min-w-0 flex flex-col justify-center">
          <WebinarCountdown targetIso={targetIso} label={countdownLabel} />
        </div>
        <div className="min-w-0 flex flex-col justify-center items-center lg:items-end">
          {/*
            Full story (9:16): width drives height via aspect; cap width so height never exceeds
            ~72vh/680px. No outer framed card (no border/shadow), so the column isn’t a wide empty box
            around a narrow strip.
          */}
          <div className="relative w-full max-w-[min(100%,calc(min(72vh,680px)*(9/16)))] aspect-[9/16] bg-black overflow-hidden">
            <WebinarVimeoEmbed vimeoId={vimeoId} />
          </div>
        </div>
      </div>
    </section>
  );
}
