"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import StickyDemoCTA from "@/components/StickyDemoCTA";

/**
 * Public site chrome, the navbar, sticky CTA, and the PROXe chat widget.
 * Rendered on every public page but NEVER on the admin (/admin, /admin-login):
 * the admin has its own sidebar layout, and the public navbar + chat launcher
 * were bleeding on top of it. Not rendering the PROXe <Script> on admin means
 * the chat widget never loads there.
 */
export default function SiteChrome() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null; // covers /admin and /admin-login

  // Flight-schools is a stripped-back, map-first page for now: logo-only header
  // (handled in Navbar), no sticky CTA, no PROXe chat launcher. Bring them back
  // later when the page is finalised.
  const isFlightSchools = pathname === "/flight-schools";
  // Webinar pages have their own "Reserve my seat" CTA — the global "Book a
  // Demo Class" sticky competes with it, so hide it there (keep the chat widget).
  const isWebinar = pathname.startsWith("/webinar");

  return (
    <>
      <Navbar />
      {!isFlightSchools && !isWebinar && <StickyDemoCTA />}
      {!isFlightSchools && (
        <Script
          src="https://proxe.windchasers.in/api/widget/embed.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
