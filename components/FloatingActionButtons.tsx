"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Calendar } from "lucide-react";

export default function FloatingActionButtons() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Hide buttons on their respective pages
  const showAssessment = pathname !== "/assessment";
  const showDemo = pathname !== "/demo";
  
  // Don't show component if both buttons are hidden
  if (!showAssessment && !showDemo) {
    return null;
  }

  useEffect(() => {
    // Bounce animation on mount
    setIsVisible(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show on scroll up, hide on scroll down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop - Inline buttons centered */}
          {(showAssessment || showDemo) && (
            <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
              className="flex flex-row gap-3"
            >
            {showAssessment && (
              <Link
                href="/assessment"
                className="w-[160px] h-12 bg-dark border-2 border-gold rounded-lg flex items-center justify-center gap-2 text-white font-semibold hover:bg-accent-dark transition-colors shadow-lg hover:shadow-xl text-sm"
              >
                <ClipboardCheck className="w-4 h-4 text-gold" />
                <span>Take Assessment</span>
              </Link>
            )}
            {showDemo && (
              <Link
                href="/demo"
                className="w-[160px] h-12 bg-gold text-dark rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-gold/90 transition-colors shadow-lg hover:shadow-xl text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Demo</span>
              </Link>
            )}
            </motion.div>
          </div>
          )}

          {/* Mobile - Side-by-side bottom bar */}
          {(showAssessment || showDemo) && (
            <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.2,
            }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex shadow-2xl"
          >
            {showDemo && (
              <Link
                href="/demo"
                className="flex-1 bg-gold text-dark h-16 flex items-center justify-center gap-2 font-semibold active:bg-gold/90 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Book a Demo</span>
              </Link>
            )}
            {showAssessment && (
              <Link
                href="/assessment"
                className="flex-1 bg-dark border-t-2 border-gold h-16 flex items-center justify-center gap-2 text-white font-semibold active:bg-accent-dark transition-colors"
              >
                <ClipboardCheck className="w-5 h-5 text-gold" />
                <span className="text-sm">Take Assessment</span>
              </Link>
            )}
          </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

