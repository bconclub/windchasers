"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { track, trackMeta, EVENTS } from "@/lib/analytics/events";

/**
 * Global sticky "Book a Demo Class" button.
 *
 * Behaviour by route:
 *  - /pilot-training*  → ALWAYS visible (primary lead-gen page, keep prominent)
 *  - everything else   → reveals on scroll-UP only, hidden while scrolling down
 *
 * Hidden entirely on admin + thank-you pages.
 */
export default function StickyDemoCTA() {
  const pathname = usePathname() || "/";
  const isPilotTraining = pathname.startsWith("/pilot-training");
  const hidden =
    pathname.startsWith("/admin") || pathname.startsWith("/thank-you");

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (hidden) {
      setShow(false);
      return;
    }
    if (isPilotTraining) {
      // Lead page: keep it prominent, but NOT in the hero (which already has the
      // inline lead form). Reveal once scrolled past the hero, then stay visible.
      const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // All other pages: reveal on scroll-up, hide on scroll-down / near top.
    let lastY = window.scrollY;
    setShow(false);
    const onScroll = () => {
      const y = window.scrollY;
      const goingUp = y < lastY - 4;
      const goingDown = y > lastY + 4;
      if (goingUp && y > 400) setShow(true);
      else if (goingDown || y <= 400) setShow(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, isPilotTraining, hidden]);

  if (hidden) return null;

  const onClick = () => {
    track(EVENTS.BOOK_DEMO_STICKY, {
      cta_location: isPilotTraining ? "sticky_pilot_training" : "sticky_global",
      source_page: pathname,
    });
    trackMeta("InitiateCheckout", { content_name: "Sticky Demo CTA" });
    const btn = document.querySelector<HTMLElement>(
      '[id*="proxe"], [class*="proxe-launcher"], [class*="widget-launcher"]'
    );
    if (btn) {
      btn.click();
    } else {
      window.location.href = "/demo";
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        show
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex items-center whitespace-nowrap px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-[#C5A572] text-black text-xs md:text-sm font-bold uppercase tracking-wider active:scale-95 transition-all hover:bg-[#d4b885]"
        style={{ boxShadow: "0 4px 24px rgba(197,165,114,0.5)" }}
      >
        Book a Demo Class
      </button>
    </div>
  );
}
