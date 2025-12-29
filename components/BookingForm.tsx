"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type DemoType = "online" | "offline";
type EducationLevel = "pursuing_10_2" | "completed_10_2" | "graduate";

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    demoType: "online" as DemoType,
    education: "pursuing_10_2" as EducationLevel,
    preferredDate: "",
    preferredTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
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

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              id="preferredDate"
              required
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium mb-2">
              Preferred Time
            </label>
            <input
              type="time"
              id="preferredTime"
              required
              value={formData.preferredTime}
              onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
              className="w-full px-4 py-3 bg-accent-dark border border-white/20 rounded-lg focus:border-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

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
