"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FlightSchool } from "@/types/flight-school";
import { GlobeStyleKey, MAP_TILES } from "../lib/globe-config";

// Forces Leaflet to recalculate tile grid when container becomes visible
function SizeInvalidator({ visible }: { visible: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    }
  }, [visible, map]);
  return null;
}

// Flies to new center when seed changes after mount
function FlyToCenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    map.setView([lat, lng], zoom, { animate: false });
  }, [lat, lng, zoom, map]);
  return null;
}

// Zooming all the way out returns to globe
function ZoomWatcher({ onZoomOut }: { onZoomOut: () => void }) {
  useMapEvents({
    zoomend: (e) => {
      if (e.target.getZoom() <= 2) onZoomOut();
    },
  });
  return null;
}

interface Props {
  schools: FlightSchool[];
  onSelectSchool: (school: FlightSchool) => void;
  onZoomOut: () => void;
  initialLat: number;
  initialLng: number;
  initialZoom: number;
  visible: boolean;
  currentLat: number;
  currentLng: number;
  currentZoom: number;
  globeStyle: GlobeStyleKey;
}

export default function LeafletMap({
  schools,
  onSelectSchool,
  onZoomOut,
  initialLat,
  initialLng,
  initialZoom,
  visible,
  currentLat,
  currentLng,
  currentZoom,
  globeStyle,
}: Props) {
  const tile = MAP_TILES[globeStyle];
  // Esri tiles don't use subdomains; CartoDB does
  const isEsri = tile.url.includes("arcgisonline");

  return (
    <MapContainer
      center={[initialLat, initialLng]}
      zoom={initialZoom}
      minZoom={2}
      maxZoom={14}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        key={tile.url}
        url={tile.url}
        attribution={tile.attribution}
        {...(!isEsri && { subdomains: "abcd" })}
        maxZoom={19}
      />
      {/* Zoom controls — bottom-right so they don't overlap the left drawer */}
      <ZoomControl position="bottomright" />
      <SizeInvalidator visible={visible} />
      <FlyToCenter lat={currentLat} lng={currentLng} zoom={currentZoom} />
      <ZoomWatcher onZoomOut={onZoomOut} />

      {schools.map((school) => (
        <CircleMarker
          key={school.id}
          center={[school.lat, school.lng]}
          radius={school.isPartner ? 10 : 7}
          pathOptions={{
            fillColor: school.isPartner ? "#C5A572" : "#555555",
            fillOpacity: 0.95,
            color: school.isPartner ? "#8B7340" : "#222",
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelectSchool(school) }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]} opacity={1}>
            <div style={{
              background: "#1a1a1a", color: "#fff",
              padding: "4px 8px", borderRadius: 6, fontSize: 11,
              lineHeight: 1.4, border: "1px solid rgba(197,165,114,0.35)",
              whiteSpace: "nowrap", pointerEvents: "none",
            }}>
              <strong>{school.name}</strong>
              {school.isPartner && (
                <span style={{ color: "#C5A572", marginLeft: 4 }}>★</span>
              )}
              <br />
              <span style={{ color: "#C5A572", fontSize: 10 }}>{school.city}, {school.country}</span>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
