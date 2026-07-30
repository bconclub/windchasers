"use client";

import { WINGS_TERMS, WINGS_TERMS_VERSION, WINGS_SCHOLARSHIP_NAME } from "@/lib/wings-of-freedom";

type Props = { id?: string };

/**
 * The full clause list, always visible rather than behind an accordion - the
 * apply checkbox says "I have read and accept", and hiding the text behind a
 * click makes that claim weaker (and costs the crawlable copy). Grouped under
 * six subheads because seventeen flat clauses is a wall nobody reads.
 */
export default function FreedomToFlyTerms({ id = "freedom-to-fly-terms" }: Props) {
  return (
    <section id={id} className="relative border-t border-white/5 bg-[#141417] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-white md:text-3xl">Eligibility &amp; terms</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-[14px] text-gray-400">
          What applying to {WINGS_SCHOLARSHIP_NAME} commits you to, in full.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="md:columns-2 md:gap-10">
            {WINGS_TERMS.map((group) => (
              <div key={group.heading} className="mb-6 break-inside-avoid">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#E7D5B3]">
                  {group.heading}
                </h3>
                <ul className="mt-2.5 space-y-2">
                  {group.clauses.map((clause) => (
                    <li key={clause} className="flex items-start gap-2 text-[13px] leading-relaxed text-gray-400">
                      <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#C5A572]" />
                      {clause}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-2 border-t border-white/10 pt-4 text-[12px] text-gray-500">
            Version {WINGS_TERMS_VERSION}. WindChasers may amend or discontinue the scheme at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
