"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "12th with Physics/Math",
    description: "Complete 12th standard with Physics and Mathematics as core subjects.",
  },
  {
    number: "02",
    title: "Medical (Class 2 → Class 1)",
    description: "Obtain Class 2 medical certificate, then upgrade to Class 1 for CPL.",
  },
  {
    number: "03",
    title: "DGCA Ground Classes",
    description: "Complete all 6 DGCA theory subjects and clear written examinations.",
  },
  {
    number: "04",
    title: "Flight School CPL",
    description: "Enroll in DGCA-approved flight school for Commercial Pilot License training.",
  },
  {
    number: "05",
    title: "200 Flying Hours",
    description: "Complete minimum 200 hours of flight training including solo and dual flights.",
  },
  {
    number: "06",
    title: "Get CPL",
    description: "Pass DGCA skill test and receive your Commercial Pilot License.",
  },
  {
    number: "07",
    title: "Airline Prep",
    description: "Prepare for airline interviews, simulator assessments, and selection processes.",
  },
  {
    number: "08",
    title: "Type Rating",
    description: "Complete type rating on specific aircraft as required by your airline.",
  },
];

interface TimelineStepProps {
  step: Step;
  index: number;
  isEven: boolean;
  isMobile: boolean;
}

function TimelineStep({ step, index, isEven, isMobile }: TimelineStepProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  const stepInView = useInView(stepRef, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={stepRef}
      className="relative flex items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={stepInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Circle with number - Desktop */}
      <motion.div
        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-gold rounded-full border-4 border-dark items-center justify-center z-10"
        initial={{ scale: 0 }}
        animate={stepInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: index * 0.1 + 0.2,
        }}
      >
        <motion.span
          className="text-dark font-bold text-xl leading-none"
          initial={{ opacity: 0 }}
          animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {step.number}
        </motion.span>
      </motion.div>

      {/* Circle with number - Mobile */}
      <motion.div
        className="lg:hidden absolute left-8 transform -translate-x-1/2 w-12 h-12 bg-gold rounded-full border-4 border-dark flex items-center justify-center z-10"
        initial={{ scale: 0 }}
        animate={stepInView ? { scale: 1 } : { scale: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: index * 0.1 + 0.2,
        }}
      >
        <motion.span
          className="text-dark font-bold"
          initial={{ opacity: 0 }}
          animate={stepInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {step.number}
        </motion.span>
      </motion.div>

      {/* Content Card */}
      <motion.div
        className={`ml-20 lg:ml-0 ${
          isEven
            ? "lg:ml-auto lg:w-[45%] lg:pl-8"
            : "lg:mr-auto lg:w-[45%] lg:pr-8 lg:text-right"
        }`}
        initial={{ 
          opacity: 0, 
          x: isMobile ? 100 : (isEven ? 50 : -50) // Mobile: always from right, Desktop: alternating
        }}
        animate={stepInView ? { 
          opacity: 1, 
          x: 0 
        } : { 
          opacity: 0, 
          x: isMobile ? 100 : (isEven ? 50 : -50) // Mobile: always from right, Desktop: alternating
        }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
      >
        <div className="bg-accent-dark p-6 rounded-lg border border-white/10">
          <h3 className="text-lg font-bold mb-2">{step.title}</h3>
          <p className="text-white/60 text-sm">{step.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PilotJourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-12 text-center text-gold">Pilot Journey</h2>
      <div className="relative max-w-6xl mx-auto" ref={containerRef}>
        {/* Runway line - Desktop */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-3 transform -translate-x-1/2 overflow-hidden">
          {/* Runway base */}
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20"
            style={{ height: "100%" }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Runway center line */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gold"
            style={{ height: "100%" }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          />
          {/* Runway dashed markings */}
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 20px, rgba(197, 165, 114, 0.3) 20px, rgba(197, 165, 114, 0.3) 25px)' }} />
        </div>

        {/* Runway line - Mobile */}
        <div className="lg:hidden absolute left-8 top-0 bottom-0 w-2 overflow-hidden">
          {/* Runway base */}
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-r from-gold/20 via-gold/30 to-gold/20"
            style={{ height: "100%" }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          {/* Runway center line */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-gold"
            style={{ height: "100%" }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
          />
          {/* Runway dashed markings */}
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 20px, rgba(197, 165, 114, 0.3) 20px, rgba(197, 165, 114, 0.3) 25px)' }} />
        </div>

        {/* Airplane taking off - Desktop */}
        <motion.div
          className="hidden lg:block absolute left-1/2 z-20"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ top: "0%", rotate: 180, opacity: 0 }}
          animate={isInView ? { 
            top: "100%", 
            rotate: 180,
            opacity: [0, 1, 1, 1, 0],
            scale: [0.8, 1, 1.2, 1.5, 2]
          } : { top: "0%", rotate: 180, opacity: 0 }}
          transition={{ 
            duration: 3, 
            ease: "easeOut",
            delay: 0.5,
            times: [0, 0.3, 0.6, 0.8, 1]
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gold" style={{ display: 'block' }}>
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Airplane taking off - Mobile */}
        <motion.div
          className="lg:hidden absolute left-8 z-20"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ top: "0%", rotate: 180, opacity: 0 }}
          animate={isInView ? { 
            top: "100%", 
            rotate: 180,
            opacity: [0, 1, 1, 1, 0],
            scale: [0.8, 1, 1.2, 1.5, 2]
          } : { top: "0%", rotate: 180, opacity: 0 }}
          transition={{ 
            duration: 3, 
            ease: "easeOut",
            delay: 0.5,
            times: [0, 0.3, 0.6, 0.8, 1]
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gold" style={{ display: 'block' }}>
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Timeline Steps */}
        <div className="space-y-12 lg:space-y-16">
          {steps.map((step, index) => (
            <TimelineStep
              key={index}
              step={step}
              index={index}
              isEven={index % 2 === 0}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

