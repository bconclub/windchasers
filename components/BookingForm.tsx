"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { trackFormSubmission, sendTrackingData } from "@/lib/tracking";

type DemoType = "online" | "offline";
type EducationLevel = "pursuing_10_2" | "completed_10_2" | "graduate";
type InterestSource = "dgca_ground" | "pilot_training_abroad" | "helicopter_license" | "other";

const interestOptions = [
  { value: "dgca_ground", label: "DGCA Ground Classes" },
  { value: "pilot_training_abroad", label: "Pilot Training Abroad" },
  { value: "helicopter_license", label: "Helicopter License" },
  { value: "other", label: "Other" },
];

// Generate hourly time slots from 10 AM to 5 PM
const timeSlots = Array.from({ length: 8 }, (_, i) => {
  const hour = 10 + i; // 10 AM to 5 PM (10, 11, 12, 13, 14, 15, 16, 17)
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 12 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, "0")}:00`,
    label: `${displayHour}:00 ${period}`,
  };
});

// Check if a date is Monday to Saturday (not Sunday)
const isWeekday = (dateString: string): boolean => {
  if (!dateString) return true;
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return day !== 0; // Return true if not Sunday
};

// Check if date is in the past
const isPastDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today;
};

// Get minimum date (today)
const getMinDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "" as InterestSource | "",
    demoType: "online" as DemoType,
    education: "pursuing_10_2" as EducationLevel,
    preferredDate: "",
    preferredTime: "",
  });
  const [dateError, setDateError] = useState("");

  // Prefill interest from URL params
  useEffect(() => {
    try {
      const source = searchParams?.get("source");
      if (source) {
        const mappedSource = mapSourceToInterest(source);
        if (mappedSource) {
          setFormData((prev) => ({ ...prev, interest: mappedSource }));
        }
      }
    } catch (error) {
      console.error("Error reading search params:", error);
    }
  }, [searchParams]);

  const mapSourceToInterest = (source: string): InterestSource | null => {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes("dgca") || sourceLower.includes("ground")) {
      return "dgca_ground";
    }
    if (sourceLower.includes("abroad") || sourceLower.includes("international")) {
      return "pilot_training_abroad";
    }
    if (sourceLower.includes("helicopter")) {
      return "helicopter_license";
    }
    return null;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date is a weekday
    if (formData.preferredDate && !isWeekday(formData.preferredDate)) {
      setDateError("Please select a date from Monday to Saturday. We are closed on Sundays.");
      return;
    }
    
    // Validate time is selected when date is selected
    if (formData.preferredDate && !formData.preferredTime) {
      setSubmitStatus("error");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      let source: string | undefined;
      try {
        source = searchParams?.get("source") || undefined;
      } catch (error) {
        console.error("Error accessing search params:", error);
        source = undefined;
      }
      
      // Track form submission
      trackFormSubmission("booking", formData, source, formData.interest);

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      });

      if (response.ok) {
        // Send complete tracking data
        await sendTrackingData("/api/booking", {
          formData,
          source,
        });

        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          interest: "",
          demoType: "online",
          education: "pursuing_10_2",
          preferredDate: "",
          preferredTime: "",
        });
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
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-8 border-2 border-white/20 rounded-lg bg-accent-dark/50">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
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
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="interest" className="block text-sm font-medium mb-2">
            I'm Interested In
          </label>
          <select
            id="interest"
            required
            value={formData.interest}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value as InterestSource })}
            className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
          >
            <option value="">Select an option</option>
            {interestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-4">Demo Type</label>
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, demoType: "online" })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.demoType === "online"
                  ? "border-gold bg-gold/10"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <div className="font-semibold mb-1">Online</div>
              <div className="text-sm text-white/60">15-30 min consultation</div>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFormData({ ...formData, demoType: "offline" })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                formData.demoType === "offline"
                  ? "border-gold bg-gold/10"
                  : "border-white/20 hover:border-white/40"
              }`}
            >
              <div className="font-semibold mb-1">Campus Visit</div>
              <div className="text-sm text-white/60">30-60 min with simulator</div>
            </motion.button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Highest Level of Education
          </label>
          <select
            required
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value as EducationLevel })}
            className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
          >
            <option value="pursuing_10_2">Pursuing 10+2</option>
            <option value="completed_10_2">10+2 Completed</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>

        <div>
          <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
            Preferred Date (Monday - Saturday)
          </label>
          <div className="relative">
            <input
              type="date"
              id="preferredDate"
              required
              min={getMinDate()}
              value={formData.preferredDate}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (selectedDate) {
                  if (isPastDate(selectedDate)) {
                    setDateError("Please select a future date.");
                    setFormData({ ...formData, preferredDate: "", preferredTime: "" });
                  } else if (!isWeekday(selectedDate)) {
                    setDateError("Please select a date from Monday to Saturday. We are closed on Sundays.");
                    setFormData({ ...formData, preferredDate: "", preferredTime: "" });
                  } else {
                    setDateError("");
                    setFormData({ ...formData, preferredDate: selectedDate, preferredTime: "" });
                  }
                } else {
                  setDateError("");
                  setFormData({ ...formData, preferredDate: "", preferredTime: "" });
                }
              }}
              className={`w-full px-4 py-3 pr-12 bg-accent-dark border rounded-lg focus:outline-none transition-colors ${
                dateError ? "border-red-500" : "border-white/20 focus:border-gold"
              }`}
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
          </div>
          {dateError && (
            <p className="mt-2 text-sm text-red-400">{dateError}</p>
          )}
        </div>

        {formData.preferredDate && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Preferred Time (Hourly Slots)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <motion.button
                  key={slot.value}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, preferredTime: slot.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.preferredTime === slot.value
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/20 hover:border-white/40 text-white/70"
                  }`}
                >
                  {slot.label}
                </motion.button>
              ))}
            </div>
            {!formData.preferredTime && (
              <p className="mt-2 text-sm text-white/60">Please select a time slot</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-dark py-4 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Book Demo Session"}
        </button>

        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-center"
          >
            Demo session booked successfully! We'll contact you soon.
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
  );
}
