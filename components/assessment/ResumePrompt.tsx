"use client";

import { motion, useReducedMotion } from "framer-motion";
import { RotateCcw, Play } from "lucide-react";

export interface ResumePromptProps {
  questionsAnswered: number;
  totalQuestions: number;
  onResume: () => void;
  onStartOver: () => void;
}

/**
 * Step 9 - Offered when localStorage holds an in-progress PAT session past
 * the eligibility gate.
 */
export default function ResumePrompt({
  questionsAnswered,
  totalQuestions,
  onResume,
  onStartOver,
}: ResumePromptProps) {
  const reduceMotion = useReducedMotion();
  const fade = reduceMotion ? {} : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        {...fade}
        transition={{ duration: 0.4 }}
        className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8"
      >
        <div className="absolute -top-3 left-6">
          <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Welcome Back
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-3">
          Pick up where you left off?
        </h2>
        <p className="text-white/70 mb-8">
          You answered {questionsAnswered} of {totalQuestions} questions in
          your last session. Your progress is saved on this device.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center justify-center gap-2 bg-[#C5A572] text-[#1A1A1A] px-6 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            <Play className="w-4 h-4" />
            Resume
          </button>
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#C5A572] text-[#C5A572] px-6 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:bg-[#C5A572]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
          >
            <RotateCcw className="w-4 h-4" />
            Start over
          </button>
        </div>
      </motion.div>
    </div>
  );
}
