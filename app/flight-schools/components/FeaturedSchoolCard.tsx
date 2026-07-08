"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin, Star, Plane } from "lucide-react";
import type { FeaturedSchool } from "../lib/featured-schools";

export default function FeaturedSchoolCard({ school }: { school: FeaturedSchool }) {
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const location = [school.place, school.country].filter(Boolean).join(", ");
  const showImage = school.image && !imgFailed;

  return (
    <div className="h-full rounded-2xl overflow-hidden bg-[#0f1521] border border-white/10 hover:border-[#C5A572]/40 transition-colors flex flex-col">
      {/* Image-led — this is the card, not a text block */}
      <div className="relative h-40 w-full bg-[#0b111c]">
        {showImage ? (
          <img
            src={school.image!}
            alt={school.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/15">
            <Plane className="w-7 h-7" />
          </div>
        )}
        {school.rating != null && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[11px] rounded">
            <Star className="w-3 h-3 text-[#C5A572] fill-[#C5A572]" />
            {school.rating}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-[14px] leading-snug line-clamp-2 min-h-[2.25rem]">{school.name}</h3>
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit website"
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-[#C5A572] hover:border-[#C5A572]/50 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {location && (
          <p className="text-[#C5A572] text-xs flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {location}
          </p>
        )}

        {/* Reserve the description area so every card matches, even when a
            school has no about text yet. */}
        <p className="text-white/50 text-[12.5px] leading-relaxed mt-2 line-clamp-2 min-h-[2.5rem]">
          {school.about}
        </p>
        <button
          onClick={() => school.about && setOpen(true)}
          disabled={!school.about}
          className="mt-auto pt-3 self-start text-[#C5A572] text-xs font-medium hover:underline disabled:opacity-0"
        >
          Read more
        </button>
      </div>

      {/* Full-text overlay, opened from "Read more" — keeps the card itself light */}
      {open && (
        <div
          className="fixed inset-0 z-[900] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-2xl bg-[#10151f] border border-white/10 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-white font-semibold text-lg">{school.name}</h3>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-xl leading-none">×</button>
            </div>
            {location && <p className="text-[#C5A572] text-xs mb-4">{location}</p>}
            <p className="text-white/65 text-sm leading-relaxed whitespace-pre-line">{school.about}</p>
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-[#C5A572] text-sm font-medium hover:underline"
              >
                Visit website <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
