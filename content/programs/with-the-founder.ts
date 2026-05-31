import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "About · WindChasers",
  title: "One to one",
  accent: "with the founder.",
  intro:
    "Sit down with Sumaiya Ali — the parent who built WindChasers — for an honest, no-pressure conversation about your pilot journey.",
  heroImage: "/WC HEro.webp",
  metaTitle: "With the Founder — Sumaiya Ali | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Why This Exists",
      title: "From one parent to another",
      paragraphs: [
        "WindChasers started because Sumaiya Ali wanted to help her own daughter, Rida, become a pilot — and discovered how confusing the path can be for a family starting from zero.",
        "These one-to-one sessions are her way of giving back that experience directly. Whether you are the aspiring pilot or the parent supporting one, you can ask the questions that keep you up at night and get straight answers.",
        "There is no script and no sales pressure. Just a conversation about where you are, where you want to go, and the most sensible next step to get there.",
      ],
    },
    {
      type: "list",
      kicker: "What to Bring",
      title: "Good things to ask about",
      intro:
        "Come with whatever is on your mind. These are the topics families raise most often.",
      items: [
        "Eligibility, medicals, and academic requirements",
        "Training in India vs. abroad — and what suits you",
        "Realistic timelines and what each stage involves",
        "Funding options and education loan support",
        "Visa, documentation, and accommodation support",
        "Career outlook after you earn your licence",
      ],
    },
    {
      type: "facts",
      kicker: "The Session",
      title: "Meet at WindChasers HQ",
      items: [
        { label: "Host", value: "Sumaiya Ali" },
        { label: "Role", value: "Founder" },
        { label: "Where", value: "WindChasers HQ, Bengaluru" },
        { label: "Format", value: "One to one" },
      ],
    },
  ],
  related: [
    { label: "About WindChasers", href: "/about" },
    { label: "Meet the Team", href: "/windchasers-meet-the-team" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
  ],
  ctaTitle: "Book your one-to-one.",
  ctaText:
    "Reserve a session with Sumaiya at WindChasers HQ in Bengaluru and get clarity on your next step.",
};

export default content;
