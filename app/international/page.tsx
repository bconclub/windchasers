"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const countries = [
  {
    name: "United States",
    flagImage: "/images/flags/united-states-of-america-flag-png-large.png",
    duration: "6-8 months",
    highlights: [
      "FAA license with global recognition",
      "High-quality training standards",
      "Advanced simulators and aircraft",
      "Post-training work opportunities",
    ],
  },
  {
    name: "Canada",
    flagImage: "/images/flags/flag-jpg-xl-9-2048x1024.jpg",
    duration: "6-8 months",
    highlights: [
      "Transport Canada approved",
      "Excellent weather conditions",
      "Multicultural environment",
      "Affordable living costs",
    ],
  },
  {
    name: "Hungary",
    flagImage: "/images/flags/hungary-flag-png-large.png",
    duration: "5-7 months",
    highlights: [
      "EASA license (European standard)",
      "Cost-effective training",
      "Good weather for flying",
      "European license validity",
    ],
  },
  {
    name: "New Zealand",
    flagImage: "/images/flags/new-zealand-flag-png-large.png",
    duration: "6-8 months",
    highlights: [
      "Excellent flying weather",
      "Beautiful training locations",
      "English-speaking country",
      "High safety standards",
    ],
  },
  {
    name: "Thailand",
    flagImage: "/images/flags/thailand-flag-png-large.png",
    duration: "6-9 months",
    highlights: [
      "Civil Aviation Authority approved",
      "Year-round flying weather",
      "Modern training facilities",
      "Cost-effective training",
    ],
  },
  {
    name: "Australia",
    flagImage: "/images/flags/australia-flag-png-large.png",
    duration: "6-9 months",
    highlights: [
      "CASA approved training",
      "Year-round flying weather",
      "Modern training facilities",
      "Strong aviation industry",
    ],
  },
];

export default function InternationalPage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Fly <span className="text-gold">Abroad</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete your flying hours internationally. Choose from top destinations. All costs transparent. Visa and admission support included.
          </p>
        </div>

        {/* Prerequisites */}
        <div className="bg-gold/10 border-2 border-gold/50 rounded-lg p-8 mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gold">Prerequisites</h2>
          <ul className="space-y-2 text-white/80">
            <li className="flex items-start">
              <span className="text-gold mr-3">✓</span>
              <span>DGCA exams cleared (all 6 papers)</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">✓</span>
              <span>Class 1 Medical certificate</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">✓</span>
              <span>Valid passport (minimum 2 years validity)</span>
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-3">✓</span>
              <span>Age 18+ years</span>
            </li>
          </ul>
        </div>

        {/* Country Selection */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">Choose Your Destination</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country) => (
              <motion.div
                key={country.name}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCountry(selectedCountry === country.name ? null : country.name)}
                className={`bg-accent-dark p-8 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCountry === country.name
                    ? "border-gold"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="mb-4 flex justify-center">
                  <div className="relative w-24 h-16 rounded-md overflow-hidden shadow-lg">
                    <Image
                      src={country.flagImage}
                      alt={`${country.name} flag`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-center">{country.name}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Duration:</span>
                    <span className="font-semibold text-gold">{country.duration}</span>
                  </div>
                </div>
                {selectedCountry === country.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-6 border-t border-white/10"
                  >
                    <h4 className="font-semibold mb-3">Highlights:</h4>
                    <ul className="space-y-2 text-sm text-white/70">
                      {country.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gold mr-2">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-dark border-2 border-gold/30 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">What We Provide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pre-Departure Support</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Flight school selection and admission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Student visa processing assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Pre-departure orientation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Accommodation arrangement</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">During Training</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Regular progress monitoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Support coordinator on ground</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>License conversion guidance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gold mr-3">•</span>
                  <span>Career counseling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Fly Abroad?</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Book a consultation to discuss the best country for your goals and budget. We'll handle everything from admission to visa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-gold text-dark px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors inline-block"
            >
              Book Consultation
            </Link>
            <Link
              href="/assessment"
              className="bg-white/10 text-white px-12 py-5 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20 inline-block"
            >
              Take Pilot Assessment Test
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
