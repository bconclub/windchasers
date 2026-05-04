"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
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
  // Ref mirrors viewMode to avoid stale closures in altitude handler
  const viewModeRef = useRef<"globe" | "map">("globe");
  useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);
  // Lock flag: ignore altitude changes while globe camera is animating back to world view
  const transitionLockRef = useRef(false);

  const [mapSeed, setMapSeed] = useState({ lat: 20, lng: 0, zoom: 5 });
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("satellite");
  // Incrementing this tells GlobeLoader to animate camera back to world view
  const [globeResetKey, setGlobeResetKey] = useState(0);
  // Active globe texture
  const [globeStyle, setGlobeStyle] = useState<GlobeStyleKey>("blue-marble");
  const globeImageUrl = GLOBE_STYLES.find((s) => s.key === globeStyle)?.url ?? "/globe/earth-blue-marble.jpg";

  // Keep LeafletMap mounted once first shown so it doesn't blank on re-show
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

  const countries = useMemo(
    () => Array.from(new Set(schools.map((s) => s.country))).sort(),
    []
  );

  const handleAltitudeChange = useCallback(
    (altitude: number, lat: number, lng: number) => {
      if (viewModeRef.current !== "globe") return;
      // Ignore while camera is animating back to world view (prevents immediate re-trigger)
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
    // Unlock after globe animation completes (700ms animate + buffer)
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
      {/* ── Globe layer ─────────────────────────────────────────────── */}
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
          />
        )}
        {dimensions.width === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/30 text-sm tracking-wide">Loading globe...</p>
          </div>
        )}
      </div>

      {/* ── Flat map layer — stays mounted after first show ─────────── */}
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

      {/* ── Hint pill ───────────────────────────────────────────────── */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[500]"
        style={{ pointerEvents: "none" }}
      >
        <div className="px-3 py-1.5 rounded-full text-xs text-white/50 bg-black/40 backdrop-blur-sm border border-white/10 tracking-wide">
          {hint}
        </div>
      </div>

      {/* ── Filter bar — top-right so it doesn't clash with left drawer */}
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
