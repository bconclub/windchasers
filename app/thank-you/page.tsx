"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Mail, Phone, BookOpen, DollarSign, Award, Radio, Users, Sparkles } from "lucide-react";
import { trackMetaLead } from "@/lib/metaPixel";

/** `type` query values that represent a captured lead — fire Meta Pixel `Lead` once per visit */
const META_LEAD_FORM_TYPES = new Set(["atc", "open-house", "summercamp"]);

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [formType, setFormType] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const type = searchParams?.get("type");
    const data = searchParams?.get("data");

    setFormType(type);

    if (data) {
      try {
        setFormData(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Error parsing form data:", e);
      }
    } else {
      setFormData(null);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!formType) return;
    if (formType === "atc") {
      document.title = "Thank You | ATC | WindChasers Aviation Academy";
    } else if (formType === "open-house") {
      document.title = "Thank You | Open House | WindChasers Aviation Academy";
    } else if (formType === "summercamp") {
      document.title = "Thank You | Summer Camp | WindChasers Aviation Academy";
    } else {
      document.title = "Thank You | WindChasers Aviation Academy";
    }
  }, [formType]);

  useEffect(() => {
    if (typeof window === "undefined" || !formType || !META_LEAD_FORM_TYPES.has(formType)) return;
    const dedupeKey = `${formType}:${window.location.pathname}${window.location.search}`;
    const w = window as Window & { __wcMetaLeadSent?: Set<string> };
    w.__wcMetaLeadSent ??= new Set();
    if (w.__wcMetaLeadSent.has(dedupeKey)) return;
    w.__wcMetaLeadSent.add(dedupeKey);

    if (formType === "atc") {
      trackMetaLead({
        content_name: "ATC Eligibility",
        content_category: "atc",
      });
    } else if (formType === "open-house") {
      trackMetaLead({
        content_name: "Open House Registration",
        content_category: "open_house",
      });
    } else if (formType === "summercamp") {
      trackMetaLead({
        content_name: "Summer Camp Registration",
        content_category: "summer_camp",
      });
    }
  }, [formType]);

  const getTierInfo = (tier: string) => {
    const tiers = {
      premium: {
        label: "Premium Tier",
        headline: "You're Flight-Ready",
        subhead: "Your score qualifies you for immediate enrollment. Book your consultation now.",
        color: "text-gold",
        bgColor: "bg-gold/20",
        borderColor: "border-gold",
        description: "Premium tier: You're in the top 15% of applicants. Let's map your fastest path to the cockpit.",
        nextSteps: [
          "Detailed breakdown sent to your email",
          "Our team calls within 24 hours",
        ],
        ctaText: "Book a Demo",
        ctaLink: "/booking",
        rankPercentile: 15,
      },
      strong: {
        label: "Strong Tier",
        headline: "You're Qualified",
        subhead: "Your score shows strong potential. Let's discuss the right training path for you.",
        color: "text-green-400",
        bgColor: "bg-green-400/20",
        borderColor: "border-green-400",
        description: "",
        nextSteps: [
          "Email breakdown sent",
          "Consultation call within 48 hours",
        ],
        ctaText: "Book a Demo",
        ctaLink: "/booking",
        rankPercentile: 30,
      },
      moderate: {
        label: "Moderate Tier",
        headline: "You Have Potential",
        subhead: "Your score shows gaps we can address. Book a consultation to explore your options.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/20",
        borderColor: "border-yellow-400",
        description: "",
        nextSteps: [
          "Email analysis sent",
          "Team reaches out within 72 hours",
        ],
        ctaText: "Book a Demo",
        ctaLink: "/booking",
        rankPercentile: 50,
      },
      "not-ready": {
        label: "Not Ready Yet",
        headline: "Build Your Foundation",
        subhead: "Let's work together to strengthen your foundation and prepare you for pilot training.",
        color: "text-red-400",
        bgColor: "bg-red-400/20",
        borderColor: "border-red-400",
        description: "Don't worry! Building a strong foundation first will set you up for success. We can help guide you.",
        nextSteps: [
          "Email analysis sent",
          "Team reaches out within 72 hours",
        ],
        ctaText: "Book a Demo",
        ctaLink: "/booking",
        rankPercentile: 70,
      },
    };
    return tiers[tier as keyof typeof tiers] || tiers.moderate;
  };

  const getFormContent = () => {
    switch (formType) {
      case "booking":
        return {
          title: "Demo Session Booked Successfully!",
          icon: Calendar,
          message: "Thank you for booking a demo session with us. We're excited to show you what WindChasers has to offer.",
          details: formData ? (
            <div className="space-y-4">
              <div className="bg-accent-dark/50 rounded-lg p-4 border border-gold/30">
                <h3 className="text-lg font-bold text-gold mb-3">Your Booking Details</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span><strong>Date:</strong> {formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString() : "TBD"}</span>
                  </div>
                  {formData.preferredTime && (
                    <div className="flex items-center gap-2">
                      <span className="text-gold">⏰</span>
                      <span><strong>Time:</strong> {formData.preferredTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gold">📱</span>
                    <span><strong>Type:</strong> {formData.demoType === "online" ? "Online Consultation" : "Campus Visit"}</span>
                  </div>
                  {formData.interest && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gold" />
                      <span><strong>Interest:</strong> {
                        formData.interest === "dgca_ground" ? "DGCA Ground Classes" :
                        formData.interest === "pilot_training_abroad" ? "Pilot Training Abroad" :
                        formData.interest === "helicopter_license" ? "Helicopter License" :
                        "Other"
                      }</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-white/70 text-sm">
                Our team will contact you shortly to confirm your booking and provide further details.
              </p>
            </div>
          ) : null,
          nextSteps: [
            "Check your email for a confirmation message",
            "Our team will call you within 24 hours to confirm",
            "Prepare any questions you'd like to ask during the demo",
          ],
        };

      case "atc":
        return {
          title: "You’re on the list ATC",
          icon: Radio,
          message:
            "Thanks for checking eligibility for our Air Traffic Controller preparation program. Our team will review your details and reach out shortly.",
          details: (
            <div className="space-y-4">
              {formData && (formData.name || formData.city || formData.qualification) ? (
                <div className="bg-accent-dark/50 rounded-lg p-4 border border-gold/30">
                  <h3 className="text-lg font-bold text-gold mb-3">What we received</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    {formData.name ? (
                      <li>
                        <strong className="text-white/90">Name:</strong> {formData.name}
                      </li>
                    ) : null}
                    {formData.city ? (
                      <li>
                        <strong className="text-white/90">City:</strong> {formData.city}
                      </li>
                    ) : null}
                    {formData.qualification ? (
                      <li>
                        <strong className="text-white/90">Qualification:</strong> {formData.qualification}
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
              <p className="text-white/70 text-sm">Need help now? Chat with us on WhatsApp.</p>
              <a
                href={`https://wa.me/919591004043?text=${encodeURIComponent(
                  "Hi WindChasers, I just submitted the ATC eligibility form and want to chat."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[#1ebe5d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          ),
          nextSteps: [
            "We’ll contact you within 24 hours on the phone number you provided",
            "Have your academic documents ready for the next conversation",
          ],
        };

      case "open-house": {
        const waStudent = "https://chat.whatsapp.com/COsk2RyqhcL8wrh6dn4irg";
        const waParent = "https://chat.whatsapp.com/ChCxl1miiSN1WS2S4oGpAZ";
        const role = formData?.role as string | undefined;
        const waHref = role === "parent" ? waParent : waStudent;
        const waLabel =
          role === "parent" ? "Join the Parent WhatsApp Group" : "Join the Student WhatsApp Group";

        return {
          title: "You’re registered Open House",
          icon: Users,
          message:
            "Thank you for securing your seat for the Pilot Career Open House on April 11, 2026 at 11:30 AM. Join the WhatsApp group below for reminders and venue details.",
          details: (
            <div className="space-y-4">
              {formData && (formData.name || formData.city || formData.role) ? (
                <div className="bg-accent-dark/50 rounded-lg p-4 border border-gold/30">
                  <h3 className="text-lg font-bold text-gold mb-3">Registration summary</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    {formData.name ? (
                      <li>
                        <strong className="text-white/90">Name:</strong> {formData.name}
                      </li>
                    ) : null}
                    {formData.city ? (
                      <li>
                        <strong className="text-white/90">City:</strong> {formData.city}
                      </li>
                    ) : null}
                    {formData.role ? (
                      <li>
                        <strong className="text-white/90">Attending as:</strong>{" "}
                        {formData.role === "parent" ? "Parent / Guardian" : "Student / Aspiring Pilot"}
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-6 py-3.5 font-semibold text-dark transition-colors hover:bg-gold/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                {waLabel}
              </a>
              <p className="text-white/50 text-xs text-center">
                We&apos;ll send reminders and event details in the group.
              </p>
            </div>
          ),
          nextSteps: [
            "Join the WhatsApp group above so you don’t miss updates",
            "Add April 11, 2026 · 11:30 AM to your calendar",
            "Bring a parent if you’re a student (optional but encouraged)",
          ],
        };
      }

      case "summercamp":
        return {
          title: "Registration received Summer Camp",
          icon: Sparkles,
          message:
            "Thank you for registering for Junior Aviators Summer Camp. Our team will send camp details and the payment link via WhatsApp shortly.",
          details: (
            <div className="space-y-4">
              {formData &&
              (formData.parentName || formData.childAge || formData.interest || formData.batch) ? (
                <div className="bg-accent-dark/50 rounded-lg p-4 border border-gold/30">
                  <h3 className="text-lg font-bold text-gold mb-3">What we received</h3>
                  <ul className="space-y-2 text-white/80 text-sm">
                    {formData.parentName ? (
                      <li>
                        <strong className="text-white/90">Parent:</strong> {formData.parentName}
                      </li>
                    ) : null}
                    {formData.childAge ? (
                      <li>
                        <strong className="text-white/90">Child age group:</strong> {formData.childAge}
                      </li>
                    ) : null}
                    {formData.interest ? (
                      <li>
                        <strong className="text-white/90">Interest:</strong> {formData.interest}
                      </li>
                    ) : null}
                    {formData.batch ? (
                      <li>
                        <strong className="text-white/90">Batch:</strong> {formData.batch}
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
              <p className="text-white/70 text-sm">
                Questions? WhatsApp or call us from the site header; we&apos;re happy to help before camp starts.
              </p>
            </div>
          ),
          nextSteps: [
            "Watch for a WhatsApp message with confirmation and payment steps",
            "Check your email (including spam) for follow-up from our team",
            "Note your preferred batch when you complete payment",
          ],
        };

      case "assessment":
        if (!formData) {
          return {
            title: "Assessment Submitted Successfully!",
            icon: Award,
            message: "Thank you for completing the Pilot Aptitude Test.",
            details: (
              <div className="pt-4">
                <Link
                  href="/booking"
                  className="block w-full bg-gold text-dark py-5 rounded-lg font-bold text-lg hover:bg-gold/90 transition-colors text-center shadow-lg shadow-gold/20"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-dark border-2 border-gold text-white py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-center mt-3"
                >
                  Back to Home
                </Link>
              </div>
            ),
            nextSteps: [],
            isAssessment: false,
          };
        }
        
        const tierInfo = getTierInfo(formData.tier || "moderate");
        const score = formData.score || 0;
        const rankPercentile = tierInfo.rankPercentile || 50;
        
        // Ensure CTA text is always "Book a Demo"
        tierInfo.ctaText = "Book a Demo";
        
        return {
          title: "",
          icon: Award,
          message: "",
          details: (
            <div className="space-y-8">
              {/* Big Score Display */}
              <div className="text-center">
                <div className={`text-8xl md:text-9xl font-bold mb-4 ${tierInfo.color}`}>
                  {score}
                  <span className="text-4xl md:text-5xl text-white/60">/150</span>
                </div>
              </div>

              {/* Tier Badge with Gold Accent */}
              <div className="flex justify-center">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${tierInfo.bgColor} ${tierInfo.borderColor} border-2 relative`}>
                  <div className="absolute -left-1 -top-1 w-3 h-3 bg-gold rounded-full"></div>
                  <span className={`text-xl font-bold ${tierInfo.color}`}>
                    {tierInfo.label}
                  </span>
                </div>
              </div>

              {/* Headline and Subhead */}
              <div className="text-center space-y-3">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {tierInfo.headline}
                </h2>
                <p className="text-xl text-white/70 max-w-2xl mx-auto">
                  {tierInfo.subhead}
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="bg-accent-dark/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Your Ranking</span>
                  <span className="text-sm font-semibold text-gold">Top {rankPercentile}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - rankPercentile}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-xs text-white/50 mt-2 text-center">
                  You rank higher than {100 - rankPercentile}% of applicants
                </p>
              </div>

              {/* Numbered Next Steps */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gold mb-4">Next Steps</h3>
                <div className="space-y-3">
                  {tierInfo.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 text-white/80">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                        <span className="text-gold font-bold">{index + 1}</span>
                      </div>
                      <span className="pt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Line Description */}
              {tierInfo.description && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-white/80 text-center">{tierInfo.description}</p>
                </div>
              )}

              {/* Single Prominent CTA Button */}
              <div className="pt-4 space-y-3">
                <Link
                  href={tierInfo.ctaLink}
                  className="block w-full bg-gold text-dark py-5 rounded-lg font-bold text-lg hover:bg-gold/90 transition-colors text-center shadow-lg shadow-gold/20"
                >
                  {tierInfo.ctaText}
                </Link>
                <Link
                  href="/"
                  className="block w-full bg-dark border-2 border-gold text-white py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ),
          nextSteps: [],
          isAssessment: true,
          tierInfo: tierInfo,
        };

      case "pricing":
        return {
          title: "Thank You for Your Interest!",
          icon: DollarSign,
          message: "Thank you for requesting pricing information. You now have access to detailed pricing for our courses.",
          details: formData ? (
            <div className="space-y-4">
              <div className="bg-accent-dark/50 rounded-lg p-4 border border-gold/30">
                <h3 className="text-lg font-bold text-gold mb-3">What&apos;s Next?</h3>
                <p className="text-white/80">
                  You can now view detailed pricing information for {formData.source === "dgca" ? "DGCA Ground Classes" : 
                  formData.source === "helicopter" ? "Helicopter License" : 
                  formData.source === "abroad" ? "Pilot Training Abroad" : "our courses"}.
                </p>
              </div>
            </div>
          ) : null,
          nextSteps: [
            "Review the detailed pricing information",
            "Book a demo to discuss your options",
            "Contact us if you have any questions",
          ],
        };

      default:
        return {
          title: "Thank You!",
          icon: CheckCircle,
          message: "Thank you for your submission. We'll get back to you soon.",
          details: null,
          nextSteps: [
            "Check your email for confirmation",
            "Our team will contact you shortly",
          ],
        };
    }
  };

  const content = getFormContent();
  const IconComponent = content.icon;
  const isAssessment = (content as any).isAssessment;

  return (
    <div className="pt-32 pb-20 px-6 lg:px-8 min-h-screen">
      <div className={`mx-auto ${isAssessment ? "max-w-4xl" : "max-w-3xl"}`}>
        {!isAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 mb-6">
              <IconComponent className="w-10 h-10 text-gold" />
            </div>
            <h1 className="text-[2.5rem] md:text-5xl font-bold mb-4 text-white">
              {content.title}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {content.message}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: isAssessment ? 0 : 0.2 }}
          className={`${isAssessment ? "" : "bg-accent-dark/50 border-2 border-gold/30 rounded-lg p-8 mb-8"}`}
        >
          {content.details}
          
          {!isAssessment && content.nextSteps.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gold mb-4">Next Steps</h3>
              <ul className="space-y-3">
                {content.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {!isAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {formType === "booking" && (
              <Link
                href="/assessment"
                className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 text-center"
              >
                Take Assessment
              </Link>
            )}
            {formType === "atc" && (
              <>
                <Link
                  href="/demo"
                  className="bg-gold text-dark px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors text-center"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/atc"
                  className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 text-center"
                >
                  ATC program
                </Link>
              </>
            )}
            {formType === "open-house" && (
              <Link
                href="/open-house"
                className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 text-center"
              >
                Open House details
              </Link>
            )}
            {formType === "summercamp" && (
              <Link
                href="/summercamp"
                className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 text-center"
              >
                Summer Camp page
              </Link>
            )}
            {formType === "pricing" && (
              <Link
                href="/pricing"
                className="bg-gold text-dark px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors text-center"
              >
                View Pricing
              </Link>
            )}
            <Link
              href="/"
              className="bg-dark border-2 border-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-center"
            >
              Back to Home
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">Need immediate assistance?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:aviators@windchasers.in" className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors">
              <Mail className="w-5 h-5" />
              <span>aviators@windchasers.in</span>
            </a>
            <a href="tel:+919591004043" className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors">
              <Phone className="w-5 h-5" />
              <span>+91 95910 04043</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gold/20 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-6 bg-white/10 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

