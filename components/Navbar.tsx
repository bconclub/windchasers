"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";
import {
  WEBINAR_PARENT_WHATSAPP_GROUP_URL,
  WEBINAR_STUDENT_WHATSAPP_GROUP_URL,
} from "@/lib/webinar";
import { WhatsAppCaptureModal } from "@/components/WhatsAppCaptureModal";
import { track, trackMeta, EVENTS } from "@/lib/analytics/events";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [waCaptureOpen, setWaCaptureOpen] = useState(false);
  // Which slide-in category is expanded (accordion — one open at a time).
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const pathname = usePathname();

  // Analytics — call + WhatsApp contact taps, menu open.
  const onCallClick = () => {
    track(EVENTS.CONTACT_CALL, { source_page: pathname || "" });
    trackMeta("Contact", { method: "phone" });
  };
  const onWhatsAppClick = () => {
    track(EVENTS.CONTACT_WHATSAPP, { source_page: pathname || "" });
    trackMeta("Contact", { method: "whatsapp" });
  };

  // The PROXe web-chat widget floats on top of everything (very high z-index),
  // so it overlaps the slide-in menu. Hide its launcher while the menu is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const widgets = document.querySelectorAll<HTMLElement>(
      '[id*="proxe"],[class*="proxe"],[class*="widget-launcher"],[class*="chat-launcher"],iframe[src*="proxe.windchasers"]'
    );
    widgets.forEach((el) => {
      el.style.visibility = isOpen ? "hidden" : "";
    });
  }, [isOpen]);

  // Compact header (logo + call + WhatsApp) on selected pages
  const isSummerCamp = pathname === "/summercamp";
  const isOpenHouse = pathname === "/open-house";
  const isNzSeminar = pathname === "/nz-seminar";
  const isHome = pathname === "/";
  const isPilotTraining = pathname?.startsWith("/pilot-training") ?? false;
  const isATC = pathname === "/atc";
  const isCabinCrew = pathname === "/cabin-crew";
  const isWebinar = pathname?.startsWith("/webinar") ?? false;
  const isWebinarParent = pathname === "/webinar/parents";
  const isWebinarStudents = pathname === "/webinar/students";
  const isStudents = pathname === "/students";
  const isParents = pathname === "/parents";
  const isFlightSchools = pathname === "/flight-schools";
  const isDGCA = pathname === "/dgca";
  const isHelicopter = pathname === "/helicopter";
  const isInternational = pathname === "/international";
  const isThankYou = pathname?.startsWith("/thank-you") ?? false;
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return null;
  }

  // Pages where we want to capture name + phone BEFORE the user leaves to
  // WhatsApp. Top-of-funnel program pages where a WA tap is the main
  // primary CTA.
  const useWaCapture =
    isHome || isPilotTraining || isDGCA || isHelicopter || isInternational;

  // Per-page WhatsApp number + pre-filled message body. The capture modal
  // prepends "Hi! I'm {name}, " to the message before opening wa.me.
  // All program pages route to the dedicated marketing/automation WhatsApp
  // agent (+91 90350 98424). Other pages keep using the general support
  // number elsewhere on the site.
  const MARKETING_WA_AGENT = "919035098424";
  // The modal prepends "Hi! I'm {name}, " — keep these templates as the
  // sentence tail so we don't double-greet ("Hi! I'm X, Hi WindChasers, ...").
  const waCaptureConfig = isPilotTraining
    ? {
        waNumber: MARKETING_WA_AGENT,
        message: "I'd like to know more about pilot training.",
        source: "navbar_pilot_training",
        program: "Pilot Training",
      }
    : isDGCA
      ? {
          waNumber: MARKETING_WA_AGENT,
          message: "I'd like to know more about DGCA ground classes.",
          source: "navbar_dgca",
          program: "DGCA Ground Classes",
        }
      : isHelicopter
        ? {
            waNumber: MARKETING_WA_AGENT,
            message: "I'd like to know more about the Helicopter Pilot License program.",
            source: "navbar_helicopter",
            program: "Helicopter License",
          }
        : isInternational
          ? {
              waNumber: MARKETING_WA_AGENT,
              message: "I'd like to explore international pilot training options.",
              source: "navbar_international",
              program: "International Flying",
            }
          : {
              // isHome (default)
              waNumber: MARKETING_WA_AGENT,
              message: "I'd like to know more about your programs.",
              source: "navbar_home",
              program: "Homepage",
            };

  const compactWhatsAppHref =
    isWebinarParent
      ? WEBINAR_PARENT_WHATSAPP_GROUP_URL
      : isWebinarStudents
        ? WEBINAR_STUDENT_WHATSAPP_GROUP_URL
        : `https://wa.me/${isPilotTraining ? '919035098424' : '919591004043'}?text=${encodeURIComponent(
            isHome
              ? "Hi WindChasers, I need more detail on your pilot training programs"
              : isATC
                ? "Hi WindChasers, I want to know more about ATC at your academy"
                : isCabinCrew
                  ? "Hi WindChasers, I want to know more about the Cabin Crew program."
                  : isSummerCamp
                    ? "Hi WindChasers, I need more detail on Young Aviators Summer Camp"
                    : isWebinar
                      ? "Hi WindChasers, I have a question about the April 25 webinar"
                      : isOpenHouse
                        ? "Hi WindChasers, I need more detail on the open house"
                        : isNzSeminar
                          ? "Hi WindChasers, I need more detail on the New Zealand Flight Training Seminar on May 29"
                        : isStudents
                          ? "Hi WindChasers, I am a student exploring pilot training. Please share details."
                          : isParents
                            ? "Hi WindChasers, I am a parent exploring pilot training for my child. Please share details."
                            : isFlightSchools
                              ? "Hi WindChasers, I want to explore international flight school options. Please guide me."
                              : isDGCA
                                ? "Hi WindChasers, I want to know more about DGCA ground classes."
                                : isHelicopter
                                  ? "Hi WindChasers, I want to know more about the Helicopter Pilot License program."
                                  : isInternational
                                    ? "Hi WindChasers, I want to explore international pilot training options. Please guide me."
                                    : "Hi WindChasers, I need more detail on pilot training"
          )}`;

  // Categorized slide-in menu — grouped by intent instead of a flat list.
  const menuGroups: { heading: string; links: { href: string; label: string }[] }[] = [
    {
      heading: "Licenses & Ratings",
      links: [
        { href: "/commercial-pilot-license", label: "Commercial Pilot License" },
        { href: "/private-pilot-license", label: "Private Pilot License" },
        { href: "/airline-transport-pilot-license", label: "Airline Transport Pilot License" },
        { href: "/instrument-rating", label: "Instrument Rating" },
        { href: "/multi-engine-rating", label: "Multi-Engine Rating" },
        { href: "/certified-flight-instructor", label: "Flight Instructor (CFI)" },
        { href: "/type-rating", label: "Type Ratings" },
      ],
    },
    {
      heading: "Programs",
      links: [
        { href: "/dgca-ground-classes", label: "DGCA Ground Classes" },
        { href: "/diploma-in-aviation", label: "Diploma in Aviation" },
        { href: "/airline", label: "Cadet & Airline Track" },
        { href: "/helicopter-training", label: "Helicopter Training" },
        { href: "/cabin-crew", label: "Cabin Crew" },
        { href: "/ielts-training-program", label: "IELTS Training" },
      ],
    },
    {
      heading: "Train Abroad",
      links: [
        { href: "/pilot-training-in-india", label: "India" },
        { href: "/pilot-training-in-usa", label: "USA" },
        { href: "/pilot-training-in-canada", label: "Canada" },
        { href: "/pilot-training-in-australia", label: "Australia" },
        { href: "/pilot-training-in-new-zealand", label: "New Zealand" },
        { href: "/pilot-training-in-south-africa", label: "South Africa" },
      ],
    },
    {
      heading: "Company",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/team", label: "Meet the Team" },
        { href: "/blog", label: "Blog" },
        { href: "/contact-us", label: "Contact Us" },
      ],
    },
  ];
  return (
    <>
      <nav className="fixed top-0 w-full bg-dark/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/White transparent.png"
                alt="WindChasers"
                width={180}
                height={60}
                className="h-[3.45rem] md:h-12 w-auto"
                priority
              />
            </Link>

            {/* Right side actions — Call + WhatsApp + Hamburger on every page. */}
            <div className="flex items-center gap-2">
              {(isHome || isPilotTraining) && (
                <div className="hidden sm:flex items-center gap-2 mr-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-xs font-medium text-green-400 whitespace-nowrap">Admissions Open</span>
                </div>
              )}

              {/* Call */}
              <a
                href="tel:+919591004043"
                onClick={onCallClick}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C5A572] text-black hover:bg-[#C5A572]/90 transition-colors"
                aria-label="Call"
              >
                <Phone className="w-5 h-5" />
              </a>

              {/* WhatsApp — now on ALL pages. Funnel pages open the name+phone
                  capture modal; webinar pages use their group-invite link;
                  every other page opens a plain wa.me chat. */}
              {useWaCapture ? (
                <button
                  type="button"
                  onClick={() => {
                    setWaCaptureOpen(true);
                    onWhatsAppClick();
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                  aria-label="Chat on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
              ) : (
                <a
                  href={compactWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onWhatsAppClick}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] transition-colors"
                  aria-label={
                    isWebinarParent
                      ? "Join parents WhatsApp group"
                      : isWebinarStudents
                        ? "Join students WhatsApp group"
                        : "Chat on WhatsApp"
                  }
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              )}

              {/* Hamburger — on every page, including home (no dropdown). */}
              <button
                onClick={() => {
                  if (!isOpen) track(EVENTS.MENU_OPEN, { source_page: pathname });
                  setIsOpen(!isOpen);
                }}
                className="text-white z-[60] relative ml-1"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-in Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[88%] max-w-sm bg-dark border-l border-gold/30 z-50 shadow-2xl overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-gold transition-colors z-10"
                aria-label="Close menu"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col min-h-full pt-20 pb-10 px-8">
                {/* Primary actions — always visible at the top of the menu */}
                <div className="flex flex-col gap-3 mb-8">
                  <Link
                    href="/demo"
                    onClick={() => {
                      track(EVENTS.CTA_CLICK, { cta_location: "menu", label: "Book a Demo", link_url: "/demo" });
                      setIsOpen(false);
                    }}
                    className="block text-center py-3 rounded-lg bg-gold text-dark font-bold hover:bg-gold/90 transition-colors"
                  >
                    Book a Demo
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      onWhatsAppClick();
                      setIsOpen(false);
                      // Capture name + phone before the WhatsApp handoff so the
                      // lead lands in PROXe even if they never message us.
                      setWaCaptureOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#25D366] text-white font-bold hover:bg-[#128C7E] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Chat on WhatsApp
                  </button>
                </div>

                {/* Categories — tap a heading to open its links (accordion) */}
                <nav className="flex-1">
                  {menuGroups.map((group) => {
                    const expanded = openGroup === group.heading;
                    return (
                      <div key={group.heading} className="border-b border-white/10">
                        <button
                          type="button"
                          onClick={() => setOpenGroup(expanded ? null : group.heading)}
                          aria-expanded={expanded}
                          className="w-full flex items-center justify-between py-4 text-left"
                        >
                          <span className="text-white font-semibold text-base">{group.heading}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gold transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              {group.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={() => {
                                      track(EVENTS.NAV_CLICK, {
                                        link_label: link.label,
                                        link_url: link.href,
                                        source_page: pathname || "",
                                      });
                                      setIsOpen(false);
                                    }}
                                    className="block py-2.5 pl-3 text-[15px] text-white/65 hover:text-gold transition-colors"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                              <li className="h-2" />
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WhatsApp prelaunch capture for top-of-funnel program pages
          (home, pilot-training, DGCA, helicopter, international). Captures
          name + phone before redirecting to wa.me so PROXe gets the lead
          even if the user never actually messages on WhatsApp. Page-specific
          message + source set in waCaptureConfig above. */}
      <WhatsAppCaptureModal
        open={waCaptureOpen}
        onClose={() => setWaCaptureOpen(false)}
        waNumber={waCaptureConfig.waNumber}
        messageTemplate={waCaptureConfig.message}
        source={waCaptureConfig.source}
        program={waCaptureConfig.program}
      />
    </>
  );
}
