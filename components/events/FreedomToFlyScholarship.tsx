"use client";

import { Compass, Stethoscope, Wallet, Globe, Users, Mic, ArrowRight, type LucideIcon } from "lucide-react";
import {
  WINGS_SCHOLARSHIP_NAME,
  WINGS_SCHOLARSHIP_TRACKS,
  WINGS_SCHOLARSHIP_TIERS,
  WINGS_SCHOLARSHIP_BENEFITS,
} from "@/lib/wings-of-freedom";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  stethoscope: Stethoscope,
  wallet: Wallet,
  globe: Globe,
  users: Users,
  mic: Mic,
};

type Props = { id?: string; onApply: () => void };

/**
 * The scholarship: what it's worth, the award tiers, and what comes with it.
 * The apply button lives HERE rather than in the hero, so nobody reaches an
 * accept-terms checkbox without having scrolled past the tiers and the link to
 * the full clauses.
 */
export default function FreedomToFlyScholarship({ id = "freedom-to-fly", onApply }: Props) {
  return (
    <section id={id} className="relative overflow-hidden border-t border-white/5 bg-[#0E0E10] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#C5A572]/8 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
          Revealed live at the Grand Finale
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">{WINGS_SCHOLARSHIP_NAME}</h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Our scholarship initiative for women entering aviation. Open to female applicants only.
        </p>

        {/* What it's worth, per track */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {WINGS_SCHOLARSHIP_TRACKS.map((t) => (
            <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <p className="text-sm font-semibold text-white">{t.label}</p>
              <p className="mt-2 text-[38px] font-extrabold leading-none tabular-nums text-[#C5A572]">
                {t.amountLabel}
              </p>
              <p className="mt-2 text-[14px] text-gray-400">towards {t.towards}</p>
              <p className="mt-3 text-[12px] text-gray-500">Waiver applies to {t.waiverAppliesTo}.</p>
            </div>
          ))}
        </div>

        {/* Award tiers */}
        <h3 className="mt-12 text-xl font-semibold text-white">The award tiers</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {WINGS_SCHOLARSHIP_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border bg-white/[0.02] p-6 ${
                tier.featured ? "border-[#C5A572]/50 ring-1 ring-[#C5A572]/40" : "border-white/10"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-2.5 left-6 rounded-full bg-[#C5A572] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Full waiver
                </span>
              )}
              <p className="text-[34px] font-extrabold leading-none tabular-nums text-white">{tier.waiver}</p>
              <p className="mt-2 text-sm font-semibold text-[#E7D5B3]">{tier.name}</p>
              <p className="mt-1 text-[13px] text-gray-400">{tier.blurb}</p>
              <p className="mt-3 text-[12px] text-gray-500">{tier.seats}</p>
            </div>
          ))}
        </div>

        {/* What else comes with it */}
        <h3 className="mt-12 text-xl font-semibold text-white">What else comes with it</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WINGS_SCHOLARSHIP_BENEFITS.map((b) => {
            const Icon = ICONS[b.icon] ?? Compass;
            return (
              <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Icon className="mb-2.5 h-5 w-5 text-[#C5A572]" aria-hidden />
                <p className="text-sm font-semibold text-white">{b.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-gray-400">{b.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onApply}
            className="group inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-8 py-4 text-base font-semibold text-[#1A1A1A] shadow-[0_12px_34px_rgba(197,165,114,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
          >
            Apply for {WINGS_SCHOLARSHIP_NAME}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <a
            href="#freedom-to-fly-terms"
            className="text-[13px] font-semibold text-[#C5A572] underline underline-offset-4 hover:text-[#d4b789]"
          >
            Read the eligibility &amp; terms
          </a>
        </div>
      </div>
    </section>
  );
}
