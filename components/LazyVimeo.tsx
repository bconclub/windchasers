"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics/events";

/**
 * Lazy Vimeo embed for mobile speed (Quality Score).
 * Shows the Vimeo poster image immediately, then mounts the iframe ONLY when
 * the card scrolls into view (IntersectionObserver) or the user taps it.
 * Replaces autoplay-on-load iframes that all loaded up-front.
 */
export default function LazyVimeo({
  vimeoId,
  title = "WindChasers video",
  className = "",
  /** Extra query params appended to the player URL. */
  params = "background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1",
  /** Auto-load when scrolled into view (true) or only on tap (false). */
  loadOnView = true,
  /** scale the iframe to crop letterboxing (e.g. 1.15). */
  scale,
}: {
  vimeoId: string;
  title?: string;
  className?: string;
  params?: string;
  loadOnView?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!loadOnView || active) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadOnView, active]);

  const poster = `https://vumbnail.com/${vimeoId}.jpg`;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onClick={() => {
        if (!active) {
          // Only a deliberate tap counts as a play; background autoplay-on-view
          // (loadOnView) embeds are decorative and don't fire this.
          track(EVENTS.VIDEO_PLAY, { video_id: vimeoId, video_title: title });
          setActive(true);
        }
      }}
      role={active ? undefined : "button"}
      aria-label={active ? undefined : `Play ${title}`}
    >
      {/* Poster — always rendered underneath so there is never a blank frame */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/90 text-on-primary shadow-lg">
            <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
          </span>
        </div>
      )}
      {active && (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?${params}`}
          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
          style={scale ? { transform: `scale(${scale})` } : undefined}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      )}
    </div>
  );
}
