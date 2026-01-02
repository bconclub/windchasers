"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Users, Book, Headphones, GraduationCap, ClipboardCheck, Shirt, BookOpen, Plane } from "lucide-react";
import PricingFormModal from "@/components/PricingFormModal";
import { hasPricingAccess } from "@/lib/sessionStorage";

function PricingPageContent() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState<string | null>(null);
  const [packageType, setPackageType] = useState<string | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Pricing | WindChasers Aviation Academy";
    const urlSource = searchParams?.get("source");
    const urlPackage = searchParams?.get("package");
    setSource(urlSource);
    setPackageType(urlPackage);
    
    // Check if user has pricing access
    const access = hasPricingAccess();
    setHasAccess(access);
    
    // If no access, show the modal
    if (!access) {
      setShowPricingModal(true);
    }
  }, [searchParams]);

  const content = useMemo(() => {
    if (source === "dgca") {
      if (packageType === "4") {
        return {
          title: "4 Subjects Package - DGCA Ground Classes",
          description: "Complete 4 subjects training with transparent pricing",
          pricing: {
            fullCourse: "₹2.35 Lacs",
            installment: "₹2.35 Lacs",
            perSubject: "₹58,750",
            gst: "+ GST",
          },
          duration: "3-4 months",
          mode: "Offline & Online",
          subjects: [
            "Air Navigation",
            "Air Regulations",
            "Aviation Meteorology",
            "RTR",
          ],
          features: [
            "4 DGCA subjects (comprehensive coverage)",
            "Comprehensive study material & notes",
            "Weekly mock tests & past papers",
            "1:1 doubt clearing sessions",
            "Free unlimited revision access",
            "Performance tracking & analytics",
            "Guest lectures by airline captains",
            "Exam registration support",
          ],
          paymentOptions: [
            "Full payment: ₹2.35 Lacs + GST",
            "Installment plan available (flexible terms)",
          ],
        };
      }
      if (packageType === "6") {
        return {
          title: "6 Subjects Package (Complete DGCA) - Ground Classes",
          description: "Complete DGCA CPL theory training with transparent pricing",
          pricing: {
            fullCourse: "₹2.75 Lacs",
            installment: "₹2.75 Lacs",
            perSubject: "₹45,833",
            gst: "+ GST",
          },
          duration: "4-5 months",
          mode: "Offline & Online",
          subjects: [
            "Air Navigation",
            "Air Regulations",
            "Aviation Meteorology",
            "Technical General",
            "Technical Specific",
            "RTR",
          ],
          features: [
            "All 6 DGCA subjects (400+ hours)",
            "Comprehensive study material & notes",
            "Weekly mock tests & past papers",
            "1:1 doubt clearing sessions",
            "Free unlimited revision access",
            "Performance tracking & analytics",
            "Guest lectures by airline captains",
            "Exam registration support",
          ],
          paymentOptions: [
            "Full payment: ₹2.75 Lacs + GST",
            "Installment plan available (flexible terms)",
          ],
        };
      }
      // Default DGCA pricing (no package specified)
      return {
        pricing: {
          fullCourse: "₹2.75 Lacs",
          installment: "₹2.75 Lacs",
          perSubject: "₹45,833",
          gst: "+ GST",
        },
      };
    }
    
    if (source === "helicopter") {
      return {
        title: "Helicopter License Pricing",
        description: "HPL training with transparent pricing",
        pricing: {
          fullCourse: "₹25,00,000",
          installment: "₹26,00,000",
        },
        features: [
          "Ground school training",
          "40 hours dual instruction",
          "10 hours solo flight",
          "DGCA skill test preparation",
          "License issuance support",
        ],
        paymentOptions: [
          "Full payment upfront: ₹25,00,000 (save ₹1,00,000)",
          "Installment plan: ₹26,00,000 (flexible terms)",
        ],
      };
    }
    
    // Default case
    return {
      title: "Training Program Pricing",
      description: "Transparent pricing for all our training programs",
      programs: [
        {
          name: "DGCA Ground Classes",
          price: "₹1,50,000",
          description: "Complete CPL theory training",
          link: "/pricing?source=dgca",
        },
        {
          name: "Pilot Training Abroad Programs",
          price: "Contact for pricing",
          description: "Training in USA, Canada, Hungary, NZ, Australia, Thailand",
          link: "/pricing?source=abroad",
        },
        {
          name: "Helicopter License",
          price: "₹25,00,000",
          description: "HPL training program",
          link: "/pricing?source=helicopter",
        },
      ],
    };
  }, [source, packageType]);

  return (
    <>
    <div className="pb-8">
      <div className="pt-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Cover Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-[2.5rem] md:text-6xl font-bold mb-6">
              Course Pricing & Packages
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Real numbers. Real transparency. No hidden costs, no surprises
            </p>
          </motion.div>

        {/* Pricing Form Modal */}
        <PricingFormModal
          isOpen={showPricingModal}
          onClose={() => {
            setShowPricingModal(false);
          }}
          onSuccess={() => {
            // Form was successfully submitted, update access state
            setHasAccess(true);
            setShowPricingModal(false);
          }}
          source={source || undefined}
        />

        {/* Pricing Content - Only show if access granted */}
        {hasAccess && (
          <>
            {/* DGCA Pricing Cards Section */}
            {source === "dgca" && !packageType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
              >
                <h2 className="text-3xl font-bold mb-12 text-center text-gold">Course Pricing</h2>
                
                {/* Package Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto">
                  {/* Package 1 - 4 Subjects */}
                  <div className="bg-[#2A2419] border border-gold/30 rounded-xl p-8 relative overflow-hidden flex flex-col h-full">
                    <div className="relative z-10 flex flex-col flex-grow">
                      <div className="mb-6">
                        <h3 className="text-3xl font-bold text-gold mb-2">4 Subjects</h3>
                      </div>
                      
                      <div className="mb-8">
                        <div className="text-5xl md:text-6xl font-bold text-gold mb-2">₹2.35 Lacs</div>
                        <div className="text-gold/70 text-base">+ GST</div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gold">Duration: 3-4 months</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gold">Mode: Offline & Online</span>
                        </div>
                      </div>

                      {/* Accordion for More Details */}
                      <div className="mb-6 flex-grow">
                        <button
                          onClick={() => setExpandedCard(expandedCard === "package1" ? null : "package1")}
                          className="w-full flex items-center justify-between text-left mb-3"
                        >
                          <h4 className="text-lg font-bold text-gold">More Details</h4>
                          <motion.svg
                            className="w-5 h-5 text-gold"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: expandedCard === "package1" ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>
                        <AnimatePresence>
                          {expandedCard === "package1" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div>
                                <h5 className="text-md font-semibold text-gold mb-2">Subjects:</h5>
                                <ul className="space-y-2 text-gold/90">
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
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Link
                        href="/pricing?source=dgca&package=4"
                        className="w-full bg-gold text-dark py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors mt-auto text-center block"
                      >
                        Get Pricing
                      </Link>
                    </div>
                  </div>

                  {/* Package 2 - 6 Subjects (Complete DGCA) */}
                  <div className="bg-[#2A2419] border border-gold/30 rounded-xl p-8 relative overflow-hidden flex flex-col h-full">
                    <div className="absolute top-4 right-4 bg-gold/90 text-[#1A1A1A] px-4 py-1.5 rounded-full text-xs font-bold z-20">
                      POPULAR
                    </div>
                    <div className="relative z-10 flex flex-col flex-grow">
                      <div className="mb-6">
                        <h3 className="text-3xl font-bold text-gold mb-2">6 Subjects</h3>
                        <p className="text-gold text-lg font-semibold">Complete DGCA</p>
                      </div>
                      
                      <div className="mb-8">
                        <div className="text-5xl md:text-6xl font-bold text-gold mb-2">₹2.75 Lacs</div>
                        <div className="text-gold/70 text-base">+ GST</div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gold">Duration: 4-5 months</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gold">Mode: Offline & Online</span>
                        </div>
                      </div>

                      {/* Accordion for More Details */}
                      <div className="mb-6 flex-grow">
                        <button
                          onClick={() => setExpandedCard(expandedCard === "package2" ? null : "package2")}
                          className="w-full flex items-center justify-between text-left mb-3"
                        >
                          <h4 className="text-lg font-bold text-gold">More Details</h4>
                          <motion.svg
                            className="w-5 h-5 text-gold"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: expandedCard === "package2" ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </button>
                        <AnimatePresence>
                          {expandedCard === "package2" && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div>
                                <h5 className="text-md font-semibold text-gold mb-2">Subjects:</h5>
                                <ul className="space-y-2 text-gold/90">
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
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Link
                        href="/pricing?source=dgca&package=6"
                        className="w-full bg-gold text-dark py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors mt-auto text-center block"
                      >
                        Get Pricing
                      </Link>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-8 max-w-6xl mx-auto">
                  <h3 className="text-2xl font-bold mb-8 text-center text-gold">What&apos;s Included</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {/* Card 1: Instructors */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <Users className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">CFI & experienced instructors</span>
                    </div>
                    
                    {/* Card 2: Materials */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <Book className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">WindChasers study materials</span>
                    </div>
                    
                    {/* Card 3: Support */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <Headphones className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">Counseling support</span>
                    </div>
                    
                    {/* Card 4: Curriculum */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <GraduationCap className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">In-depth curriculum</span>
                    </div>
                    
                    {/* Card 5: Exams */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <ClipboardCheck className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">Mock exams + assignments</span>
                    </div>
                    
                    {/* Card 6: Uniform */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <Shirt className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">Uniform</span>
                    </div>
                    
                    {/* Card 7: Textbooks */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">Text books</span>
                    </div>
                    
                    {/* Card 8: Guidance */}
                    <div className="relative backdrop-blur-md bg-white/5 border-b-2 border-gold/50 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-gold transition-colors overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-gold/10 to-transparent opacity-60"></div>
                      <Plane className="w-6 h-6 md:w-7 md:h-7 text-gold flex-shrink-0 relative z-10" />
                      <span className="text-white/90 font-medium text-sm md:text-base relative z-10">Flying school guidance</span>
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
              </motion.div>
            )}

            {source && "pricing" in content && content.pricing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/50 rounded-lg p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                {"duration" in content && content.duration && (
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white/80">Duration: {content.duration}</span>
                  </div>
                )}
                {"mode" in content && content.mode && (
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/80">Mode: {content.mode}</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  {"subjects" in content && content.subjects && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4 text-gold">Subjects Included</h3>
                      <ul className="space-y-2 text-white/80">
                        {content.subjects.map((subject, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-gold mr-2">•</span>
                            <span>{subject}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {content.programs?.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-accent-dark to-dark border-2 border-white/10 hover:border-gold/50 rounded-lg p-8 transition-all duration-300"
              >
                <h3 className="text-2xl font-bold mb-4 text-gold">{program.name}</h3>
                <div className="text-4xl font-bold text-white mb-4">{program.price}</div>
                <p className="text-white/70 mb-6">{program.description}</p>
                <Link
                  href={program.link}
                  className="bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors inline-block w-full text-center"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </motion.div>
            )}

          </>
        )}
        </div>
      </div>
    </div>
    </>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gold/20 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-white/10 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PricingPageContent />
    </Suspense>
  );
}


