"use client";

import { useTracking } from "@/hooks/useTracking";
import ScrollDepthTracker from "@/components/ScrollDepthTracker";

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useTracking();

  return (
    <>
      <ScrollDepthTracker />
      {children}
    </>
  );
}


