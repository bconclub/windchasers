"use client";

import type { ReactNode } from "react";
import { Calendar, Clock, Video } from "lucide-react";

type Props = {
  dateLine: string;
  timeLine: string;
  /** Defaults to the two-line "Zoom / Link after registration" stack. */
  zoomLine?: string;
};

const DEFAULT_ZOOM = "Zoom (link after registration)";

/**
 * Small winged emblem flanked by thin gold lines — the hero divider between the
 * date eyebrow and the headline (Option 3 design).
 */
export function WebinarWingEmblem() {
  return (
    <div className="flex items-center justify-center gap-3 my-5" aria-hidden>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#C5A572]/60" />
      <svg width="34" height="14" viewBox="0 0 34 14" fill="none" className="shrink-0">
        <path d="M17 2.5 L15.5 7 L18.5 7 Z" fill="#C5A572" />
        <path d="M15 6.5 C10 4 5 4.2 1 7 C6 6.2 11 6.8 14.5 8.6 Z" fill="#C5A572" opacity="0.9" />
        <path d="M19 6.5 C24 4 29 4.2 33 7 C28 6.2 23 6.8 19.5 8.6 Z" fill="#C5A572" opacity="0.9" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#C5A572]/60" />
    </div>
  );
}

function DetailCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#C5A572]/12 ring-1 ring-[#C5A572]/25"
          aria-hidden
        >
          {icon}
        </span>
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#C5A572]/85">
          {label}
        </p>
      </div>
      <div className="mt-2 text-[13px] font-medium leading-snug text-white">{children}</div>
    </div>
  );
}

export default function WebinarHeroDetails({
  dateLine,
  timeLine,
  zoomLine = DEFAULT_ZOOM,
}: Props) {
  const zoomBody =
    zoomLine === DEFAULT_ZOOM ? (
      <>
        <span className="font-medium">Zoom</span>
        <span className="mt-0.5 block text-[11px] font-normal leading-snug text-white/60">
          Link after registration
        </span>
      </>
    ) : (
      <span className="font-medium">{zoomLine}</span>
    );

  return (
    <div className="mt-7 mb-8 grid w-full max-w-xl mx-auto grid-cols-3 gap-2.5 sm:gap-3">
      <DetailCard icon={<Calendar className="h-3.5 w-3.5 text-[#C5A572]" />} label="Date">
        {dateLine}
      </DetailCard>
      <DetailCard icon={<Clock className="h-3.5 w-3.5 text-[#C5A572]" />} label="Time">
        {timeLine}
      </DetailCard>
      <DetailCard icon={<Video className="h-3.5 w-3.5 text-[#C5A572]" />} label="Where">
        {zoomBody}
      </DetailCard>
    </div>
  );
}
