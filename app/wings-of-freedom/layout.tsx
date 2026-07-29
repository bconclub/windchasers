import type { Metadata } from "next";
import {
  WINGS_EVENT_NAME,
  WINGS_START_ISO,
  WINGS_END_ISO,
  WINGS_ADDRESS,
  WINGS_FAQ,
} from "@/lib/wings-of-freedom";

const URL = "https://windchasers.in/wings-of-freedom";
const TITLE = "Wings of Freedom - Women-Only Aviation Day, 15 Aug 2026 · WindChasers";
const DESCRIPTION =
  "A free women-only Independence Day aviation seminar in Bengaluru. Fly the simulator, talk to ATC, hear a serving airline captain, and see the Freedom to Fly scholarship revealed. 15 August 2026, 11 AM to 3:30 PM.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Explicit canonical: the pilot.windchasers.in cutover host in middleware.ts
  // makes this cheap insurance against duplicate-content indexing.
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: URL,
  },
};

/**
 * Event + FAQPage JSON-LD are emitted HERE rather than from the client page so
 * they land in server-rendered HTML unconditionally. There is no Event schema
 * anywhere else on the site.
 */
const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: WINGS_EVENT_NAME,
  description: DESCRIPTION,
  startDate: WINGS_START_ISO,
  endDate: WINGS_END_ISO,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  isAccessibleForFree: true,
  url: URL,
  location: {
    "@type": "Place",
    name: "WindChasers Aviation Academy",
    address: { "@type": "PostalAddress", ...WINGS_ADDRESS },
  },
  organizer: {
    "@type": "Organization",
    name: "WindChasers Aviation Academy",
    url: "https://windchasers.in",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: URL,
    validFrom: "2026-07-29T00:00:00+05:30",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: WINGS_FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function WingsOfFreedomLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
