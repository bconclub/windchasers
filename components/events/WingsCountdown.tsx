"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

const UNITS = ["Days", "Hrs", "Min", "Sec"] as const;

/**
 * Countdown for the Wings hero.
 *
 * Purpose-built rather than reusing WebinarCountdown: that one ships its own
 * border and background (so nesting it in the hero panel double-bordered),
 * renders white digits, and its compact variant is inline-flex - which lets the
 * units wrap onto two lines in a narrow column. This is a fixed 7-cell grid
 * (4 values + 3 separators), so it can never stack at any width; it only scales
 * its type down. WebinarCountdown is live on the webinar pages and is untouched.
 */
export default function WingsCountdown({
  targetIso,
  className = "",
}: {
  targetIso: string;
  className?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  // Starts null so server and client render the same thing; the real value
  // lands on mount. Avoids a hydration mismatch on every digit.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(targetIso).getTime();
  const diff = now === null ? 0 : Math.max(0, target - now);
  const values = [
    Math.floor(diff / 86_400_000),
    Math.floor((diff % 86_400_000) / 3_600_000),
    Math.floor((diff % 3_600_000) / 60_000),
    Math.floor((diff % 60_000) / 1000),
  ];

  return (
    <div
      role="timer"
      // A timer that re-announces every second is hostile to screen readers;
      // the date and time are stated in the meta row above regardless.
      aria-live="off"
      aria-label={`Wings of Freedom starts in ${values[0]} days, ${values[1]} hours, ${values[2]} minutes`}
      className={`grid grid-cols-[repeat(7,auto)] items-start justify-between ${className}`}
    >
      {values.map((v, i) => (
        <div key={UNITS[i]} className="contents">
          {i > 0 && (
            <span
              aria-hidden
              className="select-none text-[26px] font-bold leading-none text-[#C5A572]/35 sm:text-[32px] lg:text-[38px]"
            >
              :
            </span>
          )}
          <div className="flex flex-col items-center">
            <span
              suppressHydrationWarning
              className="text-[28px] font-bold leading-none tabular-nums text-[#C5A572] sm:text-[34px] lg:text-[40px]"
            >
              {now === null ? "--" : pad(v)}
            </span>
            <span className="mt-2 text-[9.5px] font-semibold uppercase leading-none tracking-[0.18em] text-gray-500 sm:text-[10.5px]">
              {UNITS[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
