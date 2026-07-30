"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WindChasersPastOpenHousesGallery from "@/components/marketing/WindChasersPastOpenHousesGallery";
import WingsOfFreedomHero from "@/components/events/WingsOfFreedomHero";
import WingsOfFreedomLastTime from "@/components/events/WingsOfFreedomLastTime";
import WingsOfFreedomDualPath from "@/components/events/WingsOfFreedomDualPath";
import WingsOfFreedomCoverCards from "@/components/events/WingsOfFreedomCoverCards";
import WingsAgendaTimeline from "@/components/events/WingsAgendaTimeline";
import WingsModal from "@/components/events/WingsModal";
import WingsTeamStrip from "@/components/events/WingsTeamStrip";
import WingsOfFreedomTrackCards, { type WingsTrack } from "@/components/events/WingsOfFreedomTrackCards";
import FreedomToFlyScholarship from "@/components/events/FreedomToFlyScholarship";
import FreedomToFlyDetail from "@/components/events/FreedomToFlyDetail";
import FreedomToFlyTerms from "@/components/events/FreedomToFlyTerms";
import WingsOfFreedomFaq from "@/components/events/WingsOfFreedomFaq";
import { OfflineEventRegisterModal } from "@/components/events/OfflineEventRegisterModal";
import {
  WINGS_EVENT_KEY,
  WINGS_EVENT_NAME,
  WINGS_START_ISO,
  WINGS_LOCATION,
  WINGS_VENUE_SHORT,
  WINGS_SCHOLARSHIP_NAME,
  WINGS_SCHOLARSHIP_TRACKS,
  WINGS_ELIGIBILITY_DECLARATION,
  WINGS_TERMS_VERSION,
  formatWingsDateFullDisplay,
  formatWingsTimeRangeDisplay,
  wingsDateTimeLabel,
} from "@/lib/wings-of-freedom";

const SCHOLARSHIP_CONFIG = {
  name: WINGS_SCHOLARSHIP_NAME,
  // Just the track name - pairing it with the amount made the two toggle
  // buttons wrap onto two lines, and the amounts are already stated in the
  // scholarship section right above.
  trackOptions: WINGS_SCHOLARSHIP_TRACKS.map((t) => ({ id: t.id, label: t.label })),
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
  const [agendaOpen, setAgendaOpen] = useState(false);
  const [scholarshipOpen, setScholarshipOpen] = useState(false);

  const dateFull = formatWingsDateFullDisplay();
  const timeText = formatWingsTimeRangeDisplay();
  const dateLabel = wingsDateTimeLabel();

  const openRegister = useCallback(() => {
    setApplyIntent(false);
    setRegisterOpen(true);
  }, []);

  // Hero/dual-path CTAs scroll to the section; the amounts and tiers sit one
  // more click in, behind "View scholarships", so the page never leads with a
  // figure.
  const scrollToScholarship = useCallback(() => {
    document.getElementById("freedom-to-fly")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openScholarships = useCallback(() => setScholarshipOpen(true), []);

  // Applying is reached from inside the scholarship detail, so nobody hits the
  // accept-terms checkbox without having passed the tiers and terms link.
  const openApply = useCallback(() => {
    setScholarshipOpen(false);
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
        dateFull={dateFull}
        timeText={timeText}
        venueShort={WINGS_VENUE_SHORT}
        onReserve={openRegister}
        onScholarship={scrollToScholarship}
      />

      {/* Real footage first, then the explanation - seeing the room does more
          than any copy can, and it earns the ask that follows. */}
      <WingsOfFreedomLastTime />

      <WingsOfFreedomDualPath onReserve={openRegister} onScholarship={scrollToScholarship} />

      {/* The six highlight cards summarise the day; the full run of show with
          timings lives in a modal behind "See the full agenda", so the page
          isn't two consecutive agenda sections. */}
      <WingsOfFreedomCoverCards onAgenda={openRegister} onFullAgenda={() => setAgendaOpen(true)} />

      <WingsOfFreedomTrackCards onSelect={onTrackSelect} onViewScholarships={openScholarships} />

      <FreedomToFlyScholarship onViewScholarships={openScholarships} />

      <WingsTeamStrip />

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

      <WingsModal
        open={agendaOpen}
        onClose={() => setAgendaOpen(false)}
        eyebrow="15 August · 11:00 am - 3:30 pm IST"
        title="The full run of show"
      >
        <WingsAgendaTimeline />
      </WingsModal>

      <WingsModal
        open={scholarshipOpen}
        onClose={() => setScholarshipOpen(false)}
        eyebrow="Female applicants only"
        title={WINGS_SCHOLARSHIP_NAME}
      >
        <FreedomToFlyDetail onApply={openApply} />
      </WingsModal>

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
