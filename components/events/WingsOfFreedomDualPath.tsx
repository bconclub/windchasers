"use client";

import Image from "next/image";
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
    <section className="relative overflow-hidden border-t border-white/5 bg-[#171719] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Two ways to take part</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Women are about 5% of India&apos;s commercial pilots. For one day we&apos;re building a
          room where that isn&apos;t true.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {/* overflow-hidden + bottom-0 docks each cutout into the card's
              bottom-right corner, so it reads as sitting on the card rather
              than floating over the section above it. */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]">
            <Image
              src="/wings-of-freedom/cutout-classroom.webp"
              alt=""
              aria-hidden
              width={936}
              height={460}
              priority={false}
              className="pointer-events-none absolute bottom-0 right-0 w-[48%] max-w-[210px] select-none sm:w-[52%] sm:max-w-[310px]"
            />
            <Ticket className="mb-3 h-6 w-6 text-[#C5A572]" aria-hidden />
            {/* Full-width copy on mobile: the cutout is short and bottom-
                anchored there, so only the button row sits alongside it.
                Constraining the text below sm squeezed it into four lines. */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3] sm:max-w-[60%]">
              Free · Open to all women
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white sm:max-w-[62%] sm:text-xl">Book your slot</h3>
            <p className="mt-2 pr-2 text-[13px] leading-relaxed text-gray-400 sm:max-w-[52%] sm:pr-0">
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
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]">
            <Image
              src="/wings-of-freedom/cutout-student.webp"
              alt=""
              aria-hidden
              width={642}
              height={520}
              priority={false}
              className="pointer-events-none absolute bottom-0 right-0 w-[42%] max-w-[170px] select-none sm:w-[44%] sm:max-w-[240px]"
            />
            <Award className="mb-3 h-6 w-6 text-[#C5A572]" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3] sm:max-w-[60%]">
              Merit-based · Female applicants only
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white sm:max-w-[62%] sm:text-xl">Apply for a scholarship</h3>
            {/* Amounts intentionally omitted here - they live behind the
                "View scholarships" CTA so the page doesn't lead with a figure. */}
            <p className="mt-2 pr-2 text-[13px] leading-relaxed text-gray-400 sm:max-w-[56%] sm:pr-0">
              Tuition waivers for pilot and cabin crew training, revealed live at the Grand Finale.
            </p>
            <button
              type="button"
              onClick={onScholarship}
              className="group mt-5 inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
            >
              See the scholarship
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
