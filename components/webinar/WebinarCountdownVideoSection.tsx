"use client";

import WebinarCountdown from "@/components/webinar/WebinarCountdown";
import WebinarVideoEmbed from "@/components/webinar/WebinarVideoEmbed";

/** Self-hosted square (1:1) promo clip. */
const WEBINAR_PROMO_VIDEO = "/webinar/webinar-promo.mp4";

/**
 * Two-column strip: countdown (left) + promo video (right) on large screens;
 * stacks on small screens.
 */
export default function WebinarCountdownVideoSection({
  targetIso,
  videoSrc = WEBINAR_PROMO_VIDEO,
  countdownLabel,
}: {
  targetIso: string;
  videoSrc?: string;
  countdownLabel?: string;
}) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-[#1A1A1A] border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-center">
        <div className="min-w-0 flex flex-col justify-center">
          <WebinarCountdown targetIso={targetIso} label={countdownLabel} />
        </div>
        <div className="min-w-0 flex flex-col justify-center items-center lg:items-end">
          {/* Portrait 9:16 clip (browser display ratio); cap height ~72vh/680px so
              width follows. Rounded, subtle frame. */}
          <div className="relative w-full max-w-[min(100%,calc(min(72vh,680px)*(9/16)))] aspect-[9/16] overflow-hidden rounded-2xl bg-black ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <WebinarVideoEmbed src={videoSrc} />
          </div>
        </div>
      </div>
    </section>
  );
}
