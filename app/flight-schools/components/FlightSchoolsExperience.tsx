"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Globe as GlobeIcon, Map as MapIcon } from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";
import GlobeHero from "./GlobeHero";
import SchoolDrawer from "./SchoolDrawer";
import LeadFormModal from "./LeadFormModal";
import {
  StatsBand,
  PartnerCountries,
  PartnerSchoolsGrid,
  HowItWorks,
  SchoolsFAQ,
  CtaBand,
} from "./FlightSchoolSections";

export default function FlightSchoolsExperience({ schools }: { schools: FlightSchool[] }) {
  // Marker/point click opens the left drawer directly (no intermediate card).
  const [selectedSchool, setSelectedSchool] = useState<FlightSchool | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeCountry, setActiveCountry] = useState("");
  // Land on the dark 3D globe (on-brand); Map is a tap away. Toggle is docked
  // in the header (below).
  const [view, setView] = useState<"map" | "globe">("globe");
  const [zoomTarget, setZoomTarget] = useState<
    { lat: number; lng: number; key: number } | undefined
  >();

  const countries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of schools) counts[s.country] = (counts[s.country] ?? 0) + 1;
    return Object.keys(counts).sort((a, b) => {
      const d = counts[b] - counts[a];
      return d !== 0 ? d : a.localeCompare(b);
    });
  }, [schools]);

  function pickCountry(country: string) {
    const matching = schools.filter((s) => s.country === country);
    if (matching.length === 0) return;
    setActiveCountry(country);
    // Fly the globe to the country's centroid.
    const lat = matching.reduce((sum, s) => sum + s.lat, 0) / matching.length;
    const lng = matching.reduce((sum, s) => sum + s.lng, 0) / matching.length;
    setZoomTarget({ lat, lng, key: Date.now() });
    // Bring the globe back into view so the fly-to is visible.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function clearCountry() {
    setActiveCountry("");
  }

  const isMap = view === "map";

  return (
    <>
      {/* Map / Globe toggle, docked into the header row (logo is at the left) */}
      <div className="fixed top-0 right-4 md:right-8 h-20 flex items-center z-[60]">
        <div className="inline-flex items-center gap-1 rounded-full p-1 border border-white/15 bg-white/10 backdrop-blur-sm">
          <button
            onClick={() => setView("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              isMap ? "bg-[#C5A572] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" /> Map
          </button>
          <button
            onClick={() => setView("globe")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !isMap ? "bg-[#C5A572] text-black" : "text-white/60 hover:text-white"
            }`}
          >
            <GlobeIcon className="w-3.5 h-3.5" /> Globe
          </button>
        </div>
      </div>

      <GlobeHero
        schools={schools}
        view={view}
        onSelectSchool={setSelectedSchool}
        zoomTarget={zoomTarget}
        countries={countries}
        onPickCountry={pickCountry}
        onClearCountry={clearCountry}
        activeCountry={activeCountry}
      />

      <StatsBand schools={schools} />
      <PartnerCountries
        schools={schools}
        onPickCountry={pickCountry}
        activeCountry={activeCountry}
      />
      <PartnerSchoolsGrid
        schools={schools}
        onSelect={setSelectedSchool}
        activeCountry={activeCountry}
      />
      <HowItWorks />
      <SchoolsFAQ />
      <CtaBand />

      <SchoolDrawer
        school={selectedSchool}
        onClose={() => setSelectedSchool(null)}
        onConsult={() => setShowLeadModal(true)}
      />

      <AnimatePresence>
        {showLeadModal && selectedSchool && (
          <LeadFormModal
            key="lead-modal"
            school={selectedSchool}
            onClose={() => setShowLeadModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
