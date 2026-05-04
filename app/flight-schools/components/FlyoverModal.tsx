"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pause, Play, PlaneTakeoff } from "lucide-react";
import { FlightSchool } from "@/types/flight-school";

interface Props {
  school: FlightSchool;
  onClose: () => void;
}

// Radius of drone orbit in degrees (~4 km)
const ORBIT_RADIUS = 0.036;
// Drone altitude pitch — looking at the horizon like a real flight
const FLIGHT_PITCH = 68;
// Orbit speed — degrees per frame at 60fps
const ORBIT_SPEED = 0.055;
const FLIGHT_ZOOM = 13.2;

export default function FlyoverModal({ school, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const animRef = useRef<number>(0);
  const angleRef = useRef(0);
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState<"loading" | "approaching" | "flying">("loading");

  const togglePlay = useCallback(() => {
    playingRef.current = !playingRef.current;
    setPlaying(playingRef.current);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    let destroyed = false;

    (async () => {
      const ml = (await import("maplibre-gl")).default;
      if (destroyed || !containerRef.current) return;

      const map = new ml.Map({
        container: containerRef.current,
        style: {
          version: 8 as const,
          sources: {
            satellite: {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              attribution: "© Esri",
              maxzoom: 19,
            },
            terrain: {
              type: "raster-dem",
              tiles: [
                "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
              ],
              encoding: "terrarium" as const,
              tileSize: 256,
            },
          },
          layers: [{ id: "satellite", type: "raster", source: "satellite" }],
          terrain: { source: "terrain", exaggeration: 1.6 },
          sky: {
            "sky-color": "#0a1628",
            "sky-horizon-blend": 0.35,
            "horizon-color": "#c8daf0",
            "horizon-fog-blend": 0.5,
            "fog-color": "#dce8f8",
            "fog-ground-blend": 0.85,
          },
        },
        // Start overhead before the approach animation
        center: [school.lng, school.lat],
        zoom: 9,
        pitch: 20,
        bearing: 0,
        interactive: true, // allow manual pan/zoom during flyover
      });

      mapRef.current = map;

      map.on("load", () => {
        if (destroyed) return;
        setPhase("approaching");

        // School pin
        const pin = document.createElement("div");
        pin.style.cssText =
          "width:16px;height:16px;background:#C5A572;border-radius:50%;border:2px solid #fff;box-shadow:0 0 16px rgba(197,165,114,1),0 0 32px rgba(197,165,114,0.4);";
        new ml.Marker({ element: pin })
          .setLngLat([school.lng, school.lat])
          .addTo(map);

        // ── Approach: come in fast from overhead, tilt to horizon view ──
        // Start drone orbit position (angle 0 = north of school)
        const startLng = school.lng;
        const startLat = school.lat + ORBIT_RADIUS;

        map.flyTo({
          center: [startLng, startLat],
          zoom: FLIGHT_ZOOM,
          pitch: FLIGHT_PITCH,
          bearing: 180, // pointing south (toward school)
          duration: 4500,
          essential: true,
          curve: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });

        map.once("moveend", () => {
          if (destroyed) return;
          setPhase("flying");
          angleRef.current = 0;
          startDroneFlight();
        });
      });

      function startDroneFlight() {
        function frame() {
          if (destroyed || !mapRef.current) return;

          if (playingRef.current) {
            angleRef.current = (angleRef.current + ORBIT_SPEED) % 360;
            const rad = (angleRef.current * Math.PI) / 180;

            // Camera physically moves through the world along the orbit ring
            const camLng = school.lng + ORBIT_RADIUS * Math.sin(rad);
            const camLat = school.lat + ORBIT_RADIUS * Math.cos(rad);

            // Bearing always points from camera toward the school
            const bearing = (angleRef.current + 180) % 360;

            // Slight pitch oscillation for a natural, alive feel (+/- 3°)
            const pitchWobble = Math.sin(rad * 2) * 3;

            mapRef.current.jumpTo({
              center: [camLng, camLat],
              bearing,
              pitch: FLIGHT_PITCH + pitchWobble,
              zoom: FLIGHT_ZOOM,
            });
          }

          animRef.current = requestAnimationFrame(frame);
        }

        animRef.current = requestAnimationFrame(frame);
      }
    })();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animRef.current);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [school]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[2000]"
    >
      {/* The 3D world */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Loading phase */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#060b14] flex flex-col items-center justify-center gap-4"
          >
            <PlaneTakeoff className="w-10 h-10 text-[#C5A572] animate-bounce" />
            <p className="text-white/40 text-sm tracking-widest uppercase">
              Loading terrain data…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approach phase overlay */}
      <AnimatePresence>
        {phase === "approaching" && (
          <motion.div
            key="approach"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 2 }}
            className="absolute inset-0 pointer-events-none flex items-end justify-center pb-20"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
              <PlaneTakeoff className="w-4 h-4 text-[#C5A572]" />
              <span className="text-white/60 text-xs tracking-wide">Approaching {school.city}…</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar — always visible */}
      <div className="absolute top-0 left-0 right-0 px-5 pt-5 pb-16 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#C5A572] text-[10px] uppercase tracking-[0.25em] mb-1.5 flex items-center gap-1.5">
              <PlaneTakeoff className="w-3 h-3" />
              Drone flyover
            </p>
            <h2 className="text-white text-2xl font-bold leading-tight drop-shadow-lg">
              {school.name}
            </h2>
            <p className="text-white/50 text-sm mt-0.5">{school.city}, {school.country}</p>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-[#C5A572]/60 transition-colors"
              title={playing ? "Pause" : "Resume"}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-px" />}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-white/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
        <div className="flex items-end justify-between">
          <p className="text-white/25 text-[10px] tracking-wide uppercase">
            3D terrain · satellite imagery · real elevation data
          </p>
          {phase === "flying" && (
            <p className="text-white/20 text-[10px]">Drag to look around · Scroll to zoom</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
