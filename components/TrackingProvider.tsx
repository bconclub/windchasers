"use client";

import { useTracking } from "@/hooks/useTracking";

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useTracking();
  
  return <>{children}</>;
}


