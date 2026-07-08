"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A flight-school photo with a skeleton shimmer while it loads, so large
 * Supabase-storage images don't paint in visible strips. The placeholder
 * pulses until the image finishes loading, then the image fades in.
 */
export default function SchoolPhoto({ src, className = "" }: { src: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can finish loading before React attaches onLoad, which would
  // otherwise leave it stuck at opacity-0 (invisible). Catch that on mount.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [src]);

  if (failed) return null;

  return (
    <div
      className={`relative overflow-hidden bg-white/[0.06] ${loaded ? "" : "animate-pulse"} ${className}`}
    >
      <img
        ref={imgRef}
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
