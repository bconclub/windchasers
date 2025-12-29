"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  title?: string;
  subtitle?: string;
}

export default function ImageCarousel({ images, title, subtitle }: ImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine how many images to show based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3); // Desktop: 3 images
      } else if (window.innerWidth >= 768) {
        setVisibleCount(2); // Tablet: 2 images
      } else {
        setVisibleCount(1); // Mobile: 1 image
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

  const maxIndex = Math.max(0, images.length - visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  // Throttle wheel events for smooth scrolling
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTimeRef = useRef<number>(0);

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
      <section className="py-20 px-6 lg:px-8 bg-dark">
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

          {/* Desktop & Tablet Carousel */}
          <div className="hidden md:block relative">
            <div className="overflow-hidden" onWheel={handleWheel}>
              <motion.div
                className="flex gap-4"
                animate={{
                  x: `-${currentIndex * (100 / visibleCount)}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {images.map((image, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="relative rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
                    style={{
                      width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 16 / visibleCount}px)`,
                      aspectRatio: "1/1",
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Facility image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      priority={idx < visibleCount}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {images.length > visibleCount && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/20 hover:bg-gold/40 flex items-center justify-center transition-colors z-10"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold/20 hover:bg-gold/40 flex items-center justify-center transition-colors z-10"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {images.length > visibleCount && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
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
            <div className="overflow-hidden -mx-6 px-6" ref={containerRef}>
              <motion.div
                className="flex"
                drag="x"
                dragConstraints={{ 
                  left: -((images.length - 1) * 100), 
                  right: 0 
                }}
                dragElastic={0.2}
                dragMomentum={true}
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
                  }
                }}
                animate={!isDragging ? {
                  x: `-${currentIndex * 100}%`,
                } : {}}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  restDelta: 0.5
                }}
                style={{ 
                  touchAction: "pan-x",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  cursor: "grab"
                }}
                whileDrag={{ cursor: "grabbing" }}
              >
                {images.map((image, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    className="relative rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
                    style={{ 
                      aspectRatio: "1/1",
                      width: "100%",
                      minWidth: "100%"
                    }}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image}
                      alt={`Facility image ${idx + 1}`}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {images.map((_, idx) => (
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

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative w-full max-w-6xl max-h-[90vh]">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gold transition-colors text-4xl z-10"
                  aria-label="Close image"
                >
                  ×
                </button>

                {/* Image */}
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedImage}
                    alt="Facility image"
                    width={1200}
                    height={675}
                    className="object-contain w-full h-full"
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

