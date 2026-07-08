"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Search, X as XIcon, Hand } from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";
import { GLOBE_STYLES } from "../lib/globe-config";

const GlobeLoader = dynamic(() => import("./GlobeLoader"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#060b14]">
      <p className="text-white/30 text-sm tracking-wide">Loading globe…</p>
    </div>
  ),
});

const CartoMap = dynamic(() => import("./CartoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#eef1f5]">
      <p className="text-slate-400 text-sm tracking-wide">Loading map…</p>
    </div>
  ),
});

/* ── Globe point helpers ─────────────────────────────────────────────── */
// Warm gold palette instead of the old blue extruded bars — partners glow a
// brighter gold, the rest a soft cream. Kept low + small so they read as tidy
// studs on the globe, not chunky towers.
function pointColor(d: object): string {
  return (d as FlightSchool).isPartner ? "#FFCB5E" : "#F3E6C8";
}
function pointRadius(d: object): number {
  return (d as FlightSchool).isPartner ? 0.42 : 0.28;
}
function pointLabel(d: object): string {
  const s = d as FlightSchool;
  return `<div style="background:#10151f;color:#fff;padding:6px 10px;border-radius:8px;font-size:12px;line-height:1.5;border:1px solid rgba(197,165,114,0.35);box-shadow:0 12px 30px rgba(0,0,0,0.4);pointer-events:none"><strong>${s.name}</strong><br/><span style="color:#C5A572">${s.city ? s.city + ", " : ""}${s.country}</span></div>`;
}

type ViewMode = "map" | "globe";

interface Props {
  schools: FlightSchool[];
  view: ViewMode;
  onSelectSchool: (school: FlightSchool) => void;
  zoomTarget?: { lat: number; lng: number; key: number };
  countries: string[];
  onPickCountry: (country: string) => void;
  onClearCountry: () => void;
  activeCountry: string;
  /** Bumped when the user clears the search — snaps the map/globe back out. */
  resetKey: number;
}

export default function GlobeHero({
  schools,
  view,
  onSelectSchool,
  zoomTarget,
  countries,
  onPickCountry,
  onClearCountry,
  activeCountry,
  resetKey,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  // Once the user starts interacting (map drag/click, marker tap, search), the
  // landing text gets out of the way so the map is theirs to explore.
  const [dismissed, setDismissed] = useState(false);

  const light = view === "map";
  // Dark blue-marble globe — the on-brand look the user settled on.
  const globeImageUrl =
    GLOBE_STYLES.find((s) => s.key === "blue-marble")?.url ?? "/globe/earth-blue-marble.jpg";

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of schools) c[s.country] = (c[s.country] ?? 0) + 1;
    return c;
  }, [schools]);

  // Country chips (fly-to). Top few by school count when empty; filtered while
  // typing. Just chips — no long results list.
  const countryMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries.slice(0, 5);
    return countries.filter((c) => c.toLowerCase().includes(q)).slice(0, 10);
  }, [query, countries]);

  // Full-screen hero that "holds" the user: proximity scroll-snap + a snap-stop
  // on the hero means the page won't drift past the globe until they mean to.
  useEffect(() => {
    const el = document.documentElement;
    const prevType = el.style.scrollSnapType;
    const prevPad = el.style.scrollPaddingTop;
    el.style.scrollSnapType = "y proximity";
    el.style.scrollPaddingTop = "80px";
    return () => {
      el.style.scrollSnapType = prevType;
      el.style.scrollPaddingTop = prevPad;
    };
  }, []);

  return (
    <section
      ref={containerRef}
      onPointerDownCapture={() => setDismissed(true)}
      style={{ scrollSnapAlign: "start", scrollSnapStop: "always" }}
      className={`relative w-full h-[calc(100vh-80px)] min-h-[520px] overflow-hidden ${light ? "bg-[#eef1f5]" : "bg-[#060b14]"}`}
    >
      {/* Map layers — keep both mounted so toggling is instant */}
      <div className="absolute inset-0" style={{ opacity: light ? 1 : 0, pointerEvents: light ? "auto" : "none" }}>
        <CartoMap
          schools={schools}
          onSelectSchool={onSelectSchool}
          styleKey="voyager"
          flyTo={zoomTarget}
          resetKey={resetKey}
        />
      </div>
      <div className="absolute inset-0" style={{ opacity: light ? 0 : 1, pointerEvents: light ? "none" : "auto" }}>
        {dims.width > 0 && (
          <GlobeLoader
            width={dims.width}
            height={dims.height}
            globeImageUrl={globeImageUrl}
            backgroundImageUrl="/globe/night-sky.png"
            atmosphereColor="#F0C46B"
            atmosphereAltitude={0.28}
            enablePointerInteraction
            heroMode
            paused={light}
            onPointSelect={(p) => onSelectSchool(p as FlightSchool)}
            pointsData={schools}
            pointLat="lat"
            pointLng="lng"
            pointColor={pointColor}
            pointRadius={pointRadius}
            pointAltitude={0.006}
            pointResolution={12}
            pointLabel={pointLabel}
            zoomTarget={view === "globe" ? zoomTarget : undefined}
            resetKey={resetKey}
          />
        )}
      </div>

      {/* Readability gradients — only over the dark globe */}
      {!light && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#060b14] via-[#060b14]/50 to-transparent z-[10]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060b14] to-transparent z-[10]" />
        </>
      )}

      {/* Landing text — only on the globe (white on dark reads well; black on
          the light map does not). Fades away the moment the user interacts or
          switches to the map, so they can start exploring right away. */}
      <div
        className="absolute inset-0 z-[20] flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        style={{ opacity: !light && !open && !dismissed ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <p className="text-[#E5C77E] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
          Global Training Network
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] text-white">
          The world is your
          <br /> training ground
        </h1>
        <p className="text-sm md:text-lg mt-4 leading-relaxed max-w-md text-white/70">
          Explore certified flight academies across countries. Find where your pilot journey begins.
        </p>
      </div>

      {/* Hint pill, bottom-left (hidden while searching) */}
      {!open && (
        <div className="absolute bottom-28 md:bottom-32 left-4 md:left-8 z-[20] pointer-events-none">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs tracking-wide backdrop-blur-sm border ${light ? "bg-white/80 border-slate-200 text-slate-500" : "bg-black/40 border-white/10 text-white/60"}`}>
            <Hand className="w-3.5 h-3.5" />
            Tap marker for details · {light ? "Drag to explore" : "Drag to spin"}
          </div>
        </div>
      )}

      {/* Search — pinned bottom. Small by default; widens on focus and floats
          quick country chips in a single scrollable row above the bar (no box). */}
      <div
        className="absolute bottom-12 md:bottom-14 left-1/2 -translate-x-1/2 z-[30]"
        style={{ width: "92%", maxWidth: open ? 540 : 300, transition: "max-width 0.35s ease" }}
      >
        {/* Chips — bare, one scrollable line, as wide as the bar */}
        {open && countryMatches.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {countryMatches.map((country) => {
              const active = activeCountry === country;
              return (
                <button
                  key={country}
                  onMouseDown={(e) => { e.preventDefault(); setQuery(country); setOpen(false); onPickCountry(country); }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm shadow-lg transition-colors ${
                    active
                      ? "bg-[#C5A572] text-black border-[#C5A572]"
                      : light
                        ? "bg-white/90 text-slate-700 border-slate-200 hover:border-[#C5A572] hover:text-slate-900"
                        : "bg-[#0b111c]/90 text-white/80 border-white/15 hover:border-[#C5A572]/60 hover:text-white"
                  }`}
                >
                  {country}
                  <span className={active ? "text-black/55" : light ? "text-slate-400" : "text-white/35"}>
                    {counts[country] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* The bar — wrapped in an animated golden "beam" border for attention */}
        <div className="flex items-center gap-2">
          <div className="wc-beam-wrap flex-1 shadow-2xl">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-[2] ${light ? "text-slate-400" : "text-white/50"}`} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search a country"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                className={`w-full rounded-full pl-11 pr-10 py-3.5 text-sm outline-none ${
                  light
                    ? "bg-white text-slate-900 placeholder-slate-400"
                    : "bg-[#0b111c] text-white placeholder-white/50"
                }`}
              />
              {query && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); setQuery(""); onClearCountry(); }}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 z-[2] transition-colors ${light ? "text-slate-400 hover:text-slate-700" : "text-white/50 hover:text-white/80"}`}
                  aria-label="Clear search"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => { inputRef.current?.focus(); setOpen(true); }}
            aria-label="Search"
            className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C5A572] hover:bg-[#C5A572]/90 flex items-center justify-center shadow-lg transition-colors"
          >
            <Search className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
