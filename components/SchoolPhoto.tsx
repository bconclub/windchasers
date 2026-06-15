"use client";

import { useState } from "react";

/**
 * A flight-school photo with a skeleton shimmer while it loads, so large
 * Supabase-storage images don't paint in visible strips. The placeholder
 * pulses until the image finishes loading, then the image fades in.
 */
export default function SchoolPhoto({ src, className = "" }: { src: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div
      className={`relative overflow-hidden bg-white/[0.06] ${loaded ? "" : "animate-pulse"} ${className}`}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`pointer-events-none h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
