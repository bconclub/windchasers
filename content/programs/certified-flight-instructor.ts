import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Rating · CFI",
  title: "Certified Flight",
  accent: "Instructor.",
  intro:
    "Earning a Certified Flight Instructor (CFI) certificate can be a pivotal step in your aviation career, letting you accumulate flight experience while sharing your knowledge with aspiring pilots.",
  heroImage: "/migrated/certified-flight-instructor/gallery-27.webp",
  metaTitle: "Certified Flight Instructor (CFI) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Why Pursue a CFI Certificate?",
      paragraphs: [
        "Becoming a Certified Flight Instructor offers various advantages, with the primary motivation often being the ability to gain valuable experience and flight hours. Many aviation roles, particularly those in commercial airlines, require a specific amount of flight time for eligibility.",
        "The role of a flight instructor offers a dynamic environment, enabling instructors to accrue flight hours steadily. Teaching others to operate aircraft safely not only imparts knowledge to students but also reinforces and enhances the instructor's own understanding gained during initial flight training.",
        "Over time, flight instructors evolve into highly knowledgeable and skilled pilots, entrusted with training and endorsing fellow pilots for the PPL/CPL test.",
      ],
    },
    {
      type: "richtext",
      kicker: "Timeframe",
      title: "Obtaining a Flight Instructor Certificate",
      paragraphs: [
        "While there is no set timeframe for obtaining a flight instructor certificate, aspiring instructors must first acquire a commercial pilot license, a prerequisite for eligibility. The CPL requires a minimum of 250 flight hours, alongside other associated requirements.",
        "Essentially, individuals aiming to become flight instructors embark on this path from the start of their flight training, progressing through various ratings and milestones along the way.",
      ],
    },
    {
      type: "cards",
      kicker: "Certifications",
      title: "Types of Flight Instructor Certifications",
      cols: 2,
      items: [
        { title: "Certified Flight Instructor (CFI)", body: "Instructs on single-engine aircraft." },
        { title: "Multi-Engine Instructor (MEI)", body: "Instructs on multi-engine aircraft." },
      ],
    },
    {
      type: "richtext",
      title: "A Commitment to Continuous Learning",
      paragraphs: [
        "Becoming a Certified Flight Instructor is not just a career choice; it is a commitment to continuous learning and a dedication to shaping the next generation of aviators. If you are ready to take on the challenge and experience the rewards of imparting aviation knowledge, the journey to becoming a CFI awaits you.",
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Multi-Engine Instrument Rating (MEIR)", href: "/multi-engine-instrument-rating-meir" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the next step in your aviation career with WindChasers Aviation Academy, talk to us about batches, aircraft availability and fees.",
};

export default content;
