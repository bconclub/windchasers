"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredAttribution } from "@/lib/attribution";

export interface WhatsAppCaptureModalProps {
  open: boolean;
  onClose: () => void;
  /** WhatsApp business number, digits only with country code (e.g. "919591004043"). */
  waNumber: string;
  /** Pre-filled WhatsApp message body. Will be prefixed with "Hi! I'm {name}, ". */
  messageTemplate?: string;
  /** Source tag pushed to PROXe so the team knows where this lead came from. */
  source?: string;
  /** Optional callback fired right before the user is redirected to wa.me. */
  onRedirect?: () => void;
}

/**
 * Lead-capture gate in front of every WhatsApp redirect. Pops a small form
 * (name + phone), POSTs the lead to /api/leads (PROXe), then opens wa.me.
 * The PROXe write is fire-and-forget — if it fails we still let the user
 * reach WhatsApp.
 */
export function WhatsAppCaptureModal({
  open,
  onClose,
  waNumber,
  messageTemplate = "I'd like to know more about Windchasers.",
  source = "wa_prelaunch",
  onRedirect,
}: WhatsAppCaptureModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state every time the modal opens so a previous attempt doesn't
  // leak through.
  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // Close on Esc key for a11y.
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
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      setError("Please enter your name and phone");
      return;
    }
    setSubmitting(true);

    const attribution = getStoredAttribution();
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : undefined;

    const leadPayload = {
      type: "event" as const,
      name: trimmedName,
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
        event_name: source,
        wa_target_number: waNumber,
      },
    };

    // Fire-and-forget — never block the WhatsApp redirect on PROXe.
    try {
      void fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
        keepalive: true,
      }).catch(() => {
        /* silent — lead capture is best-effort, must not break WA redirect */
      });
    } catch {
      /* unreachable in practice */
    }

    if (onRedirect) onRedirect();

    const safeName = trimmedName.replace(/[\r\n]+/g, " ").slice(0, 80);
    const message = `Hi! I'm ${safeName}, ${messageTemplate}`;
    const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    // Use location.href so the redirect waits on the keepalive POST queueing
    // but doesn't depend on the fetch resolving.
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
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-capture-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="wa-modal-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[400px] rounded-2xl border border-[#C5A572]/30 bg-[#1A1A1A] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
          >
            <h3
              id="wa-capture-title"
              className="text-xl font-bold text-[#C5A572] mb-2"
            >
              Start a WhatsApp Chat
            </h3>
            <p className="text-white/60 text-sm mb-5">
              Drop your name and phone. We&apos;ll be ready when you message us.
            </p>

            <label className="block text-xs text-white/70 mb-1.5" htmlFor="wa-name">
              Your Name
            </label>
            <input
              id="wa-name"
              type="text"
              autoComplete="name"
              autoFocus
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-11 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors mb-3"
            />

            <label className="block text-xs text-white/70 mb-1.5" htmlFor="wa-phone">
              Phone
            </label>
            <input
              id="wa-phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#252525] border border-[#444] rounded-lg px-4 h-11 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C5A572] transition-colors mb-4"
            />

            {error && (
              <p className="text-red-400 text-sm mb-3" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#25D366] text-white h-12 rounded-lg font-semibold text-base hover:bg-[#1ebe5d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Opening WhatsApp..." : "Open WhatsApp"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-white/50 hover:text-white/80 text-sm py-2 mt-2 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
