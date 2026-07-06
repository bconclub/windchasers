"use client";

import { Star, MapPin } from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";
import SchoolPhoto from "@/components/SchoolPhoto";

export default function SchoolCard({
  school,
  onSelect,
}: {
  school: FlightSchool;
  onSelect: (s: FlightSchool) => void;
}) {
  const rating = school.googleRating ?? school.rating;
  return (
    <button
      onClick={() => onSelect(school)}
      className="group text-left rounded-2xl overflow-hidden bg-[#0f1521] border border-white/10 hover:border-[#C5A572]/50 transition-colors flex flex-col"
    >
      <div className="relative h-44 w-full overflow-hidden bg-[#0b111c]">
        {school.images && school.images.length > 0 ? (
          <SchoolPhoto
            src={school.images[0]}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/15">
            <MapPin className="w-8 h-8" />
          </div>
        )}
        {school.isPartner && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#C5A572] text-black text-[11px] font-semibold rounded">
            WC Partner
          </span>
        )}
        {rating != null && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[11px] rounded">
            <Star className="w-3 h-3 text-[#C5A572] fill-[#C5A572]" />
            {rating}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-[15px] leading-snug line-clamp-2">
          {school.name}
        </h3>
        <p className="text-white/45 text-xs mt-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {school.city ? `${school.city}, ${school.country}` : school.country}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {school.dgcaConvertible && (
            <span className="px-2 py-0.5 bg-[#C5A572]/12 text-[#C5A572] text-[10px] rounded border border-[#C5A572]/25">
              DGCA Convertible
            </span>
          )}
          {school.certifications.slice(0, 2).map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 bg-white/8 text-white/60 text-[10px] rounded border border-white/10"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-xs">
          <span className="text-white/40">
            {school.durationMonths ? `${school.durationMonths} mo program` : "Flexible duration"}
          </span>
          <span className="text-[#C5A572] font-medium group-hover:underline">
            View details →
          </span>
        </div>
      </div>
    </button>
  );
}
