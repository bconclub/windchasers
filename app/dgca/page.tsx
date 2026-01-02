"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import WhyChooseUsCarousel from "@/components/WhyChooseUsCarousel";
import PilotJourneyTimeline from "@/components/PilotJourneyTimeline";
import PricingFormModal from "@/components/PricingFormModal";
import DGCASubjectsGrid from "@/components/DGCASubjectsGrid";

export default function DGCAPage() {
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    document.title = "DGCA Ground Classes | WindChasers Aviation Academy";
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            DGCA <span className="text-gold">Ground Classes</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Complete CPL theory training. Clear all DGCA exams before you start flying. Structured curriculum with experienced instructors.
          </p>
        </div>

        {/* 6 DGCA Subjects - Expandable Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gold">
            6 DGCA Subjects Breakdown
          </h2>
          <div className="max-w-6xl mx-auto">
            <DGCASubjectsGrid />
          </div>
        </div>

        {/* Why Choose Us */}
        <WhyChooseUsCarousel />

        {/* 8-Step Journey */}
        <PilotJourneyTimeline />

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gold">Course Pricing</h2>
          
          {/* Package Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
            {/* Package 1 - 4 Subjects */}
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/50 rounded-lg p-8 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gold mb-2">Package 1</h3>
                  <p className="text-white/80 text-lg font-semibold">4 Subjects</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gold mb-1">₹2.35 Lacs</div>
                  <div className="text-white/60 text-sm">+ GST</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white/80">Duration: 3-4 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/80">Mode: Offline & Online</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gold mb-3">Subjects:</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Air Navigation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Air Regulations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Aviation Meteorology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>RTR</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowPricingModal(true)}
                  className="w-full bg-gold text-dark py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
                >
                  Get Pricing
                </button>
              </div>
            </div>

            {/* Package 2 - 6 Subjects (Complete DGCA) */}
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/50 rounded-lg p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gold text-dark px-3 py-1 rounded-full text-xs font-bold">
                POPULAR
              </div>
              <div className="relative z-10">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gold mb-2">Package 2</h3>
                  <p className="text-white/80 text-lg font-semibold">6 Subjects (Complete DGCA)</p>
                </div>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gold mb-1">₹2.75 Lacs</div>
                  <div className="text-white/60 text-sm">+ GST</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white/80">Duration: 4-5 months</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/80">Mode: Offline & Online</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gold mb-3">Subjects:</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Air Navigation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Air Regulations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Aviation Meteorology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Technical General</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>Technical Specific</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-gold mr-2">•</span>
                      <span>RTR</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setShowPricingModal(true)}
                  className="w-full bg-gold text-dark py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
                >
                  Get Pricing
                </button>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-dark border-2 border-gold/30 rounded-lg p-8 md:p-12 mb-8 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gold">What's Included</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">CFI & experienced instructors</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">In-depth curriculum</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">Text books</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">WindChasers study materials</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">Mock exams + assignments</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">Flying school guidance</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">Counseling support</span>
              </div>
              <div className="flex items-start">
                <span className="text-gold mr-3">✓</span>
                <span className="text-white/80">Uniform</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-accent-dark border border-white/10 rounded-lg p-8 md:p-12 max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gold">Terms & Conditions</h3>
            <div className="grid md:grid-cols-2 gap-6 text-white/80">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span><strong className="text-white">Registration:</strong> ₹20,000 (non-refundable, 1 month validity)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span><strong className="text-white">Location:</strong> Kothanur, New Airport Road, Bangalore</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span><strong className="text-white">No refunds</strong> on installments</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span><strong className="text-white">Exam fees:</strong> Student pays</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span><strong className="text-white">GST:</strong> 18% extra</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold mr-3">•</span>
                    <span><strong className="text-white">Payment:</strong> RTGS/NEFT/UPI/Cash</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ with Exam Format */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gold">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            {/* FAQ Items */}
            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">1. Do I need 12th pass to join DGCA classes?</h3>
              <p className="text-white/80">
                Yes. Physics and Math required. If you don't have them, bridge courses available.
              </p>
            </div>

            <div className="bg-accent-dark border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gold mb-3">2. What's the difference between 4 and 6 subject packages?</h3>
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
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo?source=dgca"
              className="bg-gold text-dark px-12 py-5 rounded-lg font-semibold text-lg hover:bg-gold/90 transition-colors inline-block"
            >
              Book a Demo
            </Link>
            <Link
              href="/assessment"
              className="bg-white/10 text-white px-12 py-5 rounded-lg font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20 inline-block"
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
        />
      </div>
    </div>
  );
}
