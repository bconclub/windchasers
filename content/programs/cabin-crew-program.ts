import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Cabin Crew · Aviation Careers",
  title: "Cabin Crew",
  accent: "Program.",
  intro:
    "Dream of travelling the world, meeting new people, and turning every day into an adventure? The WindChasers Cabin Crew Program is your gateway to a career in the skies.",
  heroImage: "/migrated/cabin-crew-program/cabin-crew-lift-luggage-bag-airplane.webp",
  metaTitle: "Cabin Crew Program | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Why WindChasers",
      title: "Training Designed to Get You Job-Ready",
      paragraphs: [
        "At WindChasers, we make your dream of a high-flying career accessible with affordable, high-quality training designed to get you job-ready fast — through expert-led courses, confidence-building mock interviews, and direct connections to leading airlines.",
        "Our job placement assistance connects you directly to leading airlines and recruitment events, ensuring a smooth takeoff to your career.",
      ],
    },
    {
      type: "cards",
      kicker: "What You Learn",
      title: "Program Highlights",
      items: [
        { title: "Safety & Survival Training", body: "Handle emergencies like a pro." },
        { title: "Customer Service Mastery", body: "Deliver 5-star experiences." },
        { title: "Global Awareness", body: "Navigate diverse cultures with ease." },
        { title: "Professional Image Workshops", body: "Stand out with confidence." },
        { title: "Mock Flights", body: "Experience real-world scenarios before takeoff." },
      ],
    },
    {
      type: "list",
      kicker: "Who We're Looking For",
      title: "Eligibility",
      items: [
        "Age: 18+ and ready for adventure.",
        "Language Skills: Fluent in English (other languages are a plus).",
        "People Skills: Great with people and passionate about making connections.",
        "Fitness: Physically fit for a dynamic lifestyle.",
      ],
    },
    {
      type: "cards",
      kicker: "Key Benefits",
      title: "What Sets the Program Apart",
      cols: 2,
      items: [
        { title: "Affordable", body: "Debt-free training for everyone." },
        { title: "Intensive & Job-Ready", body: "A results-driven curriculum for immediate impact." },
        { title: "Industry Connections", body: "Networking with top recruiters for faster career entry." },
        { title: "Focused Training", body: "Get airline-ready with practical, hands-on learning." },
      ],
    },
    {
      type: "richtext",
      kicker: "Career Outlook",
      title: "What's in It for You",
      paragraphs: [
        "A world of opportunities awaits — our graduates have secured roles with top airlines, excelling on luxury international routes and regional flights alike.",
      ],
    },
  ],
  related: [
    { label: "Diploma in Aviation", href: "/diploma-in-aviation" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "Helicopter Training", href: "/helicopter-training" },
    { label: "Women in Aviation", href: "/women-in-aviation" },
  ],
  ctaTitle: "Start your cabin crew career today.",
  ctaText:
    "Take the first step toward a high-flying career. With airline-focused training and placement assistance, WindChasers helps you get airline-ready fast.",
};

export default content;
