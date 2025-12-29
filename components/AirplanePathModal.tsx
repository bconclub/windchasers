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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
          >
            <div className="relative max-w-4xl w-full">
              <div className="bg-accent-dark border-0 md:border-2 border-gold/50 rounded-lg max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gold transition-colors text-3xl z-10 bg-dark/80 md:bg-transparent rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ×
                </button>
                <div className="p-6 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gold text-center mb-4 md:mb-8">
                    Choose Your Airplane Path
                  </h2>

                  <p className="text-white/70 mb-6 md:mb-12 text-base md:text-lg text-center">
                    Select the path that matches your current status
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                    {/* Starting Fresh */}
                    <Link
                      href="/dgca"
                      className="group bg-dark border-2 border-gold/50 hover:border-gold transition-all p-6 md:p-8 rounded-lg block"
                    >
                    <h3 className="text-2xl font-bold mb-4 text-gold">Starting Fresh</h3>
                    <p className="text-white/70 mb-6">
                      Begin with DGCA ground classes. Complete all 6 CPL theory exams before flying.
                    </p>

                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">6 DGCA theory subjects</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">Comprehensive ground school</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">400+ hours of training</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">Mock tests & exam prep</span>
                      </div>
                    </div>

                      <div className="inline-block bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
                        View DGCA Program
                      </div>
                    </Link>

                    {/* DGCA Completed */}
                    <Link
                      href="/international"
                      className="group bg-dark border-2 border-gold/50 hover:border-gold transition-all p-6 md:p-8 rounded-lg block"
                    >
                    <h3 className="text-2xl font-bold mb-4 text-gold">DGCA Completed</h3>
                    <p className="text-white/70 mb-6">
                      Already cleared DGCA exams? Fly abroad to complete your CPL hours.
                    </p>

                    <div className="space-y-3 mb-6 text-sm">
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">USA, Canada, Hungary, NZ, Australia</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">6-8 months training</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">Complete visa support</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span className="text-white/60">Transparent cost breakdown</span>
                      </div>
                    </div>

                      <div className="inline-block bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
                        Choose Country
                      </div>
                    </Link>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 text-center">
                    <p className="text-white/50 text-sm">
                      Not sure which path? <Link href="/assessment" className="text-gold hover:underline">Take our pilot assessment test</Link> or <Link href="/demo" className="text-gold hover:underline">book a free demo</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
