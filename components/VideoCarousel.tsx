"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Video {
  id: string;
  thumbnail: string;
  embedUrl: string;
}

interface VideoCarouselProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
}

export default function VideoCarousel({ videos, title, subtitle }: VideoCarouselProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = {
    mobile: 1,
    desktop: 1,
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  return (
    <>
      <section className="py-20 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          {title && (
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gold">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl text-white/70 text-center mb-16 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}

          {/* Desktop Carousel */}
          <div className="hidden md:block relative">
            <div className="flex justify-center">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-lg overflow-hidden cursor-pointer group w-full max-w-sm"
                style={{ aspectRatio: "9/16" }}
                onClick={() => setSelectedVideo(videos[currentIndex])}
              >
                <div className="relative w-full h-full bg-dark">
                  <iframe
                    src={`${videos[currentIndex].embedUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&muted=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {videos.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full bg-gold/20 hover:bg-gold/40 flex items-center justify-center transition-colors"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full bg-gold/20 hover:bg-gold/40 flex items-center justify-center transition-colors"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="flex justify-center">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x;
                  const swipeVelocity = velocity.x;

                  if (swipe < -50 || swipeVelocity < -500) {
                    nextSlide();
                  } else if (swipe > 50 || swipeVelocity > 500) {
                    prevSlide();
                  }
                }}
                whileTap={{ scale: 0.98 }}
                className="relative rounded-lg overflow-hidden cursor-pointer group w-full max-w-xs"
                style={{ aspectRatio: "9/16" }}
                onClick={() => setSelectedVideo(videos[currentIndex])}
              >
                <div className="relative w-full h-full bg-dark">
                  <iframe
                    src={`${videos[currentIndex].embedUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&portrait=0&muted=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    style={{ pointerEvents: "none" }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center">
                    <svg className="w-5 h-5 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>

            {videos.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {videos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentIndex === idx ? "bg-gold w-8" : "bg-white/30"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-6xl">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gold transition-colors text-4xl"
                  aria-label="Close video"
                >
                  ×
                </button>

                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden max-h-[80vh] mx-auto" style={{ aspectRatio: "9/16" }}>
                  <iframe
                    src={`${selectedVideo.embedUrl}?autoplay=1&loop=0&byline=0&title=0&portrait=0&muted=${isMuted ? 1 : 0}`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />

                  {/* Mute Button */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors z-10"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
