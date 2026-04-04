"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on demo, assessment, pricing, and open house pages
  if (pathname === "/demo" || pathname === "/assessment" || pathname === "/pricing" || pathname === "/open-house") {
    return null;
  }
  
  return <Footer />;
}

