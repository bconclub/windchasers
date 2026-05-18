"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { getStoredAttribution } from "@/lib/attribution";

export interface WhatsAppCaptureModalProps {
  open: boolean;
  onClose: () => void;
  /** WhatsApp business number, digits only with country code (e.g. "919035098424"). */
  waNumber: string;
  /** Pre-filled WhatsApp message body. */
  messageTemplate?: string;
  /** Source tag pushed to PROXe for analytics filtering. */
  source?: string;
  /** Human-readable program name (e.g. "Pilot Training"). Sent to PROXe as `program`. */
  program?: string;
  /** Optional callback fired just before the wa.me redirect. */
  onRedirect?: () => void;
}

/**
 * Lead capture gate in front of every WhatsApp redirect. Phone-only — the
 * name surfaces in the WhatsApp conversation itself. Visual language mirrors
 * the open-house glass hero: gold gradient top edge, L-shaped corner accents,
 * concierge-framed copy. Fires `/api/leads` (PROXe `type: event`) as
 * fire-and-forget so the WA redirect is never blocked.
 */
export function WhatsAppCaptureModal({
  open,
  onClose,
  waNumber,
  messageTemplate = "I'd like to know more about Windchasers.",
  source = "wa_prelaunch",
  program,
  onRedirect,
}: WhatsAppCaptureModalProps) {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset every open so a previous attempt doesn't leak through.
  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // Close on Esc for a11y.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while modal is open (no fighting between modal and page scroll).
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleSubmit() {
    setError(null);
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setError("Please enter your phone number");
      return;
    }
    const digits = trimmedPhone.replace(/[\s\-()]/g, "").replace(/^\+/, "");
    if (digits.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setSubmitting(true);

    const attribution = getStoredAttribution();
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const pagePath = typeof window !== "undefined" ? window.location.pathname : "";

    const leadPayload = {
      type: "event" as const,
      name: "WhatsApp Lead",
      phone: trimmedPhone,
      page_url: pageUrl,
      utm: {
        source: attribution.utm_source || undefined,
        medium: attribution.utm_medium || undefined,
        campaign: attribution.utm_campaign || undefined,
        term: attribution.utm_term || undefined,
        content: attribution.utm_content || undefined,
      },
      data: {
        event_name: "WhatsApp Prelaunch",
        touchpoint: source,
        channel: "whatsapp",
        program: program || "",
        page: pagePath,
        wa_target_number: waNumber,
      },
    };

    try {
      void fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
        keepalive: true,
      }).catch(() => {
        /* silent — PROXe never blocks the WA redirect */
      });
    } catch {
      /* unreachable in practice */
    }

    if (onRedirect) onRedirect();

    const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageTemplate)}`;
    window.location.href = waHref;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="wa-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-capture-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Ambient gold glow behind the card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-[520px] h-[420px] rounded-full bg-[#C5A572]/8 blur-[100px]" />
          </motion.div>

          <motion.div
            key="wa-modal-card"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[480px] rounded-[20px] border border-[#C5A572]/30 bg-[#1F1F1F] px-7 py-8 sm:px-9 sm:py-9 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(197,165,114,0.04)]"
          >
            {/* Top gradient border — signature open-house pattern */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent rounded-t-[20px]"
            />

            {/* L-shaped corner accents (top-left & bottom-right) */}
            <div aria-hidden="true" className="absolute top-5 left-5 w-5 h-5">
              <div className="absolute top-0 left-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>
            <div aria-hidden="true" className="absolute bottom-5 right-5 w-5 h-5">
              <div className="absolute bottom-0 right-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>

            {/* Close affordance */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Eyebrow + live pulse */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[#C5A572] text-[10px] uppercase tracking-[3px] font-medium">
                Aviators Desk · Live
              </span>
            </div>

            {/* Headline */}
            <h2
              id="wa-capture-title"
              className="text-white text-center text-[26px] sm:text-[28px] font-semibold leading-[1.15] mb-2"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.4)" }}
            >
              Start a chat
            </h2>
            <p className="text-white/55 text-center text-[13px] leading-relaxed mb-6 max-w-[340px] mx-auto">
              Drop your number, we&apos;ll pick it up on WhatsApp.
            </p>

            {/* Phone input — boarding-pass style with country code chip */}
            <label htmlFor="wa-phone" className="sr-only">
              Phone number
            </label>
            <div className="relative flex items-stretch gap-0 bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#C5A572] focus-within:shadow-[0_0_0_3px_rgba(197,165,114,0.08)] transition-all duration-200">
              {/* Country prefix chip */}
              <div className="flex items-center justify-center px-4 h-12 bg-[#1A1A1A] border-r border-white/10 text-white/80 text-[13px] font-medium tracking-wide select-none">
                <span className="mr-1 text-[#C5A572]">+91</span>
                <span className="text-white/30 text-[10px] uppercase tracking-wider">IN</span>
              </div>
              <input
                id="wa-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                autoFocus
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                className="flex-1 min-w-0 bg-transparent px-4 h-12 text-white text-[15px] tracking-wide placeholder:text-white/25 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-3 pl-1" role="alert">
                {error}
              </p>
            )}

            {/* Primary CTA */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="group relative w-full mt-5 h-12 rounded-xl bg-[#25D366] text-white font-semibold text-[15px] overflow-hidden transition-all duration-300 hover:bg-[#22c55e] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(37,211,102,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {/* Subtle inner highlight */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
              <span className="relative inline-flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Open WhatsApp
                  </>
                )}
              </span>
            </button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
