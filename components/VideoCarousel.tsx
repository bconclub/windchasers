"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Throttle wheel events for smooth scrolling
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTimeRef = useRef<number>(0);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedVideo) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Unlock scroll
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedVideo]);

  // Listen for video end events to close modal
  useEffect(() => {
    if (!selectedVideo) return;

    const handleMessage = (event: MessageEvent) => {
      // Vimeo sends events when video ends
      if (event.origin !== 'https://player.vimeo.com') return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && (data.event === 'ended' || data.method === 'ended')) {
          setSelectedVideo(null);
        }
      } catch (e) {
        // Not JSON, check for string match
        if (typeof event.data === 'string' && event.data.includes('ended')) {
          setSelectedVideo(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedVideo]);

  // Determine how many videos to show based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 768) {
        setVisibleCount(4); // Desktop: 4 videos initially
      } else {
        setVisibleCount(2); // Mobile: 2 videos
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  // Calculate max index based on visible count to prevent scrolling past the end
  // Each scroll reveals one more video, so max index is total videos minus visible count
  const maxIndex = Math.max(0, videos.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      const calculatedMax = Math.max(0, videos.length - visibleCount);
      return Math.min(newIndex, calculatedMax);
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Check if horizontal scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      
      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTimeRef.current;
      
      // Throttle to prevent jittery scrolling (minimum 100ms between scrolls)
      if (timeSinceLastWheel < 100) {
        return;
      }
      
      lastWheelTimeRef.current = now;
      
      // Clear any pending timeout
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
      
      // Use timeout to debounce rapid scrolls
      wheelTimeoutRef.current = setTimeout(() => {
        if (Math.abs(e.deltaX) > 10) {
          if (e.deltaX > 0) {
            nextSlide();
          } else if (e.deltaX < 0) {
            prevSlide();
          }
        }
      }, 50);
    }
  };

  return (
    <>
      <section className="py-20 px-6 lg:px-8">
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
          <div className="hidden md:block">
            <div className="flex items-center gap-4">
              {videos.length > 1 && (
                <button
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    currentIndex === 0
                      ? "bg-gold/10 cursor-not-allowed opacity-50"
                      : "bg-gold/20 hover:bg-gold/40 cursor-pointer"
                  }`}
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              <div className="flex-1 overflow-hidden" onWheel={handleWheel}>
                <motion.div
                  className="flex gap-6"
                  animate={{
                    x: `-${currentIndex * (100 / visibleCount)}%`,
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.25, 0.1, 0.25, 1],
                    type: "tween"
                  }}
                >
                  {videos.map((video, idx) => (
                    <motion.div
                      key={video.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
                      style={{
                        width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 24 / visibleCount}px)`,
                        aspectRatio: "9/16",
                      }}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="relative w-full h-full bg-dark">
                        <iframe
                          src={`${video.embedUrl}?background=1&autoplay=0&loop=0&byline=0&title=0&portrait=0&muted=1&rel=0&controls=0`}
                          className="absolute inset-0 w-full h-full"
                          allow="fullscreen; picture-in-picture"
                          style={{ pointerEvents: "none" }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedVideo(video)}>
                            <svg className="w-8 h-8 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {videos.length > 1 && (
                <button
                  onClick={nextSlide}
                  disabled={currentIndex >= maxIndex}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    currentIndex >= maxIndex
                      ? "bg-gold/10 cursor-not-allowed opacity-50"
                      : "bg-gold/20 hover:bg-gold/40 cursor-pointer"
                  }`}
                  aria-label="Next"
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dots Indicator */}
            {videos.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {videos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === idx ? "bg-gold w-8" : "bg-white/30 w-2"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden -mx-6 px-6" ref={containerRef} onWheel={handleWheel}>
              <motion.div
                className="flex gap-4"
                drag="x"
                dragConstraints={{ 
                  left: -maxIndex * (100 / visibleCount), 
                  right: 0 
                }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(e, { offset, velocity }) => {
                  setIsDragging(false);
                  const swipe = offset.x;
                  const swipeVelocity = velocity.x;
                  const threshold = 50;
                  const velocityThreshold = 500;

                  if (swipe < -threshold || swipeVelocity < -velocityThreshold) {
                    nextSlide();
                  } else if (swipe > threshold || swipeVelocity > velocityThreshold) {
                    prevSlide();
                  } else {
                    // Snap back to current position if not enough swipe
                    // No need to set currentIndex, it will animate back automatically
                  }
                }}
                animate={{
                  x: `-${currentIndex * (100 / visibleCount)}%`,
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  type: "tween"
                }}
                style={{ 
                  touchAction: "pan-x",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  cursor: "grab"
                }}
                whileDrag={{ cursor: "grabbing" }}
              >
                {videos.map((video, idx) => (
                  <motion.div
                    key={video.id}
                    whileTap={{ scale: 0.98 }}
                    className="relative rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
                    style={{ 
                      aspectRatio: "9/16",
                      width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 16 / visibleCount}px)`,
                    }}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative w-full h-full bg-dark">
                        <iframe
                          src={`${video.embedUrl}?background=1&autoplay=0&loop=0&byline=0&title=0&portrait=0&muted=1&rel=0&controls=0`}
                          className="absolute inset-0 w-full h-full"
                          allow="fullscreen; picture-in-picture"
                          style={{ pointerEvents: "none" }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setSelectedVideo(video)}>
                            <svg className="w-6 h-6 text-dark ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                    </div>
                  </motion.div>
                ))}
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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              onClick={(e) => {
                // Close modal when clicking backdrop
                if (e.target === e.currentTarget) {
                  setSelectedVideo(null);
                }
              }}
            >
              <div className="relative w-full max-w-6xl">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute -top-10 md:-top-12 right-0 text-white hover:text-gold transition-colors text-4xl z-10"
                  aria-label="Close video"
                >
                  ×
                </button>

                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden w-full mx-auto" style={{ paddingBottom: "56.25%", height: 0, maxHeight: "80vh" }}>
                  <iframe
                    src={`${selectedVideo.embedUrl}?autoplay=1&loop=0&byline=0&title=0&portrait=0&muted=1&controls=1&responsive=1`}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    title={selectedVideo.id || "Video player"}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
