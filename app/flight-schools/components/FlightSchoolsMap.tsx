"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { Search, X as XIcon } from "lucide-react";
import { FlightSchool, SchoolFilters } from "@/types/flight-school";
import FilterBar, { GLOBE_STYLES, GlobeStyleKey } from "./FilterBar";
import { MapStyleKey } from "../lib/globe-config";
import SchoolDrawer from "./SchoolDrawer";
import LeadFormModal from "./LeadFormModal";
import schoolsJson from "@/data/flight-schools.json";

const schools = schoolsJson as FlightSchool[];

const GlobeLoader = dynamic(() => import("./GlobeLoader"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#060b14]">
      <p className="text-white/30 text-sm tracking-wide">Loading globe...</p>
    </div>
  ),
});

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

/* ── Globe point helpers ─────────────────────────────────────────────── */
function pointColor(d: object): string {
  return (d as FlightSchool).isPartner ? "#C5A572" : "#666666";
}
function pointRadius(d: object): number {
  return (d as FlightSchool).isPartner ? 0.55 : 0.38;
}
function pointLabel(d: object): string {
  const s = d as FlightSchool;
  return `<div style="background:#1a1a1a;color:#fff;padding:5px 10px;border-radius:6px;font-size:12px;line-height:1.5;border:1px solid rgba(197,165,114,0.35);pointer-events:none"><strong>${s.name}</strong><br/><span style="color:#C5A572">${s.city}, ${s.country}</span></div>`;
}

// Trigger flat-map switch after ~2-3 scroll clicks from default altitude 2.5
const ZOOM_IN_THRESHOLD = 1.5;

export default function FlightSchoolsMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [filters, setFilters] = useState<SchoolFilters>({
    country: "",
    certifications: [],
    partnerOnly: false,
  });
  const [selectedSchool, setSelectedSchool] = useState<FlightSchool | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);

  const [viewMode, setViewMode] = useState<"globe" | "map">("globe");
  const viewModeRef = useRef<"globe" | "map">("globe");
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);
  const transitionLockRef = useRef(false);

  const [mapSeed, setMapSeed] = useState({ lat: 20, lng: 0, zoom: 5 });
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("satellite");
  const [globeResetKey, setGlobeResetKey] = useState(0);
  const [globeStyle, setGlobeStyle] = useState<GlobeStyleKey>("blue-marble");
  const globeImageUrl = GLOBE_STYLES.find((s) => s.key === globeStyle)?.url ?? "/globe/earth-blue-marble.jpg";

  // Search bar state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [zoomTarget, setZoomTarget] = useState<{ lat: number; lng: number; key: number } | undefined>();

  // Country → lat/lng from schools data
  const countryCenters = useMemo(() => {
    const map: Record<string, { lat: number; lng: number }> = {};
    schools.forEach((s) => {
      if (!map[s.country]) map[s.country] = { lat: s.lat, lng: s.lng };
    });
    return map;
  }, []);

  const countries = useMemo(
    () => Array.from(new Set(schools.map((s) => s.country))).sort(),
    []
  );

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    return countries.filter((c) =>
      c.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, countries]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleCountrySearch(country: string) {
    const center = countryCenters[country];
    if (!center) return;
    setSearchQuery(country);
    setSearchOpen(false);
    // Zoom globe to that country — altitude handler will trigger flat map
    setZoomTarget({ lat: center.lat, lng: center.lng, key: Date.now() });
  }

  // Keep LeafletMap mounted once first shown
  const [leafletMounted, setLeafletMounted] = useState(false);
  useEffect(() => {
    if (viewMode === "map" && !leafletMounted) setLeafletMounted(true);
  }, [viewMode, leafletMounted]);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredSchools = useMemo(() => {
    return schools.filter((s) => {
      if (filters.country && s.country !== filters.country) return false;
      if (filters.partnerOnly && !s.isPartner) return false;
      if (filters.certifications.length > 0) {
        if (!filters.certifications.some((c) => s.certifications.includes(c)))
          return false;
      }
      return true;
    });
  }, [filters]);

  const handleAltitudeChange = useCallback(
    (altitude: number, lat: number, lng: number) => {
      if (viewModeRef.current !== "globe") return;
      if (transitionLockRef.current) return;
      if (altitude < ZOOM_IN_THRESHOLD) {
        const zoom = Math.max(5, Math.min(9, Math.round(5 - Math.log2(Math.max(altitude, 0.1) / 1.5))));
        setMapSeed({ lat, lng, zoom });
        setViewMode("map");
        viewModeRef.current = "map";
      }
    },
    []
  );

  const returnToGlobe = useCallback(() => {
    transitionLockRef.current = true;
    setViewMode("globe");
    viewModeRef.current = "globe";
    setGlobeResetKey((k) => k + 1);
    setTimeout(() => { transitionLockRef.current = false; }, 1200);
  }, []);

  const handleMapZoomOut = useCallback(() => returnToGlobe(), [returnToGlobe]);

  const handleViewModeToggle = useCallback(() => {
    if (viewModeRef.current === "globe") {
      setMapSeed((s) => ({ ...s, zoom: 4 }));
      setViewMode("map");
      viewModeRef.current = "map";
      if (!leafletMounted) setLeafletMounted(true);
    } else {
      returnToGlobe();
    }
  }, [leafletMounted, returnToGlobe]);

  const hint =
    viewMode === "globe"
      ? "Scroll in to explore a region"
      : "Scroll out to return to globe";

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#060b14]"
      style={{ height: "calc(100vh - 80px)" }}
    >
      {/* ── Globe layer ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: viewMode === "globe" ? 1 : 0,
          pointerEvents: viewMode === "globe" ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      >
        {dimensions.width > 0 && (
          <GlobeLoader
            width={dimensions.width}
            height={dimensions.height}
            globeImageUrl={globeImageUrl}
            backgroundImageUrl="/globe/night-sky.png"
            atmosphereColor="#C5A572"
            atmosphereAltitude={0.18}
            enablePointerInteraction={true}
            pointsData={filteredSchools}
            pointLat="lat"
            pointLng="lng"
            pointColor={pointColor}
            pointRadius={pointRadius}
            pointAltitude={0.015}
            pointLabel={pointLabel}
            onAltitudeChange={handleAltitudeChange}
            paused={viewMode === "map"}
            resetKey={globeResetKey}
            zoomTarget={zoomTarget}
          />
        )}
        {dimensions.width === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/30 text-sm tracking-wide">Loading globe...</p>
          </div>
        )}
      </div>

      {/* ── Flat map layer ─────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: viewMode === "map" ? 1 : 0,
          pointerEvents: viewMode === "map" ? "auto" : "none",
          transition: "opacity 0.4s ease",
        }}
      >
        {leafletMounted && (
          <LeafletMap
            schools={filteredSchools}
            onSelectSchool={setSelectedSchool}
            onZoomOut={handleMapZoomOut}
            initialLat={mapSeed.lat}
            initialLng={mapSeed.lng}
            initialZoom={mapSeed.zoom}
            visible={viewMode === "map"}
            currentLat={mapSeed.lat}
            currentLng={mapSeed.lng}
            currentZoom={mapSeed.zoom}
            mapStyle={mapStyle}
          />
        )}
      </div>

      {/* ── Country search bar — top-left ───────────────────────────── */}
      <div
        ref={searchRef}
        className="absolute top-4 left-4 z-[400]"
        style={{ width: 240 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search country…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            className="w-full bg-[#1A1A1A]/95 backdrop-blur-sm border border-white/20 rounded px-3 py-2.5 pl-9 pr-8 text-white text-sm placeholder-white/30 outline-none focus:border-[#C5A572]/60 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {searchOpen && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1A1A] border border-white/20 rounded shadow-2xl overflow-hidden z-10">
            {filteredSuggestions.map((country) => (
              <button
                key={country}
                onMouseDown={(e) => { e.preventDefault(); handleCountrySearch(country); }}
                className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-[#C5A572]/10 hover:text-white transition-colors flex items-center justify-between group"
              >
                <span>{country}</span>
                <span className="text-[10px] text-white/20 group-hover:text-[#C5A572]/60 transition-colors">
                  {schools.filter(s => s.country === country).length} school{schools.filter(s => s.country === country).length !== 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Hint pill ───────────────────────────────────────────────── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500]"
        style={{ pointerEvents: "none" }}
      >
        <div className="px-3 py-1.5 rounded-full text-xs text-white/50 bg-black/40 backdrop-blur-sm border border-white/10 tracking-wide">
          {hint}
        </div>
      </div>

      {/* ── Filter bar — top-right ───────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-[400]">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          countries={countries}
          viewMode={viewMode}
          onViewModeToggle={handleViewModeToggle}
          globeStyle={globeStyle}
          onGlobeStyleChange={setGlobeStyle}
          mapStyle={mapStyle}
          onMapStyleChange={setMapStyle}
        />
      </div>

      {/* ── School drawer ───────────────────────────────────────────── */}
      <SchoolDrawer
        school={selectedSchool}
        onClose={() => setSelectedSchool(null)}
        onConsult={() => setShowLeadModal(true)}
      />

      {/* ── Lead modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showLeadModal && selectedSchool && (
          <LeadFormModal
            key="lead-modal"
            school={selectedSchool}
            onClose={() => setShowLeadModal(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
