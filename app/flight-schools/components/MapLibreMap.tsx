"use client";

import { useEffect, useMemo, useRef } from "react";
import type {
  GeoJSONSource,
  Map as MapLibreInstance,
  Popup,
  StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { FlightSchool } from "@/types/flight-school";
import { MapStyleKey, MAP_STYLES } from "../lib/globe-config";

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

type SchoolFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  {
    id: string;
    name: string;
    city: string;
    country: string;
    isPartner: boolean;
    classification: string;
  }
>;

function rasterTiles(url: string, subdomains?: boolean) {
  if (!subdomains || !url.includes("{s}")) return [url];
  return ["a", "b", "c", "d"].map((subdomain) =>
    url.replace("{s}", subdomain),
  );
}

function mapStyleFor(key: MapStyleKey): StyleSpecification {
  const selected = MAP_STYLES.find((style) => style.key === key) ?? MAP_STYLES[0];
  const sources: StyleSpecification["sources"] = {
    "base-raster": {
      type: "raster",
      tiles: rasterTiles(selected.url, selected.subdomains),
      tileSize: 256,
      attribution: selected.attribution,
    },
  };
  const layers: StyleSpecification["layers"] = [
    {
      id: "base-raster",
      type: "raster",
      source: "base-raster",
    },
  ];

  if (selected.labelsUrl) {
    sources["label-raster"] = {
      type: "raster",
      tiles: rasterTiles(selected.labelsUrl, selected.subdomains),
      tileSize: 256,
    };
    layers.push({
      id: "label-raster",
      type: "raster",
      source: "label-raster",
    });
  }

  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources,
    layers,
  };
}

function schoolGeoJson(schools: FlightSchool[]): SchoolFeatureCollection {
  return {
    type: "FeatureCollection",
    features: schools.map((school) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [school.lng, school.lat],
      },
      properties: {
        id: school.id,
        name: school.name,
        city: school.city,
        country: school.country,
        isPartner: school.isPartner,
        classification: school.wcClassification ?? "",
      },
    })),
  };
}

function popupHtml(feature: SchoolFeatureCollection["features"][number]) {
  const { name, city, country, isPartner } = feature.properties;
  return `
    <div style="background:#10151f;color:#fff;padding:8px 10px;border-radius:10px;font-size:12px;line-height:1.45;border:1px solid rgba(197,165,114,0.35);box-shadow:0 12px 30px rgba(0,0,0,0.35);">
      <div style="font-weight:700;max-width:220px;white-space:normal;">${name}${isPartner ? " <span style='color:#C5A572'>&starf;</span>" : ""}</div>
      <div style="color:#C5A572;font-size:11px;margin-top:2px;">${city}, ${country}</div>
    </div>
  `;
}

export default function MapLibreMap({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreInstance | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const schoolsRef = useRef(schools);
  const onSelectSchoolRef = useRef(onSelectSchool);
  const onZoomOutRef = useRef(onZoomOut);
  const coolingRef = useRef(false);
  const geojson = useMemo(() => schoolGeoJson(schools), [schools]);

  useEffect(() => {
    schoolsRef.current = schools;
  }, [schools]);

  useEffect(() => {
    onSelectSchoolRef.current = onSelectSchool;
  }, [onSelectSchool]);

  useEffect(() => {
    onZoomOutRef.current = onZoomOut;
  }, [onZoomOut]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    void import("maplibre-gl").then((maplibre) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = new maplibre.Map({
        container: containerRef.current,
        style: mapStyleFor(mapStyle),
        center: [initialLng, initialLat],
        zoom: initialZoom,
        minZoom: 2,
        maxZoom: 18,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        renderWorldCopies: false,
        cooperativeGestures: false,
      });

      mapRef.current = map;
      popupRef.current = new maplibre.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 14,
        className: "wc-school-popup",
      });

      map.addControl(
        new maplibre.NavigationControl({
          showCompass: false,
          visualizePitch: false,
        }),
        "bottom-right",
      );
      map.addControl(new maplibre.AttributionControl({ compact: true }), "bottom-left");

      map.on("load", () => {
        map.addSource("schools", {
          type: "geojson",
          data: schoolGeoJson(schoolsRef.current),
          cluster: true,
          clusterRadius: 52,
          clusterMaxZoom: 8,
        });

        map.addLayer({
          id: "school-clusters",
          type: "circle",
          source: "schools",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#C5A572",
              12,
              "#D6B985",
              40,
              "#F0D7A4",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              17,
              12,
              22,
              40,
              29,
            ],
            "circle-opacity": 0.95,
            "circle-stroke-color": "rgba(10,10,10,0.78)",
            "circle-stroke-width": 3,
          },
        });

        map.addLayer({
          id: "school-cluster-count",
          type: "symbol",
          source: "schools",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#090909",
          },
        });

        map.addLayer({
          id: "partner-school-halo",
          type: "circle",
          source: "schools",
          filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "isPartner"], true]],
          paint: {
            "circle-radius": 16,
            "circle-color": "#C5A572",
            "circle-opacity": 0.16,
            "circle-blur": 0.35,
          },
        });

        map.addLayer({
          id: "schools",
          type: "circle",
          source: "schools",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": [
              "case",
              ["==", ["get", "isPartner"], true],
              8,
              ["==", ["get", "classification"], "likely_school"],
              6,
              5,
            ],
            "circle-color": [
              "case",
              ["==", ["get", "isPartner"], true],
              "#C5A572",
              ["==", ["get", "classification"], "likely_school"],
              "#8FA8FF",
              "#9CA3AF",
            ],
            "circle-opacity": 0.96,
            "circle-stroke-color": "rgba(8,12,18,0.85)",
            "circle-stroke-width": 2,
          },
        });
      });

      map.on("click", "school-clusters", async (event) => {
        const feature = map.queryRenderedFeatures(event.point, {
          layers: ["school-clusters"],
        })[0];
        const clusterId = feature?.properties?.cluster_id;
        const source = map.getSource("schools") as GeoJSONSource | undefined;
        if (clusterId == null || !source) return;

        const zoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
          zoom,
          duration: 650,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
      });

      map.on("click", "schools", (event) => {
        const id = event.features?.[0]?.properties?.id as string | undefined;
        const school = schoolsRef.current.find((item) => item.id === id);
        if (school) onSelectSchoolRef.current(school);
      });

      map.on("mouseenter", "schools", (event) => {
        map.getCanvas().style.cursor = "pointer";
        const feature = event.features?.[0] as SchoolFeatureCollection["features"][number] | undefined;
        if (!feature) return;
        popupRef.current
          ?.setLngLat(feature.geometry.coordinates as [number, number])
          .setHTML(popupHtml(feature))
          .addTo(map);
      });

      map.on("mouseleave", "schools", () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });

      map.on("mouseenter", "school-clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "school-clusters", () => {
        map.getCanvas().style.cursor = "";
      });

      const wheelHandler = (event: WheelEvent) => {
        if (event.deltaY <= 0) return;
        if (map.getZoom() > map.getMinZoom() + 0.05) return;
        if (coolingRef.current) return;
        coolingRef.current = true;
        window.setTimeout(() => {
          coolingRef.current = false;
        }, 1500);
        onZoomOutRef.current();
      };

      map.getCanvasContainer().addEventListener("wheel", wheelHandler, {
        passive: true,
      });
    });

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initialLat, initialLng, initialZoom, mapStyle]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => {
      const source = map.getSource("schools") as GeoJSONSource | undefined;
      source?.setData(geojson);
    };

    if (map.isStyleLoaded() && map.getSource("schools")) {
      update();
    } else {
      map.once("load", update);
    }
  }, [geojson]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !visible) return;
    requestAnimationFrame(() => map.resize());
  }, [visible]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({
      center: [currentLng, currentLat],
      zoom: currentZoom,
      duration: 520,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }, [currentLat, currentLng, currentZoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !fitBoundsTarget || fitBoundsTarget.points.length === 0) return;

    if (fitBoundsTarget.points.length === 1) {
      const [lat, lng] = fitBoundsTarget.points[0];
      map.easeTo({
        center: [lng, lat],
        zoom: 6,
        duration: 650,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      return;
    }

    const lngs = fitBoundsTarget.points.map(([, lng]) => lng);
    const lats = fitBoundsTarget.points.map(([lat]) => lat);
    const bounds: [[number, number], [number, number]] = [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ];

    map.fitBounds(bounds, {
      padding: 80,
      maxZoom: 6,
      duration: 720,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  }, [fitBoundsTarget]);

  return <div ref={containerRef} className="h-full w-full" />;
}