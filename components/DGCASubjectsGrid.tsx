"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation,
  Scale,
  Cloud,
  Cog,
  Settings,
  Radio,
  ChevronDown,
} from "lucide-react";

interface Subject {
  id: number;
  name: string;
  marks: number;
  duration: string;
  icon: React.ReactNode;
  image: string;
  description: string;
}

const subjects: Subject[] = [
  {
    id: 1,
    name: "Air Navigation",
    marks: 100,
    duration: "6-8 weeks",
    icon: <Navigation className="w-8 h-8" />,
    image: "/facility/DSC_0481.JPG.webp",
    description:
      "Dead reckoning, wind calculations, flight planning, chart reading, position fixing. Learn to navigate aircraft from point A to B with precision and confidence.",
  },
  {
    id: 2,
    name: "Air Regulations",
    marks: 100,
    duration: "3-4 weeks",
    icon: <Scale className="w-8 h-8" />,
    image: "/facility/DSC_0492.JPG.webp",
    description:
      "DGCA rules, ICAO standards, airspace classifications, flight rules, pilot licensing requirements. Master aviation law essentials and regulatory compliance.",
  },
  {
    id: 3,
    name: "Aviation Meteorology",
    marks: 100,
    duration: "4-5 weeks",
    icon: <Cloud className="w-8 h-8" />,
    image: "/facility/WC5.webp",
    description:
      "Weather systems, cloud formations, wind patterns, icing, turbulence, weather reports (METAR/TAF). Read the sky like a professional pilot and make informed weather decisions.",
  },
  {
    id: 4,
    name: "Technical General",
    marks: 100,
    duration: "6-8 weeks",
    icon: <Cog className="w-8 h-8" />,
    image: "/facility/5U2A0673.JPG.webp",
    description:
      "Aircraft systems, engines, electrical, hydraulics, fuel, instruments. Understand how planes actually work from the inside out.",
  },
  {
    id: 5,
    name: "Technical Specific",
    marks: 100,
    duration: "5-6 weeks",
    icon: <Settings className="w-8 h-8" />,
    image: "/facility/DSC_0549.JPG.webp",
    description:
      "Specific aircraft systems, aerodynamics, performance, weight & balance. Deep dive into aircraft operations and technical specifications.",
  },
  {
    id: 6,
    name: "RTR",
    marks: 100,
    duration: "2-3 weeks",
    icon: <Radio className="w-8 h-8" />,
    image: "/facility/Sumaiya Ali.webp",
    description:
      "ATC communication, phonetic alphabet, emergency calls, clearances. Master radiotelephony and talk like a professional pilot.",
  },
];

export default function DGCASubjectsGrid() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const isExpanded = expandedId === subject.id;

          return (
            <motion.div
              key={subject.id}
              className="relative"
              initial={false}
              animate={{
                scale: isExpanded ? 1.03 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                className={`
                  relative overflow-hidden rounded-xl p-6 cursor-pointer
                  border-t-2 transition-all duration-300
                  ${isExpanded ? "border-[#C5A572] bg-[#0a0a0a]" : "border-[#C5A572]/50 hover:border-[#C5A572] bg-[#1A1A1A]"}
                `}
                onClick={() => toggleExpand(subject.id)}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-15 transition-opacity duration-300 group-hover:opacity-25"
                  style={{ backgroundImage: `url(${subject.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/85 to-[#1A1A1A]/50" />

                {/* Card Header - Collapsed State */}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="text-gold flex-shrink-0">{subject.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gold mb-2">
                      {subject.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-white/70">
                        {subject.marks} marks
                      </span>
                      <span className="text-gold/70">•</span>
                      <span className="text-white/70">
                        {subject.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expandable Indicator Arrow - Mobile Only */}
                <div className="md:hidden absolute bottom-3 right-3 z-10">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gold/70"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Expandable Description */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-[#C5A572]/30">
                        <p className="text-white/85 leading-relaxed">
                          {subject.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

