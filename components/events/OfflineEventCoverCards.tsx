"use client";

import { Route, Wrench, Users, Wallet, GraduationCap, MessageCircle, ArrowRight } from "lucide-react";

const ITEMS = [
  { n: "01", Icon: Route, title: "Course Roadmap", desc: "The exact path from where you are to your licence." },
  { n: "02", Icon: Wrench, title: "Simulator Experience", desc: "Sit in the simulator and get a feel for real training." },
  { n: "03", Icon: Users, title: "Meet the Instructors", desc: "Talk to the people who'll actually train you." },
  { n: "04", Icon: Wallet, title: "Cost & Financing", desc: "Full breakdown, loan options, and payment plans." },
  { n: "05", Icon: GraduationCap, title: "Campus Tour", desc: "See the classrooms, equipment and facility in person." },
  { n: "06", Icon: MessageCircle, title: "Live Q&A", desc: "Ask anything, one on one, no pressure." },
] as const;

/**
 * "What to expect" - six numbered cards for an in-person session, same visual
 * pattern as WebinarCoverCards (big faint index, icon, title, one-line blurb)
 * with demo-class-specific content instead of webinar agenda items.
 */
export default function OfflineEventCoverCards({ onAgenda }: { onAgenda?: () => void }) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0E0E10] border-t border-white/5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#C5A572]/8 blur-[120px]"
      />
      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white">What to expect</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 text-gray-400 max-w-2xl">
          A real look at training with WindChasers - not a slide deck.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ITEMS.map(({ n, Icon, title, desc }) => (
            <div
              key={n}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-4">
                <span className="select-none text-[42px] font-extrabold leading-none tracking-tight text-white/[0.09] tabular-nums transition-colors group-hover:text-[#C5A572]/25">
                  {n}
                </span>
                <div className="min-w-0">
                  <Icon className="mb-2.5 h-6 w-6 text-[#C5A572]" aria-hidden />
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-gray-400">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {onAgenda && (
          <button
            type="button"
            onClick={onAgenda}
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:bg-[#C5A572]/12 hover:border-[#C5A572]/70"
          >
            Reserve Your Spot
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>
    </section>
  );
}
