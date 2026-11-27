"use client";

import { useEffect, useRef, useState } from "react";
import { Bike, Flag, MapPin, Users } from "lucide-react";
import { RALLY } from "@/lib/bike-rally";

/**
 * "The day" on /bike-rally as a drawn route (not a map: the real start point
 * and route are not announced yet, so no roads, areas or distances).
 * The gold road draws itself when the section scrolls into view and a bike
 * rides it to the finish flag; the last stretch (finish to "meet people") is a
 * dotted walk. Phones: the road runs down the page; md and up: left to right.
 * prefers-reduced-motion: everything is shown finished, nothing moves.
 */

const STOPS = [
  { icon: MapPin, title: "Ride-out", text: RALLY.start ? `${RALLY.start}${RALLY.startTime ? `, ${RALLY.startTime}` : ""}` : "Start point shared on WhatsApp after you register" },
  { icon: null, title: "Ride together", text: "A relaxed group ride across Bengaluru" },
  { icon: Flag, title: `Breakfast at ${RALLY.time}`, text: RALLY.finish },
  { icon: Users, title: "Meet aviation people", text: "Pilots, instructors, students, engineers, ground crew" },
];

const RIDE_MS = 2600;
const WALK_MS = 700;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

type Geo = {
  viewBox: string;
  w: number;
  h: number;
  ride: string; // start -> finish (bike rides this)
  walk: string; // finish -> meet people (dotted)
  stops: [number, number][];
};

// Stops sit at fixed points so the HTML labels line up with them.
const VERTICAL: Geo = {
  viewBox: "0 0 72 600", w: 72, h: 600,
  ride: "M36 75 C 72 115, 0 185, 36 225 C 72 265, 0 335, 36 375",
  walk: "M36 375 C 64 415, 8 485, 36 525",
  stops: [[36, 75], [36, 225], [36, 375], [36, 525]],
};
const HORIZONTAL: Geo = {
  viewBox: "0 0 1000 150", w: 1000, h: 150,
  ride: "M125 75 C 205 5, 295 145, 375 75 C 455 5, 545 145, 625 75",
  walk: "M625 75 C 705 5, 795 145, 875 75",
  stops: [[125, 75], [375, 75], [625, 75], [875, 75]],
};

function Road({ geo, className = "" }: { geo: Geo; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ride = useRef<SVGPathElement>(null);
  const bike = useRef<SVGGElement>(null);
  const [draw, setDraw] = useState(0); // 0..1 of the ride road drawn
  const [walk, setWalk] = useState(0); // 0..1 of the walk drawn

  const placeBike = (t: number) => {
    const p = ride.current, b = bike.current;
    if (!p || !b) return;
    const len = p.getTotalLength();
    if (!len) return;
    const pt = p.getPointAtLength(t * len);
    b.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
  };

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDraw(1); setWalk(1); placeBike(1);
      return;
    }
    placeBike(0);
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const e = now - t0;
        const d = ease(Math.min(1, e / RIDE_MS));
        setDraw(d); placeBike(d);
        setWalk(Math.max(0, Math.min(1, (e - RIDE_MS) / WALK_MS)));
        if (e < RIDE_MS + WALK_MS) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((x) => x.isIntersecting)) { io.disconnect(); run(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // A stop lights up once the bike reaches it (finish = end of ride, meet = end of walk).
  const reached = [draw > 0 || walk > 0, draw >= 0.5, draw >= 1, walk >= 1];

  return (
    <div ref={wrap} className={className}>
      <svg viewBox={geo.viewBox} width={geo.w} height={geo.h} className="block h-auto max-w-full overflow-visible" aria-hidden="true" focusable="false">
        {/* The road ahead, faint, so the whole route is visible before it draws */}
        <path d={geo.ride} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={14} strokeLinecap="round" />
        <path d={geo.walk} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={14} strokeLinecap="round" />
        {/* Gold line drawing itself */}
        <path ref={ride} d={geo.ride} pathLength={1} fill="none" stroke="#C5A572" strokeWidth={3} strokeLinecap="round"
          strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        <path d={geo.walk} fill="none" stroke="#C5A572" strokeWidth={2.5} strokeLinecap="round" strokeDasharray="0.1 9"
          opacity={walk} />

        {geo.stops.map(([x, y], i) => {
          const Icon = STOPS[i].icon;
          const on = reached[i];
          return (
            <g key={i} transform={`translate(${x} ${y})`} style={{ transition: "opacity 300ms" }} opacity={on ? 1 : 0.45}>
              {Icon ? (
                <>
                  <circle r={17} fill="#0E0E0E" stroke="#C5A572" strokeWidth={on ? 2 : 1.25} />
                  <Icon x={-9} y={-9} width={18} height={18} color="#C5A572" strokeWidth={2} />
                </>
              ) : (
                <circle r={7} fill={on ? "#C5A572" : "#0E0E0E"} stroke="#C5A572" strokeWidth={1.5} />
              )}
            </g>
          );
        })}

        {/* The rider; hidden once parked at the finish so the flag shows */}
        <g ref={bike} style={{ transition: "opacity 300ms" }} opacity={draw > 0 && draw < 1 ? 1 : 0}>
          <circle r={14} fill="#C5A572" />
          <Bike x={-8.5} y={-8.5} width={17} height={17} color="#0E0E0E" strokeWidth={2.2} />
        </g>
      </svg>
    </div>
  );
}

export default function RallyRoute() {
  return (
    <div className="mt-8">
      {/* Phones: road down the left, stops beside it */}
      <div className="flex gap-4 md:hidden">
        <Road geo={VERTICAL} className="shrink-0" />
        <ol className="flex-1">
          {STOPS.map((s) => (
            <li key={s.title} className="flex h-[150px] flex-col justify-center">
              <h3 className="text-[16.5px] font-semibold leading-snug">{s.title}</h3>
              <p className="mt-1 text-[14.5px] leading-relaxed text-white/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* md and up: road left to right, stops underneath */}
      <div className="hidden md:block">
        <Road geo={HORIZONTAL} className="[&_svg]:w-full" />
        <ol className="mt-4 grid grid-cols-4">
          {STOPS.map((s) => (
            <li key={s.title} className="px-3 text-center">
              <h3 className="text-[16.5px] font-semibold leading-snug">{s.title}</h3>
              <p className="mx-auto mt-1 max-w-[220px] text-[14.5px] leading-relaxed text-white/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
