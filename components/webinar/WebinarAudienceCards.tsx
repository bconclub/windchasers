"use client";

import { GraduationCap, Users, ArrowRight } from "lucide-react";

type Audience = "student" | "parent";

type Card = {
  audience: Audience;
  Icon: typeof GraduationCap;
  title: string;
  desc: string;
  chips: string[];
  image: string;
  /** Which edge the photo sits on (text goes to the opposite edge) on desktop. */
  imageSide: "left" | "right";
};

const CARDS: Card[] = [
  {
    audience: "student",
    Icon: GraduationCap,
    title: "For Aspiring Pilots",
    desc: "Get a clear roadmap, understand costs, top schools, and explore career routes.",
    chips: ["Clear roadmap", "Cost clarity", "Career options"],
    image: "/unsplash/webinar-aspiring-AhteFvRl8uc.jpg",
    imageSide: "left",
  },
  {
    audience: "parent",
    Icon: Users,
    title: "For Parents",
    desc: "Understand the investment, timelines, and realistic outcomes before your child commits.",
    chips: ["Honest insights", "Timeline clarity", "Real outcomes"],
    image: "/unsplash/webinar-parents-tBYDY8CXMyY.jpg",
    imageSide: "right",
  },
];

/**
 * "Who should attend" — two audience cards (Aspiring Pilots / Parents), each a
 * photo-backed panel with icon, blurb, feature chips, and a self-select CTA.
 * onSelect(audience) fires the page's register flow tagged for that audience.
 */
export default function WebinarAudienceCards({
  heading = "Who should attend",
  subheading = "Designed for future pilots and the people who support their journey.",
  onSelect,
}: {
  heading?: string;
  subheading?: string;
  onSelect: (audience: Audience) => void;
}) {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#111] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{heading}</h2>
        <p className="mt-2 text-gray-400 max-w-2xl">{subheading}</p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          {CARDS.map(({ audience, Icon, title, desc, chips, image, imageSide }) => (
            <div
              key={audience}
              className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10 min-h-[300px] sm:min-h-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              {/* photo */}
              <img
                src={image}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
              />
              {/* directional scrim — dark on the text side, plus a bottom scrim for mobile legibility */}
              <div
                className={`absolute inset-0 ${
                  imageSide === "left"
                    ? "bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/92 to-transparent"
                    : "bg-gradient-to-r from-[#0B0B0B] via-[#0B0B0B]/92 to-transparent"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/85 via-transparent to-transparent lg:hidden" />

              {/* content — opposite edge from the photo on desktop; full-width on mobile */}
              <div
                className={`relative flex h-full min-h-[300px] sm:min-h-[280px] items-end lg:items-center ${
                  imageSide === "left" ? "lg:justify-end" : "lg:justify-start"
                }`}
              >
                <div className="w-full lg:w-[58%] p-6 sm:p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#C5A572]/15 ring-1 ring-[#C5A572]/30">
                    <Icon className="h-5 w-5 text-[#C5A572]" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-xl sm:text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-gray-300">{desc}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-[#C5A572]/30 bg-[#C5A572]/10 px-3 py-1 text-[11px] font-medium text-[#E7D5B3]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(audience)}
                    className="group/btn mt-5 inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-6 py-3 text-sm font-semibold text-[#1A1A1A] shadow-[0_10px_28px_rgba(197,165,114,0.3)] transition-all duration-300 hover:bg-[#d4b789] hover:-translate-y-0.5"
                  >
                    This session is for me
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
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
