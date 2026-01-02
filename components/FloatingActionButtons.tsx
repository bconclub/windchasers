"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Calendar } from "lucide-react";
import { hasCompletedAssessment, hasCompletedBooking } from "@/lib/sessionStorage";

export default function FloatingActionButtons() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolledUp, setHasScrolledUp] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  
  // Check completion status on mount and pathname change
  useEffect(() => {
    setAssessmentCompleted(hasCompletedAssessment());
    setBookingCompleted(hasCompletedBooking());
  }, [pathname]);
  
  // Show both buttons everywhere except demo and thank-you pages
  const showAssessment = true;
  const showDemo = true;

  useEffect(() => {
    // Don't set up scroll listener on assessment, demo, or thank-you pages
    if (pathname === "/assessment" || pathname === "/demo" || pathname === "/thank-you") {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if user has scrolled up (first upward scroll)
      if (!hasScrolledUp && currentScrollY < lastScrollY && lastScrollY > 0) {
        setHasScrolledUp(true);
      }
      
      // Only show buttons after first upward scroll
      if (hasScrolledUp) {
        // Show on scroll up, hide on scroll down (applies to both mobile and desktop)
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        }
      } else {
        // Keep hidden until first upward scroll
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, pathname, hasScrolledUp]);

  // Hide floating buttons completely on assessment, demo, and thank-you pages
  if (pathname === "/assessment" || pathname === "/demo" || pathname === "/thank-you") {
    return null;
  }

  // Hide completely if both actions are completed
  if (assessmentCompleted && bookingCompleted) {
    return null;
  }

  // Determine which buttons to show
  const showAssessmentButton = !assessmentCompleted;
  const showDemoButton = !bookingCompleted;

  // Don't render if no buttons should be shown
  if (!showAssessmentButton && !showDemoButton) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop - Inline buttons centered */}
          {(showAssessmentButton || showDemoButton) && (
            <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                scale: isVisible ? 1 : 0.8, 
                y: isVisible ? 0 : 20 
              }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3,
              }}
              className="flex flex-row gap-3"
            >
            {showAssessmentButton && (
              <Link
                href="/assessment"
                className="w-[160px] h-12 bg-dark border-2 border-gold rounded-lg flex items-center justify-center gap-2 text-white font-semibold hover:bg-accent-dark transition-colors shadow-lg hover:shadow-xl text-sm"
              >
                <ClipboardCheck className="w-4 h-4 text-gold" />
                <span>Take Assessment</span>
              </Link>
            )}
            {showDemoButton && (
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
          {(showAssessmentButton || showDemoButton) && (
            <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 100 
            }}
            exit={{ opacity: 0, y: 100 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex shadow-2xl"
          >
            {showDemoButton && (
              <Link
                href="/demo"
                className="flex-1 bg-gold text-dark h-16 flex items-center justify-center gap-2 font-semibold active:bg-gold/90 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Book a Demo</span>
              </Link>
            )}
            {showAssessmentButton && (
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

