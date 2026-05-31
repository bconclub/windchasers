"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VimeoReelProps {
  vimeoId: string;
  title?: string;
  className?: string;
  aspect?: "story" | "square" | "video" | "portrait";
  cover?: boolean;
  /** CSS scale applied to the iframe to crop letterboxing. 1 = no zoom. */
  zoom?: number;
  /** Auto-unmute when scrolled into view, mute when scrolled out. */
  autoUnmuteOnView?: boolean;
}

export default function VimeoReel({
  vimeoId,
  title,
  className = "",
  aspect = "story",
  cover = false,
  zoom = 1,
  autoUnmuteOnView = false,
}: VimeoReelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);

  const sendVimeoCommand = useCallback((method: string, value?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify(
        value === undefined ? { method } : { method, value }
      ),
      "https://player.vimeo.com"
    );
  }, []);

  const playAudible = useCallback(() => {
    sendVimeoCommand("play");
    sendVimeoCommand("setMuted", false);
    sendVimeoCommand("setVolume", 1);
    setMuted(false);
  }, [sendVimeoCommand]);

  const muteVideo = useCallback(() => {
    sendVimeoCommand("setMuted", true);
    sendVimeoCommand("setVolume", 0);
    setMuted(true);
  }, [sendVimeoCommand]);

  useEffect(() => {
    if (!autoUnmuteOnView || cover) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          playAudible();
        } else {
          setIsInView(false);
          muteVideo();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [autoUnmuteOnView, cover, muteVideo, playAudible]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (next) {
      muteVideo();
    } else {
      playAudible();
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
      ref={containerRef}
      className={`relative ${aspectClass} rounded-2xl md:rounded-3xl overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(https://vumbnail.com/${vimeoId}_large.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <iframe
        ref={iframeRef}
        src={
          cover
            ? `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1`
            : `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1&api=1&autopause=0`
        }
        className={`absolute inset-0 w-full h-full ${cover ? "pointer-events-none" : ""}`}
        style={zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: "center" } : undefined}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title || `Vimeo ${vimeoId}`}
        onLoad={() => {
          if (!autoUnmuteOnView || cover) return;

          sendVimeoCommand("play");
          if (isInView) {
            window.setTimeout(playAudible, 150);
            window.setTimeout(playAudible, 600);
          }
        }}
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
