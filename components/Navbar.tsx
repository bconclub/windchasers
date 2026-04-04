"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Hide menu on summer camp page, show contact button on open house
  const isSummerCamp = pathname === "/summercamp";
  const isOpenHouse = pathname === "/open-house";
  const hideMenu = isSummerCamp;

  const links = [
    { href: "/dgca", label: "DGCA Ground Classes" },
    { href: "/international", label: "Pilot Training Abroad" },
    { href: "/helicopter", label: "Helicopter Pilot Training" },
    { href: "/assessment", label: "Take Pilot Assessment" },
    { href: "/demo", label: "Book a Demo Session" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-dark/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/White transparent.png"
                alt="WindChasers"
                width={180}
                height={60}
                className="h-[3.45rem] md:h-12 w-auto"
                priority
              />
            </Link>

            {/* Hamburger Menu Button - Desktop & Mobile */}
            {isSummerCamp ? (
              /* Summer Camp - Show Contact Buttons */
              <div className="flex items-center gap-2">
                <a
                  href="tel:+919036263630"
                  className="flex items-center gap-2 bg-gold text-dark px-3 sm:px-4 py-2 rounded-full font-medium text-sm hover:bg-gold/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <a
                  href="https://wa.me/919036263630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-full font-medium text-sm hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            ) : isOpenHouse ? (
              <a
                href="tel:+919591004043"
                className="flex items-center gap-2 bg-[#C5A572] text-black px-4 py-2 rounded-full font-medium text-sm hover:bg-[#C5A572]/90 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+91 95910 04043</span>
                <span className="sm:hidden">Call Us</span>
              </a>
            ) : !hideMenu && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white z-[60] relative"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Slide-in Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-dark border-l border-gold/30 z-50 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-gold transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col h-full pt-24 px-8">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-4 text-lg font-medium text-white/70 hover:text-gold transition-colors border-b border-white/10"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
