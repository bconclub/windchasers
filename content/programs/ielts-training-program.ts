import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Language Training · IELTS",
  title: "IELTS Training",
  accent: "Program.",
  intro:
    "Comprehensive IELTS coaching designed to equip aspiring pilots and students with the English language proficiency needed to train and work abroad.",
  heroImage: "/migrated/ielts-training-program/pilot-22-1536x1024.webp",
  metaTitle: "IELTS Training Program | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Your Partner for IELTS Success",
      paragraphs: [
        "Whether you are aspiring to become a pilot or pursuing opportunities abroad, our IELTS coaching programs are designed to equip you with the language proficiency needed to reach new heights.",
        "Beyond IELTS coaching, we understand the importance of additional certifications for aspiring pilots, and our programs help you prepare for success in your pilot training journey abroad.",
      ],
    },
    {
      type: "cards",
      kicker: "Why WindChasers",
      title: "What Sets Our Coaching Apart",
      cols: 3,
      items: [
        { title: "Expertise in IELTS", body: "Experienced trainers and a track record of success, with specialised coaching programs tailored to your needs." },
        { title: "Comprehensive Support", body: "Preparation that goes beyond IELTS to cover the additional exams aspiring pilots need to clear with confidence." },
        { title: "Personalised Guidance", body: "Individual attention and resources whether you aim for academic excellence, career advancement, or immigration." },
      ],
    },
    {
      type: "cards",
      kicker: "Why IELTS",
      title: "Why It Matters for Pilots",
      cols: 3,
      items: [
        { title: "Global Recognition", body: "IELTS is recognised by thousands of organisations worldwide, aviation authorities, universities, employers, and immigration agencies." },
        { title: "Language Proficiency", body: "Pilots must demonstrate English proficiency to fly safely and communicate effectively with air traffic control and passengers." },
        { title: "Gateway to Opportunities", body: "A strong score opens doors to international pilot training, further education, career advancement, and immigration." },
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "Diploma in Aviation", href: "/diploma-in-aviation" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
  ],
  ctaTitle: "Score high. Fly far.",
  ctaText:
    "Build the English proficiency that opens doors to international pilot training and opportunities abroad. Talk to a WindChasers IELTS expert today.",
};

export default content;
