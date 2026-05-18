"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import { getStoredAttribution } from "@/lib/attribution";

export interface WhatsAppCaptureModalProps {
  open: boolean;
  onClose: () => void;
  /** WhatsApp business number, digits only with country code (e.g. "919591004043"). */
  waNumber: string;
  /** Pre-filled WhatsApp message body. */
  messageTemplate?: string;
  /** Source tag pushed to PROXe so the team knows where this lead came from. */
  source?: string;
  /** Human-readable program name, e.g. "Pilot Training". Surfaced to PROXe as `program`. */
  program?: string;
  /** Optional callback fired right before the user is redirected to wa.me. */
  onRedirect?: () => void;
}

/**
 * Lead-capture gate in front of every WhatsApp redirect. Phone-only: name
 * happens naturally inside the WhatsApp conversation. POSTs to /api/leads
 * (PROXe) with structured fields the CRM can filter on:
 *   - notes: "WhatsApp Prelaunch"
 *   - custom_fields.channel: "whatsapp"
 *   - custom_fields.program: <program>
 *   - custom_fields.page: <pathname>
 *   - custom_fields.touchpoint: <source>
 *   - custom_fields.utm_*: first-touch attribution
 * Fire-and-forget — PROXe never blocks the WhatsApp redirect.
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

  // Reset every time the modal opens so a previous attempt doesn't leak through.
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

  async function handleSubmit() {
    setError(null);
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setError("Please enter your phone number");
      return;
    }
    // Strip everything that isn't a digit or leading + for the validity check.
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
      // PROXe requires a name field; the WhatsApp thread will surface the real
      // name once the conversation starts. Use a sentinel that's easy to spot
      // in PROXe so the team knows to look at the WA chat for the real name.
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
        // event_name becomes `notes` + `custom_fields.form_type` on PROXe.
        // Keep it human-readable so CRM rows show "WhatsApp Prelaunch", not
        // a snake_case tag.
        event_name: "WhatsApp Prelaunch",
        // Specific touchpoint (per-page granularity) so analytics can slice
        // by which program page the click came from.
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
        /* silent — PROXe must not block the WA redirect */
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
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-capture-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="wa-modal-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-[440px] rounded-2xl border border-[#C5A572]/25 bg-[#1A1A1A] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
          >
            {/* Close affordance */}
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Headline */}
            <div className="text-center mb-4">
              <p
                id="wa-capture-title"
                className="text-white text-base font-semibold leading-tight"
              >
                Start a chat
              </p>
              <p className="text-white/50 text-xs mt-1">
                Phone only. We&apos;ll be ready when you message us.
              </p>
            </div>

            {/* Inline: phone input on the left, action button on the right */}
            <label htmlFor="wa-phone" className="sr-only">
              Phone number
            </label>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1 min-w-0">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A572]" />
                <input
                  id="wa-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  autoFocus
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  className="w-full bg-[#0D0D0D] border border-[#333] rounded-lg pl-10 pr-3 h-11 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A572] transition-colors text-sm"
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="shrink-0 px-4 sm:px-5 bg-[#25D366] text-white h-11 rounded-lg font-semibold text-sm hover:bg-[#1ebe5d] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,211,102,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none whitespace-nowrap"
              >
                {submitting ? "Opening..." : "Open WhatsApp"}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-2 px-1" role="alert">
                {error}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
