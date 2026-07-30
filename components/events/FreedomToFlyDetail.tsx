"use client";

import { Compass, Stethoscope, Wallet, Globe, Users, Mic, ArrowRight, type LucideIcon } from "lucide-react";
import {
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

/**
 * The scholarship in full - amounts, award tiers, and what comes with it.
 *
 * Modal content, not a page section: the figures are deliberately not on the
 * open page. Anyone who wants them clicks through from a "View scholarships"
 * CTA, which keeps the landing page about the event rather than leading with
 * a price tag.
 */
export default function FreedomToFlyDetail({ onApply }: { onApply?: () => void }) {
  return (
    <div>
      <p className="text-[14px] leading-relaxed text-gray-400">
        Our scholarship initiative for women entering aviation. Open to female applicants only,
        revealed live at the Grand Finale on 15 August.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {WINGS_SCHOLARSHIP_TRACKS.map((t) => (
          <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[13.5px] font-semibold text-white">{t.label}</p>
            <p className="mt-2 text-[32px] font-extrabold leading-none tabular-nums text-[#C5A572]">
              {t.amountLabel}
            </p>
            <p className="mt-2 text-[13px] text-gray-400">towards {t.towards}</p>
            <p className="mt-2.5 text-[11.5px] text-gray-500">Waiver applies to {t.waiverAppliesTo}.</p>
          </div>
        ))}
      </div>

      <h3 className="mt-8 text-[16.5px] font-semibold text-white">The award tiers</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {WINGS_SCHOLARSHIP_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-2xl border bg-white/[0.02] p-4 ${
              tier.featured ? "border-[#C5A572]/50 ring-1 ring-[#C5A572]/35" : "border-white/10"
            }`}
          >
            {tier.featured && (
              <span className="absolute -top-2.5 left-4 rounded-full bg-[#C5A572] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                Full waiver
              </span>
            )}
            <p className="text-[28px] font-extrabold leading-none tabular-nums text-white">{tier.waiver}</p>
            <p className="mt-1.5 text-[13px] font-semibold text-[#E7D5B3]">{tier.name}</p>
            <p className="mt-1 text-[12.5px] text-gray-400">{tier.blurb}</p>
            <p className="mt-2 text-[11.5px] text-gray-500">{tier.seats}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-8 text-[16.5px] font-semibold text-white">What else comes with it</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WINGS_SCHOLARSHIP_BENEFITS.map((b) => {
          const Icon = ICONS[b.icon] ?? Compass;
          return (
            <div key={b.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <Icon className="mt-0.5 h-[17px] w-[17px] shrink-0 text-[#C5A572]" aria-hidden />
              <div>
                <p className="text-[13px] font-semibold text-white">{b.title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-gray-400">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
        {onApply && (
          <button
            type="button"
            onClick={onApply}
            className="group inline-flex items-center gap-2 rounded-full bg-[#C5A572] px-7 py-3.5 text-[14.5px] font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
          >
            Apply for Freedom to Fly
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
        <a
          href="#freedom-to-fly-terms"
          className="text-[13px] font-semibold text-[#C5A572] underline underline-offset-4 hover:text-[#d4b789]"
        >
          Read the eligibility &amp; terms
        </a>
      </div>
    </div>
  );
}
