"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import StickyDemoCTA from "@/components/StickyDemoCTA";

/**
 * Public site chrome — the navbar, sticky CTA, and the PROXe chat widget.
 * Rendered on every public page but NEVER on the admin (/admin, /admin-login):
 * the admin has its own sidebar layout, and the public navbar + chat launcher
 * were bleeding on top of it. Not rendering the PROXe <Script> on admin means
 * the chat widget never loads there.
 */
export default function SiteChrome() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return null; // covers /admin and /admin-login

  return (
    <>
      <Navbar />
      <StickyDemoCTA />
      <Script
        src="https://proxe.windchasers.in/api/widget/embed.js"
        strategy="afterInteractive"
      />
    </>
  );
}
