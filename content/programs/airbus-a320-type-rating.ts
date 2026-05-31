import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Type Rating · A320",
  title: "Airbus A320",
  accent: "Type Rating.",
  intro:
    "The Airbus A320 type rating qualifies you to operate one of the most widely flown narrow-body airliners in the world. Train on modern simulators and step into the right seat job-ready.",
  heroImage: "/migrated/airbus-a320-type-rating/img-51.webp",
  metaTitle: "Airbus A320 Type Rating | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "What is the A320 Type Rating?",
      paragraphs: [
        "The Airbus A320 is one of the most popular narrow-body aircraft families in commercial aviation, flown by airlines across India and worldwide.",
        "A type rating is a mandatory certification that allows a licensed commercial pilot to operate a specific aircraft type. This program prepares you for the A320 type rating examination and your transition to airline operations.",
      ],
    },
    {
      type: "cards",
      kicker: "Highlights",
      title: "Programme Highlights",
      items: [
        { title: "Modern Simulators", body: "Train on full-flight A320 simulators that replicate real cockpit systems and procedures." },
        { title: "Experienced Instructors", body: "Learn from instructors with airline and type-rating examiner experience." },
        { title: "Airline-Ready", body: "Graduate prepared for airline assessments and the right seat of an A320." },
        { title: "Systems Knowledge", body: "Master A320 aircraft systems, automation, and standard operating procedures." },
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Who Can Apply",
      items: [
        "Valid Commercial Pilot License (CPL).",
        "Multi-engine instrument rating recommended.",
        "Class 1 Medical certificate.",
        "Cleared DGCA examinations as applicable.",
      ],
    },
  ],
  related: [
    { label: "Boeing 737 Type Rating", href: "/boeing-737-type-rating" },
    { label: "Type Rating", href: "/type-rating" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
  ],
  ctaTitle: "Ready to fly the A320?",
  ctaText:
    "Talk to our team about the A320 type rating and your path into airline operations.",
};

export default content;
