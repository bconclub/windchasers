"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import oh1 from "@/public/open house/Open HOuse 1.jpg";
import oh2 from "@/public/open house/Open Houe 2.jpg";
import ohApr from "@/public/open house/WC Open house April 15.jpg";
import ohApr1 from "@/public/open house/WC Open house April 15 1.jpg";
import ohApr2 from "@/public/open house/WC Open house April 15 2.jpg";
import ohNov from "@/public/open house/WC November 2024.jpg";

/** URL-encode filenames from `public/open house/`. */
export const openHouseMediaUrl = (filename: string) =>
  `/open%20house/${encodeURIComponent(filename)}`;

const GALLERY_VIDEOS = ["Open hosue 5.mp4", "Open House May 4.mp4"] as const;

const GALLERY_IMAGES = [
  { src: oh1, alt: "Open house attendees listening to presentations", position: "center" },
  { src: oh2, alt: "Commercial pilot answering student questions", position: "center" },
  { src: ohApr, alt: "Students and parents at WindChasers open house", position: "center" },
  { src: ohApr1, alt: "Hands-on simulator experience at open house", position: "center" },
  { src: ohApr2, alt: "Instructor explaining career paths to attendees", position: "center" },
  { src: ohNov, alt: "November open house presentation session", position: "top center" },
] as const;

type Props = {
  id?: string;
  heading?: string;
  description?: string;
  /** Section background; matches open house gallery strip by default */
  sectionClassName?: string;
};

export default function WindChasersPastOpenHousesGallery({
  id = "windchasers-events",
  heading = "Our Past Open Houses",
  description,
  sectionClassName = "py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1A1A1A] to-[#2A2A2A]",
}: Props) {
  const shouldReduceMotion = useReducedMotion();
  const transitionDuration = shouldReduceMotion ? 0 : undefined;
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState("");

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
  };

  return (
    <>
      <section id={id} className={sectionClassName}>
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: transitionDuration ?? 0.6 }}
            className={`text-4xl md:text-5xl font-bold text-center text-[#C5A572] ${description ? "mb-4" : "mb-14"}`}
          >
            {heading}
          </motion.h2>
          {description ? (
            <motion.p
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: transitionDuration ?? 0.6, delay: shouldReduceMotion ? 0 : 0.08 }}
              className="text-gray-400 text-center text-base md:text-lg mb-14 max-w-2xl mx-auto leading-relaxed"
            >
              {description}
            </motion.p>
          ) : null}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {GALLERY_VIDEOS.map((v, i) => (
              <motion.div
                key={v}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : i * 0.1 }}
                className="overflow-hidden rounded-lg bg-black"
                style={{ aspectRatio: "9/16" }}
              >
                <video
                  src={openHouseMediaUrl(v)}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain rounded-lg"
                >
                  <source src={openHouseMediaUrl(v)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            ))}
            {GALLERY_IMAGES.map(({ src, alt, position }, i) => (
              <motion.div
                key={src.src}
                initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.5,
                  delay: shouldReduceMotion ? 0 : (GALLERY_VIDEOS.length + i) * 0.1,
                }}
                className="overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(src.src, alt)}
              >
                <img
                  src={src.src}
                  alt={alt}
                  className="w-full h-[200px] md:h-[240px] object-cover rounded-lg transition-transform duration-[400ms] group-hover:scale-[1.05]"
                  style={{
                    objectPosition: position,
                    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  loading={i < 4 ? "eager" : "lazy"}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : undefined }}
            className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60 rounded p-1"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: shouldReduceMotion ? 1 : 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: shouldReduceMotion ? 1 : 0.92 }}
              transition={{ duration: shouldReduceMotion ? 0 : undefined }}
              src={lightboxSrc}
              alt={lightboxAlt}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
