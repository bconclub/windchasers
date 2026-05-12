"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface FacilityLightboxProps {
  images: string[];
  alt?: string;
}

export default function FacilityLightbox({ images, alt = "Facility photo" }: FacilityLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isOpen = openIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, images.length]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="relative aspect-[4/3] overflow-hidden rounded-xl group focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-dark"
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenIndex(null)}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
              }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl aspect-[4/3]"
            >
              <Image
                src={images[openIndex]}
                alt={`${alt} ${openIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
              }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-mono">
              {openIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
