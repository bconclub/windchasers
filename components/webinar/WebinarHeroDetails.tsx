"use client";

import { Calendar, Clock, Video } from "lucide-react";

type Props = {
  dateLine: string;
  timeLine: string;
  /** One line on tablet/desktop; mobile uses a short title + subline for easier scanning */
  zoomLine?: string;
};

const DEFAULT_ZOOM = "Zoom (link after registration)";

export default function WebinarHeroDetails({
  dateLine,
  timeLine,
  zoomLine = DEFAULT_ZOOM,
}: Props) {
  return (
    <div
      className="
        mt-8 mb-10 w-full max-w-lg mx-auto
        flex flex-col rounded-xl border border-white/10 bg-black/30 px-3.5 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        md:max-w-none md:flex-row md:items-center md:justify-center md:gap-6 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none
      "
    >
      <div className="flex items-start gap-3 border-b border-white/10 py-3 md:flex-initial md:items-center md:border-b-0 md:py-0">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C5A572]/12 ring-1 ring-[#C5A572]/25 md:mt-0 md:h-auto md:w-auto md:bg-transparent md:ring-0"
          aria-hidden
        >
          <Calendar className="h-4 w-4 text-[#C5A572]" />
        </span>
        <div className="min-w-0 flex-1 text-left md:flex md:items-center md:gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A572]/80 md:hidden">
            Date
          </p>
          <p className="text-sm text-white leading-snug md:leading-normal">{dateLine}</p>
        </div>
      </div>

      <div className="hidden md:block w-px h-4 shrink-0 bg-white/20 self-center" aria-hidden />

      <div className="flex items-start gap-3 border-b border-white/10 py-3 md:flex-initial md:items-center md:border-b-0 md:py-0">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C5A572]/12 ring-1 ring-[#C5A572]/25 md:mt-0 md:h-auto md:w-auto md:bg-transparent md:ring-0"
          aria-hidden
        >
          <Clock className="h-4 w-4 text-[#C5A572]" />
        </span>
        <div className="min-w-0 flex-1 text-left md:flex md:items-center md:gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A572]/80 md:hidden">
            Time
          </p>
          <p className="text-sm text-white leading-snug md:leading-normal">{timeLine}</p>
        </div>
      </div>

      <div className="hidden md:block w-px h-4 shrink-0 bg-white/20 self-center" aria-hidden />

      <div className="flex items-start gap-3 py-3 md:flex-initial md:items-center md:py-0">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#C5A572]/12 ring-1 ring-[#C5A572]/25 md:mt-0 md:h-auto md:w-auto md:bg-transparent md:ring-0"
          aria-hidden
        >
          <Video className="h-4 w-4 text-[#C5A572]" />
        </span>
        <div className="min-w-0 flex-1 text-left md:flex md:items-center md:gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C5A572]/80 md:hidden">
            Where
          </p>
          <p className="text-sm text-white leading-snug md:leading-normal">
            <span className="md:hidden">
              <span className="font-medium">Zoom</span>
              <span className="mt-0.5 block text-xs font-normal text-white/70 leading-snug">
                Link after registration
              </span>
            </span>
            <span className="hidden md:inline">{zoomLine}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
