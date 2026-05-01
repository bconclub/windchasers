"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PATQuestion } from "@/lib/pat-questions";

export interface QuestionScreenProps {
  question: PATQuestion;
  currentIndex: number; // 0-based
  totalCount: number;
  sectionHeader?: string | null;
  currentValue: string | number | undefined;
  onAnswer: (value: string | number, autoAdvance: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
  canProceed: boolean;
}

export default function QuestionScreen({
  question,
  currentIndex,
  totalCount,
  sectionHeader,
  currentValue,
  onAnswer,
  onBack,
  onNext,
  isLast,
  canProceed,
}: QuestionScreenProps) {
  const reduceMotion = useReducedMotion();
  const progress = ((currentIndex + 1) / totalCount) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">
            Question {currentIndex + 1} of {totalCount}
          </span>
          <span className="text-sm text-[#C5A572] tabular-nums">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#C5A572]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          />
        </div>
      </div>

      {/* Section header (between blocks of questions) */}
      {sectionHeader ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <p className="text-[#C5A572] text-xs uppercase tracking-[3px] font-medium mb-2">
            Up Next
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            {sectionHeader}
          </h3>
        </motion.div>
      ) : null}

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-6 md:p-8 mb-6"
        >
          <div className="absolute -top-3 left-6">
            <span className="bg-[#C5A572] text-[#1A1A1A] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {sectionLabel(question.section)}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-white mt-2 mb-6 leading-snug">
            {question.question}
          </h2>

          {question.type === "text" ? (
            <input
              type="number"
              value={currentValue ?? ""}
              onChange={(e) => onAnswer(e.target.value, false)}
              placeholder="Enter your age"
              inputMode="numeric"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#444] rounded-lg focus:border-[#C5A572] focus:outline-none transition-colors text-white text-lg placeholder:text-white/40"
            />
          ) : (
            <div className="space-y-3">
              {question.options?.map((option, idx) => {
                const selected = currentValue === idx;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    onClick={() => onAnswer(idx, true)}
                    className={`w-full p-4 md:p-5 text-left rounded-lg border transition-all duration-150 ${
                      selected
                        ? "border-[#C5A572] bg-[#C5A572]/10"
                        : "border-white/15 hover:border-[#C5A572]/60 bg-[#0D0D0D]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          selected ? "border-[#C5A572]" : "border-white/40"
                        }`}
                      >
                        {selected ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C5A572]" />
                        ) : null}
                      </span>
                      <span
                        className={`font-medium ${
                          selected ? "text-white" : "text-white/85"
                        }`}
                      >
                        {option}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1 px-4 py-2.5 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="inline-flex items-center gap-1 px-6 py-3 bg-[#C5A572] text-[#1A1A1A] rounded-lg font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A572]/60"
        >
          {isLast ? "Continue" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function sectionLabel(section: PATQuestion["section"]): string {
  if (section === "qualification") return "Qualification";
  if (section === "aptitude") return "Aptitude";
  return "Readiness";
}
