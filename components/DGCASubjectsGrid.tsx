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
  description: string;
}

const subjects: Subject[] = [
  {
    id: 1,
    name: "Air Navigation",
    marks: 100,
    duration: "6-8 weeks",
    icon: <Navigation className="w-8 h-8" />,
    description:
      "Dead reckoning, wind calculations, flight planning, chart reading, position fixing. Learn to navigate aircraft from point A to B with precision and confidence.",
  },
  {
    id: 2,
    name: "Air Regulations",
    marks: 100,
    duration: "3-4 weeks",
    icon: <Scale className="w-8 h-8" />,
    description:
      "DGCA rules, ICAO standards, airspace classifications, flight rules, pilot licensing requirements. Master aviation law essentials and regulatory compliance.",
  },
  {
    id: 3,
    name: "Aviation Meteorology",
    marks: 100,
    duration: "4-5 weeks",
    icon: <Cloud className="w-8 h-8" />,
    description:
      "Weather systems, cloud formations, wind patterns, icing, turbulence, weather reports (METAR/TAF). Read the sky like a professional pilot and make informed weather decisions.",
  },
  {
    id: 4,
    name: "Technical General",
    marks: 100,
    duration: "6-8 weeks",
    icon: <Cog className="w-8 h-8" />,
    description:
      "Aircraft systems, engines, electrical, hydraulics, fuel, instruments. Understand how planes actually work from the inside out.",
  },
  {
    id: 5,
    name: "Technical Specific",
    marks: 100,
    duration: "5-6 weeks",
    icon: <Settings className="w-8 h-8" />,
    description:
      "Specific aircraft systems, aerodynamics, performance, weight & balance. Deep dive into aircraft operations and technical specifications.",
  },
  {
    id: 6,
    name: "RTR",
    marks: 100,
    duration: "2-3 weeks",
    icon: <Radio className="w-8 h-8" />,
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
                  bg-accent-dark border-2 rounded-lg p-6 cursor-pointer relative
                  transition-all duration-300
                  ${isExpanded ? "border-gold bg-dark" : "border-gold/30 hover:border-gold"}
                `}
                onClick={() => toggleExpand(subject.id)}
                whileHover={{ borderColor: "#C5A572" }}
              >
                {/* Card Header - Collapsed State */}
                <div className="flex items-center gap-4">
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
                <div className="md:hidden absolute bottom-3 right-3">
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
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gold/20">
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

