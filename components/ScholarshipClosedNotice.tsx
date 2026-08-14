import Link from "next/link";
import {
  WINGS_SCHOLARSHIP_CLOSED_BODY,
  WINGS_SCHOLARSHIP_CLOSED_HEADLINE,
  WINGS_SCHOLARSHIP_NAME,
  WINGS_WHATSAPP_GROUP_URL,
} from "@/lib/wings-of-freedom";

/**
 * What someone sees at /scholarship once applications have closed.
 *
 * Deliberately not a dead end: anyone arriving here wanted something, and the
 * two things still worth their time are the event where the results are read
 * out and the group where everything after it gets announced.
 */
export default function ScholarshipClosedNotice() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C5A572]">
        {WINGS_SCHOLARSHIP_NAME} Scholarship
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
        {WINGS_SCHOLARSHIP_CLOSED_HEADLINE}
      </h1>
      <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
        {WINGS_SCHOLARSHIP_CLOSED_BODY}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/wings-of-freedom"
          className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C5A572]/60 hover:bg-[#C5A572]/[0.06]"
        >
          <span className="text-lg font-semibold text-white">Wings of Freedom</span>
          <span className="mt-1 text-[12.5px] text-white/50">
            15 August, WindChasers HQ. Simulator time, a masterclass, and the scholarship reveal.
          </span>
        </Link>
        <a
          href={WINGS_WHATSAPP_GROUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C5A572]/60 hover:bg-[#C5A572]/[0.06]"
        >
          <span className="text-lg font-semibold text-white">Join the group</span>
          <span className="mt-1 text-[12.5px] text-white/50">
            Results, shortlists and everything that follows are posted here first.
          </span>
        </a>
      </div>

      <p className="mt-8 text-[12.5px] text-white/40">
        Missed it this time? Write to us and we will tell you when the next intake opens.
      </p>
    </div>
  );
}
