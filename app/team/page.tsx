"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";

const team = [
  {
    name: "Sumaiya Ali",
    initials: "SA",
    photo: "/team/Sumaiya Ali.webp",
    title: "Founder & CEO",
    bio: "Founded WindChasers in 2024 after navigating the pilot training landscape for her own daughter Rida. Built the academy to give parents and aspiring pilots the one thing the industry rarely offers: a straight answer. Real costs. Real timelines. No false promises.",
    expertise: ["Founding Vision", "Strategic Direction", "Family-First Counselling", "Industry Partnerships", "Academy Operations"],
  },
  {
    name: "Rida Maryam Ali",
    initials: "RM",
    photo: "/team/Rida Ali.webp",
    title: "Managing Director",
    bio: "A trained commercial pilot whose aviation career instilled the discipline, precision, and decisive leadership that drives Wind Chasers forward. Her expertise lies in combining technical aviation knowledge with strategic leadership, focusing on innovation, growth, and building a culture of excellence.",
    expertise: ["Strategic Leadership", "Aviation Operations", "Innovation & Growth", "Team Culture", "Aspiring Aviator Development"],
  },
  {
    name: "Hemanth Kumar R",
    initials: "HK",
    photo: "/team/Hemanth.webp",
    title: "Chief Ground Instructor",
    bio: "CPL holder trained in the US and India, Boeing 737NG type-rated, and an Aeronautical Engineering graduate who cleared all ATPL exams. Over five years of structured teaching experience guiding students through DGCA examinations and comprehensive CPL counselling.",
    expertise: ["Air Navigation", "Air Regulations", "Technical General", "RTR & ATPL", "CPL Counselling"],
  },
  {
    name: "Navaneeth Nagendra",
    initials: "NN",
    photo: "/team/Navneeth.webp",
    title: "Senior Ground Instructor",
    bio: "Eight years in aviation training with a multidisciplinary background spanning Aeronautical, Maintenance, and Industrial Engineering. Delivers structured theory that builds robust academic foundations aligned with the DGCA syllabus.",
    expertise: ["Meteorology", "Air Navigation", "Air Regulations", "Technical General", "DGCA Syllabus Development"],
  },
  {
    name: "Namrata Baraik",
    initials: "NB",
    photo: "/team/Narmatha.webp",
    title: "Cabin Crew Senior Instructor",
    bio: "18 years in the airline industry with Kingfisher Airlines and Air India. Rated on Airbus A319/A320/A321 and Boeing B777-200LR, B777-300ER and B787-8, bringing deep operational expertise to every training session.",
    expertise: ["Cabin Crew Training", "In-flight Safety & Emergency", "Passenger Handling", "Crew Resource Management", "DGCA SEP Preparation"],
  },
  {
    name: "Rohan Hibare",
    initials: "RH",
    photo: "/team/Rohan.webp",
    title: "Ground Instructor",
    bio: "CPL holder with a Mechanical Engineering background known for making complex aviation concepts accessible and exam-ready through clear, methodical instruction. Simplifies difficult subject matter so students build genuine understanding.",
    expertise: ["Aviation Meteorology", "Air Navigation", "Technical General", "DGCA Exam Preparation"],
  },
  {
    name: "Richard B Gomes",
    initials: "RG",
    photo: "/team/Richard Gomez.webp",
    title: "Growth & Marketing Executive",
    bio: "7+ years across design, operations, and growth strategy in fast-paced environments. Drives customer acquisition, brand presence, and high-impact campaigns that translate into measurable enrollment growth and meaningful student engagement.",
    expertise: ["Growth Strategy", "Strategic Marketing", "Brand Development", "Partnerships & Outreach", "Campaign Execution"],
  },
  {
    name: "Z. Mohammed Haseeb",
    initials: "ZH",
    photo: "/team/Haseeb.webp",
    title: "Business Development Manager",
    bio: "Mechanical Engineer with broad corporate sales and marketing experience, and an aspiring pilot actively training at Windchasers. Combines business acumen with genuine passion for aviation to guide every prospective student toward the right path.",
    expertise: ["Business Development", "Student Counselling", "Sales & Marketing", "Aviation Sector Growth"],
  },
];

type Member = (typeof team)[number];

function PhotoArea({ member }: { member: Member }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={member.name}
        fill
        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        style={{ objectPosition: "center 30%" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
      <span
        className="text-6xl font-bold text-[#C5A572]/40 select-none"
        style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
      >
        {member.initials}
      </span>
    </div>
  );
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "rgba(53, 53, 53, 0.4)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(197, 165, 114, 0.15)",
      }}
    >
      {/* Photo */}
      <div className="relative h-96 overflow-hidden flex-shrink-0">
        <PhotoArea member={member} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <h3
          className="text-[#C5A572] text-2xl font-bold mb-1"
          style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
        >
          {member.name}
        </h3>
        <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-5">
          {member.title}
        </p>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="full"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                {member.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {member.expertise.map((e) => (
                  <span
                    key={e}
                    className="text-xs text-[#C5A572]/70 border border-[#C5A572]/20 bg-[#C5A572]/5 rounded-full px-2.5 py-1"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="clamped"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-1"
            >
              {member.bio}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-[#C5A572] text-sm font-bold tracking-wider uppercase mt-auto group/btn w-fit"
        >
          {expanded ? (
            <>
              CLOSE
              <X size={16} className="transition-transform group-hover/btn:rotate-90 duration-300" />
            </>
          ) : (
            <>
              READ BIO
              <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1 duration-300" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  return (
    <main style={{ backgroundColor: "#0A0A0A" }}>
      {/* Hero */}
      <section className="relative min-h-[700px] flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/WC HEro.webp"
            alt="Wind Chasers Flight Deck"
            fill
            className="object-cover opacity-35 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>
        <div className="relative z-10 text-center max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-sm mb-6 block"
              style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
            >
              Captains of Your Career
            </span>
            <h1
              className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter leading-tight mb-8"
              style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
            >
              The Minds Behind{" "}
              <span className="text-[#C5A572]">Your Wings</span>
            </h1>
            <p className="text-white/50 text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              Seasoned aviators and technical specialists dedicated to forging
              the next generation of professional pilots.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section
        className="py-28 relative"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(197, 165, 114, 0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {team.map((member, i) => (
              <MemberCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center py-16 px-10 rounded-2xl"
          style={{
            background: "rgba(53, 53, 53, 0.4)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(197, 165, 114, 0.15)",
          }}
        >
          <p
            className="text-[#C5A572] text-sm font-bold uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
          >
            Ready to begin?
          </p>
          <h2
            className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
          >
            Train with the best in the field
          </h2>
          <p className="text-white/50 mb-10 leading-relaxed">
            Our team brings together real-world aviation experience to guide
            you from your first lesson to your licence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/assessment"
              className="bg-[#C5A572] text-[#1A1A1A] px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#C5A572]/90 transition-colors"
              style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
            >
              Take Pilot Assessment
            </a>
            <a
              href="/demo"
              className="bg-transparent border-2 border-[#C5A572] text-[#C5A572] px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#C5A572] hover:text-[#1A1A1A] transition-colors"
              style={{ fontFamily: "var(--font-manrope, sans-serif)" }}
            >
              Book a Demo Session
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
