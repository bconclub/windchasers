"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function SubmittingState() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-10 text-center"
      >
        <div className="absolute -top-3 left-6">
          <span className="bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Scoring
          </span>
        </div>

        <Loader2 className="w-10 h-10 text-[#C5A572] mx-auto mb-5 animate-spin" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Calculating your score.
        </h2>
        <p className="text-white/60">
          Hang tight while we compile your personalised report.
        </p>
      </motion.div>
    </div>
  );
}
