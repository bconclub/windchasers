"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Globe, Map, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SchoolFilters } from "@/types/flight-school";
import { GLOBE_STYLES, GlobeStyleKey, MAP_STYLES, MapStyleKey } from "../lib/globe-config";

export { GLOBE_STYLES, type GlobeStyleKey };

const CERTS = ["FAA", "EASA", "ICAO", "CAA"];

interface Props {
  filters: SchoolFilters;
  onFiltersChange: (f: SchoolFilters) => void;
  countries: string[];
  viewMode: "globe" | "map";
  onViewModeToggle: () => void;
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
  onViewModeToggle,
  globeStyle,
  onGlobeStyleChange,
  mapStyle,
  onMapStyleChange,
}: Props) {
  const [certOpen, setCertOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close cert dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (certRef.current && !certRef.current.contains(e.target as Node)) {
        setCertOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasFilters =
    filters.country || filters.certifications.length > 0 || filters.partnerOnly;

  const activeFilterCount =
    (filters.country ? 1 : 0) +
    filters.certifications.length +
    (filters.partnerOnly ? 1 : 0);

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

  // ── Shared panel content ─────────────────────────────────────────────
  const PanelContent = () => (
    <div className="flex flex-col gap-3">
      {/* Globe ↔ Map toggle */}
      <button
        onClick={() => { onViewModeToggle(); setPanelOpen(false); }}
        className="w-full flex items-center justify-between bg-white/5 border border-[#C5A572]/40 rounded-lg px-3 py-2.5 hover:border-[#C5A572]/70 transition-colors group"
      >
        <div className="flex items-center gap-2">
          {viewMode === "globe" ? (
            <Map className="w-4 h-4 text-[#C5A572]" />
          ) : (
            <Globe className="w-4 h-4 text-[#C5A572]" />
          )}
          <span className="text-sm text-white/80 group-hover:text-white transition-colors">
            {viewMode === "globe" ? "Switch to Map" : "Switch to Globe"}
          </span>
        </div>
        <span className="text-[10px] text-[#C5A572]/60 uppercase tracking-wider">
          {viewMode === "globe" ? "2D" : "3D"}
        </span>
      </button>

      {/* Country */}
      <select
        value={filters.country}
        onChange={(e) => onFiltersChange({ ...filters, country: e.target.value })}
        className="w-full bg-white/5 text-white text-sm border border-white/20 rounded-lg px-3 py-2.5 outline-none focus:border-[#C5A572]/60 cursor-pointer"
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Certifications */}
      <div ref={certRef} className="relative">
        <button
          onClick={() => setCertOpen((o) => !o)}
          className="w-full flex items-center justify-between bg-white/5 text-white text-sm border border-white/20 rounded-lg px-3 py-2.5 hover:border-white/40 transition-colors"
        >
          <span className="text-white/70 truncate">{certLabel}</span>
          <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 ml-2 transition-transform ${certOpen ? "rotate-180" : ""}`} />
        </button>
        {certOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/20 rounded-lg shadow-2xl z-10 overflow-hidden">
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

      {/* Partner only */}
      <label className="flex items-center gap-2.5 bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 cursor-pointer hover:border-white/40 transition-colors">
        <input
          type="checkbox"
          checked={filters.partnerOnly}
          onChange={(e) => onFiltersChange({ ...filters, partnerOnly: e.target.checked })}
          className="accent-[#C5A572] w-4 h-4 cursor-pointer"
        />
        <span className="text-sm text-white/70">WC Partners only</span>
      </label>

      {/* Style picker */}
      <div className="bg-white/5 border border-white/20 rounded-lg px-3 py-2.5">
        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">
          {viewMode === "globe" ? "Globe style" : "Map style"}
        </p>
        <div className="flex gap-1.5 flex-wrap">
          {(viewMode === "globe" ? GLOBE_STYLES : MAP_STYLES).map((s) => {
            const active = viewMode === "globe" ? globeStyle === s.key : mapStyle === s.key;
            return (
              <button
                key={s.key}
                onClick={() =>
                  viewMode === "globe"
                    ? onGlobeStyleChange(s.key as GlobeStyleKey)
                    : onMapStyleChange(s.key as MapStyleKey)
                }
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  active
                    ? "bg-[#C5A572] border-[#C5A572] text-black font-semibold"
                    : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

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

  return (
    <div ref={panelRef}>
      {/* ── Trigger button (always visible) ─────────────────────────── */}
      <button
        onClick={() => setPanelOpen((o) => !o)}
        className="relative flex items-center gap-2 bg-[#1A1A1A]/95 backdrop-blur-sm border border-white/20 rounded-full px-3.5 py-2.5 hover:border-[#C5A572]/50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-white/60" />
        <span className="text-sm text-white/70 hidden sm:block">Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C5A572] text-black text-[10px] font-bold flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* ── Dropdown panel (desktop: drops down; mobile: slides from right) ── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[390] sm:hidden"
              onClick={() => setPanelOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-12 w-72 bg-[#111]/98 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl z-[400]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white/80 tracking-wide">Map Controls</h3>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <PanelContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
