"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track, EVENTS } from "@/lib/analytics/events";

/**
 * Fires scroll_depth at 25 / 50 / 75 / 100% once each, per page. Resets on
 * route change so every page measures its own depth. Renders nothing.
 */
const MILESTONES = [25, 50, 75, 100] as const;

export default function ScrollDepthTracker() {
  const pathname = usePathname();
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // New page, clear the milestones already fired.
    firedRef.current = new Set();

    let ticking = false;
    const compute = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const m of MILESTONES) {
        if (pct >= m && !firedRef.current.has(m)) {
          firedRef.current.add(m);
          track(EVENTS.SCROLL_DEPTH, { percent: m, page_path: pathname || "" });
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Fire once on mount in case the page is short / already scrolled.
    compute();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
