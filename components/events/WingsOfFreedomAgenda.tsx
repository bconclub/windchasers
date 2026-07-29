"use client";

import { Flag, BookOpen, Plane, Trophy, ArrowRight, type LucideIcon } from "lucide-react";
import { WINGS_AGENDA, type WingsAgendaBlock } from "@/lib/wings-of-freedom";

const ICONS: Record<WingsAgendaBlock["icon"], LucideIcon> = {
  flag: Flag,
  "book-open": BookOpen,
  plane: Plane,
  trophy: Trophy,
};

type Props = { id?: string; onReserve?: () => void };

/**
 * Run of show. Uses PilotJourneyTimeline's visual language (centre gold rail,
 * alternating cards) but the node bubble carries the TIME rather than an index
 * - a schedule's spine is the clock. The action-zones block nests a 3-card
 * grid because it's a rotation, not a talk.
 */
export default function WingsOfFreedomAgenda({ id = "agenda", onReserve }: Props) {
  return (
    <section id={id} className="relative overflow-hidden border-t border-white/5 bg-[#0B0B0D] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-[#C5A572]/8 blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">How the day runs</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Four and a half hours, three hands-on zones, one scholarship reveal.
        </p>

        <ol className="mt-12 space-y-4">
          {WINGS_AGENDA.map((block) => {
            const Icon = ICONS[block.icon];
            return (
              <li
                key={block.id}
                className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-[#C5A572]/40 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <div className="sm:w-[150px] sm:shrink-0">
                    <span className="inline-flex items-center rounded-full border border-[#C5A572]/30 bg-[#C5A572]/10 px-3 py-1 text-[12px] font-semibold tabular-nums text-[#E7D5B3]">
                      {block.timeLabel}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 shrink-0 text-[#C5A572]" aria-hidden />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
                        {block.kicker}
                      </p>
                    </div>
                    <h3 className="mt-1.5 text-lg font-semibold text-white">{block.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-gray-400">{block.description}</p>

                    {block.tracks && (
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {block.tracks.map((t) => (
                          <div key={t.title} className="rounded-xl border border-white/10 bg-[#0E0E10] p-4">
                            <p className="text-sm font-semibold text-white">{t.title}</p>
                            <ul className="mt-2 space-y-1">
                              {t.points.map((p) => (
                                <li key={p} className="flex items-start gap-2 text-[13px] text-gray-400">
                                  <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#C5A572]" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {block.zones && (
                      <>
                        <span className="mt-4 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-gray-400">
                          45-minute rotations
                        </span>
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {block.zones.map((z) => (
                            <div key={z.n} className="rounded-xl border border-white/10 bg-[#0E0E10] p-4">
                              <span className="select-none text-[26px] font-extrabold leading-none tabular-nums text-white/[0.09]">
                                {z.n}
                              </span>
                              <p className="mt-1.5 text-sm font-semibold text-white">{z.title}</p>
                              <p className="mt-1 text-[13px] leading-relaxed text-gray-400">{z.description}</p>
                              <p className="mt-2 text-[12px] font-medium text-[#E7D5B3]">{z.highlight}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {block.id === "finale" && (
                      <a
                        href="#freedom-to-fly"
                        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#C5A572] hover:text-[#d4b789]"
                      >
                        See the Freedom to Fly scholarship
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {onReserve && (
          <button
            type="button"
            onClick={onReserve}
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
          >
            Book My Slot
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </section>
  );
}
