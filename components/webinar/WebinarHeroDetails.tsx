"use client";

import type { ReactNode } from "react";
import { Calendar, Clock, Video } from "lucide-react";

type Props = {
  dateLine: string;
  timeLine: string;
  /** When this is the default Zoom line, we show the two-line “Zoom / link” stack like mobile. */
  zoomLine?: string;
};

const DEFAULT_ZOOM = "Zoom (link after registration)";

function Row({
  icon,
  label,
  children,
  isLast,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 py-3 ${isLast ? "" : "border-b border-white/10"}`}
    >
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C5A572]/12 ring-1 ring-[#C5A572]/25"
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A572]/80">{label}</p>
        <div className="mt-0.5 text-sm font-medium leading-snug text-white">{children}</div>
      </div>
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
        <span className="mt-0.5 block text-xs font-normal text-white/70 leading-snug">
          Link after registration
        </span>
      </>
    ) : (
      <span className="font-medium">{zoomLine}</span>
    );

  return (
    <div
      className="
        mt-8 mb-10 w-full max-w-lg mx-auto
        flex flex-col rounded-xl border border-white/10 bg-black/30 px-3.5 py-0.5
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        sm:max-w-xl
      "
    >
      <Row icon={<Calendar className="h-4 w-4 text-[#C5A572]" />} label="Date">
        {dateLine}
      </Row>
      <Row icon={<Clock className="h-4 w-4 text-[#C5A572]" />} label="Time">
        {timeLine}
      </Row>
      <Row icon={<Video className="h-4 w-4 text-[#C5A572]" />} label="Where" isLast>
        {zoomBody}
      </Row>
    </div>
  );
}
