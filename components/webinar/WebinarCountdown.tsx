"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function WebinarCountdown({
  targetIso,
  label = "Webinar starts in",
}: {
  targetIso: string;
  label?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  const live = diff <= 0;

  const unit = (value: number, u: string) => (
    <div className="flex flex-col items-center min-w-[4.5rem] sm:min-w-[5.5rem]">
      <span
        className="text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums text-[#C5A572] drop-shadow-[0_0_24px_rgba(197,165,114,0.35)]"
        suppressHydrationWarning
      >
        {pad(value)}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/50 mt-1">{u}</span>
    </div>
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#C5A572]/40 bg-black/50 px-5 py-7 sm:px-10 sm:py-9 shadow-[0_0_0_1px_rgba(197,165,114,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
      role="timer"
      aria-live={shouldReduceMotion ? "off" : "polite"}
      aria-label={live ? "Webinar is live or has started" : `${label}: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(197,165,114,0.5), transparent 55%)",
        }}
      />
      <p className="text-center text-xs sm:text-sm uppercase tracking-[0.25em] text-[#C5A572]/90 mb-6 sm:mb-7 font-medium">
        {label}
      </p>
      {live ? (
        <p className="text-center text-lg sm:text-xl font-semibold text-white">
          We&apos;re live - join now below
        </p>
      ) : (
        <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-9 py-1">
          {unit(days, "Days")}
          <span className="text-[#C5A572]/40 text-2xl font-light pb-6 hidden sm:inline" aria-hidden>
            :
          </span>
          {unit(hours, "Hours")}
          <span className="text-[#C5A572]/40 text-2xl font-light pb-6 hidden sm:inline" aria-hidden>
            :
          </span>
          {unit(minutes, "Min")}
          <span className="text-[#C5A572]/40 text-2xl font-light pb-6 hidden sm:inline" aria-hidden>
            :
          </span>
          {unit(seconds, "Sec")}
        </div>
      )}
    </div>
  );
}
