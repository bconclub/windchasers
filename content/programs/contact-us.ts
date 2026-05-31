import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Contact · WindChasers",
  title: "Get in touch",
  accent: "with us.",
  intro:
    "Questions about training, eligibility, or funding? Reach the WindChasers team in Bengaluru and we will help you plan your next step.",
  heroImage: "/facility/WC1.webp",
  metaTitle: "Contact WindChasers Aviation Academy | Bangalore",
  blocks: [
    {
      type: "richtext",
      kicker: "We’re Here to Help",
      title: "Talk to the team",
      paragraphs: [
        "Whether you are just starting to explore a career in aviation or are ready to enroll, our team is happy to walk you through your options.",
        "Call or email us during business hours, or drop by our office in Kothanur, Bengaluru. You can also book a demo session or a one-to-one with our founder.",
      ],
    },
    {
      type: "facts",
      kicker: "Reach Us",
      title: "Contact details",
      items: [
        { label: "Phone", value: "+91 90350 98425" },
        { label: "Phone", value: "+91 95910 04043" },
        { label: "Email", value: "aviators@windchasers.in" },
        { label: "Hours", value: "10:30 AM – 7:30 PM" },
      ],
    },
    {
      type: "list",
      kicker: "Visit Us",
      title: "Our address",
      items: [
        "Site No 1, Opp Poorna Prajna Education Center, 3rd floor",
        "New Airport Road, Hennur Bagalur Main Rd",
        "Kothanur, Bengaluru, Karnataka 560077",
        "Phone: +91 90350 98425 / +91 95910 04043",
        "Email: aviators@windchasers.in",
        "Business hours: 10:30 AM – 7:30 PM",
      ],
    },
  ],
  related: [
    { label: "About WindChasers", href: "/about" },
    { label: "Meet the Team", href: "/windchasers-meet-the-team" },
    { label: "With the Founder", href: "/with-the-founder" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
  ],
  ctaTitle: "Ready when you are.",
  ctaText:
    "Book a demo session or talk to an expert, and we will help you map the path to the cockpit.",
};

export default content;
