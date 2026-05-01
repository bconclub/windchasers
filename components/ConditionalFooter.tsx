"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on demo, assessment, pricing, open house, summer camp, atc, cabin crew,
  // pilot-training-students, students, parents, gtm, and all webinar pages.
  if (
    pathname === "/demo" ||
    pathname === "/assessment" ||
    pathname === "/assessment/early" ||
    pathname === "/pricing" ||
    pathname === "/open-house" ||
    pathname === "/summercamp" ||
    pathname === "/atc" ||
    pathname === "/cabin-crew" ||
    pathname === "/pilot-training-students" ||
    pathname === "/students" ||
    pathname === "/parents" ||
    pathname === "/gtm" ||
    pathname?.startsWith("/webinar")
  ) {
    return null;
  }
  
  return <Footer />;
}

