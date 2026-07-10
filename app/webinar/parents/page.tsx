"use client";

import { useEffect, useRef, useState } from "react";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WebinarAudienceCards from "@/components/webinar/WebinarAudienceCards";
import WebinarCoverCards from "@/components/webinar/WebinarCoverCards";
import WebinarHero from "@/components/webinar/WebinarHero";
import { WebinarRegisterModal } from "@/components/webinar/WebinarRegisterModal";
import {
  WEBINAR_START_ISO,
  WEBINAR_ZOOM_REGISTER_URL,
  WEBINAR_PARENT_ZOOM_REGISTER_URL,
  WEBINAR_NAME_PARENTS,
  WEBINAR_NAME_STUDENTS,
  webinarDateTimeLabel,
  formatWebinarDayMonthDisplay,
  formatWebinarTimeDisplay,
} from "@/lib/webinar";

export default function WebinarParentsPage() {

  const heroRegisterRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  // This page defaults to the parent audience; the "Who should attend" cards
  // let a visitor self-select, which re-tags the register flow accordingly.
  const [registerAudience, setRegisterAudience] = useState<"student" | "parent">("parent");
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
      <WebinarHero
        ref={heroRegisterRef}
        targetIso={WEBINAR_START_ISO}
        headlineTop="Your Child's Pilot Career"
        headlineAccent="Starts Here"
        dateShort={dateShort}
        timeText={timeLine}
        onReserve={() => openRegister('parent')}
      />

      <WebinarCoverCards onAgenda={() => openRegister('parent')} />

      <WebinarAudienceCards onSelect={openRegister} />

      <WindChasersPastOpenHousesGallery
        id="windchasers-events"
        heading="Where parents and students meet us in person"
        description="Open houses and mornings at WindChasers: tour the school, meet instructors, and ask the same straight questions you will hear on this parents webinar."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      {showStickyBar && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => openRegister('parent')}
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
