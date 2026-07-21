"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User as UserIcon, Users, Check } from "lucide-react";
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

export interface OfflineEventRegisterModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-selected audience (from the section/card the user opened it from). The
   *  in-modal toggle lets them change it before submitting - mirrors
   *  WebinarRegisterModal so PROXe tags TYPE (student/parent) the same way. */
  initialAudience: "parent" | "student";
  /** Event title stored on the lead + shown in the modal. */
  eventName: string;
  /** Human date/time label, e.g. "2 August 2026 at 11:00 AM IST". */
  eventDate: string;
  /** Venue - this is an in-person event, no join link. */
  eventLocation: string;
}

/**
 * Reusable registration gate for ANY offline (in-person) event - demo class,
 * open house, etc. Captures name + phone into PROXe, tagged
 * lead_type='offline_event' with event_name/event_date/event_location, so the
 * Leads page's Offline Events tab can segment them the same way Webinar does.
 * Unlike the webinar modal there's no external redirect - registration ends
 * with an in-modal confirmation (this is a physical venue, not a Zoom link).
 * Visual language mirrors WebinarRegisterModal / WhatsAppCaptureModal.
 */
export function OfflineEventRegisterModal({
  open,
  onClose,
  initialAudience,
  eventName,
  eventDate,
  eventLocation,
}: OfflineEventRegisterModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [audience, setAudience] = useState<"parent" | "student">(initialAudience);
  const [comingWith, setComingWith] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (open) {
      setError(null);
      setSubmitting(false);
      setConfirmed(false);
      setName("");
      setPhone("");
      setComingWith("");
      // Re-seat the toggle to whichever section opened it.
      setAudience(initialAudience);
    }
  }, [open, initialAudience]);

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
      // Top-level (not inside `data`) - /api/leads' event case reads
      // body.audience directly into custom_fields.audience, which PROXe inbound
      // reads to set the lead's TYPE column (student/parent). Same shape as
      // WebinarRegisterModal.
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
        event_name: eventName,
        // These four keys drive PROXe's offline-event segment (leads/inbound):
        // lead_type='offline_event' tags it into the Offline Events tab; name/
        // date/location power the (future) confirmation + reminder. They pass
        // through as custom_fields (safeRestData) on the /api/leads event path.
        lead_type: "offline_event",
        offline_event_name: eventName,
        offline_event_date: eventDate,
        offline_event_location: eventLocation,
        // Who they're bringing (parent/friend/guest count, free text) - shown
        // to the counsellor on the lead so the venue knows headcount.
        offline_event_coming_with: comingWith.trim() || undefined,
        form_name: `offline_event_register_${audience}`,
        page: pagePath,
      },
    };

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
        console.warn("[offline-event-register] PROXe write failed:", err);
        return null;
      });
      clearTimeout(timeoutId);
      if (res) {
        const j = (await res.json().catch(() => ({}))) as { ok?: boolean; lead_id?: string; message?: string };
        if (!res.ok || j.ok === false) {
          console.warn("[offline-event-register] PROXe non-OK:", res.status, j.message || "");
        } else if (j.lead_id) {
          console.info("[offline-event-register] PROXe lead:", j.lead_id);
        }
      }
    } catch (err) {
      console.warn("[offline-event-register] unexpected error:", err);
    }

    const metaLeadSent = trackMetaLead({
      content_name: eventName,
      content_category: "offline_event_registration",
      source: "offline_event",
      program: "WindChasers Offline Event",
      page_path: pagePath,
    });
    track(EVENTS.WEBINAR_LEAD, { form_name: "offline_event_register", source: "offline_event" });
    if (metaLeadSent) await new Promise((r) => setTimeout(r, 250));

    setSubmitting(false);
    setConfirmed(true);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="offline-event-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offline-event-register-title"
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
            key="offline-event-modal-card"
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

            {confirmed ? (
              <div className="text-center py-4">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[#C5A572]/15 border border-[#C5A572]/40">
                  <Check className="w-6 h-6 text-[#C5A572]" />
                </div>
                <h2 className="text-white text-[22px] font-semibold mb-2">You&apos;re registered</h2>
                <p className="text-white/60 text-[13px] leading-relaxed mb-1">{eventName}</p>
                <p className="text-white/60 text-[13px] leading-relaxed mb-1">{eventDate}</p>
                <p className="text-white/45 text-[12px] leading-relaxed mb-5">{eventLocation}</p>
                <p className="text-white/40 text-[11px] leading-relaxed">
                  Our team will confirm details on WhatsApp shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-[#C5A572] text-[10px] uppercase tracking-[3px] font-medium">
                    Reserve your spot
                  </span>
                </div>

                <h2
                  id="offline-event-register-title"
                  className="text-white text-center text-[24px] sm:text-[26px] font-semibold leading-[1.15] mb-2"
                  style={{ textShadow: "0 2px 18px rgba(0,0,0,0.4)" }}
                >
                  Register for {eventName}
                </h2>
                <p className="text-white/55 text-center text-[13px] leading-relaxed mb-1 max-w-[360px] mx-auto">
                  {eventDate}
                </p>
                <p className="text-white/45 text-center text-[12px] leading-relaxed mb-5 max-w-[360px] mx-auto">
                  {eventLocation}
                </p>

                {/* Audience toggle - pre-set from the section, switchable here. */}
                <div className="mb-4">
                  <p className="mb-1.5 text-center text-[11px] uppercase tracking-[0.15em] text-white/40">
                    I&apos;m registering as
                  </p>
                  <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#0D0D0D] p-1">
                    {(["student", "parent"] as const).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => { setAudience(a); if (error) setError(null); }}
                        aria-pressed={audience === a}
                        className={`rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                          audience === a
                            ? "bg-[#C5A572] text-[#1A1A1A]"
                            : "text-white/35 hover:text-white/70"
                        }`}
                      >
                        {a === "student" ? "Student / Aspirant" : "Parent"}
                      </button>
                    ))}
                  </div>
                </div>

                <label htmlFor="offline-event-name" className="sr-only">Your name</label>
                <div className="relative flex items-stretch bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#C5A572] focus-within:shadow-[0_0_0_3px_rgba(197,165,114,0.08)] transition-all duration-200 mb-3">
                  <div className="flex items-center justify-center pl-4 pr-3 h-12 text-[#C5A572] select-none">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="offline-event-name"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (error) setError(null); }}
                    className="flex-1 min-w-0 bg-transparent pr-4 h-12 text-white text-[15px] tracking-wide placeholder:text-white/25 focus:outline-none"
                  />
                </div>

                <label htmlFor="offline-event-phone" className="sr-only">Phone number</label>
                <div className="relative flex items-stretch gap-0 bg-[#0D0D0D] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#C5A572] focus-within:shadow-[0_0_0_3px_rgba(197,165,114,0.08)] transition-all duration-200">
                  <div className="flex items-center justify-center px-4 h-12 bg-[#1A1A1A] border-r border-white/10 text-white/80 text-[13px] font-medium tracking-wide select-none">
                    <span className="mr-1 text-[#C5A572]">+91</span>
                    <span className="text-white/30 text-[10px] uppercase tracking-wider">IN</span>
                  </div>
                  <input
                    id="offline-event-phone"
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

                <div className="mt-3">
                  <p className="mb-1.5 text-center text-[11px] uppercase tracking-[0.15em] text-white/40">
                    Coming alone, or with someone?
                  </p>
                  <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-[#0D0D0D] p-1">
                    {(["Coming alone", "Bringing someone"] as const).map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        onClick={() => setComingWith(choice)}
                        aria-pressed={comingWith === choice}
                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                          comingWith === choice
                            ? "bg-[#C5A572] text-[#1A1A1A]"
                            : "text-white/35 hover:text-white/70"
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        {choice}
                      </button>
                    ))}
                  </div>
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
                        Reserve my spot
                      </>
                    )}
                  </span>
                </button>

                <p className="text-white/35 text-center text-[11px] leading-relaxed mt-4">
                  We&apos;ll confirm your spot and share reminders on WhatsApp.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default OfflineEventRegisterModal;
