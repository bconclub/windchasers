"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { FlightSchool } from "@/types/flight-school";

interface Props {
  school: FlightSchool;
  onClose: () => void;
}

function getUtmParams() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get("utm_source") || "",
    utmMedium: p.get("utm_medium") || "",
    utmCampaign: p.get("utm_campaign") || "",
    utmContent: p.get("utm_content") || "",
    utmTerm: p.get("utm_term") || "",
  };
}

export default function LeadFormModal({ school, onClose }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/flight-schools-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          schoolInterested: school.name,
          schoolCountry: school.country,
          ...getUtmParams(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1200] flex items-end md:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 32, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-xl p-6"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[#C5A572] text-xs font-medium tracking-wider uppercase mb-1">Get Details</p>
            <h3 className="text-xl font-bold text-white leading-tight">{school.name}</h3>
            <p className="text-white/40 text-sm mt-0.5">{school.city}, {school.country}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === "success" ? (
          <div className="text-center py-8">
            <p className="text-[#C5A572] font-semibold text-lg">
              Request received.
            </p>
            <p className="text-white/50 text-sm mt-2">
              Our counsellors will reach out within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Full Name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Rahul Sharma"
                className="w-full bg-white/5 border border-white/15 rounded px-3 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-[#C5A572]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Phone</label>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                className="w-full bg-white/5 border border-white/15 rounded px-3 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-[#C5A572]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="rahul@email.com"
                className="w-full bg-white/5 border border-white/15 rounded px-3 py-2.5 text-white text-sm placeholder-white/25 outline-none focus:border-[#C5A572]/50 transition-colors"
              />
            </div>
            {status === "error" && (
              <p className="text-red-400 text-xs">
                Something went wrong. Please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-[#C5A572] text-black font-semibold text-sm rounded hover:bg-[#C5A572]/90 transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Request Consultation"}
            </button>

            <p className="text-center text-xs text-white/30">
              Typically responded to within 24 hours.
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
