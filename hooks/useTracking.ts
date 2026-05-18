"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  trackPageView,
  getSessionId,
  getStoredUTMParams,
  captureAndStoreUTMParams,
} from "@/lib/tracking";
import { captureAttributionToLocalStorage } from "@/lib/attribution";

export function useTracking() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const previousPathRef = useRef<string>("");

  useEffect(() => {
    // Capture UTM params, landing page, and referrer on initial load
    captureAndStoreUTMParams();
    // Long-lived first-touch attribution for WhatsApp prelaunch capture
    // and any other cross-session lead surface.
    captureAttributionToLocalStorage();
  }, []);

  useEffect(() => {
    // Track page view on mount and pathname change
    if (pathname && pathname !== previousPathRef.current) {
      // Calculate time spent on previous page
      const timeSpent = previousPathRef.current
        ? Math.floor((Date.now() - startTimeRef.current) / 1000)
        : undefined;

      // Track the new page view
      trackPageView(pathname, timeSpent);

      // Update refs
      previousPathRef.current = pathname;
      startTimeRef.current = Date.now();
    }
  }, [pathname]);

  useEffect(() => {
    // Track initial page load
    if (pathname && !previousPathRef.current) {
      trackPageView(pathname);
      previousPathRef.current = pathname;
    }

    // Track time spent when user leaves page
    return () => {
      if (previousPathRef.current) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackPageView(previousPathRef.current, timeSpent);
      }
    };
  }, []);

  return {
    sessionId: getSessionId(),
    // First-touch UTMs from sessionStorage. Persists across in-tab navigation
    // so a user who lands with ?utm_source=fb and clicks to /open-house still
    // sends the original campaign attribution with their form submission.
    utmParams: getStoredUTMParams(),
  };
}


