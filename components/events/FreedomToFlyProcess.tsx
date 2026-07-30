"use client";

import { ArrowRight } from "lucide-react";
import { WINGS_SCHOLARSHIP_STAGES, WINGS_SCHOLARSHIP_NAME } from "@/lib/wings-of-freedom";

type Props = {
  id?: string;
  /** Opens the register modal with the scholarship block already expanded. */
  onApply: () => void;
};

/**
 * How a scholarship is actually decided.
 *
 * Without this the page reads as if ticking a box on a form makes you
 * scholarship-eligible. It doesn't: there's an aptitude test, documents, an
 * interview and a counselling session behind it. Showing the stages before the
 * apply CTA sets the expectation in the right order, and it is deliberately an
 * open section rather than modal content - the one thing nobody should have to
 * click to discover is what they're signing up for.
 */
export default function FreedomToFlyProcess({ id = "how-to-apply", onApply }: Props) {
  return (
    <section
      id={id}
      className="relative border-t border-white/5 bg-[#141417] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
          Five stages
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">How you win one</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          {WINGS_SCHOLARSHIP_NAME} is earned, not claimed. Applying puts you in the process below.
        </p>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {WINGS_SCHOLARSHIP_STAGES.map(({ n, title, desc }) => (
            <li
              key={n}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40"
            >
              <span className="select-none text-[38px] font-extrabold leading-none tracking-tight tabular-nums text-white/[0.09]">
                {n}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-gray-400">{desc}</p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onApply}
          className="group mt-10 inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
        >
          Start my application
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
