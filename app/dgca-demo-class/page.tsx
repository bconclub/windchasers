"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WebinarAudienceCards from "@/components/webinar/WebinarAudienceCards";
import OfflineEventCoverCards from "@/components/events/OfflineEventCoverCards";
import OfflineEventHero from "@/components/events/OfflineEventHero";
import { OfflineEventRegisterModal } from "@/components/events/OfflineEventRegisterModal";
import {
  DEMO_CLASS_START_ISO,
  DEMO_CLASS_NAME,
  DEMO_CLASS_LOCATION,
  DEMO_CLASS_SESSIONS,
  demoClassDateTimeLabel,
  demoClassSessionDateTimeLabel,
  formatDemoClassDayMonthDisplay,
  formatDemoClassTimeDisplay,
} from "@/lib/offline-events";

const MODAL_SESSIONS = DEMO_CLASS_SESSIONS.map((s) => ({
  id: s.id,
  label: s.label,
  fullLabel: demoClassSessionDateTimeLabel(s.id),
}));

/**
 * PLACEHOLDER CONTENT - functional plumbing + full page structure, copy pending
 * creatives. Mirrors app/webinar/students/page.tsx's composition (hero, cover
 * cards, audience cards, past-events gallery, sticky mobile CTA, register
 * modal) so this scales the same way webinar does - swap lib/offline-events.ts
 * + the section copy once the real event details/creatives land.
 */
export default function DemoClassPage() {
  const heroRegisterRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  // Page defaults to the student audience; the audience cards let a visitor
  // self-select, re-tagging the register flow (mirrors webinar/students).
  const [registerAudience, setRegisterAudience] = useState<"student" | "parent">("student");
  const openRegister = (aud: "student" | "parent") => {
    setRegisterAudience(aud);
    setRegisterOpen(true);
  };

  const dateShort = formatDemoClassDayMonthDisplay();
  const timeText = formatDemoClassTimeDisplay();
  const dateLabel = demoClassDateTimeLabel();

  useEffect(() => {
    const el = heroRegisterRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>{DEMO_CLASS_NAME} · WindChasers</title>
        <meta name="description" content={`Join the ${DEMO_CLASS_NAME} at WindChasers. ${dateLabel}.`} />
      </Head>

      <OfflineEventHero
        ref={heroRegisterRef}
        targetIso={DEMO_CLASS_START_ISO}
        headlineTop="Come See Training"
        headlineAccent="In Person"
        dateShort={dateShort}
        timeText={timeText}
        location={DEMO_CLASS_LOCATION}
        cardTitle={DEMO_CLASS_NAME}
        onReserve={() => openRegister('student')}
      />

      <OfflineEventCoverCards onAgenda={() => openRegister('student')} />

      <WebinarAudienceCards
        heading="Who should attend"
        subheading="Designed for future pilots and the people who support their journey."
        onSelect={openRegister}
      />

      <WindChasersPastOpenHousesGallery
        id="windchasers-events"
        heading="Events at WindChasers"
        description="Open houses, simulator time, and community mornings with our team."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => openRegister('student')}
            className="flex w-full items-center justify-center bg-[#C5A572] text-[#1A1A1A] py-3.5 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(197,165,114,0.25)] active:scale-[0.99] transition-transform"
          >
            Reserve my spot
          </button>
        </div>
      )}

      <OfflineEventRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        initialAudience={registerAudience}
        eventName={DEMO_CLASS_NAME}
        eventDate={dateLabel}
        eventLocation={DEMO_CLASS_LOCATION}
        sessions={MODAL_SESSIONS}
      />
    </>
  );
}
