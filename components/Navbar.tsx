"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";

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
                  href="tel:+919591004043"
                  className="flex items-center gap-2 bg-gold text-dark px-3 sm:px-4 py-2 rounded-full font-medium text-sm hover:bg-gold/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <a
                  href={`https://wa.me/919591004043?text=${encodeURIComponent("Hi WindChasers, I need more detail on Young Aviators Summer Camp")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            ) : isOpenHouse ? (
              /* Open House - Show Phone + WhatsApp */
              <div className="flex items-center gap-2">
                <a
                  href="tel:+919591004043"
                  className="flex items-center gap-2 bg-[#C5A572] text-black px-3 sm:px-4 py-2 rounded-full font-medium text-sm hover:bg-[#C5A572]/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <a
                  href={`https://wa.me/919591004043?text=${encodeURIComponent("Hi WindChasers, I need more detail on the open house")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
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
