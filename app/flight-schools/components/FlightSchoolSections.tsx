"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Globe2,
  GraduationCap,
  ClipboardCheck,
  Plane,
  ChevronDown,
  ArrowRight,
  Star,
} from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";
import { FEATURED_SCHOOLS } from "../lib/featured-schools";
import SchoolCard from "./SchoolCard";

/* ─── helpers ─────────────────────────────────────────────────────────── */

// Regional-indicator flag emoji render as plain letter codes on Windows
// (Chrome ships no color-flag glyphs there), which reads as broken. A real
// flag image works everywhere.
function FlagIcon({ code, className = "" }: { code?: string; className?: string }) {
  if (!code || code.length !== 2) return null;
  return (
    <img
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt=""
      className={`inline-block object-cover rounded-[3px] ${className}`}
      loading="lazy"
    />
  );
}

/* ─── Stats band ──────────────────────────────────────────────────────── */

export function StatsBand({ schools }: { schools: FlightSchool[] }) {
  const stats = useMemo(() => {
    const countries = new Set(schools.map((s) => s.country)).size;
    // "Partners" = the schools the brand actually curates and vouches for
    // (Featured Flight Schools), not the auto-imported directory's stale
    // is_partner flag.
    const partners = FEATURED_SCHOOLS.length;
    return [
      { value: schools.length ? `${schools.length}+` : "—", label: "Flight schools mapped" },
      { value: countries ? `${countries}` : "—", label: "Countries covered" },
      { value: partners ? `${partners}` : "—", label: "Exclusive Partners" },
      { value: "1:1", label: "Counsellor guidance" },
    ];
  }, [schools]);

  return (
    <section className="bg-[#060b14] border-y border-white/8">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-[#C5A572] text-3xl md:text-4xl font-bold">{s.value}</p>
            <p className="text-white/50 text-xs md:text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Partner countries ───────────────────────────────────────────────── */

// Partner countries = the countries our curated Featured (partner) schools are
// in — the single source of truth, not the directory's stale is_partner flag.
const PARTNER_COUNTRIES = new Set(FEATURED_SCHOOLS.map((s) => s.country));

export function PartnerCountries({
  schools,
  onPickCountry,
  activeCountry,
}: {
  schools: FlightSchool[];
  onPickCountry: (country: string) => void;
  activeCountry: string;
}) {
  const [showAllCountries, setShowAllCountries] = useState(false);
  const countries = useMemo(() => {
    const map: Record<string, { name: string; code: string; count: number; isPartner: boolean }> = {};
    for (const s of schools) {
      const key = s.country;
      if (!map[key]) map[key] = { name: s.country, code: s.countryCode, count: 0, isPartner: PARTNER_COUNTRIES.has(s.country) };
      map[key].count += 1;
    }
    return Object.values(map).sort((a, b) => {
      // Partner countries first, then by school count.
      if (a.isPartner !== b.isPartner) return a.isPartner ? -1 : 1;
      return b.count - a.count;
    });
  }, [schools]);

  if (countries.length === 0) return null;

  // Partners are the point of this section - they are where we can actually
  // place a student - so they are shown, not buried in an alphabetical wall of
  // 41 flags. The rest are still one tap away for anyone browsing.
  const partners = countries.filter((c) => c.isPartner);
  const others = countries.filter((c) => !c.isPartner);

  return (
    <section className="bg-[#080d17]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="text-[#C5A572] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Where we&apos;re connected
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">
            Countries we&apos;re tied up with
          </h2>
          <p className="text-white/50 text-sm md:text-base mt-3 leading-relaxed">
            Pick a country to see it on the map above. These are the regions where we help
            students find, compare, and enrol in the right academy.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(showAllCountries ? countries : partners).map((c) => {
            const active = activeCountry === c.name;
            return (
              <button
                key={c.name}
                onClick={() => onPickCountry(c.name)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  active
                    ? "bg-[#C5A572]/12 border-[#C5A572]/50"
                    : "bg-[#0f1521] border-white/10 hover:border-[#C5A572]/40"
                }`}
              >
                <FlagIcon code={c.code} className="w-7 h-5 flex-shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-medium truncate">{c.name}</span>
                    {/* A star, not a sentence. "· Partner country" wrapped every
                        partner card onto a second line and shouted louder than
                        the country it was labelling. */}
                    {c.isPartner && (
                      <Star
                        className="w-3.5 h-3.5 flex-shrink-0 text-[#C5A572] fill-[#C5A572]"
                        aria-label="Partner country"
                      />
                    )}
                  </span>
                  <span className="block text-white/40 text-xs">
                    {c.count} school{c.count !== 1 ? "s" : ""}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {others.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAllCountries((v) => !v)}
            aria-expanded={showAllCountries}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-[#C5A572]/50 hover:text-white"
          >
            {showAllCountries
              ? "Show partner countries only"
              : `See all ${countries.length} countries`}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showAllCountries ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
    </section>
  );
}

/* ─── Partner schools grid ────────────────────────────────────────────── */

export function PartnerSchoolsGrid({
  schools,
  onSelect,
  activeCountry,
}: {
  schools: FlightSchool[];
  onSelect: (s: FlightSchool) => void;
  activeCountry: string;
}) {
  const [showAll, setShowAll] = useState(false);

  // Prefer partners; if there aren't enough, backfill with top-scored schools.
  const featured = useMemo(() => {
    const base = activeCountry
      ? schools.filter((s) => s.country === activeCountry)
      : schools;
    const partners = base.filter((s) => s.isPartner);
    const rest = base.filter((s) => !s.isPartner);
    return [...partners, ...rest];
  }, [schools, activeCountry]);

  const visible = showAll ? featured : featured.slice(0, 8);

  if (featured.length === 0) return null;

  return (
    <section className="bg-[#060b14]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-[#C5A572] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Featured academies
            </p>
            <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">
              {activeCountry ? `Flight schools in ${activeCountry}` : "Partner flight schools"}
            </h2>
            <p className="text-white/50 text-sm md:text-base mt-3 leading-relaxed">
              Hand-picked academies we work with directly. Tap any card for photos, ratings,
              certifications, and a direct line to our counsellors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visible.map((s) => (
            <SchoolCard key={s.id} school={s} onSelect={onSelect} />
          ))}
        </div>

        {featured.length > 8 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white/70 text-sm hover:border-[#C5A572]/50 hover:text-white transition-colors"
            >
              {showAll ? "Show fewer" : `Show all ${featured.length}`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── How it works ────────────────────────────────────────────────────── */

export function HowItWorks() {
  const steps = [
    {
      icon: Globe2,
      title: "Explore the network",
      body: "Browse certified academies across the globe on the map. Filter by country and compare at a glance.",
    },
    {
      icon: GraduationCap,
      title: "Shortlist with a counsellor",
      body: "Tell us your goal and budget. We match you to schools that fit — no false promises, real costs.",
    },
    {
      icon: ClipboardCheck,
      title: "Get admission support",
      body: "We help with applications, DGCA conversion questions, visas, and everything in between.",
    },
    {
      icon: Plane,
      title: "Start training",
      body: "Enrol with confidence and begin your journey from ground school to the cockpit.",
    },
  ];

  return (
    <section className="bg-[#080d17] border-y border-white/8">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-2xl mb-12">
          <p className="text-[#C5A572] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            How it works
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">
            From the map to the cockpit
          </h2>
        </div>

        {/* A journey, not four unrelated cards.
            The old version put a ghosted numeral in the far corner of each
            block and left the blocks floating apart, so nothing said "these
            happen in order" - which is the only thing this section is for.
            Now every step is a numbered node threaded onto one line: vertical
            on mobile, horizontal from lg up, with the connector stopping at
            the last node so the sequence ends where the journey does. */}
        <ol className="relative lg:grid lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <li key={s.title} className="relative pl-14 pb-9 last:pb-0 lg:pl-0 lg:pb-0">
              {/* connector */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[19px] top-11 bottom-1 w-px bg-gradient-to-b from-[#C5A572]/45 to-[#C5A572]/5 lg:left-auto lg:top-[19px] lg:bottom-auto lg:h-px lg:w-full lg:translate-x-10 lg:bg-gradient-to-r lg:from-[#C5A572]/45 lg:to-[#C5A572]/5"
                />
              )}

              {/* the node: number and icon together, so the order is the first
                  thing you read rather than a decorative afterthought */}
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A572]/40 bg-[#C5A572]/12 text-sm font-bold text-[#C5A572] lg:static lg:mb-5 lg:flex">
                {i + 1}
              </span>

              <div className="lg:pr-4">
                <div className="mb-2 flex items-center gap-2">
                  <s.icon className="h-4 w-4 flex-shrink-0 text-[#C5A572]" />
                  <h3 className="text-base font-semibold text-white">{s.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────────────── */

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How does WindChasers work with these flight schools?",
    a: "We maintain direct relationships with partner academies worldwide and stay on top of the wider network. We help you compare them objectively and connect you to the right one for your goals and budget.",
  },
  {
    q: "Do I have to train abroad?",
    a: "No. We map international schools so you can weigh every option, but we also guide you through DGCA-aligned training in India. Our counsellors help you decide what actually fits.",
  },
  {
    q: "Are these licences convertible to DGCA?",
    a: "Many are. Schools marked “DGCA Convertible” issue licences that can be converted for flying in India, subject to DGCA requirements. We walk you through the conversion process.",
  },
  {
    q: "Is there a fee to use WindChasers?",
    a: "Talking to a counsellor and getting shortlisted is free. Reach out and we’ll lay out the real costs of each school with no hidden surprises.",
  },
  {
    q: "How do I get details about a specific school?",
    a: "Tap any marker on the map or any card above to open its profile — photos, ratings, certifications, and a direct enquiry form that reaches our team.",
  },
];

export function SchoolsFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-[#060b14]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-[#C5A572] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Questions
          </p>
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight">
            Frequently asked
          </h2>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-white font-medium text-[15px]">{f.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A572] flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-white/55 text-sm leading-relaxed pb-5 -mt-1">{f.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA band ────────────────────────────────────────────────────────── */

export function CtaBand() {
  return (
    <section className="bg-[#080d17]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="rounded-3xl border border-[#C5A572]/25 bg-gradient-to-br from-[#C5A572]/10 to-transparent px-6 md:px-12 py-12 text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight max-w-2xl mx-auto">
            Not sure which school is right for you?
          </h2>
          <p className="text-white/55 text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Talk to a WindChasers counsellor. We&apos;ll compare your options honestly and map
            out the fastest, most affordable path to your licence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C5A572] text-black text-sm font-semibold hover:bg-[#C5A572]/90 transition-colors"
            >
              Talk to a counsellor
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pilot-training"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white/80 text-sm font-medium hover:border-white/40 transition-colors"
            >
              Explore pilot training
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
