import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Career Program · Interview Prep",
  title: "Airline Cadet Program",
  accent: "Interview Training.",
  intro:
    "Prepare for the skies with WindChasers' Airline Cadet Program prep training in Bangalore, led by experienced instructors.",
  heroImage: "/migrated/airline-cadet-program-interview-training/plane-18.webp",
  metaTitle: "Airline Cadet Program Interview Training | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "About the Course",
      paragraphs: [
        "This prep training takes you through every phase of the airline cadet selection process, from the written test through to the final personal interview.",
        "Each phase is guided by experienced instructors, with practice material and mock assessments designed to build your confidence.",
      ],
    },
    {
      type: "steps",
      kicker: "Stages",
      title: "The Three Phases",
      steps: [
        {
          title: "Phase 1: Written Test",
          body: "Examinations in Physics, Mathematics, and English. WindChasers provides comprehensive notes with formulas and examples for effective revision, plus five mock tests to gauge progress and sharpen exam skills.",
        },
        {
          title: "Phase 2: ADAPT Simulator",
          body: "Assessments in Mathematics, Physics, and English, along with the Physical Assessment Stage (FAST), the ADAPT Personality Questionnaire (APQ), and Flight Simulator and joystick flying tests, followed by a Skype interview. Simulator and joystick training continues until candidates are proficient.",
        },
        {
          title: "Phase 3: Group Discussion & Personal Interview",
          body: "A group activity/discussion and personal interviews with IndiGo. Technical classes cover aircraft instruments and related topics, and rigorous mock interviews build candidate confidence.",
        },
      ],
    },
  ],
  related: [
    { label: "Pre-Cadet Program", href: "/pre-cadet-program" },
    { label: "Cadet Pilot Program", href: "/cadet-pilot-program" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Airline Pathway", href: "/airline" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Prepare for the skies.",
  ctaText:
    "Train through every phase of cadet selection with experienced instructors and rigorous mock assessments.",
};

export default content;
