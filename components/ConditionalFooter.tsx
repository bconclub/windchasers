"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on demo and assessment pages
  if (pathname === "/demo" || pathname === "/assessment") {
    return null;
  }
  
  return <Footer />;
}

