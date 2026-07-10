"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User as UserIcon } from "lucide-react";
import { trackMetaLead } from "@/lib/metaPixel";
import { track, EVENTS } from "@/lib/analytics/events";
import { getStoredAttribution } from "@/lib/attribution";
import {
  getStoredUTMParamsFull,
  getStoredClickIds,
  getLandingPage,
  getStoredReferrer,
  deriveTrafficSource,
} from "@/lib/tracking";

export interface WebinarRegisterModalProps {
  open: boolean;
  onClose: () => void;
  /** 'parent' or 'student' — drives which welcome sequence PROXe sends. */
  audience: "parent" | "student";
  /** Webinar title stored on the lead (e.g. "Pilot Roadmap Webinar — Apr 2026"). */
  webinarName: string;
  /** Human date/time label stored on the lead + shown in confirmation copy. */
  webinarDate: string;
  /** Official Zoom registration URL — attendee is sent here after we capture them. */
  zoomUrl: string;
}

/**
 * Webinar registration gate. Captures name + phone into PROXe (tagged
 * lead_type='webinar' + audience so the counsellor agent picks them up for
 * WhatsApp confirm/reminders and calls), THEN redirects to the official Zoom
 * registration page — Zoom collects the email itself and sends the join link.
 * Capture-then-redirect means we get the contact into the chat even if they
 * abandon Zoom, and the audience tag (parent vs student) rides on which page
 * they registered from. Visual language mirrors WhatsAppCaptureModal.
 */
export function WebinarRegisterModal({
  open,
  onClose,
  audience,
  webinarName,
  webinarDate,
  zoomUrl,
}: WebinarRegisterModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleSubmit() {
    if (submitting) return;
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (trimmedPhone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const localAttr = getStoredAttribution();
    const sessionAttr = getStoredUTMParamsFull();
    const utm = {
      source: localAttr.utm_source || sessionAttr.utm_source || "",
      medium: localAttr.utm_medium || sessionAttr.utm_medium || "",
      campaign: localAttr.utm_campaign || sessionAttr.utm_campaign || "",
      term: localAttr.utm_term || sessionAttr.utm_term || "",
      content: localAttr.utm_content || sessionAttr.utm_content || "",
    };
    const clickIds = getStoredClickIds();
    const landingUrl = getLandingPage();
    const referrer = getStoredReferrer();
    const trafficSource = deriveTrafficSource();
    const pageUrl = typeof window !== "undefined" ? window.location.href : "";
    const pagePath = typeof window !== "undefined" ? window.location.pathname : "";

    const leadPayload = {
      type: "event" as const,
      name: trimmedName,
      phone: trimmedPhone,
      audience,
      page_url: pageUrl,
      landing_url: landingUrl || undefined,
      referrer: referrer || undefined,
      traffic_source: trafficSource || undefined,
      utm: {
        source: utm.source || undefined,
        medium: utm.medium || undefined,
        campaign: utm.campaign || undefined,
        term: utm.term || undefined,
        content: utm.content || undefined,
      },
      click_ids: Object.keys(clickIds).length > 0 ? clickIds : undefined,
      data: {
        event_name: webinarName,
        // These three keys drive PROXe's webinar segment (leads/inbound):
        // lead_type='webinar' tags it into the Webinar tab; name/date power
        // the confirmation + reminder templates. They pass through as
        // custom_fields (safeRestData) on the /api/leads event path.
        lead_type: "webinar",
        webinar_name: webinarName,
        webinar_date: webinarDate,
        form_name: `webinar_${audience}`,
        page: pagePath,
      },
    };

    // Await briefly so we can log a hard failure, but never block the Zoom
    // redirect on it — worst case is a registrant who reached Zoom without a
    // CRM row, which is recoverable (Zoom→Pabbly is a second capture path).
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
        keepalive: true,
        signal: controller.signal,
      }).catch((err) => {
        console.warn("[webinar-register] PROXe write failed:", err);
        return null;
      });
      clearTimeout(timeoutId);
      if (res) {
        const j = (await res.json().catch(() => ({}))) as { ok?: boolean; lead_id?: string; message?: string };
        if (!res.ok || j.ok === false) {
          console.warn("[webinar-register] PROXe non-OK:", res.status, j.message || "");
        } else if (j.lead_id) {
          console.info("[webinar-register] PROXe lead:", j.lead_id);
        }
      }
    } catch (err) {
      console.warn("[webinar-register] unexpected error:", err);
    }

    const metaLeadSent = trackMetaLead({
      content_name: webinarName,
      content_category: "webinar_registration",
      source: `webinar_${audience}`,
      program: "WindChasers Webinar",
      page_path: pagePath,
    });
    track(EVENTS.WEBINAR_LEAD, { form_name: `webinar_${audience}`, source: "webinar", audience });
    if (metaLeadSent) await new Promise((r) => setTimeout(r, 250));

    // Off to Zoom for the confirmed registration.
    window.location.href = zoomUrl;
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="webinar-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="webinar-register-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
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
            key="webinar-modal-card"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[480px] rounded-[20px] border border-[#C5A572]/30 bg-[#1F1F1F] px-7 py-8 sm:px-9 sm:py-9 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(197,165,114,0.04)]"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent rounded-t-[20px]"
            />
            <div aria-hidden="true" className="absolute top-5 left-5 w-5 h-5">
              <div className="absolute top-0 left-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>
            <div aria-hidden="true" className="absolute bottom-5 right-5 w-5 h-5">
              <div className="absolute bottom-0 right-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute bottom-0 right-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[#C5A572] text-[10px] uppercase tracking-[3px] font-medium">
                Reserve your seat
              </span>
            </div>

            <h2
              id="webinar-register-title"
              className="text-white text-center text-[24px] sm:text-[26px] font-semibold leading-[1.15] mb-2"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.4)" }}
            >
              Register for the webinar
            </h2>
            <p className="text-white/55 text-center text-[13px] leading-relaxed mb-6 max-w-[360px] mx-auto">
              {webinarDate} · we&apos;ll confirm on WhatsApp, then take you to Zoom for the join link.
            </p>

            <label htmlFor="webinar-name" className="sr-only">Your name</label>
            <div className="relative flex items-stretch bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#C5A572] focus-within:shadow-[0_0_0_3px_rgba(197,165,114,0.08)] transition-all duration-200 mb-3">
              <div className="flex items-center justify-center pl-4 pr-3 h-12 text-[#C5A572] select-none">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="webinar-name"
                type="text"
                autoComplete="name"
                autoFocus
                placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError(null); }}
                className="flex-1 min-w-0 bg-transparent pr-4 h-12 text-white text-[15px] tracking-wide placeholder:text-white/25 focus:outline-none"
              />
            </div>

            <label htmlFor="webinar-phone" className="sr-only">Phone number</label>
            <div className="relative flex items-stretch gap-0 bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#C5A572] focus-within:shadow-[0_0_0_3px_rgba(197,165,114,0.08)] transition-all duration-200">
              <div className="flex items-center justify-center px-4 h-12 bg-[#1A1A1A] border-r border-white/10 text-white/80 text-[13px] font-medium tracking-wide select-none">
                <span className="mr-1 text-[#C5A572]">+91</span>
                <span className="text-white/30 text-[10px] uppercase tracking-wider">IN</span>
              </div>
              <input
                id="webinar-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (error) setError(null); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                className="flex-1 min-w-0 bg-transparent px-4 h-12 text-white text-[15px] tracking-wide placeholder:text-white/25 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-3 pl-1" role="alert">{error}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="group relative w-full mt-5 h-12 rounded-xl bg-[#C5A572] text-[#1A1A1A] font-semibold text-[15px] overflow-hidden transition-all duration-300 hover:bg-[#d4b789] hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(197,165,114,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <span className="relative inline-flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                    Reserving...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Reserve my seat
                  </>
                )}
              </span>
            </button>

            <p className="text-white/35 text-center text-[11px] leading-relaxed mt-4">
              Next step is Zoom&apos;s registration page for your official join link.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WebinarRegisterModal;
