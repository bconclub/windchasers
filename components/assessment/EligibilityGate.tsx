"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Check, X } from "lucide-react";

export interface EligibilityGateProps {
  onAnswer: (answer: "yes" | "no") => void;
}

/**
 * Step 1 - Eligibility gate.
 * Shown BEFORE any test question loads. Hard rule: PAT is for 12th-pass-plus
 * aspirants. Sub-12 users are routed to /assessment/early.
 */
export default function EligibilityGate({ onAnswer }: EligibilityGateProps) {
  const reduceMotion = useReducedMotion();
  const fade = reduceMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome hero - only visible on the gate (welcome) view. Hidden on every
          subsequent phase so the test stays focused. */}
      <motion.div
        {...fade}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 md:mb-12"
      >
        <span className="inline-block bg-[#C5A572]/15 text-[#C5A572] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide border border-[#C5A572]/40 mb-5">
          Pilot Aptitude Test
        </span>
        <h1 className="text-[2.25rem] md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Where do you stand on the{" "}
          <span className="text-[#C5A572]">pilot path?</span>
        </h1>
        <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto">
          20 questions, about 3 minutes. Instant scorecard plus personalised
          guidance from our team.
        </p>
      </motion.div>

      <motion.div
        {...fade}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
        className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8 md:p-12"
      >
        {/* Floating gold pill (signature WindChasers card) */}
        <div className="absolute -top-3 left-6">
          <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Quick Check
          </span>
        </div>

        <div className="mb-6 mt-2">
          <GraduationCap className="w-10 h-10 text-[#C5A572]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Quick check before we start.
        </h1>
        <p className="text-white/70 text-base md:text-lg mb-10">
          Have you completed Class 12, or are you currently in Class 12?
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onAnswer("yes")}
            className="group flex items-center justify-center gap-3 bg-[#C5A572] text-[#1A1A1A] px-6 py-5 rounded-lg font-semibold text-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
            aria-label="Yes, I have completed or am in Class 12"
          >
            <span className="w-7 h-7 rounded-full bg-[#1A1A1A]/15 flex items-center justify-center">
              <Check className="w-4 h-4" strokeWidth={3} />
            </span>
            Yes
          </button>
          <button
            type="button"
            onClick={() => onAnswer("no")}
            className="group flex items-center justify-center gap-3 bg-transparent border border-[#C5A572] text-[#C5A572] px-6 py-5 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-[#C5A572]/10 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
            aria-label="No, I am earlier in my journey"
          >
            <span className="w-7 h-7 rounded-full border border-[#C5A572] flex items-center justify-center">
              <X className="w-4 h-4" strokeWidth={3} />
            </span>
            No
          </button>
        </div>

        <p className="text-white/40 text-xs mt-8 text-center">
          PAT is built for Class 12 pass aspirants. We will guide you to the
          right resources either way.
        </p>
      </motion.div>
    </div>
  );
}
