"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Calendar } from "lucide-react";

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
          {/* Desktop - Stacked buttons bottom right */}
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
            className="hidden md:flex flex-col gap-3 fixed bottom-6 right-6 z-50"
          >
            <Link
              href="/assessment"
              className="w-[180px] h-14 bg-dark border-2 border-gold rounded-lg flex items-center justify-center gap-3 text-white font-semibold hover:bg-accent-dark transition-colors shadow-lg hover:shadow-xl"
            >
              <ClipboardCheck className="w-5 h-5 text-gold" />
              <span>Take Assessment</span>
            </Link>
            <Link
              href="/demo"
              className="w-[180px] h-14 bg-gold text-dark rounded-lg flex items-center justify-center gap-3 font-semibold hover:bg-gold/90 transition-colors shadow-lg hover:shadow-xl"
            >
              <Calendar className="w-5 h-5" />
              <span>Book a Demo</span>
            </Link>
          </motion.div>

          {/* Mobile - Side-by-side bottom bar */}
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
            <Link
              href="/assessment"
              className="flex-1 bg-dark border-t-2 border-gold h-16 flex items-center justify-center gap-2 text-white font-semibold active:bg-accent-dark transition-colors"
            >
              <ClipboardCheck className="w-5 h-5 text-gold" />
              <span className="text-sm">Take Assessment</span>
            </Link>
            <Link
              href="/demo"
              className="flex-1 bg-gold text-dark h-16 flex items-center justify-center gap-2 font-semibold active:bg-gold/90 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Book a Demo</span>
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

