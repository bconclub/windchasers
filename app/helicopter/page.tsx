"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Manrope } from "next/font/google";
import { CheckCircle } from "lucide-react";
import { trackKeyPageView } from "@/lib/analytics";

const manrope = Manrope({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-headline" });

const trainingPath = [
  { step: "01", title: "Ground School", desc: "DGCA theoretical exams covering helicopter systems, aerodynamics, and regulations.", duration: "6–8 months" },
  { step: "02", title: "Flight Training", desc: "Minimum 40 hours dual instruction and 10 hours solo flight in helicopters.", duration: "4–6 months" },
  { step: "03", title: "License Issuance", desc: "DGCA skill test and license issuance. Start your helicopter pilot career.", duration: "After completion" },
];

const careers = [
  { title: "Offshore Operations", desc: "Oil rig crew transport, offshore platform support. High-demand specialized sector." },
  { title: "Medical Evacuation", desc: "Air ambulance services, emergency medical transport. Critical life-saving operations." },
  { title: "VIP Transport", desc: "Corporate and executive charter. Premium service for business leaders." },
  { title: "Tourism", desc: "Scenic tours, charter services. Growing industry in tourist destinations." },
  { title: "Agriculture", desc: "Crop spraying, agricultural surveys. Specialized farming operations." },
  { title: "Utility Services", desc: "Power line inspection, pipeline monitoring. Infrastructure support." },
];

const requirements = [
  "Age: 18 years minimum",
  "Education: 10+2 with Physics & Maths",
  "English proficiency required",
  "Class 1 Medical certificate",
  "No flying experience needed",
  "Valid government ID",
];

export default function HelicopterPage() {
  useEffect(() => {
    document.title = "Helicopter Pilot License | WindChasers Aviation Academy";
    trackKeyPageView("Helicopter Training");
  }, []);

  return (
    <div className={`${manrope.variable}`} style={{ backgroundColor: "#131313", color: "#fff" }}>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 md:px-12 text-center" style={{ backgroundColor: "#131313" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">
            WindChasers · Specialized Training
          </span>
          <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-tight mb-5">
            Helicopter{" "}
            <span className="text-[#C5A572] italic">Pilot License.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
            HPL training for specialized aviation careers. Offshore operations, medical evacuation, VIP transport, and more.
          </p>
        </motion.div>
      </section>

      {/* Training Path */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#0e0e0e" }}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Step by step</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Training Path
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {trainingPath.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8"
              >
                <div className="text-4xl font-extrabold text-[#C5A572] mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 mb-4 text-sm leading-relaxed">{item.desc}</p>
                <span className="text-xs font-bold text-[#C5A572] bg-[#C5A572]/10 border border-[#C5A572]/20 px-3 py-1 rounded-full">
                  {item.duration}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Entry Requirements */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Eligibility</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl font-extrabold tracking-tighter text-white">
              Entry Requirements
            </h2>
          </motion.div>
          <div className="bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-10">
            <div className="grid md:grid-cols-2 gap-4">
              {requirements.map((req) => (
                <div key={req} className="flex items-start gap-3 text-white/80">
                  <CheckCircle className="w-5 h-5 text-[#C5A572] shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#0e0e0e" }}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Where you fly</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Career Opportunities
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-[#1A1A1A] border-t-2 border-[#C5A572]/40 rounded-xl p-8 hover:-translate-y-1 hover:border-[#C5A572] transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 text-center" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">Ready?</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-5">
              Start Your Helicopter Career
            </h2>
            <p className="text-white/60 mb-8">
              Specialized training for a unique aviation career. Book a demo session to get started.
            </p>
            <Link
              href="/demo"
              className="inline-block bg-[#C5A572] text-[#1A1A1A] px-12 py-5 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5"
            >
              Book a Demo Session
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
