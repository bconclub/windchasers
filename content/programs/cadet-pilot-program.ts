import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Career Program · Cadet",
  title: "Cadet Pilot",
  accent: "Program.",
  intro:
    "Conquer your cadet exam with WindChasers. Specialized preparation in Bangalore for India's airline cadet pilot programs.",
  heroImage:
    "/migrated/cadet-pilot-program/cheerful-young-man-airline-worker-touching-captain-hat-smiling-while-standing-airfield-with-airplane-background-2048x1365.webp",
  metaTitle: "Cadet Pilot Program | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Preparing for the Cadet Program",
      paragraphs: [
        "The cadet pilot program in India has transformed the journey to becoming a pilot for many hopefuls, known for its excellence and rigorous selection process.",
        "WindChasers offers specialized training to prepare students thoroughly for these programs, focusing on the skills, guidance, and practical experience essential for success in aviation careers.",
        "In India, airlines like Air India, IndiGo, SpiceJet, and AirAsia run cadet pilot training programs, giving aspiring pilots a structured route into the cockpit.",
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Cadet Program Requirements",
      intro:
        "Applicants must meet the following criteria to be considered for the programme.",
      items: [
        "Must be between 18 and 32 years of age.",
        "Have a valid passport and the unrestricted right to live and work in India, with the ability to travel unrestricted worldwide.",
        "Fluent in English (verbal and written).",
        "Able to obtain and maintain an Indian DGCA Class 1 Medical Certificate.",
        "Minimum education: 10+2 with at least 51% / Grade Point 6 / Grade C1 individually in Physics, Mathematics, and English (or a higher degree in these subjects with a minimum of 51%).",
        "Candidates without an Indian Class 1 medical may apply for the IndiGo programme with a Class II medical, but must hold an Indian Class 1 medical before commencing the programme.",
      ],
    },
    {
      type: "steps",
      kicker: "Selection",
      title: "Selection Criteria & Assessment",
      steps: [
        {
          title: "Stage 1: Online Assessment Test",
          body: "Computer-based testing of pilot aptitude (hand/eye co-ordination, motor skills, spatial awareness), academic, mathematical and technical capacity, a multiple-choice technical reasoning test, and a dynamic multi-task test.",
        },
        {
          title: "Stage 2: Group Activity",
          body: "After passing the online test, you are invited to a group activity in front of an IndiGo selection panel, assessing communication skills and team coordination.",
        },
        {
          title: "Stage 3: Personal Interview",
          body: "A 1-to-1 personal interview with the selection panel.",
        },
      ],
    },
    {
      type: "list",
      kicker: "How We Prepare You",
      title: "Preparation Material",
      items: [
        "Physics",
        "Mathematics",
        "English",
        "General reasoning",
        "General knowledge about aviation",
      ],
    },
  ],
  related: [
    { label: "Pre-Cadet Program", href: "/pre-cadet-program" },
    { label: "Cadet Interview Training", href: "/airline-cadet-program-interview-training" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Airline Pathway", href: "/airline" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Conquer your cadet exam.",
  ctaText:
    "Get specialized, structured preparation from instructors who know the cadet selection process inside out.",
};

export default content;
