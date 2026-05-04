"use client";

import { useRef, useCallback, useEffect } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import type { ComponentProps } from "react";

// Strip onGlobeClick and onPointClick — we handle them internally for zoom-to behaviour
type Props = Omit<ComponentProps<typeof Globe>, "ref" | "onGlobeClick" | "onPointClick"> & {
  onAltitudeChange?: (altitude: number, lat: number, lng: number) => void;
  paused?: boolean;
  resetKey?: number;
};

export default function GlobeLoader({ onAltitudeChange, paused, resetKey, ...props }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const controlsRef = useRef<any>(null);

  // Zoom camera to a lat/lng — altitude change listener will trigger flat-map switch
  const zoomTo = useCallback((lat: number, lng: number) => {
    const globe = globeRef.current;
    if (!globe) return;
    if (controlsRef.current) controlsRef.current.autoRotate = false;
    // Animate in close enough to cross ZOOM_IN_THRESHOLD (1.5) smoothly
    globe.pointOfView({ lat, lng, altitude: 0.05 }, 1400);
  }, []);

  // Click anywhere on the globe surface → zoom there
  const handleGlobeClick = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      zoomTo(lat, lng);
    },
    [zoomTo]
  );

  // Click a school point → zoom to that school's location
  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as any;
      const lat = typeof p.lat === "number" ? p.lat : 0;
      const lng = typeof p.lng === "number" ? p.lng : 0;
      zoomTo(lat, lng);
    },
    [zoomTo]
  );

  const handleReady = useCallback(() => {
    const globe = globeRef.current;
    if (!globe) return;
    setTimeout(() => {
      globe.pointOfView({ altitude: 2.5 }, 0);
    }, 150);
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = true;
    controlsRef.current = controls;

    if (onAltitudeChange) {
      controls.addEventListener("change", () => {
        const pov = globe.pointOfView();
        onAltitudeChange(pov.altitude ?? 2.5, pov.lat ?? 0, pov.lng ?? 0);
      });
    }
  }, [onAltitudeChange]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !paused;
    }
  }, [paused]);

  useEffect(() => {
    if (resetKey && resetKey > 0 && globeRef.current) {
      globeRef.current.pointOfView({ altitude: 2.5 }, 700);
    }
  }, [resetKey]);

  return (
    <Globe
      ref={globeRef}
      onGlobeReady={handleReady}
      onGlobeClick={handleGlobeClick}
      onPointClick={handlePointClick}
      {...props}
    />
  );
}
