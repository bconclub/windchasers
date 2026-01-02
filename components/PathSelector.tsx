"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const MotionLink = motion(Link);

export default function PathSelector() {
  const [selectedPath, setSelectedPath] = useState<"airplane" | "helicopter" | null>(null);

  return (
    <section className="py-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gold">
          Choose Your Path
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedPath("airplane")}
            className={`bg-accent-dark border-2 cursor-pointer transition-all p-8 rounded-lg ${
              selectedPath === "airplane" ? "border-gold" : "border-white/10 hover:border-white/30"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">Airplane</h3>
            <p className="text-white/60 mb-6">
              Commercial Pilot License training. DGCA ground classes or pilot training abroad.
            </p>
            <div className="text-sm text-white/40">
              Click to see options
            </div>
          </motion.div>

          <MotionLink
            href="/helicopter"
            whileHover={{ scale: 1.02 }}
            className="bg-accent-dark border-2 border-white/10 hover:border-white/30 transition-all p-8 rounded-lg block"
          >
            <h3 className="text-2xl font-bold mb-4">Helicopter</h3>
            <p className="text-white/60 mb-6">
              Helicopter Pilot License (HPL) track. Specialized training.
            </p>
            <div className="text-sm text-gold">
              View details →
            </div>
          </MotionLink>
        </div>

        {selectedPath === "airplane" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <Link
              href="/dgca"
              className="bg-dark border-2 border-gold/50 hover:border-gold transition-all p-8 rounded-lg block group"
            >
              <h4 className="text-xl font-bold mb-3 text-gold">Starting Fresh</h4>
              <p className="text-white/60 mb-4">
                Begin with DGCA ground classes. Complete CPL theory before flying.
              </p>
              <div className="text-sm text-gold group-hover:translate-x-2 transition-transform inline-block">
                Start here →
              </div>
            </Link>

            <Link
              href="/international"
              className="bg-dark border-2 border-gold/50 hover:border-gold transition-all p-8 rounded-lg block group"
            >
              <h4 className="text-xl font-bold mb-3 text-gold">DGCA Completed</h4>
              <p className="text-white/60 mb-4">
                Already cleared DGCA exams? Choose a country to complete your flying hours.
              </p>
              <div className="text-sm text-gold group-hover:translate-x-2 transition-transform inline-block">
                Choose country →
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
