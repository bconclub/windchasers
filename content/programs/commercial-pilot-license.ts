import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Certification · CPL",
  title: "Commercial Pilot",
  accent: "Licence.",
  intro:
    "Aspiring commercial pilots embark on a journey fuelled by passion and determination, ready to turn their childhood dreams into a reality among the clouds.",
  heroImage: "/facility/WC3.webp",
  metaTitle: "Commercial Pilot License (CPL) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "list",
      kicker: "Who Can Apply",
      title: "Eligibility Criteria",
      items: [
        "Age: Minimum 18 years at the time of application.",
        "Educational Foundation: Completed 10+2 with Physics and Mathematics from a recognised educational board.",
        "Physical Fitness: Must pass the Class 1 Medical examination — fit both physically and mentally to command an aircraft.",
        "Emotional Resilience: Determination, resilience in the face of challenges, and a genuine passion for aviation.",
      ],
    },
    {
      type: "steps",
      kicker: "Check Ride",
      title: "WindChasers CPL Requirements",
      steps: [
        { title: "General Flying Test by Day", body: "Daytime handling and manoeuvre mastery." },
        { title: "General Flying Test by Night", body: "Conquering the night under instructor evaluation." },
        { title: "Cross-Country Flight Test by Day", body: "Testing endurance over a 250nm route." },
        { title: "Cross-Country Flying Test by Night", body: "Night-time navigation challenge over 120nm." },
        { title: "Instrument Rating Test", body: "Instrument proficiency showcase." },
        { title: "Ground Evaluation (Oral)", body: "Demonstrate your verbal and theoretical command." },
      ],
    },
    {
      type: "richtext",
      kicker: "Important Note",
      title: "Flying Hours Vary by Country",
      paragraphs: [
        "The hours outlined for the CPL are in accordance with the standards and guidelines set forth by the Directorate General of Civil Aviation (DGCA).",
        "These hours may vary based on the specific requirements of the country chosen for flight training. Each country has its own regulations and expectations, so aspiring pilots should be prepared for potential differences on their journey towards the skies.",
      ],
    },
  ],
  related: [
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "Foreign CPL", href: "/foreign-cpl" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the first step towards a fulfilling career in the skies. Elevate your aspirations with WindChasers, where we turn dreams of flight into reality.",
};

export default content;
