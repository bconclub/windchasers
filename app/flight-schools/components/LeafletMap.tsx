"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FlightSchool } from "@/types/flight-school";
import { MapStyleKey, MAP_STYLES } from "../lib/globe-config";

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

// Fits the map to a list of points (e.g. all schools in a country) so wide
// countries don't get cropped to one corner. `key` ensures the effect re-runs
// when the user picks a new country.
function FitBoundsTo({ target }: { target: { points: Array<[number, number]>; key: number } | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (!target || !target.points || target.points.length === 0) return;
    // Make sure the map knows its current size (drawer / panel changes can
    // leave it stale) before computing the zoom level for the new bounds.
    map.invalidateSize();
    if (target.points.length === 1) {
      map.setView(target.points[0], 9, { animate: false });
      return;
    }
    map.fitBounds(target.points, {
      padding: [60, 60],
      maxZoom: 10,
      animate: false,
    });
  }, [target?.key, map]);
  return null;
}

// Returns to globe when the user tries to zoom out beyond the world view.
// Strategy: minZoom on the MapContainer is 2 so the flat map never shows
// the empty-tile void around the edges. We then attach a native wheel
// listener to the map's container — when the user scrolls "out" (deltaY > 0)
// AND we're already at minZoom, that's the "I want to zoom out further"
// intent, so hand off to the globe.
function ZoomWatcher({ onZoomOut }: { onZoomOut: () => void }) {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    let cooling = false;
    const handler = (e: WheelEvent) => {
      if (e.deltaY <= 0) return; // zoom-in, ignore
      const minZoom = map.getMinZoom();
      if (map.getZoom() > minZoom) return; // still has zoom-out headroom
      if (cooling) return;
      cooling = true;
      setTimeout(() => { cooling = false; }, 1500);
      onZoomOut();
    };
    container.addEventListener("wheel", handler, { passive: true });
    return () => container.removeEventListener("wheel", handler);
  }, [map, onZoomOut]);
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
  mapStyle: MapStyleKey;
  fitBoundsTarget?: { points: Array<[number, number]>; key: number };
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
  mapStyle,
  fitBoundsTarget,
}: Props) {
  const style = MAP_STYLES.find((s) => s.key === mapStyle) ?? MAP_STYLES[0];

  return (
    <MapContainer
      center={[initialLat, initialLng]}
      zoom={initialZoom}
      minZoom={2}
      maxZoom={18}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      worldCopyJump={false}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1}
    >
      <TileLayer
        key={style.url}
        url={style.url}
        attribution={style.attribution}
        {...(style.subdomains && { subdomains: "abcd" })}
        maxZoom={19}
        noWrap
      />
      {/* Country / city name overlay for tile sources that ship without labels */}
      {style.labelsUrl && (
        <TileLayer
          key={`${style.url}-labels`}
          url={style.labelsUrl}
          {...(style.subdomains && { subdomains: "abcd" })}
          maxZoom={19}
          pane="overlayPane"
          noWrap
        />
      )}
      {/* Zoom controls — bottom-right so they don't overlap the left drawer */}
      <ZoomControl position="bottomright" />
      <SizeInvalidator visible={visible} />
      <FlyToCenter lat={currentLat} lng={currentLng} zoom={currentZoom} />
      <FitBoundsTo target={fitBoundsTarget} />
      <ZoomWatcher onZoomOut={onZoomOut} />

      {schools.map((school) => (
        <CircleMarker
          key={school.id}
          center={[school.lat, school.lng]}
          radius={school.isPartner ? 10 : (school.wcClassification === "likely_school" ? 7 : 5)}
          pathOptions={{
            fillColor: school.isPartner
              ? "#C5A572"
              : school.wcClassification === "likely_school"
                ? "#8FA8FF"
                : "#555555",
            fillOpacity: school.wcClassification === "possible_school" ? 0.7 : 0.95,
            color: school.isPartner ? "#8B7340" : "#1f2937",
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelectSchool(school) }}
        >
          <Tooltip
            sticky
            direction="top"
            offset={[0, -10]}
            opacity={1}
          >
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
