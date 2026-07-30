"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X, Expand } from "lucide-react";
import { WINGS_LAST_TIME_MEDIA } from "@/lib/wings-of-freedom";

const ITEMS = WINGS_LAST_TIME_MEDIA;

/**
 * "What it looked like last time" - a compact scrolling strip of real photos
 * and the reel from the previous event, sitting under the hero.
 *
 * Deliberately several tiles in view rather than one full-width slide: a
 * portrait reel and landscape photos in a single big stage meant heavy
 * letterboxing and the video visibly broke the frame. Uniform 4:3 tiles with
 * object-cover keep the row even regardless of source aspect, and full-size
 * viewing happens in the lightbox where each item can use its own shape.
 *
 * The video only attaches its src inside the lightbox, so its ~4MB costs
 * nothing until someone opens it.
 */
export default function WingsOfFreedomLastTime({ id = "last-time" }: { id?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  // Lightbox keyboard: Esc closes, arrows move between items.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % ITEMS.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + ITEMS.length) % ITEMS.length));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const active = open === null ? null : ITEMS[open];

  return (
    <section
      id={id}
      className="relative border-t border-white/5 bg-[#0B0B0D] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">
          From last year
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
          Inside last year&apos;s cohort
        </h2>
        <span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
        <p className="mt-3 max-w-2xl text-gray-400">
          Same campus, same team, a room full of women who came to find out whether flying is
          actually for them. Tap any of them to take a closer look.
        </p>

        {/* A grid rather than a scroll strip: only three tiles were visible at
            a time, so most of the set went unseen. All of them show at once
            now; each still opens full-size in the lightbox. */}
        <div className="relative mt-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {ITEMS.map((item, i) => {
              const thumb = item.kind === "video" ? item.poster : item.src;
              return (
                <button
                  key={item.src}
                  data-tile
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open ${item.caption}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-[#C5A572]/50"
                >
                  <Image
                    src={thumb}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 74vw, (max-width: 1024px) 46vw, 363px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:from-black/75 sm:via-black/10" />

                  {item.kind === "video" ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A572] shadow-[0_10px_28px_rgba(197,165,114,0.45)] transition-transform group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5 fill-[#1A1A1A] text-[#1A1A1A]" />
                      </span>
                    </span>
                  ) : (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                      <Expand className="h-3.5 w-3.5 text-white" />
                    </span>
                  )}

                  {/* Captions are hidden on mobile: at two columns they cover
                      most of the tile and read as clutter over the photo. The
                      lightbox still names each one. */}
                  <span className="absolute inset-x-0 bottom-0 hidden p-3 text-left text-[12.5px] font-medium leading-snug text-white sm:block">
                    {item.caption}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox - each item shows at its own aspect here, which is why the
          grid tiles can stay a uniform 4:3. */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/60 p-2 text-white/70 transition-colors hover:text-white sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>

            {ITEMS.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setOpen((i) => (i === null ? i : (i - 1 + ITEMS.length) % ITEMS.length))}
                  aria-label="Previous"
                  className="absolute left-2 rounded-full border border-white/15 bg-black/60 p-2 text-white/70 transition-colors hover:text-white sm:left-5"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen((i) => (i === null ? i : (i + 1) % ITEMS.length))}
                  aria-label="Next"
                  className="absolute right-2 rounded-full border border-white/15 bg-black/60 p-2 text-white/70 transition-colors hover:text-white sm:right-5"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <figure className="flex max-h-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
              {active.kind === "video" ? (
                <video
                  key={active.src}
                  src={active.src}
                  poster={active.poster}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[78vh] w-auto rounded-xl"
                />
              ) : (
                <img
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  className="max-h-[78vh] w-auto rounded-xl object-contain"
                />
              )}
              <figcaption className="mt-3 text-center text-[13px] text-gray-300">
                {active.caption}
                <span className="ml-2 text-gray-500">
                  {(open ?? 0) + 1} / {ITEMS.length}
                </span>
              </figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
