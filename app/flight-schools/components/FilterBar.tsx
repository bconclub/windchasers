"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { SchoolFilters } from "@/types/flight-school";
import { GLOBE_STYLES, GlobeStyleKey, MAP_STYLES, MapStyleKey } from "../lib/globe-config";

export { GLOBE_STYLES, type GlobeStyleKey };

const CERTS = ["FAA", "EASA", "ICAO", "CAA"];

interface Props {
  filters: SchoolFilters;
  onFiltersChange: (f: SchoolFilters) => void;
  countries: string[];
  viewMode: "globe" | "map";
  globeStyle: GlobeStyleKey;
  onGlobeStyleChange: (key: GlobeStyleKey) => void;
  mapStyle: MapStyleKey;
  onMapStyleChange: (key: MapStyleKey) => void;
}

export default function FilterBar({
  filters,
  onFiltersChange,
  countries,
  viewMode,
  globeStyle,
  onGlobeStyleChange,
  mapStyle,
  onMapStyleChange,
}: Props) {
  const [certOpen, setCertOpen] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (certRef.current && !certRef.current.contains(e.target as Node)) {
        setCertOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasFilters =
    filters.country || filters.certifications.length > 0 || filters.partnerOnly;

  function toggleCert(cert: string) {
    const has = filters.certifications.includes(cert);
    onFiltersChange({
      ...filters,
      certifications: has
        ? filters.certifications.filter((c) => c !== cert)
        : [...filters.certifications, cert],
    });
  }

  const certLabel =
    filters.certifications.length > 0
      ? filters.certifications.join(", ")
      : "All Certifications";

  return (
    <div className="flex flex-col gap-2 w-56 md:w-64">
      {/* Country */}
      <select
        value={filters.country}
        onChange={(e) => onFiltersChange({ ...filters, country: e.target.value })}
        className="w-full bg-[#1A1A1A]/95 backdrop-blur-sm text-white text-sm border border-white/20 rounded px-3 py-2 outline-none focus:border-[#C5A572]/60 cursor-pointer"
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Certifications multi-select */}
      <div ref={certRef} className="relative">
        <button
          onClick={() => setCertOpen((o) => !o)}
          className="w-full flex items-center justify-between bg-[#1A1A1A]/95 backdrop-blur-sm text-white text-sm border border-white/20 rounded px-3 py-2 hover:border-white/40 transition-colors"
        >
          <span className="text-white/70 truncate">{certLabel}</span>
          <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 ml-2 transition-transform ${certOpen ? "rotate-180" : ""}`} />
        </button>
        {certOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-white/20 rounded shadow-2xl z-10">
            {CERTS.map((cert) => (
              <label key={cert} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.certifications.includes(cert)}
                  onChange={() => toggleCert(cert)}
                  className="accent-[#C5A572] w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-white/80">{cert}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Partner only toggle */}
      <label className="flex items-center gap-2.5 bg-[#1A1A1A]/95 backdrop-blur-sm border border-white/20 rounded px-3 py-2 cursor-pointer hover:border-white/40 transition-colors">
        <input
          type="checkbox"
          checked={filters.partnerOnly}
          onChange={(e) => onFiltersChange({ ...filters, partnerOnly: e.target.checked })}
          className="accent-[#C5A572] w-4 h-4 cursor-pointer"
        />
        <span className="text-sm text-white/70">WC Partners only</span>
      </label>

      {/* Globe style picker — shown in globe mode */}
      {viewMode === "globe" && (
        <div className="bg-[#1A1A1A]/95 backdrop-blur-sm border border-white/20 rounded px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Globe style</p>
          <div className="flex gap-1.5 flex-wrap">
            {GLOBE_STYLES.map((s) => (
              <button
                key={s.key}
                onClick={() => onGlobeStyleChange(s.key)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  globeStyle === s.key
                    ? "bg-[#C5A572] border-[#C5A572] text-black font-semibold"
                    : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map style picker — shown in flat map mode */}
      {viewMode === "map" && (
        <div className="bg-[#1A1A1A]/95 backdrop-blur-sm border border-white/20 rounded px-3 py-2">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Map style</p>
          <div className="flex gap-1.5 flex-wrap">
            {MAP_STYLES.map((s) => (
              <button
                key={s.key}
                onClick={() => onMapStyleChange(s.key)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  mapStyle === s.key
                    ? "bg-[#C5A572] border-[#C5A572] text-black font-semibold"
                    : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {hasFilters && (
        <button
          onClick={() => onFiltersChange({ country: "", certifications: [], partnerOnly: false })}
          className="flex items-center gap-1.5 text-xs text-[#C5A572] hover:text-[#C5A572]/80 px-1 transition-colors"
        >
          <X className="w-3 h-3" />
          Reset filters
        </button>
      )}
    </div>
  );
}
