"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/dgca", label: "DGCA Ground" },
    { href: "/international", label: "Pilot Training Abroad" },
    { href: "/helicopter", label: "Helicopter" },
    { href: "/assessment", label: "Take Assessment" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full bg-dark/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/Windchasers-Logo.png"
                alt="WindChasers"
                width={180}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Hamburger Menu Button - Desktop & Mobile */}
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
