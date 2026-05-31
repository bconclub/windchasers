import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Type Rating · B737",
  title: "Boeing 737",
  accent: "Type Rating.",
  intro:
    "A specialised Boeing 737 Type Rating programme for pilots aiming to operate one of the most widely flown aircraft in commercial aviation.",
  heroImage: "/migrated/boeing-737-type-rating/boeing737.webp",
  metaTitle: "Boeing 737 Type Rating | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "About the Programme",
      paragraphs: [
        "WindChasers offers a specialised Boeing 737 Type Rating programme, ideal for pilots aiming to operate one of the most trusted aircraft in aviation.",
        "The course combines ground school, full flight simulator training, and live aircraft base training to take you from systems theory to the flight deck.",
      ],
    },
    {
      type: "cards",
      kicker: "What's Covered",
      title: "Programme Highlights",
      cols: 3,
      items: [
        {
          title: "Ground School Training",
          body: "Comprehensive sessions on B737 systems, avionics, and emergency protocols.",
        },
        {
          title: "Full Flight Simulator (FFS) Training",
          body: "Training on advanced B737 simulators that replicate real-world operations.",
        },
        {
          title: "Multi-Crew Cooperation (MCC)",
          body: "Master teamwork and operational coordination in a multi-crew cockpit.",
        },
        {
          title: "Jet Orientation Course (JOC)",
          body: "Focus on high-performance jet dynamics and automation skills.",
        },
        {
          title: "Line-Oriented Flight Training (LOFT)",
          body: "Simulated airline operations to prepare you for real-world challenges.",
        },
        {
          title: "Base Training",
          body: "Live aircraft sessions to meet regulatory requirements.",
        },
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Who Can Apply",
      items: [
        "Valid CPL (Commercial Pilot Licence) with Instrument Rating (IR).",
        "Medical fitness: Class 1 Medical Certificate.",
        "English language proficiency: minimum ICAO Level 4.",
      ],
    },
    {
      type: "list",
      kicker: "Benefits",
      title: "What You Gain",
      items: [
        "Global Certification: achieve an internationally accepted B737 Type Rating.",
        "Career Mentorship: support for interviews and simulator assessments.",
        "Flexible Scheduling: choose from multiple global training centres.",
      ],
    },
    {
      type: "richtext",
      kicker: "Why WindChasers",
      title: "A Holistic Training Experience",
      paragraphs: [
        "With integrated MCC and JOC modules, experienced instructors, and modern simulators, WindChasers provides training designed to prepare you for a successful aviation career.",
        "From the first ground school session to base training on a live aircraft, the programme is structured to build the practical competence airlines look for.",
      ],
    },
  ],
  related: [
    { label: "Type Rating Hub", href: "/type-rating" },
    { label: "Airbus A320 Type Rating", href: "/airbus-a320-type-rating" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
  ],
  ctaTitle: "Ready to fly the 737?",
  ctaText:
    "Start your Boeing 737 Type Rating journey with WindChasers. Talk to our team to map out your path from CPL to the flight deck.",
};

export default content;
