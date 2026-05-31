import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Integrated Program · Diploma",
  title: "Diploma in",
  accent: "Aviation.",
  intro:
    "An integrated program for aspiring commercial pilots that combines theoretical instruction with practical flight training, giving you a well-rounded path from ground school to the cockpit.",
  heroImage: "/migrated/diploma-in-aviation/main-24-1536x1160.webp",
  metaTitle: "Diploma in Aviation | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "A Comprehensive Aviation Education",
      paragraphs: [
        "Our Diploma in Aviation program for commercial pilots is built around an integrated curriculum that emphasises a forward-thinking approach to aviation education and a comprehensive understanding of aviation fundamentals.",
        "Throughout the program, students engage in intensive ground school sessions and immersive flight exercises, ensuring a learning experience that combines theoretical knowledge with hands-on practice.",
        "Upon successful completion, graduates obtain a range of certifications — affirming their competency and readiness to excel in the dynamic aviation industry.",
      ],
    },
    {
      type: "list",
      kicker: "Who Can Apply",
      title: "Eligibility",
      items: [
        "Age: Minimum 17 years.",
        "Qualifications: Completion of 10+2 with Mathematics and Physics.",
        "English Proficiency: IELTS or PTE required for Canada and New Zealand.",
        "South Africa: No specific English proficiency test required.",
      ],
    },
    {
      type: "cards",
      kicker: "What's Included",
      title: "Course Inclusions",
      cols: 3,
      items: [
        { title: "Private Pilot License", body: "Your first certification and the foundation of all pilot training." },
        { title: "Commercial Pilot License", body: "The qualification that lets you fly professionally for compensation." },
        { title: "Multi-Engine Instrument Rating", body: "Training to fly multi-engine aircraft and operate under instrument flight rules." },
        { title: "Night Rating", body: "Certification to safely operate aircraft after dark." },
        { title: "VFR Over The Top Rating", body: "Flying under visual flight rules above a cloud layer." },
        { title: "Diploma in Aviation", body: "The diploma credential awarded on successful completion of the program." },
      ],
    },
    {
      type: "gallery",
      kicker: "Inside the Program",
      title: "Gallery",
      images: [
        "/migrated/diploma-in-aviation/gallery-20-1024x767.webp",
        "/migrated/diploma-in-aviation/gallery-21-1024x767.webp",
        "/migrated/diploma-in-aviation/gallery-22-1024x683.webp",
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
    { label: "IELTS Training Program", href: "/ielts-training-program" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the first step towards a fulfilling career in the skies. Enrol in the WindChasers Diploma in Aviation and earn every certification you need to fly professionally.",
};

export default content;
