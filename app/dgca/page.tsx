"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import WhyChooseUsCarousel from "@/components/WhyChooseUsCarousel";
import PilotJourneyTimeline from "@/components/PilotJourneyTimeline";
import PricingFormModal from "@/components/PricingFormModal";
import DGCASubjectsGrid from "@/components/DGCASubjectsGrid";
import VideoCarousel from "@/components/VideoCarousel";
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
          <h1 className="text-[2.5rem] md:text-6xl font-bold mb-6 text-white">
            DGCA <span className="text-gold">Ground Classes</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete CPL theory training. Clear all DGCA exams before you start flying. Structured curriculum with experienced instructors.
          </p>
        </div>

        {/* 6 DGCA Subjects - Expandable Grid */}
        <section className="mb-16 py-12 md:py-12 h-[90vh] md:h-auto">
          <h2 className="text-3xl font-bold mb-4 md:mb-12 text-center text-gold">
            6 DGCA Subjects Breakdown
          </h2>
          <div className="max-w-6xl mx-auto">
            <DGCASubjectsGrid />
          </div>
          <div className="text-center mt-16 mb-8">
            <Link
              href="/demo"
              className="inline-block bg-gold text-dark px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors"
            >
              Book a Demo Session
            </Link>
          </div>
        </section>

        {/* Why Choose Us */}
        <div className="mt-16">
          <WhyChooseUsCarousel />
        </div>

        {/* 8-Step Journey */}
        <section className="py-16">
          <PilotJourneyTimeline />
          <div className="text-center mt-12">
            <Link
              href="/demo"
              className="inline-block bg-gold text-dark px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors"
            >
              Book a Demo Session
            </Link>
          </div>
        </section>

        {/* Student Video Carousel */}
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
    </div>
  );
}
