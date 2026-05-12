"use client";

import { useRef, useState, useEffect } from "react";
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

  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentVolRef = useRef(0);

  const setVolume = (vol: number) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "setVolume", value: vol }),
      "*"
    );
  };

  const sendMute = (val: boolean) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "setMuted", value: val }),
      "*"
    );
    if (!val) setVolume(0.5);
  };

  const fadeOut = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    let vol = currentVolRef.current;
    fadeIntervalRef.current = setInterval(() => {
      vol = Math.max(0, vol - 0.05);
      currentVolRef.current = vol;
      setVolume(vol);
      if (vol <= 0) {
        clearInterval(fadeIntervalRef.current!);
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ method: "setMuted", value: true }),
          "*"
        );
        setMuted(true);
      }
    }, 60);
  };

  const fadeIn = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "setMuted", value: false }),
      "*"
    );
    setMuted(false);
    let vol = currentVolRef.current;
    fadeIntervalRef.current = setInterval(() => {
      vol = Math.min(0.5, vol + 0.05);
      currentVolRef.current = vol;
      setVolume(vol);
      if (vol >= 0.5) clearInterval(fadeIntervalRef.current!);
    }, 60);
  };

  useEffect(() => {
    if (!autoUnmuteOnView || cover) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fadeIn();
        } else {
          fadeOut();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [autoUnmuteOnView, cover]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sendMute(next);
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
