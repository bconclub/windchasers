"use client";

import { useState, useEffect, useRef } from "react";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WebinarAudienceCards from "@/components/webinar/WebinarAudienceCards";
import WebinarCoverCards from "@/components/webinar/WebinarCoverCards";
import WebinarHero from "@/components/webinar/WebinarHero";
import { WebinarRegisterModal } from "@/components/webinar/WebinarRegisterModal";
import {
  WEBINAR_START_ISO,
  WEBINAR_ZOOM_REGISTER_URL,
  WEBINAR_PARENT_ZOOM_REGISTER_URL,
  WEBINAR_NAME_STUDENTS,
  WEBINAR_NAME_PARENTS,
  webinarDateTimeLabel,
  formatWebinarDayMonthDisplay,
  formatWebinarTimeDisplay,
} from "@/lib/webinar";

export default function WebinarStudentsPage() {

  /** While the hero Register CTA is in view, hide the mobile sticky bar so only one CTA shows. */
  const heroRegisterRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  // Page defaults to the student audience; the audience cards let a visitor
  // self-select, re-tagging the register flow.
  const [registerAudience, setRegisterAudience] = useState<"student" | "parent">("student");
  const openRegister = (aud: "student" | "parent") => {
    setRegisterAudience(aud);
    setRegisterOpen(true);
  };

  const timeLine = formatWebinarTimeDisplay();
  const dateShort = formatWebinarDayMonthDisplay();

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
      {/* Hero: full-bleed facility photo + overlay, same pattern as /summercamp */}
      <WebinarHero
        ref={heroRegisterRef}
        targetIso={WEBINAR_START_ISO}
        headlineTop="Your Pilot Career Plan"
        headlineAccent="Starts Here"
        dateShort={dateShort}
        timeText={timeLine}
        onReserve={() => openRegister('student')}
      />

      <WebinarCoverCards onAgenda={() => openRegister('student')} />

      <WebinarAudienceCards onSelect={openRegister} />

      <WindChasersPastOpenHousesGallery
        id="windchasers-events"
        heading="Events at WindChasers"
        description="Open houses, simulator time, and community mornings with our team. The same highlights we feature on our in-person open house page."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => openRegister('student')}
            className="flex w-full items-center justify-center bg-[#C5A572] text-[#1A1A1A] py-3.5 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(197,165,114,0.25)] active:scale-[0.99] transition-transform"
          >
            Reserve my free seat
          </button>
        </div>
      )}

      <WebinarRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        audience={registerAudience}
        webinarName={registerAudience === 'parent' ? WEBINAR_NAME_PARENTS : WEBINAR_NAME_STUDENTS}
        webinarDate={webinarDateTimeLabel()}
        zoomUrl={registerAudience === 'parent' ? WEBINAR_PARENT_ZOOM_REGISTER_URL : WEBINAR_ZOOM_REGISTER_URL}
      />
    </>
  );
}
