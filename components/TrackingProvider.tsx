"use client";

import { useTracking } from "@/hooks/useTracking";
import { useEffect } from "react";

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  useTracking();
  
  return <>{children}</>;
}


