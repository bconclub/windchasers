"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User as UserIcon, Users, Check, ArrowRight } from "lucide-react";
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

export interface OfflineEventSession {
  id: string;
  /** Short label, e.g. "27 July". */
  label: string;
  /** Full "27 July 2026 at 11:00 AM IST" label - what's actually submitted/shown. */
  fullLabel: string;
}

export interface OfflineEventScholarshipConfig {
  /** Which programme they'd be applying to, e.g. Pilot / Cabin Crew. */
  trackOptions: { id: string; label: string }[];
  /** Anchor on the page holding the full terms, e.g. "#freedom-to-fly-terms". */
  termsHref: string;
  /** The exact eligibility sentence shown - stored verbatim as an audit trail. */
  declarationText: string;
  /** Bumped whenever the terms copy changes, so consent is traceable. */
  termsVersion: string;
  /** Programme name, e.g. "Freedom to Fly". */
  name: string;
  /** One line shown the moment the box is ticked - what applying actually
   *  starts. Without it a tick-box reads as "I have a scholarship". */
  processNote?: string;
  /** What happens next, shown on the confirmation screen after applying. */
  nextStepNote?: string;
  /** WhatsApp group invite. The test link and shortlist dates go out there, so
   *  joining is genuinely the next step, not a nice-to-have. */
  groupUrl?: string;
  /** Path to the aptitude test. Applicants are sent straight there from the
   *  confirmation with their phone prefilled, so the result can be joined back
   *  to this application instead of relying on them retyping the same number. */
  examPath?: string;
}

export interface OfflineEventRegisterModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-selected audience (from the section/card the user opened it from). The
   *  in-modal toggle lets them change it before submitting - mirrors
   *  WebinarRegisterModal so PROXe tags TYPE (student/parent) the same way. */
  initialAudience: "parent" | "student";
  /** Event title stored on the lead + shown in the modal. */
  eventName: string;
  /** Human date/time label, e.g. "2 August 2026 at 11:00 AM IST". Used as-is
   *  when `sessions` isn't given (single fixed date). */
  eventDate: string;
  /** Venue - this is an in-person event, no join link. */
  eventLocation: string;
  /** Optional - when the event runs as multiple single-day sessions (attendee
   *  picks ONE, not a multi-day event), pass them here and a picker replaces
   *  the static `eventDate` line. The picked session's fullLabel is what gets
   *  submitted as the lead's offline_event_date. */
  sessions?: OfflineEventSession[];
  /** Registry slug (e.g. "wings-of-freedom"). PROXe resolves the event's real
   *  date/venue/landing URL from this, so the display strings above can never
   *  corrupt reminder scheduling. Omit and PROXe falls back to matching on name. */
  eventKey?: string;
  /** Hide the student/parent toggle - for events where it doesn't apply (e.g.
   *  a women-only cohort). Audience still submits as `initialAudience`. */
  hideAudienceToggle?: boolean;
  /** Opt-in scholarship application, revealed by a checkbox. Omit entirely and
   *  the modal behaves exactly as before. */
  scholarship?: OfflineEventScholarshipConfig;
  /** Open with the scholarship block already expanded - set when the modal was
   *  opened from an "Apply" CTA rather than a "Book" one. */
  defaultApplying?: boolean;
}

const EDUCATION_OPTIONS = [
  "In Class 11/12",
  "Class 12 passed (PCM)",
  "Class 12 passed (non-PCM)",
  "Diploma / Undergraduate",
  "Graduate",
] as const;

const AGE_BANDS = ["Under 17", "17-19", "20-22", "23-25", "26+"] as const;

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
  sessions,
  eventKey,
  hideAudienceToggle = false,
  scholarship,
  defaultApplying = false,
}: OfflineEventRegisterModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [audience, setAudience] = useState<"parent" | "student">(initialAudience);
  const [comingWith, setComingWith] = useState("");
  const [sessionId, setSessionId] = useState<string>(sessions?.[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  // Scholarship block - inert unless the `scholarship` prop is passed.
  const [applying, setApplying] = useState(false);
  // NOT `track` - that name is taken by the imported analytics helper.
  const [scholarshipTrack, setScholarshipTrack] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [declared, setDeclared] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  // Scholarship fields live on a SECOND step rather than expanding inline.
  // Inline made the card ~1.6x the viewport on a laptop, pushing the submit
  // button out of reach. 1 = register, 2 = scholarship details.
  const [step, setStep] = useState<1 | 2>(1);

  // The date/time actually submitted + shown once picked: the chosen session's
  // full label when sessions are offered, else the fixed eventDate prop.
  /** True while the scholarship half of the form is on screen. */
  const onScholarshipStep = Boolean(scholarship) && applying && step === 2;

  const selectedSession = sessions?.find((s) => s.id === sessionId);
  const resolvedEventDate = selectedSession?.fullLabel ?? eventDate;

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
      setSessionId(sessions?.[0]?.id ?? "");
      setApplying(!!scholarship && defaultApplying);
      setStep(1);
      setScholarshipTrack(scholarship?.trackOptions[0]?.id ?? "");
      setEmail("");
      setEducation("");
      setAgeBand("");
      setDeclared(false);
      setAcceptedTerms(false);
    }
  }, [open, initialAudience, sessions, scholarship, defaultApplying]);

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

  /** Step-1 fields, checked before advancing AND before submitting. */
  function validateBasics(): string | null {
    if (!name.trim()) return "Please enter your name.";
    if (phone.trim().replace(/\D/g, "").length < 10) return "Please enter a valid phone number.";
    if (sessions && sessions.length > 0 && !sessionId) return "Please pick which day you'll attend.";
    return null;
  }

  /** "Continue" on step 1 when they've ticked the scholarship box. */
  function handleContinue() {
    const problem = validateBasics();
    if (problem) { setError(problem); return; }
    setError(null);
    setStep(2);
  }

  async function handleSubmit() {
    if (submitting) return;
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    const basicsProblem = validateBasics();
    if (basicsProblem) {
      // Send them back to the field that's wrong rather than showing a step-1
      // error under a step-2 form.
      setStep(1);
      setError(basicsProblem);
      return;
    }
    const trimmedEmail = email.trim();
    if (scholarship && applying) {
      if (!scholarshipTrack) { setError("Please pick which scholarship you're applying for."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setError("Please enter a valid email - we need it to reach shortlisted candidates.");
        return;
      }
      if (!education) { setError("Please tell us your current education level."); return; }
      if (!ageBand) { setError("Please pick your age range."); return; }
      if (!declared) { setError("Please confirm you're eligible to apply."); return; }
      if (!acceptedTerms) { setError("Please accept the scholarship terms to apply."); return; }
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
      // Only sent when they're applying - the scholarship needs a way to reach
      // shortlisted candidates; plain registration stays phone-only.
      ...(scholarship && applying && trimmedEmail ? { email: trimmedEmail } : {}),
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
        offline_event_date: resolvedEventDate,
        offline_event_location: eventLocation,
        // Who they're bringing (parent/friend/guest count, free text) - shown
        // to the counsellor on the lead so the venue knows headcount.
        offline_event_coming_with: comingWith.trim() || undefined,
        // Stable registry slug - PROXe resolves the event's real date, venue
        // and landing URL from this rather than trusting the strings above.
        offline_event_key: eventKey || undefined,
        // 'scholarship' is still a registration, just a stronger signal - the
        // dashboard surfaces it and the counsellor picks up the application.
        offline_event_intent: scholarship && applying ? "scholarship" : "register",
        ...(scholarship && applying
          ? {
              scholarship_name: scholarship.name,
              scholarship_track: scholarshipTrack,
              scholarship_track_label:
                scholarship.trackOptions.find((t) => t.id === scholarshipTrack)?.label || scholarshipTrack,
              education_level: education,
              age_band: ageBand,
              // Store the boolean AND the exact wording agreed to, so consent
              // stays auditable if the copy is ever reworded.
              eligibility_declared: true,
              eligibility_declaration_text: scholarship.declarationText,
              terms_accepted: true,
              terms_version: scholarship.termsVersion,
              terms_accepted_at: new Date().toISOString(),
            }
          : {}),
        form_name:
          scholarship && applying
            ? "offline_event_scholarship_apply"
            : `offline_event_register_${audience}`,
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
          /* overflow-y-auto + min-h-full wrapper: when the card is taller than
             the viewport (scholarship step on a short screen) the OVERLAY
             scrolls. Previously nothing scrolled - body scroll is locked, the
             card had no max height, so the submit button was simply
             unreachable below the fold. */
          className="fixed inset-0 z-[200] flex justify-center overflow-y-auto overscroll-contain bg-black/80 p-3 backdrop-blur-md sm:p-5"
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
            className="pointer-events-none fixed inset-0 flex items-center justify-center"
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
            /* my-auto (not items-center on the parent): auto margins centre the
               card while it fits and collapse to 0 once it is taller than the
               viewport, so the top never gets clipped out of reach. */
            className="relative my-auto w-full max-w-[560px] rounded-[20px] border border-[#C5A572]/30 bg-[#1F1F1F] px-5 py-6 sm:px-8 sm:py-7 shadow-[0_30px_70px_rgba(0,0,0,0.7),0_0_0_1px_rgba(197,165,114,0.04)]"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A572] to-transparent rounded-t-[20px]"
            />
            <div aria-hidden="true" className="absolute top-3.5 left-3.5 w-5 h-5">
              <div className="absolute top-0 left-0 w-5 h-[2px] bg-[#C5A572]" />
              <div className="absolute top-0 left-0 w-[2px] h-5 bg-[#C5A572]" />
            </div>
            <div aria-hidden="true" className="absolute bottom-3.5 right-3.5 w-5 h-5">
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
                <h2 className="text-white text-[22px] font-semibold mb-2">
                  {scholarship && applying ? "Application started" : "You're registered"}
                </h2>
                <p className="text-white/60 text-[13px] leading-relaxed mb-1">{eventName}</p>
                <p className="text-white/60 text-[13px] leading-relaxed mb-1">{resolvedEventDate}</p>
                <p className="text-white/45 text-[12px] leading-relaxed mb-5">{eventLocation}</p>

                {/* An applicant's next step is a real one (the aptitude test
                    link goes out in the group), so it gets a button rather
                    than a line of fine print promising someone will call. */}
                {scholarship && applying ? (
                  <>
                    <p className="text-white/60 text-[12.5px] leading-relaxed mb-4">
                      {scholarship.nextStepNote ||
                        `Your seat is booked and your ${scholarship.name} application is open. It is not decided yet.`}
                    </p>
                    {scholarship.examPath && (
                      <a
                        href={`${scholarship.examPath}?p=${encodeURIComponent(phone.trim())}&n=${encodeURIComponent(name.trim())}`}
                        className="mb-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#C5A572] px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]"
                      >
                        Complete your application
                      </a>
                    )}
                    {scholarship.groupUrl && (
                      <a
                        href={scholarship.groupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C5A572]/40 bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3] transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12"
                      >
                        Join the group
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-white/40 text-[11px] leading-relaxed">
                    Our team will confirm details on WhatsApp shortly.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  <span className="text-[#C5A572] text-[10px] uppercase tracking-[3px] font-medium">
                    {onScholarshipStep ? "Step 2 of 2" : scholarship && applying ? "Step 1 of 2" : "Reserve your spot"}
                  </span>
                </div>

                <h2
                  id="offline-event-register-title"
                  className="text-white text-center text-[22px] sm:text-[25px] font-semibold leading-[1.15] mb-2"
                  style={{ textShadow: "0 2px 18px rgba(0,0,0,0.4)" }}
                >
                  {onScholarshipStep ? `Apply for ${scholarship!.name}` : `Register for ${eventName}`}
                </h2>
                {onScholarshipStep ? (
                  <p className="text-white/55 text-center text-[13px] leading-relaxed mb-5 max-w-[360px] mx-auto">
                    {scholarship!.processNote ||
                      "A few details so the selection committee can assess your application."}
                  </p>
                ) : (
                  <>
                    <p className="text-white/55 text-center text-[13px] leading-relaxed mb-1 max-w-[360px] mx-auto">
                      {eventDate}
                    </p>
                    <p className="text-white/45 text-center text-[12px] leading-relaxed mb-4 max-w-[360px] mx-auto">
                      {eventLocation}
                    </p>
                  </>
                )}

                {/* Everything below is step 1. Hidden (not unmounted-and-lost:
                    the state lives in the parent) while the scholarship step
                    is showing, so neither screen is longer than a viewport. */}
                {!onScholarshipStep && (
                <>
                {/* Day picker - only when the event runs as separate single-day
                    sessions (attendee picks one, not a multi-day event). */}
                {sessions && sessions.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-1.5 text-center text-[11px] uppercase tracking-[0.15em] text-white/40">
                      Which day will you attend?
                    </p>
                    <div className={`grid gap-1 rounded-xl border border-white/10 bg-[#0D0D0D] p-1`} style={{ gridTemplateColumns: `repeat(${sessions.length}, minmax(0, 1fr))` }}>
                      {sessions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setSessionId(s.id); if (error) setError(null); }}
                          aria-pressed={sessionId === s.id}
                          className={`rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                            sessionId === s.id
                              ? "bg-[#C5A572] text-[#1A1A1A]"
                              : "text-white/35 hover:text-white/70"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audience toggle - pre-set from the section, switchable here.
                    Hidden for events where student/parent doesn't apply. */}
                <div className={`mb-4 ${hideAudienceToggle ? "hidden" : ""}`}>
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

                {/* Scholarship opt-in. Ticking it only sets the intent - the
                    fields themselves are step 2, so step 1 stays short. */}
                {scholarship && (
                  <div className="mt-4 rounded-xl border border-[#C5A572]/25 bg-[#C5A572]/[0.04] p-3">
                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={applying}
                        onChange={(e) => { setApplying(e.target.checked); if (error) setError(null); }}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#C5A572]"
                      />
                      <span className="text-[13px] leading-snug text-white/80">
                        I&apos;d also like to start a{" "}
                        <span className="font-semibold text-[#E7D5B3]">{scholarship.name}</span> scholarship
                        application
                      </span>
                    </label>
                    {applying && scholarship.processNote && (
                      <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-white/60">
                        {scholarship.processNote}
                      </p>
                    )}
                  </div>
                )}
                </>
                )}

                {/* Step 2 - the scholarship fields. */}
                {onScholarshipStep && scholarship && (
                  <div className="rounded-xl border border-[#C5A572]/25 bg-[#C5A572]/[0.04] p-3">
                    <div className="space-y-3">
                        <div>
                          <p className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-white/40">Applying for</p>
                          <div className="grid gap-1 rounded-xl border border-white/10 bg-[#0D0D0D] p-1" style={{ gridTemplateColumns: `repeat(${scholarship.trackOptions.length}, minmax(0, 1fr))` }}>
                            {scholarship.trackOptions.map((t) => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => { setScholarshipTrack(t.id); if (error) setError(null); }}
                                aria-pressed={scholarshipTrack === t.id}
                                className={`rounded-lg px-2 py-2 text-[12.5px] font-semibold transition-colors ${
                                  scholarshipTrack === t.id ? "bg-[#C5A572] text-[#1A1A1A]" : "text-white/35 hover:text-white/70"
                                }`}
                              >
                                {t.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="offline-event-email" className="sr-only">Email</label>
                          <input
                            id="offline-event-email"
                            type="email"
                            autoComplete="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 text-[14px] text-white placeholder:text-white/25 focus:border-[#C5A572] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label htmlFor="offline-event-education" className="sr-only">Education level</label>
                          <select
                            id="offline-event-education"
                            value={education}
                            onChange={(e) => { setEducation(e.target.value); if (error) setError(null); }}
                            style={{ colorScheme: "dark" }}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 text-[14px] text-white focus:border-[#C5A572] focus:outline-none"
                          >
                            <option value="">Current education</option>
                            {EDUCATION_OPTIONS.map((o) => (<option key={o} value={o}>{o}</option>))}
                          </select>
                        </div>

                        <div>
                          <p className="mb-1.5 text-[11px] uppercase tracking-[0.15em] text-white/40">Age</p>
                          <div className="grid grid-cols-5 gap-1 rounded-xl border border-white/10 bg-[#0D0D0D] p-1">
                            {AGE_BANDS.map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => { setAgeBand(a); if (error) setError(null); }}
                                aria-pressed={ageBand === a}
                                className={`rounded-lg py-1.5 text-[11px] font-semibold transition-colors ${
                                  ageBand === a ? "bg-[#C5A572] text-[#1A1A1A]" : "text-white/35 hover:text-white/70"
                                }`}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        </div>

                        <label className="flex cursor-pointer items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={declared}
                            onChange={(e) => { setDeclared(e.target.checked); if (error) setError(null); }}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-[#C5A572]"
                          />
                          <span className="text-[12px] leading-snug text-white/65">{scholarship.declarationText}</span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => { setAcceptedTerms(e.target.checked); if (error) setError(null); }}
                            className="mt-0.5 h-4 w-4 shrink-0 accent-[#C5A572]"
                          />
                          <span className="text-[12px] leading-snug text-white/65">
                            I have read and accept the{" "}
                            <a href={scholarship.termsHref} onClick={onClose} className="text-[#C5A572] underline underline-offset-2">
                              scholarship terms
                            </a>
                            .
                          </span>
                        </label>

                        <p className="text-[11px] leading-snug text-white/35">
                          Shortlisted candidates are contacted for an interview and counselling session.
                          Any documents or essay are collected then - nothing else is needed now.
                        </p>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-xs mt-3 pl-1" role="alert">{error}</p>
                )}

                {/* Step 1 with the box ticked advances instead of submitting,
                    so nothing is sent until they've seen what applying means. */}
                <button
                  type="button"
                  onClick={scholarship && applying && step === 1 ? handleContinue : handleSubmit}
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
                    ) : scholarship && applying && step === 1 ? (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {onScholarshipStep ? "Reserve my spot & apply" : "Reserve my spot"}
                      </>
                    )}
                  </span>
                </button>

                {onScholarshipStep && !submitting && (
                  <button
                    type="button"
                    onClick={() => { setError(null); setStep(1); }}
                    className="mx-auto mt-3 block text-[12.5px] font-semibold text-white/45 transition-colors hover:text-white/80"
                  >
                    Back
                  </button>
                )}

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
