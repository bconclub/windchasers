"use client";

import { Plane, Star, ChevronRight, X as XIcon } from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";

interface Props {
  school: FlightSchool;
  light: boolean;
  onOpen: (school: FlightSchool) => void;
  onClose: () => void;
}

// Compact map card that pops up when a marker is tapped. The chevron opens the
// full details drawer.
export default function SchoolPreviewCard({ school, light, onOpen, onClose }: Props) {
  const rating = school.googleRating ?? school.rating;
  const certs = school.certifications.slice(0, 4).join(", ");
  const location = [school.city, school.country].filter(Boolean).join(", ");

  return (
    <div
      className={`relative flex items-center gap-3 rounded-2xl border pl-3 pr-2 py-3 shadow-2xl backdrop-blur-sm ${
        light ? "bg-white/95 border-slate-200" : "bg-[#10151f]/95 border-white/12"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#C5A572] flex items-center justify-center">
        <Plane className="w-5 h-5 text-black" />
      </div>

      {/* Body */}
      <button onClick={() => onOpen(school)} className="flex-1 min-w-0 text-left">
        <p className={`font-semibold text-sm leading-tight truncate ${light ? "text-slate-900" : "text-white"}`}>
          {school.name}
        </p>
        {location && (
          <p className="text-[#B4863B] text-xs mt-0.5 truncate">{location}</p>
        )}
        <p className={`text-[11px] mt-1 truncate flex items-center gap-1 ${light ? "text-slate-500" : "text-white/50"}`}>
          {rating != null && (
            <span className="inline-flex items-center gap-0.5">
              <Star className="w-3 h-3 text-[#C5A572] fill-[#C5A572]" />
              {rating}
            </span>
          )}
          {rating != null && certs && <span className="opacity-50">·</span>}
          {certs && <span className="truncate">{certs}</span>}
        </p>
      </button>

      {/* Open details */}
      <button
        onClick={() => onOpen(school)}
        aria-label="Open details"
        className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
          light ? "bg-slate-100 hover:bg-slate-200 text-slate-700" : "bg-white/8 hover:bg-white/15 text-white"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center border shadow ${
          light ? "bg-white border-slate-200 text-slate-500" : "bg-[#10151f] border-white/15 text-white/60"
        }`}
      >
        <XIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
