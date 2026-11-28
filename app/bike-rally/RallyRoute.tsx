"use client";

import { useEffect, useRef, useState } from "react";
import { Bike, Check, Flag, MapPin, Users } from "lucide-react";
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

const startPlace = RALLY.start ?? "Shared on WhatsApp after you register";
const rideTime = RALLY.rideMinutes ? (RALLY.rideMinutes >= 60 ? `${Math.floor(RALLY.rideMinutes / 60)} h${RALLY.rideMinutes % 60 ? ` ${RALLY.rideMinutes % 60} min` : ""}` : `${RALLY.rideMinutes} min`) : null;

const FACTS: { label: string; value: string; note?: string; maps?: string | null }[] = [
  { label: "Start", value: startPlace, note: RALLY.startTime ? `Ride-out at ${RALLY.startTime}` : RALLY.start ? "Meeting spot and ride-out time shared on WhatsApp after you register" : undefined, maps: RALLY.startMapsUrl },
  { label: "Finish", value: RALLY.finish, note: `Breakfast at ${RALLY.time}`, maps: RALLY.finishMapsUrl },
  ...(RALLY.distanceKm ? [{ label: "Distance", value: `About ${RALLY.distanceKm} km` }] : []),
  ...(rideTime ? [{ label: "Ride time", value: `About ${rideTime}` }] : []),
];

const RIDER_INFO = [
  { title: "Who can ride", items: ["Riders 18 and over", "A valid driving licence", "Your own bike"] },
  { title: "What to bring", items: ["Helmet", "Riding gear", "Your driving licence"] },
  { title: "Documents", items: ["Licence and ID copies are collected on WhatsApp after you register"] },
];

export default function RallyRoute() {
  return (
    <div className="mt-8">
      {RALLY.routeMapImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={RALLY.routeMapImage} alt={`Route map from ${startPlace} to ${RALLY.finish}`} loading="lazy" className="w-full rounded-2xl border border-white/10" />
      ) : (
        <DrawnRoute />
      )}

      {/* Route card: the facts, straight from lib/bike-rally.ts */}
      <dl className="mt-8 grid divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-[#151515] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {FACTS.map((f) => (
          <div key={f.label} className="p-5">
            <dt className="text-[13px] font-medium text-gold">{f.label}</dt>
            <dd className="mt-1.5">
              <span className="block text-[16px] font-semibold leading-snug">{f.value}</span>
              {f.note && <span className="mt-1 block text-[14.5px] text-white/65">{f.note}</span>}
              {f.maps && (
                <a href={f.maps} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-gold underline-offset-4 hover:underline">
                  <MapPin size={15} /> Open in Maps
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-7 sm:grid-cols-3 sm:gap-6">
        {RIDER_INFO.map((b) => (
          <div key={b.title}>
            <h3 className="text-[15.5px] font-semibold">{b.title}</h3>
            <ul className="mt-2.5 space-y-2">
              {b.items.map((i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed text-white/70">
                  <Check size={16} className="mt-[3px] shrink-0 text-gold" />{i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function DrawnRoute() {
  return (
    <div>
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
