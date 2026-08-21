"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import LeadFormModal from "./LeadFormModal";
import { FlightSchool } from "@/types/flight-school";

const WHATSAPP_NUMBER = "919035098424";

/**
 * Always visible way to become a lead.
 *
 * The school markers are drawn in WebGL, so the drawer and its "Get More
 * Details" button are only reachable by tapping a marker on a spinning globe.
 * That is not a conversion path for paid traffic, and it is not reachable at
 * all by keyboard or screen reader. This bar sits on the page the whole time
 * so an enquiry is always one tap away, and it opens the same modal with the
 * same attribution payload rather than sending anyone to /contact-us.
 *
 * When a school is selected the message and the modal carry it, so the lead
 * still lands with school and country attached.
 */
export function EnquiryBar({ school }: { school?: FlightSchool | null }) {
  const [open, setOpen] = useState(false);

  /**
   * Stay off the hero.
   *
   * This bar is fixed to the bottom of the viewport, so on the opening screen
   * it sat directly on top of the "Search a country" field - covering the one
   * control the hero exists to offer. The hero already converts (search, and
   * tapping a marker opens the drawer); this bar is the fallback for further
   * down the page, where the WebGL markers are the only path.
   *
   * So it hides while the hero is on screen and slides in once you are past
   * it. If the hero is not on the page at all - any other route that mounts
   * this - it stays visible exactly as before.
   */
  const [clearOfHero, setClearOfHero] = useState(true);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = document.querySelector("[data-globe-hero]");
    if (!hero) return;                       // no hero here, behave as before
    setClearOfHero(false);                   // hero exists: start hidden
    const io = new IntersectionObserver(
      ([entry]) => setClearOfHero(entry.intersectionRatio < 0.35),
      { threshold: [0, 0.35, 1] },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  const waMessage = school
    ? `Hi WindChasers, I am interested in ${school.name}${school.country ? `, ${school.country}` : ""}. Please share the details.`
    : "Hi WindChasers, I am interested in flight training abroad. Please share the details.";

  return (
    <>
      {/* Sits above the map controls, clear of the iOS home indicator. */}
      <div
        ref={barRef}
        aria-hidden={!clearOfHero}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[1100] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300"
        style={{
          opacity: clearOfHero ? 1 : 0,
          transform: clearOfHero ? "translateY(0)" : "translateY(120%)",
          // Not just invisible - unclickable, so it cannot swallow a tap meant
          // for the search field underneath it.
          visibility: clearOfHero ? "visible" : "hidden",
        }}
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/10 bg-[#111]/95 p-2 shadow-2xl backdrop-blur">
          <p className="ml-2 hidden min-w-0 flex-1 text-sm text-white/70 sm:block">
            {school ? (
              <>
                Interested in{" "}
                <span className="font-medium text-white">{school.name}</span>?
              </>
            ) : (
              "Not sure which school fits you?"
            )}
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:flex-none"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#C5A572] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#C5A572]/90 sm:flex-none"
          >
            <Phone className="h-4 w-4" />
            Request a callback
          </button>
        </div>
      </div>

      {open ? <LeadFormModal school={school ?? null} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
