"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WingsOfFreedomHero from "@/components/events/WingsOfFreedomHero";
import WingsOfFreedomDualPath from "@/components/events/WingsOfFreedomDualPath";
import WingsOfFreedomCoverCards from "@/components/events/WingsOfFreedomCoverCards";
import WingsOfFreedomAgenda from "@/components/events/WingsOfFreedomAgenda";
import WingsOfFreedomTrackCards, { type WingsTrack } from "@/components/events/WingsOfFreedomTrackCards";
import FreedomToFlyScholarship from "@/components/events/FreedomToFlyScholarship";
import FreedomToFlyTerms from "@/components/events/FreedomToFlyTerms";
import WingsOfFreedomFaq from "@/components/events/WingsOfFreedomFaq";
import { OfflineEventRegisterModal } from "@/components/events/OfflineEventRegisterModal";
import {
  WINGS_EVENT_KEY,
  WINGS_EVENT_NAME,
  WINGS_START_ISO,
  WINGS_LOCATION,
  WINGS_SCHOLARSHIP_NAME,
  WINGS_SCHOLARSHIP_TRACKS,
  WINGS_ELIGIBILITY_DECLARATION,
  WINGS_TERMS_VERSION,
  formatWingsDayMonthDisplay,
  formatWingsTimeRangeDisplay,
  wingsDateTimeLabel,
} from "@/lib/wings-of-freedom";

const SCHOLARSHIP_CONFIG = {
  name: WINGS_SCHOLARSHIP_NAME,
  trackOptions: WINGS_SCHOLARSHIP_TRACKS.map((t) => ({
    id: t.id,
    label: `${t.label} · ${t.amountLabel}`,
  })),
  termsHref: "#freedom-to-fly-terms",
  declarationText: WINGS_ELIGIBILITY_DECLARATION,
  termsVersion: WINGS_TERMS_VERSION,
};

/**
 * Wings of Freedom - women-only Independence Day aviation day, 15 Aug 2026.
 *
 * Single fixed date, so no `sessions` prop on the register modal (it falls
 * back to the static eventDate line). The audience toggle is hidden: this is a
 * women-only cohort, so student-vs-parent doesn't apply.
 *
 * Metadata + Event/FAQ JSON-LD live in the sibling layout.tsx - NOT next/head,
 * which is a no-op inside a "use client" App Router page.
 */
export default function WingsOfFreedomPage() {
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [applyIntent, setApplyIntent] = useState(false);

  const dateShort = formatWingsDayMonthDisplay();
  const timeText = formatWingsTimeRangeDisplay();
  const dateLabel = wingsDateTimeLabel();

  const openRegister = useCallback(() => {
    setApplyIntent(false);
    setRegisterOpen(true);
  }, []);

  // The scholarship CTAs scroll rather than opening a modal, so nobody reaches
  // the accept-terms checkbox without passing the tiers and the terms link.
  const scrollToScholarship = useCallback(() => {
    document.getElementById("freedom-to-fly")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openApply = useCallback(() => {
    setApplyIntent(true);
    setRegisterOpen(true);
  }, []);

  const onTrackSelect = useCallback((_track: WingsTrack) => {
    openRegister();
  }, [openRegister]);

  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <WingsOfFreedomHero
        ref={heroCtaRef}
        targetIso={WINGS_START_ISO}
        dateShort={dateShort}
        timeText={timeText}
        location={WINGS_LOCATION}
        cardTitle={WINGS_EVENT_NAME}
        onReserve={openRegister}
        onScholarship={scrollToScholarship}
      />

      <WingsOfFreedomDualPath onReserve={openRegister} onScholarship={scrollToScholarship} />

      <WingsOfFreedomCoverCards onAgenda={openRegister} />

      <WingsOfFreedomAgenda onReserve={openRegister} />

      <WingsOfFreedomTrackCards onSelect={onTrackSelect} />

      <FreedomToFlyScholarship onApply={openApply} />

      <FreedomToFlyTerms />

      <WindChasersPastOpenHousesGallery
        id="windchasers-events"
        heading="Events at WindChasers"
        description="Open houses, simulator mornings and community days with our team."
        sectionClassName="py-20 px-6 lg:px-8 bg-gradient-to-b from-[#1E1E1E] to-[#1A1A1A] border-t border-white/5"
      />

      <WingsOfFreedomFaq />

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#1A1A1A]/90 px-4 py-3 backdrop-blur-md md:hidden">
          <button
            type="button"
            onClick={openRegister}
            className="flex w-full items-center justify-center rounded-full bg-[#C5A572] py-3.5 text-sm font-semibold text-[#1A1A1A] shadow-[0_10px_30px_rgba(197,165,114,0.25)] transition-transform active:scale-[0.99]"
          >
            Book my slot
          </button>
          <button
            type="button"
            onClick={scrollToScholarship}
            className="mt-2 block w-full text-center text-[12px] text-[#E7D5B3] underline underline-offset-2"
          >
            or apply for a scholarship
          </button>
        </div>
      )}

      <OfflineEventRegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        initialAudience="student"
        hideAudienceToggle
        eventKey={WINGS_EVENT_KEY}
        eventName={WINGS_EVENT_NAME}
        eventDate={dateLabel}
        eventLocation={WINGS_LOCATION}
        scholarship={SCHOLARSHIP_CONFIG}
        defaultApplying={applyIntent}
      />
    </>
  );
}
