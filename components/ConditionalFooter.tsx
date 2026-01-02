"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on demo, assessment, and pricing pages
  if (pathname === "/demo" || pathname === "/assessment" || pathname === "/pricing") {
    return null;
  }
  
  return <Footer />;
}

