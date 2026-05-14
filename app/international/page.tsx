"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Manrope } from "next/font/google";
import { CheckCircle } from "lucide-react";
import { trackKeyPageView } from "@/lib/analytics";
import { setLastVisitedProgram } from "@/lib/sessionStorage";

const manrope = Manrope({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-headline" });

const countries = [
  {
    name: "United States",
    flagImage: "/images/flags/united-states-of-america-flag-png-large.png",
    duration: "6–8 months",
    highlights: ["FAA license with global recognition", "High-quality training standards", "Advanced simulators and aircraft", "Post-training work opportunities"],
  },
  {
    name: "Canada",
    flagImage: "/images/canada-flag-png-large.png",
    duration: "6–8 months",
    highlights: ["Transport Canada approved", "Excellent weather conditions", "Multicultural environment", "Affordable living costs"],
  },
  {
    name: "Hungary",
    flagImage: "/images/flags/hungary-flag-png-large.png",
    duration: "5–7 months",
    highlights: ["EASA license (European standard)", "Cost-effective training", "Good weather for flying", "European license validity"],
  },
  {
    name: "New Zealand",
    flagImage: "/images/flags/new-zealand-flag-png-large.png",
    duration: "6–8 months",
    highlights: ["Excellent flying weather", "Beautiful training locations", "English-speaking country", "High safety standards"],
  },
  {
    name: "Thailand",
    flagImage: "/images/flags/thailand-flag-png-large.png",
    duration: "6–9 months",
    highlights: ["Civil Aviation Authority approved", "Year-round flying weather", "Modern training facilities", "Cost-effective training"],
  },
  {
    name: "Australia",
    flagImage: "/images/flags/flag-jpg-xl-9-2048x1024.jpg",
    duration: "6–9 months",
    highlights: ["CASA approved training", "Year-round flying weather", "Modern training facilities", "Strong aviation industry"],
  },
];

const prerequisites = [
  "DGCA exams cleared (all 6 papers)",
  "Class 1 Medical certificate",
  "Valid passport (minimum 2 years validity)",
  "Age 18+ years",
];

const provided = {
  "Pre-Departure Support": ["Flight school selection and admission", "Student visa processing assistance", "Pre-departure orientation", "Accommodation arrangement"],
  "During Training": ["Regular progress monitoring", "Support coordinator on ground", "License conversion guidance", "Career counseling"],
};

export default function InternationalPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Pilot Training Abroad | WindChasers Aviation Academy";
    trackKeyPageView("Fly Abroad");
    setLastVisitedProgram("pilot_training_abroad");
  }, []);

  return (
    <div className={`${manrope.variable}`} style={{ backgroundColor: "#131313", color: "#fff" }}>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 md:px-12 text-center" style={{ backgroundColor: "#131313" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">
            WindChasers · International Flying
          </span>
          <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-tight mb-5">
            Fly{" "}
            <span className="text-[#C5A572] italic">Abroad.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            Complete your flying hours internationally. Choose from top destinations. All costs transparent. Visa and admission support included.
          </p>
        </motion.div>
      </section>

      {/* Prerequisites */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#0e0e0e" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Before you fly</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold tracking-tighter text-white">
              Prerequisites
            </h2>
          </motion.div>
          <div className="bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-10">
            <ul className="space-y-4">
              {prerequisites.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/80">
                  <CheckCircle className="w-5 h-5 text-[#C5A572] shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Country Selection */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Destinations</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Choose Your Destination
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {countries.map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                onClick={() => setSelectedCountry(selectedCountry === country.name ? null : country.name)}
                className={`bg-[#1A1A1A] rounded-xl border-t-2 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  selectedCountry === country.name
                    ? "border-[#C5A572] shadow-lg shadow-[#C5A572]/10"
                    : "border-[#C5A572]/30 hover:border-[#C5A572]"
                }`}
              >
                <div className="mb-6 flex justify-center">
                  <div className="relative w-28 h-20 rounded-lg overflow-hidden border border-white/10">
                    <Image src={country.flagImage} alt={`${country.name} flag`} fill className="object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-4">{country.name}</h3>
                <div className="flex justify-center mb-4">
                  <span className="text-xs font-bold text-[#C5A572] bg-[#C5A572]/10 border border-[#C5A572]/20 px-3 py-1 rounded-full">
                    {country.duration}
                  </span>
                </div>
                <AnimatePresence>
                  {selectedCountry === country.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-4 border-t border-[#C5A572]/20"
                    >
                      <ul className="space-y-2.5">
                        {country.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-white/70">
                            <CheckCircle className="w-4 h-4 text-[#C5A572] mt-0.5 shrink-0" strokeWidth={2} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Provide */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#0e0e0e" }}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">End-to-end support</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              What We Provide
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {Object.entries(provided).map(([section, items], i) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8"
              >
                <h3 className="font-bold text-white text-lg mb-5">{section}</h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-white/60 text-sm">
                      <span className="text-[#C5A572] shrink-0 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 text-center" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">Ready?</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-5">
              Ready for Pilot Training Abroad?
            </h2>
            <p className="text-white/60 mb-8">
              Book a demo to discover the best country for your goals and budget. We&apos;ll handle everything from admission to visa.
            </p>
            <Link
              href="/demo?source=abroad"
              className="inline-block bg-[#C5A572] text-[#1A1A1A] px-12 py-5 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5"
            >
              Book a Demo Session
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
