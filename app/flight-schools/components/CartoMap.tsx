"use client";

import { useEffect, useMemo, useRef } from "react";
import type {
  GeoJSONSource,
  Map as MapLibreInstance,
  Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FlightSchool } from "@/types/flight-school";

// CARTO's free MapLibre vector styles — the same light basemaps NammaKasa uses.
// Vector tiles: crisp + smooth at every zoom, no raster satellite clutter,
// no "map data not available" gutters. No API key required.
export const CARTO_STYLES = {
  voyager: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  positron: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
} as const;

export type CartoStyleKey = keyof typeof CARTO_STYLES;

type SchoolFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { id: string; name: string; city: string; country: string; isPartner: boolean }
>;

function schoolGeoJson(schools: FlightSchool[]): SchoolFeatureCollection {
  return {
    type: "FeatureCollection",
    features: schools.map((s) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [s.lng, s.lat] },
      properties: {
        id: s.id,
        name: s.name,
        city: s.city,
        country: s.country,
        isPartner: s.isPartner,
      },
    })),
  };
}

function popupHtml(f: SchoolFeatureCollection["features"][number]) {
  const { name, city, country, isPartner } = f.properties;
  return `
    <div style="background:#ffffff;color:#0f172a;padding:8px 11px;border-radius:10px;font-size:12px;line-height:1.45;border:1px solid rgba(197,165,114,0.5);box-shadow:0 10px 28px rgba(15,23,42,0.18);">
      <div style="font-weight:700;max-width:220px;white-space:normal;">${name}${isPartner ? " <span style='color:#B4863B'>&starf;</span>" : ""}</div>
      <div style="color:#B4863B;font-size:11px;margin-top:2px;">${city ? city + ", " : ""}${country}</div>
    </div>`;
}

interface Props {
  schools: FlightSchool[];
  onSelectSchool: (school: FlightSchool) => void;
  styleKey: CartoStyleKey;
  /** Fly to a lat/lng (country centroid) when key changes. */
  flyTo?: { lat: number; lng: number; key: number };
}

export default function CartoMap({ schools, onSelectSchool, styleKey, flyTo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreInstance | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const schoolsRef = useRef(schools);
  const onSelectRef = useRef(onSelectSchool);
  const geojson = useMemo(() => schoolGeoJson(schools), [schools]);

  useEffect(() => { schoolsRef.current = schools; }, [schools]);
  useEffect(() => { onSelectRef.current = onSelectSchool; }, [onSelectSchool]);

  // Add the schools source + layers to the current style. Re-run whenever the
  // basemap style is swapped (setStyle wipes custom sources/layers).
  function addSchoolLayers(map: MapLibreInstance) {
    if (map.getSource("schools")) return;
    map.addSource("schools", {
      type: "geojson",
      data: schoolGeoJson(schoolsRef.current),
      cluster: true,
      clusterRadius: 50,
      clusterMaxZoom: 8,
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "schools",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": ["step", ["get", "point_count"], "#C5A572", 12, "#D6B985", 40, "#EAD3A2"],
        "circle-radius": ["step", ["get", "point_count"], 16, 12, 21, 40, 28],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-opacity": 0.95,
      },
    });
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "schools",
      filter: ["has", "point_count"],
      layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
      paint: { "text-color": "#3a2c12" },
    });

    // Partner glow
    map.addLayer({
      id: "partner-halo",
      type: "circle",
      source: "schools",
      filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "isPartner"], true]],
      paint: { "circle-radius": 15, "circle-color": "#C5A572", "circle-opacity": 0.22, "circle-blur": 0.5 },
    });
    // Individual schools
    map.addLayer({
      id: "schools",
      type: "circle",
      source: "schools",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": ["case", ["==", ["get", "isPartner"], true], 8, 5],
        "circle-color": ["case", ["==", ["get", "isPartner"], true], "#C5A572", "#3E63DD"],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
        "circle-opacity": 0.98,
      },
    });
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    void import("maplibre-gl").then((maplibre) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = new maplibre.Map({
        container: containerRef.current,
        style: CARTO_STYLES[styleKey],
        center: [30, 25],
        zoom: 1.4,
        minZoom: 1,
        maxZoom: 17,
        attributionControl: false,
        dragRotate: false,
        renderWorldCopies: true,
      });
      mapRef.current = map;
      popupRef.current = new maplibre.Popup({ closeButton: false, closeOnClick: false, offset: 12 });

      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");

      map.on("load", () => addSchoolLayers(map));

      map.on("click", "clusters", async (e) => {
        const feat = map.queryRenderedFeatures(e.point, { layers: ["clusters"] })[0];
        const clusterId = feat?.properties?.cluster_id;
        const src = map.getSource("schools") as GeoJSONSource | undefined;
        if (clusterId == null || !src) return;
        const zoom = await src.getClusterExpansionZoom(clusterId);
        map.easeTo({ center: (feat.geometry as GeoJSON.Point).coordinates as [number, number], zoom, duration: 600 });
      });

      map.on("click", "schools", (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        const school = schoolsRef.current.find((s) => s.id === id);
        if (school) onSelectRef.current(school);
      });

      map.on("mouseenter", "schools", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0] as SchoolFeatureCollection["features"][number] | undefined;
        if (!f) return;
        popupRef.current?.setLngLat(f.geometry.coordinates as [number, number]).setHTML(popupHtml(f)).addTo(map);
      });
      map.on("mouseleave", "schools", () => { map.getCanvas().style.cursor = ""; popupRef.current?.remove(); });
      map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });
    });

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap basemap style without tearing down the map.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(CARTO_STYLES[styleKey]);
    map.once("styledata", () => addSchoolLayers(map));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleKey]);

  // Keep marker data in sync.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const src = map.getSource("schools") as GeoJSONSource | undefined;
    if (src) src.setData(geojson);
  }, [geojson]);

  // Fly to a country centroid.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !flyTo) return;
    map.flyTo({ center: [flyTo.lng, flyTo.lat], zoom: 4.5, duration: 1400, essential: true });
  }, [flyTo?.key]);

  return <div ref={containerRef} className="wc-map h-full w-full" />;
}
