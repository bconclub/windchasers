import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Contact · WindChasers",
  title: "Get in Touch",
  accent: "With Us.",
  intro:
    "Reach the WindChasers team for admissions, course details, or a campus visit. We are based in Bengaluru and respond within 24 hours.",
  heroImage: "/facility/WC1.webp",
  metaTitle: "Contact WindChasers Aviation Academy | Bangalore",
  testimonials: false,
  blocks: [
    {
      type: "facts",
      kicker: "Reach Us",
      title: "Talk to an Aviation Advisor",
      items: [
        { label: "Call", value: "+91 90350 98425" },
        { label: "Call", value: "+91 95910 04043" },
        { label: "Email", value: "aviators@windchasers.in" },
        { label: "Visit", value: "Sat, 11am–4pm" },
      ],
    },
    {
      type: "split",
      kicker: "Our Campus",
      title: "WindChasers Aviation Academy, Bengaluru",
      image: "/facility/WC2.webp",
      paragraphs: [
        "Site No 1, Opp Poorna Prajna Education Center, 3rd floor, New Airport Road, Hennur Bagalur Main Rd, Kothanur, Bengaluru, Karnataka 560077.",
        "Walk in for a demo session on Saturdays between 11am and 4pm, or book a slot and we will keep an advisor ready for you.",
      ],
      bullets: [
        "Admissions & course guidance",
        "Campus tour and simulator demo",
        "Loan, visa & accommodation support queries",
      ],
    },
    {
      type: "richtext",
      kicker: "Prefer to Write?",
      title: "Send Us a Message",
      paragraphs: [
        "Email aviators@windchasers.in with your name, phone number, and the program you are interested in, and our team will get back to you within one business day.",
        "For the fastest response, book a demo session or call us directly — we are happy to walk you through eligibility, costs, and the full path to your license.",
      ],
    },
  ],
  related: [
    { label: "About WindChasers", href: "/about" },
    { label: "Meet the Team", href: "/windchasers-meet-the-team" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
  ],
  ctaTitle: "Ready when you are.",
  ctaText: "Book a demo session or call us — let us map out your path to the cockpit.",
};

export default content;
