"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Mail, Phone, BookOpen, DollarSign, Award } from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const [formType, setFormType] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    document.title = "Thank You | WindChasers Aviation Academy";
    
    const type = searchParams?.get("type");
    const data = searchParams?.get("data");
    
    setFormType(type);
    
    if (data) {
      try {
        setFormData(JSON.parse(decodeURIComponent(data)));
      } catch (e) {
        console.error("Error parsing form data:", e);
      }
    }
  }, [searchParams]);

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

      case "assessment":
        return {
          title: "Assessment Submitted Successfully!",
          icon: Award,
          message: "Thank you for completing the Pilot Aptitude Test. We've received your results and will provide personalized guidance.",
          details: formData ? (
            <div className="space-y-4">
              <div className="bg-accent-dark/50 rounded-lg p-4 border border-gold/30">
                <h3 className="text-lg font-bold text-gold mb-3">Your Assessment Results</h3>
                <div className="space-y-2 text-white/80">
                  {formData.score !== undefined && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold" />
                      <span><strong>Total Score:</strong> {formData.score} / 100</span>
                    </div>
                  )}
                  {formData.tier && (
                    <div className="flex items-center gap-2">
                      <span className="text-gold">⭐</span>
                      <span><strong>Tier:</strong> {formData.tier}</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-white/70 text-sm">
                Our team will review your assessment and contact you with personalized recommendations.
              </p>
            </div>
          ) : null,
          nextSteps: [
            "Check your email for detailed results",
            "Our team will contact you with personalized guidance",
            "Consider booking a demo to discuss your results",
          ],
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

  return (
    <div className="pt-32 pb-20 px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 mb-6">
            <IconComponent className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {content.title}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            {content.message}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-accent-dark/50 border-2 border-gold/30 rounded-lg p-8 mb-8"
        >
          {content.details}
          
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
        </motion.div>

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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-white/60 mb-4">Need immediate assistance?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:info@windchasers.com" className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors">
              <Mail className="w-5 h-5" />
              <span>info@windchasers.com</span>
            </a>
            <a href="tel:+919876543210" className="flex items-center gap-2 text-white/80 hover:text-gold transition-colors">
              <Phone className="w-5 h-5" />
              <span>+91 98765 43210</span>
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

