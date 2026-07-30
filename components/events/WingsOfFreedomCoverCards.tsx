"use client";

import { Flag, Mic, Map, Gamepad2, Sparkles, Award, ArrowRight } from "lucide-react";

const ITEMS = [
  { n: "01", Icon: Flag, title: "Flag Hoisting", desc: "We open Independence Day together on campus." },
  { n: "02", Icon: Mic, title: "Captain's Keynote", desc: "A serving female airline captain, on how she got there." },
  { n: "03", Icon: Map, title: "Blueprint Masterclass", desc: "The pilot route and the cabin crew route, laid out plainly." },
  { n: "04", Icon: Gamepad2, title: "Simulator Contest", desc: "Fly the sim and compete for the smoothest landing." },
  { n: "05", Icon: Sparkles, title: "Glam, Safety & RT Labs", desc: "Airline presentation, exit drills, and live ATC phraseology." },
  { n: "06", Icon: Award, title: "Scholarship Reveal", desc: "Freedom to Fly, announced live at the finale." },
] as const;

/**
 * "What happens on 15 August" - six numbered cards. Forked from
 * OfflineEventCoverCards (whose only prop is onAgenda; its heading, subcopy
 * and all six items are module consts, so reuse would mean rewriting its
 * body). The original stays live on the demo-class pages.
 */
export default function WingsOfFreedomCoverCards({
  onAgenda,
  onFullAgenda,
}: {
  onAgenda?: () => void;
  /** Opens the full run-of-show timeline in a modal. */
  onFullAgenda?: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-[#171719] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#C5A572]/8 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Event Agenda</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Six things you&apos;ll do on the day.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {ITEMS.map(({ n, Icon, title, desc }) => (
            <div
              key={n}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]"
            >
              {/* Number and icon share one top row, text runs the full card
                  width underneath. Previously the number sat in its own left
                  gutter, squeezing the copy into a narrow column and leaving
                  dead space below the digits. */}
              <div className="flex items-center justify-between">
                <span className="select-none text-[38px] font-extrabold leading-none tracking-tight tabular-nums text-white/[0.09] transition-colors group-hover:text-[#C5A572]/25">
                  {n}
                </span>
                <Icon className="h-6 w-6 shrink-0 text-[#C5A572]" aria-hidden />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          {onFullAgenda && (
            <button
              type="button"
              onClick={onFullAgenda}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A572] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
            >
              See the full agenda
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
          {onAgenda && (
            <button
              type="button"
              onClick={onAgenda}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
            >
              Book My Slot
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
