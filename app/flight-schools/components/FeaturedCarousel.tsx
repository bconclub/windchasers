"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FeaturedSchool } from "../lib/featured-schools";
import FeaturedSchoolCard from "./FeaturedSchoolCard";

export default function FeaturedCarousel({
  eyebrow,
  title,
  schools,
}: {
  eyebrow: string;
  title: string;
  schools: FeaturedSchool[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Scroll roughly one card-and-a-bit so a fresh card leads each time.
    const amount = Math.min(el.clientWidth * 0.85, 320);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (schools.length === 0) return null;

  return (
    <div>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[#C5A572] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            {eyebrow}
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">{title}</h2>
        </div>
        {/* Arrows — desktop only; mobile swipes */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-white/15 text-white/70 flex items-center justify-center hover:border-[#C5A572]/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-white/15 text-white/70 flex items-center justify-center hover:border-[#C5A572]/50 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track: horizontal snap carousel. Cards keep a fixed width and the next
          one peeks in, e-commerce style — swipe / drag / arrow to browse. */}
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0 px-4 md:px-0 pb-2"
        style={{ scrollPaddingLeft: 0 }}
      >
        {schools.map((s) => (
          <div key={s.id} className="snap-start shrink-0 w-[248px] sm:w-[268px]">
            <FeaturedSchoolCard school={s} />
          </div>
        ))}
        {/* Tail spacer so the last card isn't flush to the edge */}
        <div className="shrink-0 w-1" aria-hidden />
      </div>
    </div>
  );
}
