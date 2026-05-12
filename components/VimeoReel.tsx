"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VimeoReelProps {
  vimeoId: string;
  title?: string;
  className?: string;
  aspect?: "story" | "square" | "video" | "portrait";
  cover?: boolean;
  /** CSS scale applied to the iframe to crop letterboxing. 1 = no zoom. */
  zoom?: number;
}

export default function VimeoReel({
  vimeoId,
  title,
  className = "",
  aspect = "story",
  cover = false,
  zoom = 1,
}: VimeoReelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "setMuted", value: next }),
      "*"
    );
    if (!next) {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ method: "setVolume", value: 1 }),
        "*"
      );
    }
  };

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "video"
      ? "aspect-video"
      : aspect === "portrait"
      ? "aspect-[4/5]"
      : "aspect-[9/16]";

  return (
    <div
      className={`relative ${aspectClass} rounded-2xl md:rounded-3xl overflow-hidden ${className}`}
    >
      <iframe
        ref={iframeRef}
        src={
          cover
            ? `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1`
            : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1&api=1`
        }
        className={`absolute inset-0 w-full h-full ${cover ? "pointer-events-none" : ""}`}
        style={zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: "center" } : undefined}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || `Vimeo ${vimeoId}`}
      />
      {!cover && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur text-white flex items-center justify-center transition-colors"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
