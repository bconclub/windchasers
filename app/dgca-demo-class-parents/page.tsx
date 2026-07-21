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
 * Same event as /dgca-demo-class - this is the parent-targeted entry point
 * (mirrors webinar/parents vs webinar/students: identical composition, just
 * default audience + headline/gallery copy swapped so parent-facing ads land
 * on copy that speaks to them first).
 */
export default function DemoClassParentsPage() {
  const heroRegisterRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerAudience, setRegisterAudience] = useState<"student" | "parent">("parent");
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
        <meta name="description" content="A free, in-person DGCA ground class at our Bengaluru campus for you and your child. Real instructors, real simulator, honest answers. No pressure." />
      </Head>

      <OfflineEventHero
        ref={heroRegisterRef}
        targetIso={DEMO_CLASS_START_ISO}
        headlineTop="See Your Child's"
        headlineAccent="Pilot Training, In Person"
        subheadline="Free, in-person DGCA ground class. Meet real instructors, see the simulator, get honest answers - no pressure."
        dateShort={dateShort}
        timeText={timeText}
        location={DEMO_CLASS_LOCATION}
        cardTitle={DEMO_CLASS_NAME}
        onReserve={() => openRegister('parent')}
      />

      <OfflineEventCoverCards onAgenda={() => openRegister('parent')} />

      <WebinarAudienceCards
        heading="Who should attend"
        subheading="Designed for future pilots and the people who support their journey."
        onSelect={openRegister}
      />

      <WindChasersPastOpenHousesGallery
        id="windchasers-events"
        heading="Where parents and students meet us in person"
        description="Open houses, simulator time, and mornings with our team - the same experience your child will get at this demo class."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => openRegister('parent')}
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
