"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AirplanePathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AirplanePathModal({ isOpen, onClose }: AirplanePathModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
          >
            <div
              className="relative max-w-4xl w-full h-[100dvh] md:h-auto md:max-h-[90vh] flex flex-col md:block bg-accent-dark border-0 md:border-2 border-gold/50 rounded-none md:rounded-lg overflow-hidden md:overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 md:top-6 md:right-6 text-white hover:text-gold transition-colors text-2xl z-20 bg-dark/80 md:bg-transparent rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>

              <div className="flex flex-col h-full md:block p-4 md:p-12 pt-12 md:pt-12 overflow-y-auto md:overflow-visible">
                <h2 className="text-2xl md:text-4xl font-bold text-gold text-center mb-4 md:mb-12 leading-tight">
                  Choose Your Pilot Training Path
                </h2>

                <div className="grid md:grid-cols-2 gap-3 md:gap-8 flex-1">
                  {/* Starting Fresh — gold accent */}
                  <Link
                    href="/dgca"
                    onClick={onClose}
                    className="group bg-gold/5 border-2 border-gold/50 hover:border-gold transition-all p-4 md:p-8 rounded-lg block"
                  >
                    <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gold">
                      Starting Fresh
                    </h3>
                    <p className="text-white/70 text-sm md:text-base mb-3 md:mb-6 leading-snug">
                      Begin with DGCA ground classes. Complete all 6 CPL theory
                      exams before flying.
                    </p>

                    <div className="space-y-1.5 md:space-y-3 mb-4 md:mb-6 text-xs md:text-sm">
                      {[
                        "6 DGCA theory subjects",
                        "Comprehensive ground school",
                        "400+ hours of training",
                      ].map((item) => (
                        <div key={item} className="flex items-start">
                          <span className="text-gold mr-2 md:mr-3">•</span>
                          <span className="text-white/60">{item}</span>
                        </div>
                      ))}
                    </div>

                    <span className="inline-block bg-gold text-dark px-5 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-gold/90 transition-colors">
                      View DGCA Program
                    </span>
                  </Link>

                  {/* DGCA Completed — sky/blue accent */}
                  <Link
                    href="/international"
                    onClick={onClose}
                    className="group bg-sky-500/5 border-2 border-sky-400/50 hover:border-sky-400 transition-all p-4 md:p-8 rounded-lg block"
                  >
                    <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-sky-300">
                      DGCA Completed
                    </h3>
                    <p className="text-white/70 text-sm md:text-base mb-3 md:mb-6 leading-snug">
                      Already cleared DGCA exams? Get pilot training abroad to
                      complete your CPL hours.
                    </p>

                    <div className="space-y-1.5 md:space-y-3 mb-4 md:mb-6 text-xs md:text-sm">
                      {[
                        "USA, Canada, Hungary, NZ, Australia",
                        "6-8 months training",
                        "Complete visa support",
                      ].map((item) => (
                        <div key={item} className="flex items-start">
                          <span className="text-sky-300 mr-2 md:mr-3">•</span>
                          <span className="text-white/60">{item}</span>
                        </div>
                      ))}
                    </div>

                    <span className="inline-block bg-sky-400 text-dark px-5 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base hover:bg-sky-300 transition-colors">
                      Choose Country
                    </span>
                  </Link>
                </div>

                <div className="mt-4 md:mt-8 pt-3 md:pt-8 border-t border-white/10 text-center">
                  <p className="text-white/50 text-xs md:text-sm">
                    Not sure which path?{" "}
                    <Link
                      href="/assessment"
                      onClick={onClose}
                      className="text-gold hover:underline font-semibold"
                    >
                      Take Assessment
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
