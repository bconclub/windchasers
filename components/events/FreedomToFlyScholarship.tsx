"use client";

import { ArrowRight, Award } from "lucide-react";
import { WINGS_SCHOLARSHIP_NAME, WINGS_SCHOLARSHIP_TRACKS } from "@/lib/wings-of-freedom";

type Props = {
  id?: string;
  /** Opens the full breakdown - amounts, tiers, benefits - in a modal. */
  onViewScholarships: () => void;
};

/**
 * Scholarship teaser.
 *
 * The figures deliberately are NOT on the open page: leading a women-only
 * event page with a price tag frames it as a discount rather than an
 * opportunity. Anyone who wants the numbers is one click away via
 * "View scholarships", which is the same CTA wording used everywhere else
 * that points here.
 */
export default function FreedomToFlyScholarship({ id = "freedom-to-fly", onViewScholarships }: Props) {
  return (
    <section
      id={id}
      className="relative overflow-hidden border-t border-white/5 bg-[#0E0E10] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#C5A572]/8 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
          Revealed live at the Grand Finale
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">{WINGS_SCHOLARSHIP_NAME}</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Full and partial tuition waivers for women entering aviation, across two tracks and three
          award tiers. Open to female applicants only.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {WINGS_SCHOLARSHIP_TRACKS.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A572]" aria-hidden />
              <div>
                <p className="text-[15px] font-semibold text-white">{t.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-400">
                  Tuition waivers towards {t.towards}.
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onViewScholarships}
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-8 py-4 text-base font-semibold text-[#1A1A1A] shadow-[0_12px_34px_rgba(197,165,114,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
        >
          View scholarships
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
