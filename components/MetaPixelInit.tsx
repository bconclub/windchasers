"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MetaPixelInit() {
  const initialized = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    if (!initialized.current) {
      initialized.current = true;
      window.fbq("init", "1097272771358425");
    }
    window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}
