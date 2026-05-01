import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import {
  ArrowRight,
  Globe,
  BadgeCheck,
  GraduationCap,
  PlaneTakeoff,
  CheckCircle,
  Star,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Pilot Training for Students | WindChasers Aviation Academy",
  description:
    "Start your pilot training journey as a student. DGCA certified, international exposure, and expert mentors. From Bengaluru to the world.",
};

export default function PilotTrainingStudents() {
  return (
    <div className={`${manrope.variable} bg-background text-on-surface font-sans`}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover opacity-60"
            alt="dramatic wide angle shot of a modern jet cockpit at night"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaJvmGCC6fazmArP7_W1S-qCrREJePXSPsOLiZId65JZaJ5pPUBMM0pQHrJaMqUK7bqo4oVGB6famt8SKLXMRQqYX-yKBZ1Tj4g3g1NYjE7rmHSwGoqsncLNbw2nz1jMN2fz6_V94xTMs1b3s6QEnHLX5eQgdJXtcXmx0f59OUnP1Oxxb-zJ4-N_0S1FOsAYhS-lhzH_JqV9dZIWrciiNIwdTTcr7bzay5wz60k51CxfGFSGjHona5_meTZRoizTtAgTN2g-5bUjO2"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(19, 19, 19, 0) 0%, rgba(19, 19, 19, 1) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1400px] px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-24">
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
                style={{ boxShadow: "0 0 20px rgba(197, 165, 114, 0.15)" }}
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

      {/* The Vibe Section */}
      <section className="py-24 md:py-32 bg-surface-container-lowest">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block mb-4">
                The Experience
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-headline)] font-bold text-white tracking-tighter">
                Atmospheric Precision.
              </h2>
            </div>
            <p className="text-on-surface-variant max-w-sm md:text-right leading-relaxed">
              We don&apos;t just teach flight; we engineer professional aviators
              through world-class simulators and global exposure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* International Exposure */}
            <div className="group relative overflow-hidden rounded-3xl h-[500px] md:h-[600px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="cinematic view of a small propeller plane flying over a lush mountain landscape"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHljZP3ypAootIGahDgWTRCIW41l0fL6IFv4bifNm-kZC0hR1PfPEicr4mNwyYOKVS4SxWDLFUa6-vinhJUoOqWOCfyYVzHKqNxApX2BR9aKpwkZj88rssyhyqdm0NEniuYM2tUp0l20uIQ7yzaiJS98grZlLTQ6ufg9SASBm0nu5NDfFyUG8-2485a358ONu2geEIW4TVc-UQe5Tj5ZBiiwuZqkksbQLxezzM4LEXmTWEwGKP1xkntaPLz5-iECmsANSxrvMCLtk0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent p-8 md:p-10 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] font-bold text-white mb-4">
                  International Exposure
                </h3>
                <p className="text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Train where the world flies. Gain 200+ hours in the world&apos;s
                  most beautiful skies across USA, Canada, and NZ.
                </p>
              </div>
            </div>

            {/* Modern Simulators */}
            <div className="group relative overflow-hidden rounded-3xl h-[500px] md:h-[600px] md:mt-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="ultra-realistic flight simulator cockpit"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRNxzGpb1LRhPin8py-mDBNlgyJ_SnAL_J82qB-h_NU9Cp4OgMrxtZGCucuhF-6FcO0fqRwEW98XWmtqptAYQaKZCvQjit4AtTMwIBRwOjtWmqqrXWjx917WVZjYn2E9CePR__LuuuvoQBqE8oMvf7xFw6SObmVx7c9Be89P9V5IIm2QHO1Nfoo1j1DI_7MqBkP9qaCbJIfLoSIxPbGoLnHgCjwdfUzKkIn_ZAYIfrmR8iQdsIghTkbDLRUtbtYiVbenCh1VE3Cm-j"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent p-8 md:p-10 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] font-bold text-white mb-4">
                  Modern Simulators
                </h3>
                <p className="text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Master the Airbus A320 and Boeing 737 platforms before you ever
                  step into a heavy metal cockpit.
                </p>
              </div>
            </div>

            {/* Expert Mentors */}
            <div className="group relative overflow-hidden rounded-3xl h-[500px] md:h-[600px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="senior airline captain mentoring a young cadet"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSV7Z4Jjdc2G9YL0UeI4fBMMcMgUT0X9DMnuT7K2RhH8bm3wLI-5Pqn9KssEVs3cEb60n9qhOkusFm--CMXSfozHvqnvj5DofnecEpXEsBF7Ayn_6ZYClCdSaqigg_THPTvsnYLXlnbVpKIuZ4y5ZGS5OYFoLGC02K578Z6rFxqNYysvejYjHlXTSJ_sO3rDRjr1bAtISxbr8xrVrcIghEohcQtO30Pe0Fe2FZheqpWNBIpTF-8gJpu1-3Yo8Oh5nhpEid8cN7HxoI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent p-8 md:p-10 flex flex-col justify-end">
                <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-headline)] font-bold text-white mb-4">
                  Expert Mentors
                </h3>
                <p className="text-on-surface-variant leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Learn from ex-Air Force and Senior Airline Captains who bring
                  thousands of real-world flight hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Path Section */}
      <section className="py-24 md:py-32 bg-background border-y border-outline-variant/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-[family-name:var(--font-headline)] font-extrabold text-white tracking-tighter mb-6">
              3 Steps to Your CPL
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 relative">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-[8rem] md:text-[12rem] font-[family-name:var(--font-headline)] font-black text-white/5 absolute -top-20 md:-top-32 -left-4 md:-left-8 pointer-events-none">
                01
              </div>
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Ground School Mastery
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Conquer the DGCA exams with our AI-driven mock tests and
                  structured ground classes that translate complex theory into
                  cockpit intuition.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-[8rem] md:text-[12rem] font-[family-name:var(--font-headline)] font-black text-white/5 absolute -top-20 md:-top-32 -left-4 md:-left-8 pointer-events-none">
                02
              </div>
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                  <PlaneTakeoff className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Global Wings</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Fast-track your 200+ flight hours at top-tier international
                  bases. Experience diverse weather, terrains, and advanced ATC
                  environments.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="text-[8rem] md:text-[12rem] font-[family-name:var(--font-headline)] font-black text-white/5 absolute -top-20 md:-top-32 -left-4 md:-left-8 pointer-events-none">
                03
              </div>
              <div className="space-y-6 relative z-10">
                <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Airline Ready</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Finish with a Type Rating and dedicated placement assistance. We
                  bridge the gap between having a license and having a career.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 md:py-32 bg-surface-container-lowest overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div
                className="relative rounded-[40px] overflow-hidden border-8 border-surface-container-high"
                style={{ boxShadow: "0 0 20px rgba(197, 165, 114, 0.15)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-[400px] md:h-[600px] object-cover"
                  alt="proud young male graduate pilot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA23LF9n_ykaOt2BQ0h0m_5t_lcuA90uIwocZmoInpy4LyC7aKj9hmZQHlRPfTBMFsYe4QjEZCouuB-BDXJvEVc8gI6gUYj13yP-8hnRMwn6HKclsDtfmOPhPSAqtvSwCt5hqP8G1dVd2y7oC9jzpd8A7LFHjuxy7ev8_3ikpjwb-LffUYJ2frobTKeaMCeKyZ5PKVXnVzAMnMlmml3eVEV7PQpoouXnFF-FdeJbZyxdWvohkOlrgiFYjH7bFzd2QYpGjzJnwO7AeYq"
                />
              </div>
              <div className="absolute -bottom-8 -right-4 md:-right-8 bg-surface-container-highest p-6 md:p-8 rounded-3xl border border-outline-variant/30 max-w-xs shadow-2xl">
                <div className="flex text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <p className="text-sm font-medium text-white italic">
                  &quot;Wind Chasers didn&apos;t just give me a license; they gave
                  me a career.&quot;
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center font-bold text-primary">
                    A
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Aditya</h5>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                      CPL Graduate
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-headline)] font-bold text-white tracking-tighter leading-tight">
                From Bengaluru to the World.
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-lg md:text-xl text-on-surface-variant font-light italic">
                    &quot;I went from wondering if I could do it, to flying solo
                    in New Zealand within 6 months. The mentors here are not just
                    teachers; they are senior captains who care about your
                    future.&quot;
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <div className="text-3xl md:text-4xl font-[family-name:var(--font-headline)] font-bold text-white">
                      1,200+
                    </div>
                    <p className="text-sm text-primary uppercase tracking-widest font-bold mt-1">
                      Flight Hours Logged
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-[family-name:var(--font-headline)] font-bold text-white">
                      98%
                    </div>
                    <p className="text-sm text-primary uppercase tracking-widest font-bold mt-1">
                      Placement Success
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover opacity-30"
            alt="wide scenic aerial view from a cockpit"
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
              style={{ boxShadow: "0 0 20px rgba(197, 165, 114, 0.15)" }}
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
