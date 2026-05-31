import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Certification · License Conversion",
  title: "License Conversion",
  accent: "Course.",
  intro:
    "WindChasers recognises the aspirations of pilots who have earned their professional licences abroad and wish to pursue a career in India. Our License Conversion Course helps you convert a valid overseas CPL or CPL/IR to Indian CPL standards.",
  heroImage: "/facility/WC1.webp",
  metaTitle: "Pilot License Conversion Course (DGCA) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "list",
      kicker: "Course Overview",
      title: "Who It's For & What's Included",
      items: [
        "Target Audience: Holders of a valid CPL or CPL/IR licence issued abroad.",
        "Course Offerings: Available for both single-engine and multi-engine aircraft.",
        "Expert Guidance: Preparation for the License Conversion Examination conducted by the DGCA, ensuring compliance with Indian regulatory standards.",
        "Supportive Environment: Access to experienced instructors and comprehensive resources to aid a successful conversion.",
      ],
    },
    {
      type: "steps",
      kicker: "Conversion Program",
      title: "The Steps to an Indian CPL",
      steps: [
        { title: "DGCA Class 2 Medical", body: "Obtain medical certification from the DGCA." },
        { title: "RTR (P)", body: "Commonwealth-country-trained pilots are exempt; non-Commonwealth-trained pilots must pass the exam." },
        { title: "FRTOL", body: "Obtain the Flight Radio Telephony Operator's License (FRTOL) after clearing the RTR." },
        { title: "DGCA Class 1 Medical", body: "Can be processed simultaneously with the RTR application." },
        { title: "Flying Training", body: "Conversion flying is approximately 12 to 13 hours, costing around ₹4 to ₹4.5 lakhs depending on aircraft type, plus recency flying tailored to your needs." },
        { title: "CPL License Application", body: "Submit your application after completing all required documentation." },
      ],
    },
    {
      type: "cards",
      kicker: "Why WindChasers",
      title: "Why Convert With Us",
      cols: 3,
      items: [
        { title: "Industry Experience", body: "Years of experience in aviation education and training." },
        { title: "Government Compliance", body: "Adherence to DGCA regulations and guidelines." },
        { title: "Career Opportunities", body: "Facilitating entry into the dynamic Indian civil aviation sector." },
      ],
    },
    {
      type: "richtext",
      kicker: "Explore WindChasers",
      title: "Begin Your Conversion Journey",
      paragraphs: [
        "Explore our detailed course curriculum and enrolment requirements to begin converting your foreign pilot licence to an Indian CPL.",
        "WindChasers is committed to supporting your professional aspirations in the thriving Indian aviation landscape.",
      ],
    },
  ],
  related: [
    { label: "Foreign CPL", href: "/foreign-cpl" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
  ],
  ctaTitle: "Schedule a call.",
  ctaText:
    "Talk to a WindChasers advisor about converting your foreign licence to a DGCA CPL and entering the Indian aviation sector.",
};

export default content;
