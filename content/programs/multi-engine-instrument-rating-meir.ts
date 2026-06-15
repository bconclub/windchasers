import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Rating · MEIR",
  title: "Multi-Engine Instrument Rating",
  accent: "MEIR.",
  intro:
    "Advance your aviation career with our MEIR conversion services. Whether you have prior multi-engine experience or are starting fresh, WindChasers provides comprehensive support to help you achieve your goals.",
  heroImage: "/migrated/multi-engine-instrument-rating-meir/Multi-Engine-Rating-1024x555.jpg",
  metaTitle: "Multi-Engine Instrument Rating (MEIR) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "What is MEIR?",
      paragraphs: [
        "The Multi-Engine Instrument Rating (MEIR) qualifies pilots to operate multi-engine aircraft under Instrument Flight Rules (IFR), a crucial step for airline careers.",
      ],
    },
    {
      type: "steps",
      kicker: "How It Works",
      title: "Our MEIR Process",
      steps: [
        { title: "Assessment of Experience", body: "Streamlined conversion for experienced pilots and personalised training plans for beginners." },
        { title: "Instrument Rating Training", body: "IFR navigation and emergency handling, with advanced manoeuvres for diverse conditions." },
        { title: "Multi-Engine Flight Training", body: "Hands-on training on well-maintained multi-engine aircraft." },
        { title: "DGCA-Compliant Curriculum", body: "Training aligned with Indian aviation standards for seamless certification." },
      ],
    },
    {
      type: "cards",
      kicker: "Why WindChasers",
      title: "From Ground to the Skies",
      cols: 3,
      items: [
        { title: "Comprehensive Training", body: "From basic to advanced multi-engine operations." },
        { title: "Seasoned Instructors", body: "Learn from instructors with extensive aviation experience." },
        { title: "Integrated Process", body: "Efficient and hassle-free training pathways." },
      ],
    },
  ],
  related: [
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Take off with confidence.",
  ctaText:
    "Begin your MEIR journey today. Let WindChasers Aviation Academy guide you toward your airline career, talk to us about batches and fees.",
};

export default content;
