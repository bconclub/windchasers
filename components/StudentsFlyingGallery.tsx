"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play } from "lucide-react";
import { track, EVENTS } from "@/lib/analytics/events";

type ImageItem = { kind: "image"; src: string; alt?: string };
type VideoItem = { kind: "video"; vimeoId: string; label?: string };
export type GalleryItem = ImageItem | VideoItem;

interface StudentsFlyingGalleryProps {
  items: GalleryItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  variant?: "stitch" | "legacy";
}

export default function StudentsFlyingGallery({
  items,
  eyebrow = "In the Cockpit",
  title = "Our students. Actually flying.",
  subtitle,
  variant = "stitch",
}: StudentsFlyingGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [unmutedId, setUnmutedId] = useState<number | null>(null);
  // Video iframes mount lazily, only those scrolled into view (mobile speed).
  const [activeVideos, setActiveVideos] = useState<Set<number>>(new Set());

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const next: number[] = [];
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.cardIndex);
            if (!Number.isNaN(idx)) next.push(idx);
          }
        });
        if (next.length) {
          setActiveVideos((prev) => {
            const merged = new Set(prev);
            next.forEach((n) => merged.add(n));
            return merged;
          });
        }
      },
      { root: scrollerRef.current, rootMargin: "300px" }
    );
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const sendVimeoCommand = (
    iframe: HTMLIFrameElement | null,
    method: string,
    value: unknown
  ) => {
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ method, value }),
      "*"
    );
  };

  const toggleMute = (index: number) => {
    const isUnmuting = unmutedId !== index;
    if (isUnmuting) {
      // Unmuting a reel is an intentional video engagement.
      track(EVENTS.VIDEO_PLAY, { source: "students_gallery", card_index: index });
      iframeRefs.current.forEach((ifr, i) => {
        if (ifr && i !== index) sendVimeoCommand(ifr, "setMuted", true);
      });
      sendVimeoCommand(iframeRefs.current[index], "setMuted", false);
      sendVimeoCommand(iframeRefs.current[index], "setVolume", 1);
      setUnmutedId(index);
    } else {
      sendVimeoCommand(iframeRefs.current[index], "setMuted", true);
      setUnmutedId(null);
    }
  };

  const updateNavState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateNavState();
    el.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
    return () => {
      el.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, []);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    track(EVENTS.GALLERY_INTERACT, {
      source: "students_gallery",
      action: dir === 1 ? "next" : "prev",
    });
    const card = el.querySelector<HTMLElement>("[data-gallery-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    const target = Math.max(
      0,
      Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + dir * step)
    );
    el.scrollTo({ left: target, behavior: "smooth" });
    setTimeout(() => {
      setCanPrev(target > 8);
      setCanNext(target + el.clientWidth < el.scrollWidth - 8);
    }, 0);
  };

  const isStitch = variant === "stitch";
  const eyebrowClass = isStitch
    ? "text-primary font-bold tracking-[0.3em] text-xs uppercase block mb-4"
    : "text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3";
  const titleClass = isStitch
    ? "font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter"
    : "text-3xl md:text-5xl font-bold text-white leading-tight";
  const cardBorder = isStitch
    ? "border-outline-variant/20 bg-surface-container-low"
    : "border-white/10 bg-accent-dark";
  const navBtnClass = isStitch
    ? "bg-primary text-on-primary hover:bg-primary-container ring-2 ring-primary/30 ring-offset-4 ring-offset-background shadow-lg shadow-black/40 active:scale-95"
    : "bg-gold text-dark hover:bg-gold/90 ring-2 ring-gold/30 ring-offset-4 ring-offset-dark shadow-lg shadow-black/40 active:scale-95";

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10 text-center"
        >
          {eyebrow && <span className={eyebrowClass}>{eyebrow}</span>}
          <h2 className={titleClass}>{title}</h2>
          {subtitle && (
            <p className="text-on-surface-variant text-base md:text-lg mt-4 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="hidden md:flex justify-end gap-3 mb-6">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={!canPrev}
            aria-label="Previous"
            className={`flex w-12 h-12 rounded-full items-center justify-center transition-all ${navBtnClass} ${
              canPrev ? "opacity-100" : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={!canNext}
            aria-label="Next"
            className={`flex w-12 h-12 rounded-full items-center justify-center transition-all ${navBtnClass} ${
              canNext ? "opacity-100" : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">

          <div
            ref={scrollerRef}
            className="flex gap-3 md:gap-4 overflow-x-auto snap-x snap-proximity pb-4 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ touchAction: "pan-x pan-y" }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                data-gallery-card
                data-card-index={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`relative shrink-0 w-[78%] sm:w-[42%] md:w-[31%] lg:w-[23%] xl:w-[19%] aspect-[9/16] rounded-xl md:rounded-2xl overflow-hidden border ${cardBorder} snap-start group`}
              >
                {item.kind === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt || `Student ${i + 1}`}
                    fill
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 42vw, 58vw"
                    className="object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                ) : (
                  <>
                    {/* Thumbnail backdrop, always visible; iframe mounts lazily */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(https://vumbnail.com/${item.vimeoId}_large.jpg)` }}
                    />
                    {activeVideos.has(i) ? (
                      <iframe
                        ref={(el) => {
                          iframeRefs.current[i] = el;
                        }}
                        src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1&api=1`}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        title={item.label || `Student flying ${i + 1}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/90 text-on-primary shadow-lg">
                          <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                        </span>
                      </div>
                    )}
                    {activeVideos.has(i) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMute(i);
                        }}
                        aria-label={unmutedId === i ? "Mute" : "Unmute"}
                        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur text-white flex items-center justify-center transition-colors"
                      >
                        {unmutedId === i ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <VolumeX className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
