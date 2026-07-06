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
} from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";
import SchoolCard from "./SchoolCard";

/* ─── helpers ─────────────────────────────────────────────────────────── */

// ISO 3166-1 alpha-2 → flag emoji via regional indicator symbols.
function flagEmoji(code?: string): string {
  if (!code || code.length !== 2) return "🏳️";
  const cc = code.toUpperCase();
  const A = 0x1f1e6;
  return String.fromCodePoint(A + (cc.charCodeAt(0) - 65), A + (cc.charCodeAt(1) - 65));
}

/* ─── Stats band ──────────────────────────────────────────────────────── */

export function StatsBand({ schools }: { schools: FlightSchool[] }) {
  const stats = useMemo(() => {
    const countries = new Set(schools.map((s) => s.country)).size;
    const partners = schools.filter((s) => s.isPartner).length;
    return [
      { value: schools.length ? `${schools.length}+` : "—", label: "Flight schools mapped" },
      { value: countries ? `${countries}` : "—", label: "Countries covered" },
      { value: partners ? `${partners}` : "—", label: "WindChasers partners" },
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

export function PartnerCountries({
  schools,
  onPickCountry,
  activeCountry,
}: {
  schools: FlightSchool[];
  onPickCountry: (country: string) => void;
  activeCountry: string;
}) {
  const countries = useMemo(() => {
    const map: Record<string, { name: string; code: string; count: number; partners: number }> = {};
    for (const s of schools) {
      const key = s.country;
      if (!map[key]) map[key] = { name: s.country, code: s.countryCode, count: 0, partners: 0 };
      map[key].count += 1;
      if (s.isPartner) map[key].partners += 1;
    }
    return Object.values(map).sort((a, b) => {
      if (b.partners !== a.partners) return b.partners - a.partners;
      return b.count - a.count;
    });
  }, [schools]);

  if (countries.length === 0) return null;

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
          {countries.map((c) => {
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
                <span className="text-2xl leading-none">{flagEmoji(c.code)}</span>
                <span className="min-w-0">
                  <span className="block text-white text-sm font-medium truncate">{c.name}</span>
                  <span className="block text-white/40 text-xs">
                    {c.count} school{c.count !== 1 ? "s" : ""}
                    {c.partners > 0 && (
                      <span className="text-[#C5A572]"> · {c.partners} partner{c.partners !== 1 ? "s" : ""}</span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#C5A572]/12 border border-[#C5A572]/25 flex items-center justify-center mb-4">
                <s.icon className="w-5 h-5 text-[#C5A572]" />
              </div>
              <span className="absolute top-0 right-0 text-white/8 text-5xl font-bold leading-none">
                {i + 1}
              </span>
              <h3 className="text-white font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
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
