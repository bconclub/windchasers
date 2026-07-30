"use client";

import Image from "next/image";
import { ArrowRight, Plane, Sparkles } from "lucide-react";

export type WingsTrack = "pilot" | "cabin_crew";

type Props = {
  heading?: string;
  subheading?: string;
  onSelect: (track: WingsTrack) => void;
  /** Opens the scholarship breakdown - the amounts live there, not here. */
  onViewScholarships: () => void;
};

const CARDS: {
  id: WingsTrack;
  title: string;
  desc: string;
  chips: string[];
  image: string;
  imageAlt: string;
  Icon: typeof Plane;
}[] = [
  {
    id: "pilot",
    title: "The Pilot Path",
    desc: "DGCA written exams, Class 1 and Class 2 medicals, and how to actually choose a flight school.",
    chips: ["DGCA written exams", "Class 1 & 2 medicals", "Flight school selection"],
    // Our own footage beats the pilot-training page's stock here: that page's
    // cockpit shot is two male pilots, and its student shot crops to legs at
    // this aspect. This is women actually flying the sim at last year's event.
    image: "/wings-of-freedom/simulator.jpg",
    imageAlt: "Attendees at the flight simulator controls with an instructor",
    Icon: Plane,
  },
  {
    id: "cabin_crew",
    title: "The Cabin Crew Path",
    desc: "Airline interviews, premium hospitality standards, and what life on the roster is really like.",
    chips: ["Airline interviews", "Premium hospitality", "Life on the roster"],
    // From the cabin-crew page.
    image: "/cabin crew/page images/cabin crew 1.webp",
    imageAlt: "Cabin crew walking through an airport terminal",
    Icon: Sparkles,
  },
];

/**
 * Pick-your-track cards. Forked from WebinarAudienceCards rather than reused:
 * that component's signature is `"student" | "parent"` and its second card is
 * literally "For Parents", which on a women-only page would read as if parents
 * were the co-audience. Here the split is Pilot vs Cabin Crew - the actual
 * self-identification question, and the axis both the masterclass and the
 * scholarship are organised around.
 */
export default function WingsOfFreedomTrackCards({
  heading = "Two paths. Pick yours.",
  subheading = "The masterclass and the scholarship both split into these two tracks.",
  onSelect,
  onViewScholarships,
}: Props) {
  return (
    <section className="relative border-t border-white/5 bg-[#1B1B1E] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-white md:text-4xl">{heading}</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">{subheading}</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {CARDS.map(({ id, title, desc, chips, image, imageAlt, Icon }) => (
            <div
              key={id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]"
            >
              <div className="relative h-44 w-full overflow-hidden sm:h-52">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/25 to-transparent"
                />
              </div>

              <div className="p-6">
              <Icon className="mb-3 h-6 w-6 text-[#C5A572]" aria-hidden />
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-400">{desc}</p>

              <ul className="mt-4 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-gray-300"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
                >
                  Book my slot
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={onViewScholarships}
                  className="text-[13px] font-semibold text-[#C5A572] hover:text-[#d4b789]"
                >
                  View scholarships &rarr;
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
