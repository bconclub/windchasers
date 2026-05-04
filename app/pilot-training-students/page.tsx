import type { Metadata } from "next";
import Script from "next/script";
import { Manrope } from "next/font/google";
import {
  ArrowRight,
  Globe,
  BadgeCheck,
  GraduationCap,
  PlaneTakeoff,
  CheckCircle,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pilot Training for Students | WindChasers Aviation Academy",
  description:
    "Why settle for grounded? Elite flight training with international exposure, AI-driven ground school, and Type Rating placement. From Bengaluru to the world.",
};

const PATHS = [
  {
    code: "PPL",
    label: "Private Pilot License",
    blurb: "The foundation of your aviation journey. Fly for pleasure or start your career.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDHljZP3ypAootIGahDgWTRCIW41l0fL6IFv4bifNm-kZC0hR1PfPEicr4mNwyYOKVS4SxWDLFUa6-vinhJUoOqWOCfyYVzHKqNxApX2BR9aKpwkZj88rssyhyqdm0NEniuYM2tUp0l20uIQ7yzaiJS98grZlLTQ6ufg9SASBm0nu5NDfFyUG8-2485a358ONu2geEIW4TVc-UQe5Tj5ZBiiwuZqkksbQLxezzM4LEXmTWEwGKP1xkntaPLz5-iECmsANSxrvMCLtk0",
  },
  {
    code: "CPL",
    label: "Commercial Pilot License",
    blurb: "Professional grade training for those ready to lead in the commercial skies.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRNxzGpb1LRhPin8py-mDBNlgyJ_SnAL_J82qB-h_NU9Cp4OgMrxtZGCucuhF-6FcO0fqRwEW98XWmtqptAYQaKZCvQjit4AtTMwIBRwOjtWmqqrXWjx917WVZjYn2E9CePR__LuuuvoQBqE8oMvf7xFw6SObmVx7c9Be89P9V5IIm2QHO1Nfoo1j1DI_7MqBkP9qaCbJIfLoSIxPbGoLnHgCjwdfUzKkIn_ZAYIfrmR8iQdsIghTkbDLRUtbtYiVbenCh1VE3Cm-j",
  },
  {
    code: "ATPL",
    label: "Airline Transport License",
    blurb: "The pinnacle of pilot certification. Commands of heavy transport aircraft.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8DFWBP4BdZPHI7J_xHx1tVmpV3hyiT5gkk6IZmFCuliIpntApQ2R6rIvvrFcOqipWfFuSLz9bWZE7O62bk17aTfBMOPLLnX9W5tRO8vwTum7Q5Jt72FX0M0VcF_X9-6o3AvlDBkAfvNgy4Bb0ys3_Imn15wUiGiLJ_zXYxSTRwO-V0WwOS59QRdy9Y_5EgNt3NvBodC8N8fw7MT_NcnkgFfCyXvwGThW1rmNkOtMLHpw1pKwlwN0vLiz_pNdJkVAmTuBu4ed70xoT",
  },
  {
    code: "HPL",
    label: "Helicopter Pilot License",
    blurb: "Master vertical flight. Specialized training for rotary-wing excellence.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-DAkJJAJ7CwRKtxEHpSfbRCfNXZyS79QHt4c_c9zVDx7mebNbEgvtcH5wpVqgZbWQ4FHirymkm6h8E2aSf_DsXEJJnKcuaCrAN4M8ldlj5OZkwgSCYyGVZ-COmN7-z3Oq2gzRf3vbWun4KyMsbe0Ku6Omv-r8qbRl9Xb_TtJuVmn13OaJY_L4H7IcOmehCUXf6jlIoX7A4y4nyc-rHb9WawXVh9mNQWhAcn-qyBO8dVQ2ptFsg-PBzoDfQXMPJ35IxUAx9ycFvJYG",
  },
];

const STEPS = [
  {
    n: "01",
    icon: GraduationCap,
    title: "Ground School Mastery",
    body: "Conquer the DGCA exams with our AI-driven mock tests and structured ground classes that translate complex theory into cockpit intuition.",
  },
  {
    n: "02",
    icon: PlaneTakeoff,
    title: "Global Wings",
    body: "Fast-track your 200+ flight hours at top-tier international bases. Experience diverse weather, terrains, and advanced ATC environments.",
  },
  {
    n: "03",
    icon: CheckCircle,
    title: "Airline Ready",
    body: "Finish with a Type Rating and dedicated placement assistance. We bridge the gap between having a license and having a career.",
  },
];

export default function PilotTrainingStudents() {
  return (
    <div className={`${manrope.variable} bg-background text-on-surface font-sans`}>
      {/* PROXe widget - scoped to this page only (test deployment) */}
      <Script
        src="https://proxe.windchasers.in/api/widget/embed.js"
        strategy="afterInteractive"
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover opacity-60"
            alt="modern jet cockpit at night with glowing amber instrumentation"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvW2yE49-Wr6aDmYoZahopYzURTgwbGMRibK5lVk2JmDfSDoqvWkyaCtg2KXzOi6dKKMPSTB4m7XeNV8BsviNCeG1TddFo-ZcWKIL_xK3REy1VkJcuTzfI6u_hgI95esEkJ0EbM0AjlnwDP3iQP37rFLMuPvbww24Ylhe9BPgubJt2IyOjfrAlkIWGFfG4nVb0SznbEv9C9llgEIVeJDr0teihuzjUIkPHSkt7w2dAyrecqLPkHc-VTbgInXb0qzm-yfEKoVpk7Qt0"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(19,19,19,0) 0%, rgba(19,19,19,1) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-24">
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-surface-container-highest rounded-full text-xs font-bold tracking-[0.2em] text-primary uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Elite Flight Training</span>
            </div>
            <h1 className="font-[family-name:var(--font-headline)] text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-tight">
              Why Settle for <br />
              <span className="text-primary italic">Grounded?</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-2xl max-w-2xl leading-relaxed font-light">
              Most academies treat you like a roll number. At Wind Chasers, we
              treat you like a Captain in training. Engineered for the future of
              aviation.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
              <a
                href="/demo"
                className="bg-primary hover:bg-primary-container text-on-primary px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-lg transition-all flex items-center justify-center group"
                style={{ boxShadow: "0 0 20px rgba(197,165,114,0.15)" }}
              >
                Start My Journey
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/dgca"
                className="border border-outline-variant text-white px-8 md:px-10 py-4 md:py-5 rounded-lg font-bold text-lg hover:bg-white/5 transition-all text-center"
              >
                Explore Programs
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                <span className="text-xs uppercase tracking-widest text-on-surface-variant">
                  Next Batch Starts
                </span>
                <span className="text-primary font-bold">15 NOV 2024</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Global Access</h4>
                    <p className="text-xs text-on-surface-variant">
                      USA, Canada, NZ Training
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">DGCA Certified</h4>
                    <p className="text-xs text-on-surface-variant">
                      100% Exam Pass Rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Flight Paths */}
      <section className="py-24 md:py-32 bg-surface-container-lowest">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block mb-4">
                Choose Your Journey
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-headline)] font-bold text-white tracking-tighter">
                Elite Flight Paths.
              </h2>
            </div>
            <p className="text-on-surface-variant max-w-sm md:text-right leading-relaxed">
              Select the certification that matches your aviation ambitions.
              From private mastery to commercial command.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PATHS.map((p) => (
              <div
                key={p.code}
                className="group relative overflow-hidden rounded-3xl h-[460px] md:h-[500px] flex flex-col justify-end p-8 border border-outline-variant/20 hover:border-primary/50 transition-colors duration-500"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
                  alt={p.label}
                  src={p.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-[family-name:var(--font-headline)] font-bold text-white">
                    <span className="block text-4xl md:text-5xl font-black mb-1">
                      {p.code}
                    </span>
                    <span className="text-sm uppercase tracking-wider font-semibold opacity-90">
                      {p.label}
                    </span>
                  </h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2">
                    {p.blurb}
                  </p>
                  <a
                    href="/demo"
                    className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    Explore Path
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps to Your CPL */}
      <section className="py-24 md:py-32 bg-background border-y border-outline-variant/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-[family-name:var(--font-headline)] font-extrabold text-white tracking-tighter mb-6">
              3 Steps to Your CPL
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 relative">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.n} className="relative group">
                  <div className="text-[8rem] md:text-[12rem] font-[family-name:var(--font-headline)] font-black text-white/5 absolute -top-20 md:-top-32 -left-4 md:-left-8 pointer-events-none">
                    {s.n}
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover opacity-30"
            alt="aerial view from a cockpit overlooking a sea of clouds at sunset"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCby0NpMGFsmbfC6aGDpD6rdcKF73_QmpM-TkiovfkjQC83CejR6ruqvIEObm1g_xobwvmnOXRfennGJ2Rv2pNuu03tw5iuzpDN8SMoNjX3OrJc9P1WyRVfOBXTMJJQB8DFaKSUdGNsZ0euNyzgUyPt53EzXFgfTRcJ10L5wWO6XuRWzM5rQTnkqcObB5zZp7HEh3wxCw4IP5K6buqm2uVMHUHyqIgTZxoKGn0t9dKVHS9cKpCtMtKh1I3IKhQL7rANcQtjKGVk7Nf6"
          />
          <div className="absolute inset-0 bg-stone-950/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center space-y-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-[family-name:var(--font-headline)] font-extrabold text-white tracking-tighter">
            Ready to Earn Your Wings?
          </h2>
          <p className="text-xl md:text-2xl text-on-surface-variant font-light max-w-2xl mx-auto">
            Don&apos;t let your dream stay on standby. Join the next batch and
            start your flight training today.
          </p>
          <div className="pt-10">
            <a
              href="/demo"
              className="inline-flex items-center bg-primary hover:bg-primary-container text-on-primary px-12 md:px-16 py-5 md:py-6 rounded-full font-bold text-lg md:text-xl transition-all scale-110 hover:scale-105 active:scale-95 group"
              style={{ boxShadow: "0 0 20px rgba(197,165,114,0.15)" }}
            >
              Start My Journey
              <PlaneTakeoff className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="mt-8 text-on-surface-variant/60 text-sm uppercase tracking-[0.2em]">
              Next intake: November 15th &bull; Limited seats available
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
