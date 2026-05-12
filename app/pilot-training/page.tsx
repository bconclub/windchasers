"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Manrope } from "next/font/google";
import AirplanePathModal from "@/components/AirplanePathModal";
import {
  ArrowRight,
  PlaneTakeoff,
  HelpCircle,
  Award,
  Globe,
  Wallet,
  Headphones,
  Plane,
  Receipt,
  Phone,
  Calendar,
  Sparkles,
  FileText,
  Download,
  Star,
} from "lucide-react";
import VideoCarousel from "@/components/VideoCarousel";
import ImageCarousel from "@/components/ImageCarousel";
import StudentsFlyingGallery, {
  type GalleryItem,
} from "@/components/StudentsFlyingGallery";
import VimeoReel from "@/components/VimeoReel";
import CardCarousel from "@/components/CardCarousel";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "600", "700", "800"],
});

const flyingGallery: GalleryItem[] = [
  { kind: "image", src: "/students-flying/001.webp", alt: "WindChasers student" },
  { kind: "video", vimeoId: "1191450781" },
  { kind: "video", vimeoId: "1191450782" },
  { kind: "image", src: "/students-flying/Shreyas.webp", alt: "Shreyas" },
  { kind: "video", vimeoId: "1191450783" },
  { kind: "image", src: "/students-flying/Shreyas 1.webp", alt: "Shreyas in cockpit" },
  { kind: "image", src: "/students-flying/Sudeep.webp", alt: "Sudeep" },
  { kind: "image", src: "/students-flying/Sudeep1.webp", alt: "Sudeep flying" },
  { kind: "video", vimeoId: "1191451980" },
  { kind: "video", vimeoId: "1191451981" },
  { kind: "image", src: "/students-flying/Madhu.webp", alt: "Madhu" },
  { kind: "video", vimeoId: "1191451984" },
  { kind: "image", src: "/students-flying/Madhu 1.webp", alt: "Madhu flying" },
  { kind: "video", vimeoId: "1191475154" },
  { kind: "image", src: "/students-flying/Vinay.webp", alt: "Vinay" },
  { kind: "video", vimeoId: "1191475156" },
  { kind: "image", src: "/students-flying/Vinaly Flt=ying.webp", alt: "Vinay flying" },
  { kind: "video", vimeoId: "1191475157" },
  { kind: "image", src: "/students-flying/MOhithan Graduation.jpg", alt: "Mohithan graduation" },
  { kind: "image", src: "/students-flying/Mohithan Graduation 1.webp", alt: "Mohithan graduation" },
  { kind: "video", vimeoId: "1191483930" },
];

const SIMULATOR_VIMEO_IDS = ["1191485284", "1191485533"];

// Unused for now: 1191486085 (student in classroom footage, reserve for a future section)

const testimonialGallery: GalleryItem[] = [
  { kind: "video", vimeoId: "1191521721" },
  { kind: "video", vimeoId: "1150072244" },
  { kind: "video", vimeoId: "1150072000" },
  { kind: "video", vimeoId: "1150070765" },
  { kind: "video", vimeoId: "1150070605" },
  { kind: "video", vimeoId: "1150070400" },
  { kind: "video", vimeoId: "1150071458" },
  { kind: "video", vimeoId: "1150071201" },
  { kind: "video", vimeoId: "1150072494" },
  { kind: "video", vimeoId: "1150070211" },
  { kind: "video", vimeoId: "1150069889" },
];

const steps = [
  {
    n: "01",
    title: "Eligibility",
    body: "12th pass with Physics and Maths. The non-negotiable starting point for your flying career.",
  },
  {
    n: "02",
    title: "Paperwork First",
    body: "Class 1 medical and Computer Number from DGCA. We assist with the bureaucracy so you stay focused.",
  },
  {
    n: "03",
    title: "Ground School",
    body: "Five DGCA theory papers, in-house at our Bengaluru campus. Master the science before the skill.",
  },
  {
    n: "04",
    title: "Flight Training",
    body: "200 hours minimum at DGCA-approved partner FTOs across India, USA, Canada, NZ, or Australia.",
  },
  {
    n: "05",
    title: "Final Checks",
    body: "RTR(A), English Language Proficiency, and the CPL flight test. The ultimate demonstration of your proficiency.",
  },
  {
    n: "06",
    title: "Your CPL",
    body: "DGCA-issued Commercial Pilot License. You're no longer a student. You're a Captain.",
  },
];

const whyCards = [
  {
    icon: Award,
    label: "Faculty",
    title: "Commercial pilot instructors",
    body: "Thousands of cockpit hours. Active and ex-airline captains who teach what they actually fly.",
    image: "/why-windchasers/instructors.webp",
  },
  {
    icon: Globe,
    label: "Global",
    title: "DGCA-approved partners",
    body: "Flight training at approved FTOs in India or partner schools in USA, Canada, NZ, Australia.",
    image: "/facility/WC2.webp",
  },
  {
    icon: Wallet,
    label: "Flexible",
    title: "Built around your goal",
    body: "Your path. Your budget. India, abroad, or a mix. We do not over-promise.",
    image: "/facility/WC3.webp",
  },
  {
    icon: Headphones,
    label: "Support",
    title: "End-to-end support",
    body: "Loan documentation, visa, accommodation, post-CPL placement. We do not drop you halfway.",
    image: "/facility/WC4.webp",
  },
  {
    icon: Plane,
    label: "Simulator",
    title: "Industry-grade simulators",
    body: "Train on the equipment you'll see in real airline cockpits, not toy software.",
    image: "/brand/image.webp",
    tint: true,
  },
  {
    icon: Receipt,
    label: "Pricing",
    title: "Honest pricing",
    body: "Full cost breakdown upfront. No surprise add-ons. Real graduates flying today.",
    image: "/facility/WC6.webp",
  },
];

const team = [
  {
    name: "Sumaiya Ali",
    role: "Founder & CEO",
    bio: "Founded WindChasers in 2024 to give parents and aspiring pilots an honest path to the cockpit.",
    image: "/team/Sumaiya Ali.webp",
    offset: false,
  },
  {
    name: "Rida Maryam Ali",
    role: "Managing Director",
    bio: "Trained commercial pilot. Brings aviation discipline and strategic leadership to every cohort.",
    image: "/team/Rida Ali.webp",
    offset: true,
  },
  {
    name: "Hemanth Kumar R",
    role: "Chief Ground Instructor · B737NG Type-Rated",
    bio: "CPL holder, ATPL-cleared aeronautical engineer. Five years guiding students through DGCA exams.",
    image: "/team/Hemanth.webp",
    offset: false,
  },
  {
    name: "Rohan Hibare",
    role: "Ground Instructor · CPL",
    bio: "Makes complex aviation concepts exam-ready through clear, methodical instruction.",
    image: "/team/Rohan.webp",
    offset: true,
  },
  {
    name: "Navaneeth Nagendra",
    role: "Senior Ground Instructor",
    bio: "Eight years in aviation training across Aeronautical, Maintenance, and Industrial Engineering. Builds robust academic foundations aligned with the DGCA syllabus.",
    image: "/team/Navneeth.webp",
    offset: false,
  },
];

export default function PilotTraining() {
  const [showAirplaneModal, setShowAirplaneModal] = useState(false);

  return (
    <div className={`${manrope.variable} bg-background text-on-surface`}>
      {/* Section 1: Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 overflow-hidden">
          <iframe
            className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none"
            src="https://player.vimeo.com/video/1160946921?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            title="Aviation Background"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(19,19,19,0.4) 0%, rgba(19,19,19,1) 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl px-6 text-center space-y-8 pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]"
          >
            You. In the cockpit. <br />
            <span className="text-primary italic">Inside two years.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
          >
            No false promises. Real costs. Real guidance. DGCA-aligned ground
            training, with DGCA-approved flying partners.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex justify-center pt-4"
          >
            <a
              href="#path-selection"
              className="bg-primary hover:bg-primary-container text-on-primary px-10 md:px-12 py-4 md:py-5 rounded-lg font-bold text-lg transition-all flex items-center group"
              style={{ boxShadow: "0 0 20px rgba(197,165,114,0.2)" }}
            >
              Choose Your Path
              <PlaneTakeoff className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>

        {/* Trust strip pinned to bottom of hero */}
        <div className="absolute bottom-0 w-full bg-surface-container-low/80 backdrop-blur-sm border-t border-outline-variant/10 py-6 md:py-8 z-10">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-nowrap md:flex-wrap items-center md:justify-center gap-6 md:gap-12 overflow-x-auto md:overflow-visible text-on-surface-variant text-[11px] md:text-sm font-bold tracking-[0.15em] uppercase [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              "100+ Successful Pilots",
              "DGCA Approved Curriculum",
              "Commercial Pilot Instructors",
            ].map((t) => (
              <span key={t} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Path Selection — Airplane / Helicopter (mirrors homepage) */}
      <section id="path-selection" className="relative min-h-screen flex flex-col md:flex-row">
        {/* Airplane Half */}
        <button
          type="button"
          onClick={() => setShowAirplaneModal(true)}
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen group cursor-pointer overflow-hidden text-left"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/PIlot Traingin  v1.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-background/80" />

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center transform group-hover:scale-105 transition-transform duration-300"
            >
              <h2 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tighter">
                Airplane
              </h2>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
                <span className="bg-white/10 backdrop-blur-sm border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary tracking-wider">
                  PPL
                </span>
                <span className="bg-white/10 backdrop-blur-sm border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary tracking-wider">
                  CPL
                </span>
                <span className="bg-white/10 backdrop-blur-sm border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary tracking-wider">
                  ATPL
                </span>
              </div>
              <span className="inline-block bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors">
                Explore Path
              </span>
            </motion.div>
          </div>

          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
        </button>

        {/* Helicopter Half */}
        <Link
          href="/helicopter"
          className="relative w-full md:w-1/2 min-h-[50vh] md:min-h-screen group overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: "url('/images/Helicopter Training.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-900/40 to-background/80" />

          <div className="absolute inset-0 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-center transform group-hover:scale-105 transition-transform duration-300"
            >
              <h2 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-tighter">
                Helicopter
              </h2>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
                <span className="bg-white/10 backdrop-blur-sm border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary tracking-wider">
                  PHPL
                </span>
                <span className="bg-white/10 backdrop-blur-sm border border-primary/40 rounded-full px-4 py-1.5 text-sm font-bold text-primary tracking-wider">
                  CHPL
                </span>
              </div>
              <span className="inline-block bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors">
                Explore Path
              </span>
            </motion.div>
          </div>

          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
        </Link>

        {/* Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-primary/30 hidden md:block" />
      </section>

      {/* Airplane Path Modal */}
      <AirplanePathModal
        isOpen={showAirplaneModal}
        onClose={() => setShowAirplaneModal(false)}
      />

      {/* Chapter 3: The Honest Part */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block mb-6">
              WindChasers
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter leading-[1.05] mb-8">
              Building India&apos;s <br />
              <span className="text-primary italic">next generation</span> of pilots.
            </h2>
            <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed font-light">
              <p>Most academies sell you a dream. We give you a plan.</p>
              <p>
                Ground classes here in Bengaluru, flight training at our partner
                schools in India or abroad. Class 1 medical first. DGCA theory
                exams next. Flight hours come after.{" "}
                <span className="text-white">
                  If you can do the work, we can show you the road.
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-[353px] md:w-[391px] flex-shrink-0"
          >
            <VimeoReel
              vimeoId="1191491477"
              title="Recent WindChasers event"
              aspect="portrait"
              zoom={1.5}
              className="w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Chapter 4: Students Flying Gallery (images + Vimeo) */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-surface-container-lowest border-y border-outline-variant/10">
        <StudentsFlyingGallery
          items={flyingGallery}
          eyebrow="In the Cockpit"
          title="They started exactly where you are."
          subtitle="Photos and clips from students in active training."
          variant="stitch"
        />
      </section>

      {/* Chapter 5: The Journey */}
      <section className="py-24 md:py-32 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tighter mb-6">
              From here to your CPL. <br className="hidden md:block" />
              Step by step.
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {steps.map((s, i) => {
              const starCount = Math.min(i + 1, 5);
              const isFinal = i === steps.length - 1;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`group relative p-8 md:p-10 rounded-3xl border transition-colors duration-500 ${
                    isFinal
                      ? "bg-gradient-to-br from-primary/15 to-primary/5 border-primary/50 hover:border-primary"
                      : "bg-surface-container-low border-outline-variant/10 hover:border-primary/30"
                  }`}
                >
                  <div
                    className={`absolute top-5 right-5 flex items-center gap-0.5 px-2.5 py-1 rounded-full border ${
                      isFinal
                        ? "bg-primary/20 border-primary/60"
                        : "bg-surface-container border-outline-variant/30"
                    }`}
                    aria-label={`${starCount} star${starCount > 1 ? "s" : ""}`}
                  >
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                          idx < starCount
                            ? "text-primary fill-primary"
                            : "text-outline-variant/40"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-primary font-[family-name:var(--font-headline)] font-black text-5xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">
                    {s.n}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{s.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{s.body}</p>
                  {isFinal && (
                    <p className="mt-4 text-primary text-xs font-bold uppercase tracking-[0.2em]">
                      Captain rank
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chapter 6: The Captains of Your Career */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-20"
          >
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block mb-4">
              Elite Mentorship
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tighter leading-none mb-6">
              The Captains of Your Career.
            </h2>
            <p className="text-on-surface-variant text-lg md:text-xl lg:text-2xl max-w-3xl font-light">
              Mentorship from pilots who have spent thousands of hours in the
              cockpit and decades in the industry.
            </p>
          </motion.div>

          <CardCarousel cardWidthClass="w-[80%] sm:w-[48%] md:w-[31%] lg:w-[23%]">
            {team.map((t, i) => (
              <Link key={t.name} href="/team" className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative bg-surface-container-low rounded-3xl border border-outline-variant/10 overflow-hidden transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 cursor-pointer"
                >
                  <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 relative">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="(min-width: 1024px) 23vw, (min-width: 768px) 48vw, 80vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:p-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent">
                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-1">
                      {t.name}
                    </h3>
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                      {t.role}
                    </p>
                    <p className="text-on-surface-variant text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {t.bio}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </CardCarousel>
        </div>
      </section>

      {/* Chapter 7: Why WindChasers */}
      <section className="py-24 md:py-32 bg-surface-container-lowest">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tighter mb-6">
              What you actually get <br className="hidden md:block" />
              with us.
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </motion.div>

          <CardCarousel cardWidthClass="w-[80%] sm:w-[60%] md:w-[42%] lg:w-[32%]">
            {whyCards.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative h-full bg-surface-container-low border border-outline-variant/20 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="relative h-44 md:h-48 w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                        "tint" in c && c.tint ? "saturate-150 contrast-110" : ""
                      }`}
                    />
                    {"tint" in c && c.tint && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent mix-blend-overlay" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/40 to-transparent" />
                    <span className="absolute top-4 left-4 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {c.label}
                    </span>
                  </div>

                  <div className="p-7 pt-6">
                    <div className="w-12 h-12 mb-5 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </CardCarousel>
        </div>
      </section>

      {/* Chapter 7b: Real Journeys testimonials */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-background border-y border-outline-variant/10">
        <StudentsFlyingGallery
          items={testimonialGallery}
          eyebrow="Proof in Flight"
          title="They were where you are. Now they fly."
          subtitle="Real students. Their own words."
          variant="stitch"
        />
      </section>

      {/* Chapter 8: Train at our Campus (Simulator + Facility) */}
      <section className="py-24 md:py-32 bg-surface-container-lowest border-y border-outline-variant/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block mb-5">
              Train at our Campus
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-tight mb-6">
              Try the cockpit <span className="text-primary italic">before you commit.</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-light">
              Visit our Bengaluru campus, sit in the simulator, fly a session
              with one of our instructors. The fastest way to know if pilot
              training is right for you.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-7 py-3.5 rounded-lg font-bold text-base md:text-lg transition-all"
              style={{ boxShadow: "0 0 20px rgba(197,165,114,0.2)" }}
            >
              Book a Demo Session
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-3 gap-3 md:gap-4"
          >
            {SIMULATOR_VIMEO_IDS.map((id, i) => (
              <div
                key={id}
                className="relative aspect-[9/16] rounded-xl md:rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container-low"
              >
                <iframe
                  src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1`}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`Simulator footage ${i + 1}`}
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-16 md:mt-24">
          <ImageCarousel
            images={[
              "/facility/WC1.webp",
              "/facility/WC2.webp",
              "/facility/WC3.webp",
              "/facility/WC4.webp",
              "/facility/WC5.webp",
              "/facility/WC6.webp",
              "/facility/WC7.webp",
            ]}
            title="Inside the Bengaluru campus."
            subtitle="Saturdays and Sundays between 11 AM and 4 PM. Bring your parents."
          />
          <div className="text-center pt-4 pb-4 px-6">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-on-primary px-7 py-3.5 rounded-lg font-bold text-base md:text-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book a campus visit
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: The Aptitude Test */}
      <section className="py-24 md:py-32 bg-primary-container text-on-primary-container">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-none">
              Are you actually a fit for pilot training?
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 leading-relaxed font-medium">
              Twenty questions. Three minutes. You&apos;ll know where you stand
              on qualification, aptitude, and readiness. No fluff. No false
              rating. If you score well, we&apos;ll line up a counsellor call.
              If you don&apos;t, we&apos;ll tell you that too.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center bg-black text-white px-10 md:px-12 py-5 md:py-6 rounded-xl font-bold text-lg md:text-xl hover:bg-stone-900 transition-all group"
            >
              Take the Pilot Assessment Test
              <HelpCircle className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-black/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl">
              <div className="space-y-6">
                <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-black" />
                </div>
                <div className="text-sm font-bold uppercase tracking-widest text-black/60">
                  Question 15 of 20
                </div>
                <h4 className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] font-bold">
                  Quickly calculate fuel burn at 12 GPH for 3 hours 15 minutes.
                </h4>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div className="p-4 bg-black/5 border border-black/10 rounded-xl font-bold">
                    36 Gallons
                  </div>
                  <div className="p-4 bg-black text-white rounded-xl font-bold">
                    39 Gallons
                  </div>
                  <div className="p-4 bg-black/5 border border-black/10 rounded-xl font-bold">
                    42 Gallons
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-background border-t border-outline-variant/10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter">
              Two ways to <span className="text-primary italic">start.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group bg-primary-container/15 border border-primary/40 rounded-3xl p-8 md:p-10 hover:border-primary transition-all"
            >
              <Sparkles className="w-10 h-10 text-primary mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Take the Pilot Assessment Test now
              </h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Three minutes. Free. Honest score, honest next step.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-7 py-3.5 rounded-lg font-bold transition-colors group/btn"
              >
                Take the Pilot Assessment Test
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 md:p-10 hover:border-primary/40 transition-all"
            >
              <Phone className="w-10 h-10 text-primary mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Talk to a counsellor
              </h3>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Real conversation. No sales pitch.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary px-7 py-3.5 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-colors"
              >
                Book a 1-on-1 call
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
