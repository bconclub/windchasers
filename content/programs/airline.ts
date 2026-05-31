import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Airline Track",
  title: "Airline Pilot",
  accent: "Programs.",
  intro:
    "WindChasers prepares aspiring airline pilots from selection through to the right seat, with cadet programs, airline preparation, and interview training.",
  heroImage: "/facility/WC1.webp",
  metaTitle: "Airline Pilot Programs | WindChasers Aviation Academy",
  blocks: [
    {
      type: "cards",
      kicker: "Programs",
      title: "Our Airline-Track Programs",
      intro:
        "Each program targets a different stage of the airline pathway. Use the links below to explore the one that matches where you are now.",
      cols: 2,
      items: [
        {
          title: "Pre-Cadet Program",
          body:
            "An entry point for candidates preparing for cadet selection, building the aptitude, knowledge, and study habits needed before applying to an airline cadet scheme. See the Pre-Cadet Program page for details.",
        },
        {
          title: "Cadet Pilot Program",
          body:
            "A structured route from ab-initio training towards an airline cadet pathway, aligning your flying and ground training with what airlines expect. See the Cadet Pilot Program page for details.",
        },
        {
          title: "Airline Preparation Program",
          body:
            "For licensed pilots preparing for airline recruitment, covering the knowledge and skills airlines assess during selection. See the Airline Preparation Program page for details.",
        },
        {
          title: "Airline Cadet Program & Interview Training",
          body:
            "Focused preparation for airline cadet selection and interviews, including assessment practice and interview technique. See the Airline Cadet Program & Interview Training page for details.",
        },
      ],
    },
    {
      type: "list",
      kicker: "Why",
      title: "Why the Airline Track",
      items: [
        "A structured pathway that takes you stage by stage towards a first officer role.",
        "Training aligned with what airlines look for during selection and on the line.",
        "Interview and assessment preparation to help you perform on recruitment day.",
        "Mentors with airline and instructional experience to guide your progress.",
      ],
    },
  ],
  related: [
    { label: "Pre-Cadet Program", href: "/pre-cadet-program" },
    { label: "Cadet Pilot Program", href: "/cadet-pilot-program" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Airline Cadet Program & Interview Training", href: "/airline-cadet-program-interview-training" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Aiming for the airlines?",
  ctaText:
    "Talk to our team about which airline-track program fits your stage and your goals.",
};

export default content;
