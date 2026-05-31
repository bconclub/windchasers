import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Career Program · Pre-Cadet",
  title: "Pre-Cadet",
  accent: "Program.",
  intro:
    "A structured pathway to an airline career. Prepare for competitive airline cadet programs with the WindChasers Pre-Cadet Program.",
  heroImage:
    "/migrated/pre-cadet-program/aircrew-member-flying-plane-from-cockpit-with-dashboard-command-control-panel-using-steering-wheel-control-panel-windscreen-navigation-woman-using-lever-fly-aircraft.webp",
  metaTitle: "Pre-Cadet Program | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "What is the Pre-Cadet Program?",
      paragraphs: [
        "The Pre-Cadet Program provides aspiring pilots with the essential skills, knowledge, and preparation needed to succeed in cadet selection processes.",
        "It covers everything from written-exam fundamentals to interview readiness and aptitude testing, so you walk into a cadet assessment knowing what to expect.",
      ],
    },
    {
      type: "cards",
      kicker: "What's Included",
      title: "Program Highlights",
      cols: 2,
      items: [
        {
          title: "Written Exam Preparation",
          body: "Master mathematics, physics, aviation knowledge, and logical reasoning.",
        },
        {
          title: "Interview Readiness",
          body: "Mock interviews and HR question training, with personalized feedback for improvement.",
        },
        {
          title: "CASS Training",
          body: "Psychomotor skills, situational awareness, and flight simulator practice to enhance readiness.",
        },
        {
          title: "Airline-Specific Guidance",
          body: "Tailored preparation for your chosen airline's requirements.",
        },
      ],
    },
    {
      type: "list",
      kicker: "Why WindChasers",
      title: "The WindChasers Advantage",
      items: [
        "Expert Guidance: Learn from aviation professionals.",
        "Comprehensive Curriculum: From technical to interpersonal skills.",
        "Personalized Support: Tailored training to maximize your success.",
      ],
    },
  ],
  related: [
    { label: "Cadet Pilot Program", href: "/cadet-pilot-program" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Cadet Interview Training", href: "/airline-cadet-program-interview-training" },
    { label: "Airline Pathway", href: "/airline" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Your journey starts here.",
  ctaText:
    "Contact us to begin your cadet program preparation today and take the first structured step towards an airline career.",
};

export default content;
