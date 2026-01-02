"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { trackFormSubmission, sendTrackingData } from "@/lib/tracking";
import { getUserSessionData, saveUserSessionData, grantPricingAccess } from "@/lib/sessionStorage";
import { trackPilotLead } from "@/lib/analytics";

type StartTimeline = "immediately" | "within_month" | "within_3_months" | "within_6_months" | "planning";

const startTimelineOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "within_month", label: "Within a month" },
  { value: "within_3_months", label: "Within 3 months" },
  { value: "within_6_months", label: "Within 6 months" },
  { value: "planning", label: "Just planning/exploring" },
];

interface PricingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
  onSuccess?: () => void; // Optional callback when form is successfully submitted
}

export default function PricingFormModal({ isOpen, onClose, source, onSuccess }: PricingFormModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startTimeline: "" as StartTimeline | "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Load user data from sessionStorage on mount
  useEffect(() => {
    if (isOpen) {
      const userData = getUserSessionData();
      if (userData) {
        const updates: Partial<typeof formData> = {};
        
        // Combine firstName and lastName for name field
        if (userData.firstName || userData.lastName) {
          const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(" ");
          if (fullName) updates.name = fullName;
        }
        
        if (userData.email) updates.email = userData.email;
        if (userData.phone) updates.phone = userData.phone;
        
        if (Object.keys(updates).length > 0) {
          setFormData((prev) => ({ ...prev, ...updates }));
        }
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const urlSource = source || "dgca";
      
      // Track form submission
      trackFormSubmission("pricing", formData, urlSource, "dgca_ground");

      const response = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: urlSource,
          interest: "dgca_ground",
        }),
      });

      if (response.ok) {
        // Track pilot lead
        trackPilotLead(urlSource, 'pricing_inquiry');
        
        // Send complete tracking data
        await sendTrackingData("/api/pricing", {
          formData,
          source: urlSource,
        });

        // Grant pricing access
        grantPricingAccess();

        setSubmitStatus("success");
        
        // Redirect to thank you page with pricing data
        const thankYouData = {
          source: urlSource,
        };
        const dataParam = encodeURIComponent(JSON.stringify(thankYouData));
        
        // Close modal and navigate to thank you page after a brief delay
        setTimeout(() => {
          onClose();
          // If onSuccess callback is provided, call it instead of redirecting
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.href = `/thank-you?type=pricing&data=${dataParam}`;
          }
        }, 1000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative max-w-2xl w-full">
              <div className="bg-accent-dark border-2 border-gold/50 rounded-lg p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gold transition-colors text-3xl z-10"
                >
                  ×
                </button>

                <h2 className="text-3xl font-bold text-gold mb-2">Get Pricing Details</h2>
                <p className="text-white/70 mb-6">
                  Please provide your details to access our transparent pricing information.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFormData({ ...formData, name: newValue });
                        // Save to sessionStorage - try to split name into first/last
                        const nameParts = newValue.trim().split(/\s+/);
                        if (nameParts.length >= 2) {
                          const lastName = nameParts.pop() || "";
                          const firstName = nameParts.join(" ");
                          saveUserSessionData({ firstName, lastName });
                        } else if (nameParts.length === 1) {
                          saveUserSessionData({ firstName: nameParts[0], lastName: "" });
                        }
                      }}
                      className="w-full px-4 py-3 bg-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email <span className="text-white/50 text-xs">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFormData({ ...formData, email: newValue });
                          saveUserSessionData({ email: newValue });
                        }}
                        className="w-full px-4 py-3 bg-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFormData({ ...formData, phone: newValue });
                          saveUserSessionData({ phone: newValue });
                        }}
                        className="w-full px-4 py-3 bg-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="startTimeline" className="block text-sm font-medium mb-2">
                      How soon are you looking to start?
                    </label>
                    <select
                      id="startTimeline"
                      required
                      value={formData.startTimeline}
                      onChange={(e) => setFormData({ ...formData, startTimeline: e.target.value as StartTimeline })}
                      className="w-full px-4 py-3 bg-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="">Select an option</option>
                      {startTimelineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold text-dark py-4 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "View Pricing"}
                  </button>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
                    >
                      Redirecting to pricing page...
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center"
                    >
                      Something went wrong. Please try again.
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

