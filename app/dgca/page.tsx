"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign } from "lucide-react";
import WhyChooseUsCarousel from "@/components/WhyChooseUsCarousel";
import PilotJourneyTimeline from "@/components/PilotJourneyTimeline";
import PricingFormModal from "@/components/PricingFormModal";
import DGCASubjectsGrid from "@/components/DGCASubjectsGrid";
import VideoCarousel from "@/components/VideoCarousel";
import HeroImageCarousel from "@/components/HeroImageCarousel";
import { trackKeyPageView } from "@/lib/analytics";

export default function DGCAPage() {
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    document.title = "DGCA Ground Classes | WindChasers Aviation Academy";
    
    // Track page view
    trackKeyPageView('DGCA Ground Classes');
    
    // Handle scroll to pricing section if hash is present
    if (window.location.hash === "#pricing") {
      setTimeout(() => {
        const pricingSection = document.getElementById("pricing");
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);


  const videos = [
    {
      id: "1",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150072244",
    },
    {
      id: "2",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150072000",
    },
    {
      id: "3",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070765",
    },
    {
      id: "4",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070605",
    },
    {
      id: "5",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070400",
    },
    {
      id: "6",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150071458",
    },
    {
      id: "7",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150071201",
    },
    {
      id: "8",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150072494",
    },
    {
      id: "9",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150070211",
    },
    {
      id: "10",
      thumbnail: "",
      embedUrl: "https://player.vimeo.com/video/1150069889",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            DGCA <span className="text-gold">Ground Classes</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete CPL theory training. Clear all DGCA exams before you start flying. Structured curriculum with experienced instructors.
          </p>
        </div>

        {/* 6 DGCA Subjects - Expandable Grid */}
        <section className="mb-16 py-12 md:py-12 h-[90vh] md:h-auto">
          {/* #region agent log */}
          {typeof window !== 'undefined' && (() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:133',message:'DGCA Subjects section rendering',data:{viewportHeight:window.innerHeight,sectionHeight:'90vh'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{}); return null; })()}
          {/* #endregion */}
          <h2 className="text-3xl font-bold mb-4 md:mb-12 text-center text-gold">
            6 DGCA Subjects Breakdown
          </h2>
          <div className="max-w-6xl mx-auto">
            {/* #region agent log */}
            {(() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:138',message:'Before DGCASubjectsGrid render',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
            {/* #endregion */}
            <DGCASubjectsGrid />
            {/* #region agent log */}
            {(() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:141',message:'After DGCASubjectsGrid render',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
            {/* #endregion */}
          </div>
        </section>

        {/* Why Choose Us */}
        {/* #region agent log */}
        {(() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:145',message:'Before WhyChooseUsCarousel render',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
        {/* #endregion */}
        <WhyChooseUsCarousel />
        {/* #region agent log */}
        {(() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:149',message:'After WhyChooseUsCarousel render',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
        {/* #endregion */}

        {/* 8-Step Journey */}
        <section className="py-16">
          {/* #region agent log */}
          {(() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:153',message:'Before PilotJourneyTimeline render',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
          {/* #endregion */}
          <PilotJourneyTimeline />
        </section>

        {/* Student Video Carousel */}
        {/* #region agent log */}
        {(() => { fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dgca/page.tsx:158',message:'Before VideoCarousel render',data:{videosCount:videos.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{}); return null; })()}
        {/* #endregion */}
        <VideoCarousel
          videos={videos}
          title="Student to Pilot"
          subtitle="Real journeys. Real results."
        />
        {/* Pricing Section - Link to pricing page */}
        <div id="pricing" className="mb-16 scroll-mt-32 text-center">
          <h2 className="text-3xl font-bold mb-8 text-center text-gold">Course Pricing</h2>
          <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
            View detailed pricing information, package options, and what&apos;s included in our DGCA Ground Classes.
          </p>
          <button
            onClick={() => setShowPricingModal(true)}
            className="inline-block bg-gold text-dark px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors cursor-pointer"
          >
            View Pricing Details
          </button>
        </div>

        {/* FAQ with Exam Format */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gold">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            {/* FAQ Items */}
            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">1. Do I need 12th pass to join DGCA classes?</h3>
              <p className="text-white/80">
                Yes. Physics and Math required. If you don&apos;t have them, bridge courses available.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">2. What&apos;s the difference between 4 and 6 subject packages?</h3>
              <p className="text-white/80">
                4 subjects: Air Navigation, Air Regulations, Aviation Meteorology, and RTR. Good for helicopter pilots.<br />
                6 subjects: Complete DGCA for airplane CPL - includes Technical General and Technical Specific in addition to the 4 subjects.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">3. Can I pay in installments?</h3>
              <p className="text-white/80">
                Yes. ₹20,000 registration (non-refundable). Rest in installments. No refunds once paid.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">4. What if I fail a subject?</h3>
              <p className="text-white/80">
                Free unlimited revision until you pass. No extra fees.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">5. How tough are DGCA exams?</h3>
              <p className="text-white/80">
                6 papers, 100 marks each. Need 70% to pass. Our pass rate: 95%.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">6. When can I attempt exams?</h3>
              <p className="text-white/80">
                Complete papers within 3 years from first attempt.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">7. Do I need medical before DGCA?</h3>
              <p className="text-white/80">
                Class 2 medical recommended before starting. Class 1 needed before flying.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">8. What after DGCA?</h3>
              <p className="text-white/80">
                Join flight school for CPL training (flying hours + license).
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">9. Online or offline - which is better?</h3>
              <p className="text-white/80">
                Both available. Offline recommended for complex subjects. Online for flexibility.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">10. Is job guaranteed after CPL?</h3>
              <p className="text-white/80">
                No guarantees. We provide airline prep, resume help, interview training. Rest depends on you.
              </p>
            </div>
          </div>

          {/* Exam Format Section */}
          <div className="bg-dark border-2 border-gold/30 rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center text-gold">DGCA Exam Format</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold mb-4 text-gold">Exam Details</h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>6 subjects, each 100 marks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>70% passing marks required</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>Multiple choice questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>All papers within 3 years</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4 text-gold">What You Get</h4>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>Comprehensive study material</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>Regular mock tests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>Doubt clearing sessions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span>Exam registration support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start?</h2>
          <div className="flex justify-center">
            <Link
              href="/assessment?from=dgca"
              className="bg-gold text-dark px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors inline-block"
            >
              Take Assessment
            </Link>
          </div>
        </div>

        {/* Pricing Form Modal */}
        <PricingFormModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          source="dgca"
          onSuccess={() => {
            setShowPricingModal(false);
            window.location.href = "/pricing?source=dgca";
          }}
        />
      </div>

      {/* Pricing Section CTA - Split Hero Layout */}
      <section className="w-full bg-dark border-t-2 border-b-2 border-gold/30 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Heading + Subtext + Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col space-y-6 text-center lg:text-left"
            >
              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex justify-center lg:justify-start"
              >
                <DollarSign className="w-12 h-12 text-gold" />
              </motion.div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-gold"
              >
                Course Pricing & Packages
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-white/80"
              >
                Real numbers. Real transparency. Get complete pricing breakdown 
                for our DGCA Ground Classes - no hidden costs, no surprises.
              </motion.p>

              {/* Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center lg:justify-start"
              >
                <Link
                  href="/pricing?source=dgca"
                  className="inline-block bg-gold text-dark px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors"
                >
                  View Pricing Details
                  <span>→</span>
                </Link>
              </motion.div>

              {/* Trust Line */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-sm text-white/60"
              >
                Join 100+ students who chose honest pricing
              </motion.p>
            </motion.div>

            {/* Right: Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <HeroImageCarousel
                images={[
                  "/images/PIlot Traingin.webp",
                  "/images/PIlot Traingin  v1.webp",
                  "/images/Helicopter Training.webp",
                  "/facility/WC1.webp",
                ]}
                autoRotateInterval={4000}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
