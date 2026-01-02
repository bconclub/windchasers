"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function PricingPage() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Pricing | WindChasers Aviation Academy";
    const urlSource = searchParams?.get("source");
    setSource(urlSource);
  }, [searchParams]);

  const getPricingContent = () => {
    switch (source) {
      case "dgca":
        return {
          title: "DGCA Ground Classes Pricing",
          description: "Complete CPL theory training with transparent pricing",
          pricing: {
            fullCourse: "₹1,50,000",
            installment: "₹1,60,000",
            perSubject: "₹28,000",
          },
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
            "Full payment upfront: ₹1,50,000 (save ₹10,000)",
            "Installment plan: ₹1,60,000 (monthly/quarterly)",
            "Subject-wise: ₹28,000 per subject",
          ],
        };
      case "helicopter":
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
      default:
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
              name: "Fly Abroad Programs",
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
    }
  };

  const content = getPricingContent();

  return (
    <div className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {content.title}
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        {source && "pricing" in content && content.pricing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/50 rounded-lg p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gold mb-2">
                  {content.pricing.fullCourse}
                </div>
                <p className="text-white/70 text-lg">Full Course Payment</p>
                {content.pricing.installment && (
                  <p className="text-white/60 text-sm mt-2">
                    Installment Plan: {content.pricing.installment}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">What's Included</h3>
                  <ul className="space-y-3 text-white/80">
                    {"features" in content && content.features?.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-gold mr-3 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Payment Options</h3>
                  <ul className="space-y-3 text-white/80 mb-6">
                    {"paymentOptions" in content && content.paymentOptions?.map((option, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gold mr-3">•</span>
                        <span>{option}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-accent-dark p-6 rounded-lg border border-gold/30">
                    <h4 className="text-lg font-bold mb-3 text-gold">Loan Assistance Available</h4>
                    <p className="text-white/70 text-sm mb-4">
                      We partner with leading financial institutions to help you secure education loans for your pilot training.
                    </p>
                    <ul className="space-y-2 text-white/80 text-sm">
                      <li className="flex items-start">
                        <span className="text-gold mr-2">→</span>
                        <span>Easy loan application process</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">→</span>
                        <span>Competitive interest rates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">→</span>
                        <span>Flexible repayment options</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-white/70">
                Have questions about pricing? Our team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/demo"
                  className="bg-gold text-dark px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors inline-block"
                >
                  Book a Demo
                </Link>
                <Link
                  href="/assessment"
                  className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20 inline-block"
                >
                  Take Assessment
                </Link>
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-dark border-2 border-gold/30 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gold">Why Transparent Pricing?</h3>
            <p className="text-white/70 mb-6">
              We believe in complete transparency. No hidden fees, no surprises. You know exactly what you're investing in your pilot training journey.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-bold text-gold mb-2">No Hidden Costs</h4>
                <p className="text-white/60 text-sm">
                  All fees are clearly stated upfront. What you see is what you pay.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gold mb-2">Flexible Payment</h4>
                <p className="text-white/60 text-sm">
                  Choose from full payment, installments, or subject-wise options.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gold mb-2">Loan Support</h4>
                <p className="text-white/60 text-sm">
                  We help you secure education loans with competitive rates.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

