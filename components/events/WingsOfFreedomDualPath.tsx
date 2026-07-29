"use client";

import { ArrowRight, Ticket, Award } from "lucide-react";

type Props = {
  onReserve: () => void;
  onScholarship: () => void;
};

/**
 * The two ways to take part, stated explicitly right under the hero.
 * Registration and the scholarship are very different commitments, and the
 * common worry ("do I have to apply to come?") is answered in the footnote
 * rather than left to be inferred.
 */
export default function WingsOfFreedomDualPath({ onReserve, onScholarship }: Props) {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#0E0E10] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Two ways to take part</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Women are about 5% of India&apos;s commercial pilots. For one day we&apos;re building a
          room where that isn&apos;t true.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]">
            <Ticket className="mb-3 h-6 w-6 text-[#C5A572]" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
              Free · Open to all women
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">Book your slot</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-400">
              Reserve a seat for 15 August. Name and phone number, and you&apos;re done.
            </p>
            <button
              type="button"
              onClick={onReserve}
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
            >
              Book My Slot
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-[12px] text-gray-500">
              You do not need to apply for a scholarship to attend.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]">
            <Award className="mb-3 h-6 w-6 text-[#C5A572]" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
              Merit-based · Female applicants only
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">Apply for a scholarship</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-400">
              Up to &#8377;2,35,000 off pilot training or &#8377;80,000 off cabin crew training.
              Revealed live at the Grand Finale.
            </p>
            <button
              type="button"
              onClick={onScholarship}
              className="group mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
            >
              See the scholarship
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="mt-4 text-[12px] text-gray-500">
              Applying doesn&apos;t guarantee an award - shortlisted candidates are interviewed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
