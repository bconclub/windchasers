"use client";

import { WINGS_FAQ } from "@/lib/wings-of-freedom";

type Props = { id?: string };

/**
 * FAQ using native <details> - crawlable without JS, and unlike the
 * summercamp accordion's max-h-40 it can't clip a long answer (several of
 * these run past three lines).
 */
export default function WingsOfFreedomFaq({ id = "faq" }: Props) {
  return (
    <section id={id} className="relative border-t border-white/5 bg-[#0E0E10] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Questions</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />

        <div className="mt-8 space-y-3">
          {WINGS_FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-[#C5A572]/40 open:border-[#C5A572]/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-white marker:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="shrink-0 text-xl leading-none text-[#C5A572] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
