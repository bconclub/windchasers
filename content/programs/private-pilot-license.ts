import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Certification · PPL",
  title: "Private Pilot",
  accent: "License.",
  intro:
    "Every requirement, every milestone brings aspiring pilots one step closer to their dreams. Each moment in the air is filled with anticipation, excitement, and the determination to fly.",
  heroImage: "/facility/WC3.webp",
  metaTitle: "Private Pilot License (PPL) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Where It Begins",
      title: "What is a Private Pilot License?",
      paragraphs: [
        "A Private Pilot License (PPL) is the entry-level licence that allows you to fly a single-engine aircraft as Pilot-in-Command for private, non-commercial purposes. It is the first formal step toward becoming a commercial or airline pilot, and it builds the core stick-and-rudder skills every aviator relies on.",
        "At WindChasers, your PPL training combines DGCA ground-school subjects with hands-on flying, so you learn to handle the aircraft, navigate, and make sound decisions in the air.",
      ],
    },
    {
      type: "list",
      kicker: "Theory Examinations",
      title: "DGCA Ground Subjects",
      intro: "The PPL theory papers cover the foundations of flight, weather, regulations, and communication.",
      items: [
        "Air Regulations",
        "Aviation Meteorology",
        "Air Navigation",
        "RTR(A), Radio Telephony",
        "Aircraft Technical (General)",
      ],
    },
    {
      type: "steps",
      kicker: "Your Path",
      title: "From Enrolment to Licence",
      steps: [
        { title: "Enrol & Medical", body: "Complete your DGCA Class 2 medical and enrolment formalities." },
        { title: "Ground School", body: "Study the DGCA PPL theory subjects and clear the exams." },
        { title: "Flight Training", body: "Build dual and solo hours including cross-country flying." },
        { title: "Skill Test", body: "Pass the flight test with a DGCA examiner to earn your licence." },
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Quick Facts",
      items: [
        { label: "Minimum Flight Hours", value: "40 hrs" },
        { label: "Medical", value: "Class 2" },
        { label: "Typical Duration", value: "6–12 mo" },
        { label: "Ground Papers", value: "5" },
      ],
    },
    {
      type: "richtext",
      kicker: "Important Note",
      title: "Flying Hours Vary by Country",
      paragraphs: [
        "The hours outlined above are in accordance with the standards and guidelines set forth by the Directorate General of Civil Aviation (DGCA).",
        "These hours may vary based on the specific requirements of the country chosen for flight training. Each country has its own regulations and expectations, so aspiring pilots should be prepared for potential differences on their journey towards the skies.",
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the first step towards a fulfilling career in the skies. Talk to a WindChasers advisor about PPL ground classes, flight hours, and a plan that fits your goals.",
};

export default content;
