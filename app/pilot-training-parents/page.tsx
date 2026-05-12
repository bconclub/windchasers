"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  Plane,
  Home,
  Users,
  Briefcase,
  Banknote,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import VideoCarousel from "@/components/VideoCarousel";
import ImageCarousel from "@/components/ImageCarousel";

const videos = [
  { id: "1", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150072244" },
  { id: "2", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150072000" },
  { id: "3", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150070765" },
  { id: "4", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150070605" },
  { id: "5", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150070400" },
  { id: "6", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150071458" },
  { id: "7", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150071201" },
  { id: "8", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150072494" },
  { id: "9", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150070211" },
  { id: "10", thumbnail: "", embedUrl: "https://player.vimeo.com/video/1150069889" },
];

const numbers = [
  { label: "Total investment", value: "Up to ₹80 lakh" },
  { label: "Timeline", value: "18 to 24 months" },
  { label: "Loan coverage", value: "Up to ₹40 lakh", sub: "HDFC Credila · Avanse · Auxilo" },
  { label: "Starting age", value: "17 to begin", sub: "18 for CPL issuance" },
  { label: "Eligibility", value: "12th pass", sub: "with Physics and Maths" },
];

const whyCards = [
  {
    title: "Commercial pilot instructors",
    body: "Thousands of cockpit hours between them. Helicopter, multi-engine, A320, B737 type-rated.",
    iconPath:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    title: "25:1 student-teacher ratio",
    body: "Live interactive classrooms. Mock tests every week. Counsellor check-ins monthly.",
    iconPath:
      "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
  {
    title: "DGCA-aligned flight partners",
    body: "Training at approved FTOs in India, or partner schools in the USA, Canada, NZ, Australia, South Africa.",
    iconPath:
      "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Honest pricing",
    body: "Full cost breakdown upfront. No surprise add-ons, no last-minute fees.",
    iconPath:
      "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "End-to-end support",
    body: "Loan documentation, visa, accommodation, post-CPL placement. We don't drop your child halfway.",
    iconPath:
      "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    title: "Real graduates",
    body: "Our students are flying with Indian and international airlines. Ask their families yourself.",
    iconPath:
      "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

const services = [
  {
    icon: Banknote,
    title: "Education loan assistance",
    body: "Documentation, bank coordination, EMI structure.",
  },
  {
    icon: GraduationCap,
    title: "Enrollment guidance",
    body: "Course selection, school matching in India or abroad.",
  },
  {
    icon: FileText,
    title: "Visa documentation",
    body: "For students training overseas.",
  },
  {
    icon: Plane,
    title: "Immigration support",
    body: "End-to-end for international training.",
  },
  {
    icon: Home,
    title: "Accommodation",
    body: "Verified housing near training facilities.",
  },
  {
    icon: HeartHandshake,
    title: "Continuous guidance",
    body: "Monthly counsellor check-ins through training and post-CPL placement.",
  },
];

export default function PilotTrainingParents() {
  return (
    <div className="bg-dark text-white">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <iframe
            className="absolute top-1/2 left-[70%] md:left-1/2 w-[150vw] h-[84.375vw] min-h-[150vh] min-w-[266.66vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src="https://player.vimeo.com/video/1160946921?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&loop=1&background=1"
            title="Aviation Background"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: "none" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/90 to-dark z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 text-center pt-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-2 mb-8"
          >
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs uppercase tracking-[0.2em] font-semibold">
              For parents · No dream-selling
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] text-white max-w-5xl mx-auto"
          >
            Your child wants to be a pilot. <br className="hidden md:block" />
            <span className="text-gold">Here&apos;s what that actually means.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/75 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Cost, timeline, faculty, financing. No dream-selling. No false
            promises. We tell you exactly what you&apos;re signing up for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/demo"
              className="bg-gold text-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors inline-flex items-center gap-2 group"
              style={{ boxShadow: "0 0 20px rgba(197,165,114,0.2)" }}
            >
              Book a 1-on-1 with a counsellor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/pricing"
              className="bg-transparent border-2 border-gold text-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold hover:text-dark transition-colors inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download the cost guide
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 text-center text-sm md:text-base">
              <div className="text-white/80">
                <span className="text-gold font-semibold">100+</span> Successful Pilots
              </div>
              <div className="text-white/80">
                <span className="text-gold font-semibold">DGCA</span> Approved Curriculum
              </div>
              <div className="text-white/80">
                Founded by a parent who was once <span className="text-gold font-semibold">in your seat</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 - Real numbers */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-4">
              Real numbers, upfront
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Before anything else, <br className="hidden md:block" />
              <span className="text-gold">the numbers.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mb-10">
            {numbers.map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/40 rounded-xl p-6 transition-all hover:-translate-y-1"
              >
                <div className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold">
                  {n.label}
                </div>
                <div className="text-xl md:text-2xl font-bold text-gold mb-1 leading-tight">
                  {n.value}
                </div>
                {n.sub && (
                  <div className="text-xs text-white/60 mt-2">{n.sub}</div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white/75 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            That&apos;s what pilot training costs and takes. Anyone telling you
            faster or cheaper is <span className="text-gold font-semibold">selling, not training.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 3 - Founder's note */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-gold/10 to-transparent border-l-4 border-gold rounded-r-2xl p-8 md:p-14"
          >
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-4">
              From one parent to another
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-8">
              I almost gave up trying to find <br className="hidden md:block" />
              an <span className="text-gold">honest path</span> for my daughter.
            </h2>

            <div className="space-y-5 text-white/75 text-lg leading-relaxed">
              <p>
                When my daughter Rida said she wanted to be a pilot, I didn&apos;t
                know where to start.
              </p>
              <p>
                I made calls. I got conflicting answers. I met people who
                promised the world and others who quietly took deposits with no
                clear plan. It was exhausting. I almost gave up trying to find an
                honest path for her.
              </p>
              <p>
                That&apos;s why WindChasers exists. To give parents like you and
                aspiring pilots like Rida the one thing the industry doesn&apos;t
                naturally offer: <span className="text-white font-semibold">a straight answer.</span>
              </p>
              <p>
                We tell you what it costs. We tell you what it takes. We tell you
                when your child is ready, and when they need more time. We are
                not the cheapest. We are not the flashiest. We are the academy
                that won&apos;t waste your money or your child&apos;s two years.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="text-gold font-semibold">Sumaiya Ali</div>
              <div className="text-white/60 text-sm">Founder and CEO, WindChasers</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4 - Honest career picture */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-4">
              The honest career picture
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Is this a <span className="text-gold">real career?</span>
            </h2>
            <p className="text-white/60 text-lg mt-4">
              Yes, with caveats every parent should hear.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-accent-dark to-dark border-2 border-gold/30 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white">The opportunity</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                Indian aviation is hiring. Air India, IndiGo, Vistara, and AIX
                are bulk-hiring co-pilots through 2030. Starting pay is
                competitive and grows substantially with experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-accent-dark to-dark border-2 border-white/15 rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white/80" />
                </div>
                <h3 className="text-xl font-bold text-white">The catch</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                First job after license typically takes six to eighteen months.
                Type rating may be needed. Some students build hours abroad
                before their first Indian airline job.
              </p>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white/70 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mt-10"
          >
            We don&apos;t promise placement. We do provide{" "}
            <span className="text-gold font-semibold">placement assistance, interview prep,</span>{" "}
            and a counsellor who stays with your child past their CPL.
          </motion.p>
        </div>
      </section>

      {/* Section 5 - Faculty + Why WindChasers */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-4">
              The faculty and process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Who teaches your child, <br className="hidden md:block" />
              <span className="text-gold">and how.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-8 rounded-xl bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gold/10 group-hover:bg-gold/20 transition-colors border border-gold/20">
                  <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.iconPath} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gold transition-colors">
                  {c.title}
                </h3>
                <p className="text-white/60 leading-relaxed">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 - Financing */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-4">
              Financing your child&apos;s training
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-8">
              How families <span className="text-gold">actually pay</span> for this.
            </h2>
            <div className="space-y-5 text-white/75 text-lg leading-relaxed">
              <p>
                Education loans cover up to <span className="text-gold font-semibold">₹40 lakh</span>{" "}
                through three partners we work with: HDFC Credila, Avanse, and
                Auxilo. EMI starts after training completes. We help your family
                with the documentation.
              </p>
              <p>
                Many families combine loan + savings + sponsorship from extended
                family. The full cost is rarely paid in one go.
              </p>
              <p className="text-white">
                A counsellor will walk you through what works for your specific
                situation in your 1-on-1 call.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {["HDFC Credila", "Avanse", "Auxilo"].map((bank) => (
                <span
                  key={bank}
                  className="px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold"
                >
                  {bank}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7 - Six support services */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-semibold block mb-4">
              The six support services
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              What we do <span className="text-gold">beyond training.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative bg-dark border-t-2 border-gold rounded-xl p-7 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
                >
                  <span className="absolute -top-3 left-6 bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-7 h-7 text-gold mb-5 mt-2" />
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white/75 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            You don&apos;t drop your child off. <span className="text-gold font-semibold">We don&apos;t drop them either.</span>
          </motion.p>
        </div>
      </section>

      {/* Section 8 - Testimonials */}
      <section className="bg-accent-dark">
        <VideoCarousel
          videos={videos}
          title="Hear it from families who've been through this."
          subtitle="Real students and their families. Their own words."
        />
      </section>

      {/* Section 9 - Campus visit */}
      <section className="bg-dark">
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
          title="Come visit. Meet us in person."
          subtitle="Kothanur campus, open Saturdays and Sundays 11 AM to 4 PM. Meet the team. See the simulators. Ask hard questions. Bring your child."
        />
        <div className="text-center pb-20 px-6">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-gold text-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            Book a campus visit
          </Link>
        </div>
      </section>

      {/* Section 10 - Final CTA */}
      <section className="py-20 md:py-28 px-6 lg:px-8 bg-accent-dark">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              The next step is a <br className="hidden md:block" />
              <span className="text-gold">real conversation.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/40 rounded-2xl p-8 md:p-10 hover:border-gold transition-all"
            >
              <Users className="w-10 h-10 text-gold mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Book a 1-on-1 with a counsellor
              </h3>
              <p className="text-white/75 mb-8 leading-relaxed">
                We&apos;ll walk through your child&apos;s situation, costs that
                apply to you, and what your next 18 months would look like.
              </p>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 bg-gold text-dark px-7 py-3.5 rounded-lg font-semibold hover:bg-gold/90 transition-colors group/btn"
              >
                Book a 1-on-1 call
                <Phone className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group bg-gradient-to-br from-accent-dark to-dark border-2 border-white/15 rounded-2xl p-8 md:p-10 hover:border-gold/40 transition-all"
            >
              <FileText className="w-10 h-10 text-gold mb-5" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Get the parent cost guide
              </h3>
              <p className="text-white/75 mb-8 leading-relaxed">
                Full breakdown emailed to your WhatsApp.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-gold text-gold px-7 py-3.5 rounded-lg font-semibold hover:bg-gold hover:text-dark transition-colors"
              >
                <Download className="w-5 h-5" />
                Download cost guide
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
