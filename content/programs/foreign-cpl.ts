import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Certification · Foreign CPL",
  title: "Foreign CPL",
  accent: "Conversion.",
  intro:
    "At WindChasers, we specialise in making your transition from international flight training to a successful aviation career in India seamless. Our Foreign CPL conversion services provide end-to-end guidance tailored to your needs.",
  heroImage: "/facility/WC5.webp",
  metaTitle: "Foreign CPL Conversion | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Foreign CPL (Commercial Pilot License)",
      paragraphs: [
        "Many Indian students complete their commercial pilot training abroad — where weather and aircraft availability allow faster hour-building — and then convert that licence to a DGCA CPL when they return home.",
        "We guide you through every stage, from documentation to your Indian CPL, so your foreign licence and hours translate cleanly into an Indian one.",
      ],
    },
    {
      type: "cards",
      kicker: "Our Services",
      title: "What WindChasers Helps With",
      items: [
        { title: "Documentation Assistance", body: "Complete support assembling and submitting required documentation, ensuring compliance with DGCA regulations." },
        { title: "Indian FTO Slot Allocation", body: "Pre-booked slots with reputable Indian Flight Training Organisations (FTOs) to minimise waiting times." },
        { title: "Ground Training & Exam Prep", body: "Tailored coaching for DGCA exams, designed to meet Indian aviation standards." },
        { title: "Practical Flight Training Support", body: "Training with established Indian FTOs to fulfil DGCA skill-verification requirements." },
        { title: "End-to-End Guidance", body: "From application to obtaining your Indian CPL, we're with you at every step." },
      ],
    },
    {
      type: "cards",
      kicker: "Why WindChasers",
      title: "Why Convert With Us",
      cols: 3,
      items: [
        { title: "Experience", body: "Hands-on experience with CPL conversions and Indian aviation requirements." },
        { title: "Efficiency", body: "Reduced waiting periods with pre-booked FTO slots." },
        { title: "Personalised Support", body: "Tailored assistance for a smooth journey." },
      ],
    },
    {
      type: "richtext",
      kicker: "A Note on Conversion",
      title: "Plan Against Current Rules",
      paragraphs: [
        "DGCA conversion requirements can change over time. We keep our guidance current so you always prepare against the latest rules — and there are no surprises when you return.",
      ],
    },
  ],
  related: [
    { label: "License Conversion Course", href: "/license-conversion-course" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
  ],
  ctaTitle: "Get started today.",
  ctaText:
    "Contact WindChasers to secure your slot and take the next step toward your aviation career in India.",
};

export default content;
