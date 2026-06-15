import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Certification · ATPL",
  title: "Airline Transport Pilot",
  accent: "License.",
  intro:
    "Embarking on the journey to become an Airline Transport Pilot is a thrilling endeavour filled with determination and passion for the skies. The ATPL is the highest level of pilot certification, the licence to command large multi-crew airliners.",
  heroImage: "/WC HEro.webp",
  metaTitle: "Airline Transport Pilot License (ATPL) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "list",
      kicker: "Milestones",
      title: "Eligibility Criteria",
      intro: "To hold an ATPL, you must meet each of these milestones.",
      items: [
        "Age of Aspiration: At least 21 years old.",
        "Flying Credentials: Holding a Multi-Crew Pilot License (MPL) or Commercial Pilot License (CPL).",
        "Health and Vitality: A Class 1 Medical Certificate.",
        "Language Proficiency: Proficiency in reading, speaking, writing, and understanding English, the universal language of aviation.",
        "Academic Triumph: Clearing the ATPL theoretical knowledge exams.",
        "Flight Experience: Accumulating at least 1,500 hours of total flight time.",
      ],
    },
    {
      type: "steps",
      kicker: "Training & Examination",
      title: "The ATPL Pathway",
      steps: [
        { title: "Learn the Theory", body: "Study with an approved flight training operator and master the ATPL theoretical subjects." },
        { title: "Pass the ATPL Theory Exam", body: "Clear the written examinations covering your chosen aircraft rating." },
        { title: "English Language Proficiency", body: "Complete an aviation English Language Proficiency assessment." },
        { title: "Flight Training", body: "Train as pilot-in-command in a multi-crew operation, covering instrument, multi-engine and multi-crew skills." },
        { title: "ATPL Flight Test", body: "Conduct the ATPL flight test on completion of training." },
        { title: "Licence Maintenance", body: "Keep the licence active with flight reviews and instrument proficiency checks (IPCs)." },
      ],
    },
    {
      type: "list",
      kicker: "Theory Subjects",
      title: "What You'll Study",
      items: [
        "Air Law",
        "Human Factors",
        "Meteorology",
        "Navigation",
        "Flight Planning",
        "Performance",
        "Aircraft Systems",
        "Instrument Rating Theory (aeroplane licence)",
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Quick Facts",
      items: [
        { label: "Minimum Flight Hours", value: "1,500 hrs" },
        { label: "Medical", value: "Class 1" },
        { label: "Minimum Age", value: "21 yrs" },
        { label: "Prerequisite", value: "CPL / MPL" },
      ],
    },
    {
      type: "richtext",
      kicker: "In Summary",
      title: "A Comprehensive Pathway",
      paragraphs: [
        "This pathway outlines the steps, requirements, and examinations needed to obtain and maintain an Airline Transport Pilot License (ATPL).",
        "Most pilots clear the ATPL theory exams early in their career and convert the licence once they have accumulated the required flying hours as an airline first officer.",
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
  ],
  ctaTitle: "Reach for the stars.",
  ctaText:
    "Talk to a WindChasers advisor about the ATPL pathway and how to plan your hours and exams toward airline command.",
};

export default content;
