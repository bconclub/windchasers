"use client";

import { Flag, BookOpen, Plane, Trophy, type LucideIcon } from "lucide-react";
import { WINGS_AGENDA, type WingsAgendaBlock } from "@/lib/wings-of-freedom";

const ICONS: Record<WingsAgendaBlock["icon"], LucideIcon> = {
  flag: Flag,
  "book-open": BookOpen,
  plane: Plane,
  trophy: Trophy,
};

/**
 * The run of show, as modal content rather than its own page section.
 *
 * The page previously carried both "Event Agenda" (six highlight cards) and
 * "How the day runs" (this timeline) back to back - two headings saying the
 * same thing. The cards stayed on the page as the summary; the full timings
 * moved in here, behind a button.
 *
 * Content only - no section chrome, no heading; WingsModal supplies those.
 */
export default function WingsAgendaTimeline() {
  return (
    <ol className="space-y-3">
      {WINGS_AGENDA.map((block) => {
        const Icon = ICONS[block.icon];
        return (
          <li
            key={block.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
              <div className="sm:w-[136px] sm:shrink-0">
                <span className="inline-flex items-center rounded-full border border-[#C5A572]/30 bg-[#C5A572]/10 px-2.5 py-1 text-[11.5px] font-semibold tabular-nums text-[#E7D5B3]">
                  {block.timeLabel}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-[18px] w-[18px] shrink-0 text-[#C5A572]" aria-hidden />
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
                    {block.kicker}
                  </p>
                </div>
                <h3 className="mt-1.5 text-[16.5px] font-semibold text-white">{block.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-gray-400">{block.description}</p>

                {block.tracks && (
                  <div className="mt-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {block.tracks.map((t) => (
                      <div key={t.title} className="rounded-xl border border-white/10 bg-[#0E0E10] p-3.5">
                        <p className="text-[13.5px] font-semibold text-white">{t.title}</p>
                        <ul className="mt-2 space-y-1">
                          {t.points.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-[12.5px] text-gray-400">
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
                    <span className="mt-3.5 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10.5px] font-medium text-gray-400">
                      45-minute rotations
                    </span>
                    <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {block.zones.map((z) => (
                        <div key={z.n} className="rounded-xl border border-white/10 bg-[#0E0E10] p-3.5">
                          <span className="select-none text-[22px] font-extrabold leading-none tabular-nums text-white/[0.09]">
                            {z.n}
                          </span>
                          <p className="mt-1.5 text-[13px] font-semibold text-white">{z.title}</p>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-gray-400">{z.description}</p>
                          <p className="mt-1.5 text-[11.5px] font-medium text-[#E7D5B3]">{z.highlight}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
