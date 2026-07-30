"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TEAM } from "@/lib/team";

/**
 * Who's running the day.
 *
 * Shares the roster with the homepage via lib/team.ts but not the markup - the
 * homepage cards use the design-system tokens (surface-container, on-surface-
 * variant), which read as a different product next to this page's gold-on-near-
 * black palette. Same people, styled for this page.
 */
export default function WingsTeamStrip({ id = "team" }: { id?: string }) {
  return (
    <section
      id={id}
      className="relative border-t border-white/5 bg-[#171719] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
          Who you&apos;ll meet
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">The team on the day</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          The instructors and mentors running the masterclass, the zones and the interviews.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {TEAM.map((t) => (
            <div
              key={t.name}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-[#C5A572]/40"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-black/30">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.06] group-hover:grayscale-0"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#171719] via-[#171719]/70 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="truncate text-[13px] font-semibold text-[#E7D5B3]">{t.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-white/55">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/team"
          className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
        >
          Meet the full team
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
