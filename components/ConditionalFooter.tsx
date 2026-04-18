"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on demo, assessment, pricing, open house, summer camp, atc, and cabin crew pages
  if (pathname === "/demo" || pathname === "/assessment" || pathname === "/pricing" || pathname === "/open-house" || pathname === "/summercamp" || pathname === "/atc" || pathname === "/cabin-crew" || pathname?.startsWith("/webinar")) {
    return null;
  }
  
  return <Footer />;
}

