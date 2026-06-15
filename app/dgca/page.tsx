"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Manrope } from "next/font/google";
import WhyChooseUsCarousel from "@/components/WhyChooseUsCarousel";
import PilotJourneyTimeline from "@/components/PilotJourneyTimeline";
import DGCASubjectsGrid from "@/components/DGCASubjectsGrid";
import VideoCarousel from "@/components/VideoCarousel";
import { trackKeyPageView } from "@/lib/analytics";
import { setLastVisitedProgram } from "@/lib/sessionStorage";

const manrope = Manrope({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-headline" });

const faqs = [
  { q: "Do I need 12th pass to join DGCA classes?", a: "Yes. Physics and Math required. If you don't have them, bridge courses available." },
  { q: "What's the difference between 4 and 6 subject packages?", a: "4 subjects: Air Navigation, Air Regulations, Aviation Meteorology, and RTR. Good for helicopter pilots.\n6 subjects: Complete DGCA for airplane CPL, includes Technical General and Technical Specific in addition to the 4 subjects." },
  { q: "Can I pay in installments?", a: "Yes. ₹20,000 registration (non-refundable). Rest in installments. No refunds once paid." },
  { q: "What if I fail a subject?", a: "Free unlimited revision until you pass. No extra fees." },
  { q: "How tough are DGCA exams?", a: "6 papers, 100 marks each. Need 70% to pass. Our pass rate: 95%." },
  { q: "When can I attempt exams?", a: "Complete papers within 3 years from first attempt." },
  { q: "Do I need medical before DGCA?", a: "Class 2 medical recommended before starting. Class 1 needed before flying." },
  { q: "What after DGCA?", a: "Join flight school for CPL training (flying hours + license)." },
  { q: "Online or offline, which is better?", a: "Both available. Offline recommended for complex subjects. Online for flexibility." },
  { q: "Is job guaranteed after CPL?", a: "No guarantees. We provide airline prep, resume help, interview training. Rest depends on you." },
];

export default function DGCAPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showDemoBtn, setShowDemoBtn] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.title = "DGCA Ground Classes | WindChasers Aviation Academy";
    trackKeyPageView("DGCA Ground Classes");
    setLastVisitedProgram("dgca_ground");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowDemoBtn(y > 300 && y < lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <div className={`${manrope.variable}`} style={{ backgroundColor: "#131313", color: "#fff" }}>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 text-center overflow-hidden" style={{ backgroundColor: "#131313" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url(/facility/DSC_0492.JPG.webp)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/70 via-[#131313]/80 to-[#131313]" />
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">
            WindChasers · Ground Training
          </span>
          <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl font-extrabold tracking-tighter text-white leading-tight mb-5">
            DGCA{" "}
            <span className="text-[#C5A572] italic">Ground Classes.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Complete CPL theory training. Clear all DGCA exams before you start flying. Structured curriculum with experienced instructors.
          </p>
        </motion.div>
      </section>

      {/* 6 DGCA Subjects */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#0e0e0e" }}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Curriculum</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              6 DGCA Subjects
            </h2>
          </motion.div>
          <div className="max-w-6xl mx-auto h-[90vh] md:h-auto">
            <DGCASubjectsGrid />
          </div>
          <div className="text-center mt-16">
            <Link
              href="/demo"
              className="inline-block bg-[#C5A572] text-[#1A1A1A] px-10 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5"
            >
              Book a Demo Session
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">WindChasers</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Why Choose Us
            </h2>
          </motion.div>
          <WhyChooseUsCarousel />
        </div>
      </section>

      {/* 8-Step Journey */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#0e0e0e" }}>
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">The Path</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Your Journey
            </h2>
          </motion.div>
          <PilotJourneyTimeline />
          <div className="text-center mt-12">
            <Link
              href="/demo"
              className="inline-block bg-[#C5A572] text-[#1A1A1A] px-10 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5"
            >
              Book a Demo Session
            </Link>
          </div>
        </div>
      </section>

      {/* Student Video Carousel */}
      <section className="py-20" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <VideoCarousel videos={videos} title="Student to Pilot" subtitle="Real journeys. Real results." />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: "#131313" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Help</span>
            <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-[#1A1A1A] border-t-2 border-[#C5A572]/40 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-bold text-white">{i + 1}. {faq.q}</span>
                  <span className="text-[#C5A572] shrink-0 mt-0.5">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed whitespace-pre-line border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Floating Demo CTA */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          showDemoBtn ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            const btn = document.querySelector<HTMLElement>('[id*="proxe"], [class*="proxe-launcher"], [class*="widget-launcher"]');
            if (btn) { btn.click(); } else { window.location.href = "/demo"; }
          }}
          className="flex items-center whitespace-nowrap px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-[#C5A572] text-black text-xs md:text-sm font-bold uppercase tracking-wider active:scale-95 transition-all hover:bg-[#d4b885]"
          style={{ boxShadow: "0 4px 24px rgba(197,165,114,0.5)" }}
        >
          Book a Demo Session
        </button>
      </div>
    </div>
  );
}
