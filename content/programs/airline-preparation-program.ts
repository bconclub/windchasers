import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Career Program · Airline Prep",
  title: "Airline Preparation",
  accent: "From CPL to Cockpit.",
  intro:
    "WindChasers bridges the gap between earning your CPL and landing an airline job with our Airline Preparation Program.",
  heroImage: "/migrated/airline-preparation-program/place-flying-sunset-sky_1112-1132.avif",
  metaTitle: "Airline Preparation Program | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Turn Your CPL Into a Career",
      paragraphs: [
        "Holding a Commercial Pilot License is a milestone, but airline recruitment has its own demands: written assessments, group exercises, simulator checks, and interviews.",
        "The Airline Preparation Program readies you for each of these stages so you can step into the cockpit with confidence.",
      ],
    },
    {
      type: "cards",
      kicker: "What's Included",
      title: "Program Highlights",
      cols: 2,
      items: [
        {
          title: "Written Exam Coaching",
          body: "Master complex topics like aerodynamics, navigation, and regulations.",
        },
        {
          title: "Group Discussion Skills",
          body: "Real-world simulations to enhance communication and collaboration.",
        },
        {
          title: "CASS Training",
          body: "Multitasking and decision-making practice, plus situational awareness through flight simulators.",
        },
        {
          title: "Interview Success Strategies",
          body: "Mock interviews with experts and behavioural and technical question preparation.",
        },
      ],
    },
    {
      type: "list",
      kicker: "Why WindChasers",
      title: "What Sets the Program Apart",
      items: [
        "Tailored Training: Customized to your strengths and needs.",
        "Industry Expertise: Training aligned with airline expectations.",
        "End-to-End Support: Guidance at every stage of recruitment.",
      ],
    },
  ],
  related: [
    { label: "Pre-Cadet Program", href: "/pre-cadet-program" },
    { label: "Cadet Pilot Program", href: "/cadet-pilot-program" },
    { label: "Cadet Interview Training", href: "/airline-cadet-program-interview-training" },
    { label: "Airline Pathway", href: "/airline" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Turn your CPL into a career.",
  ctaText:
    "Step into the cockpit with confidence. Contact us to start your airline preparation journey.",
};

export default content;
