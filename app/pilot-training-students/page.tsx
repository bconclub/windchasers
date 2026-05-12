"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Compass,
  CloudRain,
  Scale,
  Wrench,
  Plane,
  Radio,
  BedDouble,
  Banknote,
  ClipboardList,
  BookOpen,
  Shirt,
  HeartHandshake,
  PlayCircle,
  X,
  Phone,
  Calendar,
  MessageCircle,
  BadgeCheck,
  Award,
  Moon,
  Helicopter,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import StudentLeadForm, { type LeadFormName } from "@/components/StudentLeadForm";
import FacilityLightbox from "@/components/FacilityLightbox";
import { getNextBatchDate } from "@/lib/batch-date";

const TESTIMONIAL_VIDEOS = [
  "https://windchasers.in/wp-content/uploads/2025/01/Testimonial_WCBhoomika.mp4#t=5",
  "https://windchasers.in/wp-content/uploads/2025/11/Student-Flying.mp4",
  "https://windchasers.in/wp-content/uploads/2025/01/Testimonial_WC-Shreyas-1.mp4#t=5",
  "https://windchasers.in/wp-content/uploads/2025/11/Charan.mp4",
];

const FLYING_VIMEO_IDS = [
  "1191450781",
  "1191450782",
  "1191450783",
  "1191451296",
  "1191451981",
  "1191451984",
  "1191451985",
];

const FACILITY_PHOTOS = [
  "/facility/WC1.webp",
  "/facility/WC2.webp",
  "/facility/WC3.webp",
  "/facility/WC4.webp",
  "/facility/WC5.webp",
  "/facility/WC6.webp",
  "/facility/WC7.webp",
];

const CURRICULUM = [
  { icon: Compass, title: "Air Navigation" },
  { icon: CloudRain, title: "Aviation Meteorology" },
  { icon: Scale, title: "Air Regulations" },
  { icon: Wrench, title: "Aircraft Technical" },
  { icon: Plane, title: "Aircraft General" },
  { icon: Radio, title: "Radio Telephony" },
];

const INCLUDED = [
  { icon: BedDouble, title: "Food and Accommodation", body: "Verified housing near campus." },
  { icon: Banknote, title: "Educational loan support", body: "HDFC Credila, Avanse, Auxilo. Up to ₹40 lakh." },
  { icon: ClipboardList, title: "Comprehensive training", body: "5 DGCA papers, mock tests, counsellor check-ins." },
  { icon: BookOpen, title: "Oxford ATPL Books", body: "Standard reference set provided." },
  { icon: Shirt, title: "One Uniform Set", body: "Issued during enrolment." },
  { icon: HeartHandshake, title: "Continuous Guidance", body: "Counsellor support through training and post-CPL." },
];

const PATH_STEPS = [
  {
    n: 1,
    icon: BadgeCheck,
    title: "Eligibility checks",
    body: "12th pass with PCM. Class 1 medical. Computer Number from DGCA to register for theory exams.",
  },
  {
    n: 2,
    icon: BookOpen,
    title: "DGCA ground classes (in-house at Bengaluru)",
    body: "Five theory papers: Air Navigation, Aviation Meteorology, Air Regulations, Aircraft Technical, Aircraft General, Radio Telephony. You clear these with us.",
  },
  {
    n: 3,
    icon: Plane,
    title: "Flight training (at partner FTOs)",
    body: "200 hours minimum. Dual, solo, cross-country, instrument, night. Begins only after theory papers are cleared.",
  },
  {
    n: 4,
    icon: ClipboardList,
    title: "Final certifications",
    body: "RTR(A) license, English Language Proficiency, CPL flight test with a DGCA examiner.",
  },
  {
    n: 5,
    icon: Award,
    title: "Your Commercial Pilot License",
    body: "DGCA issues it. You are a Commercial Pilot.",
  },
];

const PROGRAMS = [
  {
    icon: Plane,
    title: "Private Pilot License (PPL)",
    body: "Ground classes with us, flight training at partner FTOs. For aviation enthusiasts and those starting toward CPL.",
  },
  {
    icon: BadgeCheck,
    title: "Commercial Pilot License (CPL)",
    body: "Our flagship program. Ground in Bengaluru, flying at partner FTOs. The full 18 to 24 month path to your CPL.",
  },
  {
    icon: Award,
    title: "Certified Flight Instructor (CFI)",
    body: "For licensed pilots looking to teach. Build hours while you train others.",
  },
  {
    icon: Moon,
    title: "Night Rating",
    body: "Add night flying authorisation to your CPL. Required for most airline jobs.",
  },
  {
    icon: Compass,
    title: "Multi-Engine Instrument Rating (MEIR)",
    body: "Multi-engine certification with instrument flying. Essential for commercial flying.",
  },
  {
    icon: Helicopter,
    title: "Helicopter Pilot Training",
    body: "Ground with us, flight with helicopter-specialised partner schools. Indian and international tracks available.",
  },
  {
    icon: GraduationCap,
    title: "Diploma in Aviation",
    body: "One-year aviation foundation course. Good for students still deciding on the pilot path.",
  },
];

export default function PilotTrainingStudents() {
  const [modalForm, setModalForm] = useState<LeadFormName | null>(null);
  const [batchLabel, setBatchLabel] = useState<string>("");

  useEffect(() => {
    setBatchLabel(getNextBatchDate().label);
  }, []);

  useEffect(() => {
    if (!modalForm) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalForm]);

  const openModal = (which: LeadFormName) => () => setModalForm(which);

  return (
    <div className="bg-dark text-white">
      {/* Section 1: Hero */}
      <section className="relative min-h-[100vh] md:min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/WC HEro.webp')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/75 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
              WindChasers
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white">
              Your Pilot Journey <br />
              <span className="text-gold">Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed">
              Master DGCA ground classes in Bengaluru. Flight training with our
              DGCA-approved partner schools in India or abroad. Up to ₹80 lakh
              investment. 18 to 24 months.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/assessment"
                className="bg-gold hover:bg-gold/90 text-dark px-7 py-3.5 rounded-lg font-bold text-base md:text-lg inline-flex items-center justify-center gap-2 transition-colors"
                style={{ boxShadow: "0 0 20px rgba(197,165,114,0.2)" }}
              >
                Take the Pilot Aptitude Test
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={openModal("student_modal")}
                className="border-2 border-gold text-gold hover:bg-gold hover:text-dark px-7 py-3.5 rounded-lg font-bold text-base md:text-lg transition-colors"
              >
                Talk to a counsellor
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 hidden md:block"
          >
            <div className="lg:sticky lg:top-24">
              <StudentLeadForm formName="student_hero" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: About */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">
              WindChasers
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
              About Us
            </h2>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8">
              WindChasers is a Bengaluru-based pilot training academy founded by
              Sumaiya Ali in 2024. We run DGCA-aligned ground classes for the
              five CPL theory papers. Flight training is delivered through our
              DGCA-approved partner Flying Training Organisations in India, and
              recognised partner schools abroad. Our wedge is honest: real
              costs, real timelines, no false promises.
            </p>
            <button
              type="button"
              onClick={openModal("student_modal")}
              className="bg-gold hover:bg-gold/90 text-dark font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Mobile-only inline form (form is hidden in hero on mobile) */}
      <section className="md:hidden py-12 px-6 bg-accent-dark">
        <div className="max-w-md mx-auto">
          <StudentLeadForm formName="student_hero" compact />
        </div>
      </section>

      {/* Section 3: Eligibility gate */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              Before You Start
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Quick eligibility check
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-dark border-t-2 border-gold rounded-xl p-7"
            >
              <GraduationCap className="w-9 h-9 text-gold mb-5" />
              <h3 className="text-xl font-bold text-white mb-4">
                Academic requirements
              </h3>
              <ul className="space-y-3 text-white/75">
                <li className="flex gap-3">
                  <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>12th pass with Physics and Mathematics.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>If you did not take PCM in 12th, you can qualify through NIOS before applying.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-dark border-t-2 border-gold rounded-xl p-7"
            >
              <Stethoscope className="w-9 h-9 text-gold mb-5" />
              <h3 className="text-xl font-bold text-white mb-4">
                Age and medical
              </h3>
              <ul className="space-y-3 text-white/75">
                <li className="flex gap-3">
                  <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>Start training at 17.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>CPL is issued at 18.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>Class 1 medical clearance from a DGCA-approved centre.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>ICAO Level 4 English.</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-10"
          >
            <p className="text-white/70 mb-4">
              Not sure if you qualify? Take the 3-minute PAT and we will tell
              you straight.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-dark font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Take the PAT
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 4: The honest path */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              The Path
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              From here to your CPL
            </h2>
          </motion.div>

          <ol className="relative space-y-6 md:space-y-8">
            <div
              aria-hidden="true"
              className="absolute left-6 md:left-7 top-2 bottom-2 w-px bg-gold/30"
            />
            {PATH_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative pl-16 md:pl-20"
                >
                  <div className="absolute left-0 top-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold text-dark flex items-center justify-center font-bold text-lg md:text-xl border-4 border-dark">
                    {s.n}
                  </div>
                  <div className="bg-accent-dark border border-white/10 rounded-xl p-6 md:p-7">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6 text-gold" />
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-white/70 leading-relaxed">{s.body}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Section 5: Comprehensive Curriculum */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              WindChasers
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              Comprehensive Curriculum
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Our DGCA ground program covers all six critical subjects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {CURRICULUM.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group bg-dark border border-white/10 hover:border-gold/50 rounded-xl p-7 transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{c.title}</h3>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              type="button"
              onClick={openModal("student_modal")}
              className="bg-gold hover:bg-gold/90 text-dark font-bold px-7 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              Join Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 6: What's included */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              Inside the DGCA Program
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              What&apos;s included
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {INCLUDED.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative bg-accent-dark border-t-2 border-gold rounded-xl p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-gold mb-5" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 7: Voices of WindChasers (mp4 testimonials) */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              Student Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
              Voices of WindChasers
            </h2>
            <p className="text-lg text-white/70">Real students. Their own words.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
            {TESTIMONIAL_VIDEOS.map((url, i) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-dark border border-white/10"
              >
                <video
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={url} type="video/mp4" />
                </video>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Our students flying (Vimeo) */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              In the Cockpit
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Our students. <span className="text-gold">Actually flying.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {FLYING_VIMEO_IDS.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden bg-accent-dark border border-white/10"
              >
                <iframe
                  src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&dnt=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`Student flying ${i + 1}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Instructors */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              Instructors
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              Who teaches you
            </h2>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8">
              DGCA-aligned training delivered by commercial pilot instructors.
              Multi-engine, A320, B737, helicopter qualified. Faculty profiles
              shared on the counsellor call.
            </p>
            <button
              type="button"
              onClick={openModal("student_modal")}
              className="bg-gold hover:bg-gold/90 text-dark font-bold px-7 py-3.5 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              Book a counsellor call to meet the team
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 10: Our Programs */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              WindChasers Programs
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Our Programs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {PROGRAMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group bg-accent-dark border border-white/10 hover:border-gold/50 rounded-xl p-7 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 11: Our Facility */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              Our Facility
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Inside WindChasers
            </h2>
          </motion.div>

          <FacilityLightbox images={FACILITY_PHOTOS} alt="WindChasers facility" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 bg-dark border border-gold/30 rounded-2xl p-7 md:p-9 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Visit our Kothanur campus
            </h3>
            <p className="text-white/70 mb-6 max-w-xl mx-auto">
              Saturdays and Sundays, 11 AM to 4 PM. Meet the team. See the
              simulators. Ask hard questions.
            </p>
            <button
              type="button"
              onClick={openModal("student_visit")}
              className="bg-gold hover:bg-gold/90 text-dark font-bold px-7 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Book campus visit
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 12: Next Batch */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              DGCA Ground Classes
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Next Batch Starting
            </h2>
            <p className="text-4xl md:text-6xl lg:text-7xl font-bold text-gold leading-none mb-8 min-h-[1.1em]">
              {batchLabel || " "}
            </p>
            <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join our comprehensive DGCA Ground Classes and take the first
              step. Limited cohort sizes. Apply early.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={openModal("student_apply")}
                className="bg-gold hover:bg-gold/90 text-dark font-bold px-8 py-4 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
                style={{ boxShadow: "0 0 20px rgba(197,165,114,0.2)" }}
              >
                Apply for next batch
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://chat.whatsapp.com/B7nQhU9J5IFEWMmC6qLd8V"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-gold text-gold hover:bg-gold hover:text-dark font-bold px-8 py-4 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Join WhatsApp Community
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 13: Final CTA + form */}
      <section className="py-20 md:py-24 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-3">
              Ready?
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Take the next step
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/40 rounded-2xl p-8 md:p-10 hover:border-gold transition-all"
            >
              <ShieldCheck className="w-10 h-10 text-gold mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Take the Pilot Aptitude Test
              </h3>
              <p className="text-white/75 mb-7 leading-relaxed">
                20 questions. 3 minutes. Honest assessment of your fit.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-dark font-bold px-7 py-3 rounded-lg transition-colors"
              >
                Take the PAT
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-dark border-2 border-white/15 hover:border-gold/40 rounded-2xl p-8 md:p-10 transition-all"
            >
              <Phone className="w-10 h-10 text-gold mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Talk to a counsellor
              </h3>
              <p className="text-white/75 mb-7 leading-relaxed">
                Real conversation, no sales pitch.
              </p>
              <button
                type="button"
                onClick={openModal("student_modal")}
                className="inline-flex items-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-dark font-bold px-7 py-3 rounded-lg transition-colors"
              >
                Book a 1-on-1 call
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto">
            <StudentLeadForm formName="student_final" />
          </div>
        </div>
      </section>

      {/* Lead form modal */}
      <AnimatePresence>
        {modalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto"
            onClick={() => setModalForm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl my-8"
            >
              <button
                type="button"
                onClick={() => setModalForm(null)}
                className="absolute -top-12 right-0 md:-right-2 md:-top-2 md:z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <StudentLeadForm formName={modalForm} compact />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
