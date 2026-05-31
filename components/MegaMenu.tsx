"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

type MenuLink = { label: string; href: string };
type MenuColumn = { heading: string; links: MenuLink[] };

const COLUMNS: MenuColumn[] = [
  {
    heading: "Licenses",
    links: [
      { label: "Commercial Pilot License (CPL)", href: "/commercial-pilot-license" },
      { label: "Private Pilot License (PPL)", href: "/private-pilot-license" },
      { label: "Airline Transport Pilot (ATPL)", href: "/airline-transport-pilot-license" },
      { label: "Foreign CPL", href: "/foreign-cpl" },
      { label: "License Conversion Course", href: "/license-conversion-course" },
    ],
  },
  {
    heading: "Ratings",
    links: [
      { label: "Instrument Rating", href: "/instrument-rating" },
      { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
      { label: "Multi-Engine Instrument (MEIR)", href: "/multi-engine-instrument-rating-meir" },
      { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
      { label: "Night Rating", href: "/night-rating-progam" },
    ],
  },
  {
    heading: "Type Ratings",
    links: [
      { label: "All Type Ratings", href: "/type-rating" },
      { label: "Boeing 737 Type Rating", href: "/boeing-737-type-rating" },
      { label: "Airbus A320 Type Rating", href: "/airbus-a320-type-rating" },
    ],
  },
  {
    heading: "Ground & Academics",
    links: [
      { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
      { label: "Diploma in Aviation", href: "/diploma-in-aviation" },
      { label: "IELTS Training", href: "/ielts-training-program" },
    ],
  },
  {
    heading: "Cadet & Airline",
    links: [
      { label: "Airline Track Overview", href: "/airline" },
      { label: "Pre-Cadet Program", href: "/pre-cadet-program" },
      { label: "Cadet Pilot Program", href: "/cadet-pilot-program" },
      { label: "Airline Preparation Program", href: "/airline-preparation-program" },
      { label: "Cadet Interview Training", href: "/airline-cadet-program-interview-training" },
    ],
  },
  {
    heading: "Train Abroad",
    links: [
      { label: "Pilot Training in India", href: "/pilot-training-in-india" },
      { label: "Pilot Training in USA", href: "/pilot-training-in-usa" },
      { label: "Pilot Training in Canada", href: "/pilot-training-in-canada" },
      { label: "Pilot Training in Australia", href: "/pilot-training-in-australia" },
      { label: "Pilot Training in New Zealand", href: "/pilot-training-in-new-zealand" },
      { label: "Pilot Training in South Africa", href: "/pilot-training-in-south-africa" },
    ],
  },
  {
    heading: "More Training",
    links: [
      { label: "Helicopter Training", href: "/helicopter-training" },
      { label: "Cabin Crew Program", href: "/cabin-crew-program" },
      { label: "Women in Aviation", href: "/women-in-aviation" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Meet the Team", href: "/windchasers-meet-the-team" },
      { label: "With the Founder", href: "/with-the-founder" },
      { label: "Blog", href: "/blog" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
];

export default function MegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Open programs menu"
        className="flex items-center gap-1.5 px-3 sm:px-4 h-10 rounded-full border border-[#C5A572]/40 text-[#C5A572] text-sm font-semibold hover:bg-[#C5A572] hover:text-black transition-colors"
      >
        <span className="hidden sm:inline">Programs</span>
        <span className="sm:hidden">Menu</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-20 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-20 z-50 bg-dark border-b border-[#C5A572]/30 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
                  {COLUMNS.map((col) => (
                    <div key={col.heading}>
                      <h3 className="text-[#C5A572] font-bold text-xs uppercase tracking-[0.15em] mb-3">
                        {col.heading}
                      </h3>
                      <ul className="space-y-2">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              onClick={() => setOpen(false)}
                              className="block text-sm text-white/70 hover:text-white transition-colors"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* CTA row */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-3">
                  <Link
                    href="/assessment"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-lg bg-[#C5A572] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-colors"
                  >
                    Take Pilot Assessment
                  </Link>
                  <Link
                    href="/demo"
                    onClick={() => setOpen(false)}
                    className="px-6 py-2.5 rounded-lg border border-[#C5A572] text-[#C5A572] text-sm font-bold uppercase tracking-wider hover:bg-[#C5A572] hover:text-black transition-colors"
                  >
                    Book a Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
