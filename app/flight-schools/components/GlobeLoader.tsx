"use client";

import { useRef, useCallback, useEffect } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import type { ComponentProps } from "react";

// Strip onGlobeClick and onPointClick, we handle them internally for zoom-to behaviour
type Props = Omit<ComponentProps<typeof Globe>, "ref" | "onGlobeClick" | "onPointClick"> & {
  onAltitudeChange?: (altitude: number, lat: number, lng: number) => void;
  paused?: boolean;
  resetKey?: number;
  zoomTarget?: { lat: number; lng: number; key: number };
  // Hero mode: the globe is one section on a scrollable page. Clicking a
  // marker opens its details (no tunnel-zoom), the mouse wheel scrolls the
  // PAGE (we don't trap it), and "fly to" eases to a regional altitude on the
  // globe surface rather than diving inside for a flat-map handoff.
  heroMode?: boolean;
  onPointSelect?: (point: object) => void;
};

export default function GlobeLoader({ onAltitudeChange, paused, resetKey, zoomTarget, heroMode, onPointSelect, ...props }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const controlsRef = useRef<any>(null);

  // Ease the camera to a lat/lng. Hero mode stops at a regional altitude so the
  // country stays visible on the globe; legacy mode dives in for the flat-map
  // handoff the altitude watcher listens for.
  const zoomTo = useCallback((lat: number, lng: number) => {
    const globe = globeRef.current;
    if (!globe) return;
    if (controlsRef.current) controlsRef.current.autoRotate = false;
    globe.pointOfView({ lat, lng, altitude: heroMode ? 1.1 : 0.05 }, 1400);
  }, [heroMode]);

  // Click empty ocean/land: hero mode ignores it (drag spins, wheel scrolls);
  // legacy mode zooms toward the click.
  const handleGlobeClick = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      if (heroMode) return;
      zoomTo(lat, lng);
    },
    [zoomTo, heroMode]
  );

  // Click a school marker: hero mode opens its details; legacy mode zooms to it.
  const handlePointClick = useCallback(
    (point: object) => {
      if (heroMode) {
        onPointSelect?.(point);
        return;
      }
      const p = point as any;
      const lat = typeof p.lat === "number" ? p.lat : 0;
      const lng = typeof p.lng === "number" ? p.lng : 0;
      zoomTo(lat, lng);
    },
    [zoomTo, heroMode, onPointSelect]
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
    // Zoom is driven by our own wheel handler below (OrbitControls' wheel
    // dolly is unreliable), disable it so the two never fight.
    controls.enableZoom = false;
    controlsRef.current = controls;
  }, []);

  // Altitude watcher, drives the globe→map handoff. We deliberately do NOT
  // rely on OrbitControls "change" events: the click-to-zoom pointOfView tween
  // moves the camera directly without firing them, which left users tunnelled
  // deep inside the globe with no 2D-map switch. A rAF loop reporting every
  // actual altitude change covers wheel, pinch AND programmatic tweens.
  useEffect(() => {
    if (paused || !onAltitudeChange) return;
    let raf = 0;
    let lastAlt = -1;
    const loop = () => {
      const globe = globeRef.current;
      if (globe) {
        const pov = globe.pointOfView();
        const alt = pov.altitude ?? 2.5;
        if (Math.abs(alt - lastAlt) > 0.001) {
          lastAlt = alt;
          onAltitudeChange(alt, pov.lat ?? 0, pov.lng ?? 0);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused, onAltitudeChange]);

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

  // Search-triggered zoom: spin globe to country then zoom in
  useEffect(() => {
    if (zoomTarget && zoomTarget.key > 0) {
      zoomTo(zoomTarget.lat, zoomTarget.lng);
    }
  }, [zoomTarget?.key, zoomTo]);

  // Manual wheel zoom. OrbitControls' built-in wheel dolly proved unreliable
  // (its internal state machine can end up ignoring wheel events entirely, so
  // scrolling did nothing and the globe never handed off to the 2D map).
  // We drive pointOfView altitude ourselves: ~13% per tick, which the rAF
  // altitude watcher above reports to the parent → map handoff on zoom-in.
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Hero mode: never trap the wheel — the page must be able to scroll past
    // the globe. Drag still spins it.
    if (heroMode) return;
    const el = wrapperRef.current;
    if (!el || paused) return;
    const onWheel = (e: WheelEvent) => {
      const globe = globeRef.current;
      if (!globe) return;
      e.preventDefault();
      // Stop auto-rotation first, its per-frame controls.update() would
      // overwrite the camera tween and the zoom would never apply.
      if (controlsRef.current) controlsRef.current.autoRotate = false;
      const pov = globe.pointOfView();
      const alt = pov.altitude ?? 2.5;
      const next = Math.min(2.5, Math.max(0.3, alt * (e.deltaY > 0 ? 1.15 : 0.87)));
      globe.pointOfView({ altitude: next }, 120);
    };
    // capture phase: react-globe.gl's inner wrappers stop wheel propagation,
    // so a bubble-phase listener up here never hears the event.
    el.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => el.removeEventListener("wheel", onWheel, { capture: true });
  }, [paused, heroMode]);

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <Globe
        ref={globeRef}
        onGlobeReady={handleReady}
        onGlobeClick={handleGlobeClick}
        onPointClick={handlePointClick}
        {...props}
      />
    </div>
  );
}
