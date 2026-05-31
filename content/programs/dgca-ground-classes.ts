import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Ground Training · DGCA",
  title: "DGCA Ground",
  accent: "Classes.",
  intro:
    "Earning your wings in India starts on the ground. Before any aspiring pilot takes to the skies, they must master the theoretical knowledge required by the Directorate General of Civil Aviation (DGCA) — the foundation for a Commercial Pilot License.",
  heroImage: "/migrated/dgca-ground-classes/dgca-1536x769.webp",
  metaTitle: "DGCA Ground Classes | WindChasers Aviation Academy",
  blocks: [
    {
      type: "cards",
      kicker: "Core Curriculum",
      title: "DGCA Ground Classes Subjects",
      intro:
        "Our DGCA course covers all the core subjects mandated by India's aviation authority, taught by instructors well-versed in aviation theory and practice.",
      cols: 3,
      items: [
        { title: "Air Navigation", body: "Route planning, charts, instruments, and the principles of finding your way through the air." },
        { title: "Aviation Meteorology", body: "Reading the weather — atmosphere, cloud formation, winds, and conditions that affect flight." },
        { title: "Air Regulations", body: "The rules and laws that govern Indian airspace and pilot conduct." },
        { title: "Technical General", body: "Aircraft systems, aerodynamics, and the engineering fundamentals every pilot must know." },
        { title: "Technical Specific", body: "Type-specific aircraft knowledge applied to the aircraft you train and fly on." },
        { title: "RTR (Aero)", body: "Radio telephony procedures for clear, correct communication with air traffic control." },
      ],
    },
    {
      type: "list",
      kicker: "How We Teach",
      title: "Quality of Education",
      intro:
        "Our pilot ground classes go beyond textbooks. The curriculum adheres strictly to DGCA regulatory standards, so students receive comprehensive, up-to-date instruction.",
      items: [
        "Thorough instruction on each subject from experienced aviation instructors.",
        "Interactive ground classes, study materials, and mock tests to reinforce key concepts.",
        "Personalised assistance and supplementary support tailored to individual learning needs.",
        "A low student-to-teacher ratio of 25:1 for individualised attention.",
        "Individualised learning plans built around each student's strengths and goals.",
        "Continuous assessment and constructive feedback to track progress.",
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Course Format",
      items: [
        { label: "Core Subjects", value: "5" },
        { label: "Student : Teacher", value: "25:1" },
        { label: "Plus Radio Telephony", value: "RTR" },
        { label: "Leads To", value: "CPL" },
      ],
    },
    {
      type: "richtext",
      kicker: "Why It Matters",
      title: "The Foundation for Flight",
      paragraphs: [
        "Cracking these vital DGCA assessments opens access to the skies via flight training. Selecting a quality DGCA curriculum is key before ever taking flight.",
        "We foster an encouraging, supportive environment where students feel comfortable asking questions, engaging in discussions, and receiving tailored feedback to strengthen their understanding and performance.",
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "Diploma in Aviation", href: "/diploma-in-aviation" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
    { label: "Certified Flight Instructor", href: "/certified-flight-instructor" },
    { label: "IELTS Training Program", href: "/ielts-training-program" },
  ],
  ctaTitle: "Start on the ground. Finish in the sky.",
  ctaText:
    "Build the theoretical foundation every Indian pilot needs. Talk to us about joining the next batch of WindChasers DGCA ground classes.",
};

export default content;
