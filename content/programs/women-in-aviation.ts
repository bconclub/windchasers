import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Initiative · Women in Aviation",
  title: "Women in",
  accent: "Aviation.",
  intro:
    "WindChasers hosted India's first aviation event dedicated exclusively to aspiring female pilots, an inspiring, empowering gathering for young women who aspire to soar in the aviation industry.",
  heroImage: "/facility/WC1.webp",
  metaTitle: "Women in Aviation | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "About the Event",
      title: "India's First Event for Aspiring Female Pilots",
      paragraphs: [
        "On 15 August 2024, WindChasers HQ in Bengaluru hosted an inspiring and empowering event dedicated to encouraging and guiding young women who aspire to soar in the aviation industry.",
        "Held at WindChasers HQ, Site No 1, 3rd Floor, New Airport Road, Hennur Bagalur Main Road, Kothanur, Bengaluru, from 11:00 am to 3:00 pm, the event brought together aspiring aviators, mentors, and accomplished female pilots.",
      ],
    },
    {
      type: "cards",
      kicker: "Why It Matters",
      title: "What the Event Offered",
      items: [
        {
          title: "First Event in India Dedicated to Women",
          body: "An empowering event focused solely on women aspiring to soar in the aviation industry.",
        },
        {
          title: "Inspiring Journeys and Insights",
          body: "Hear firsthand from accomplished female aviators sharing their journeys and valuable insights.",
        },
        {
          title: "Aviation as a Career for Women",
          body: "Explore the limitless opportunities and pathways in aviation careers specifically tailored for women.",
        },
      ],
    },
    {
      type: "cards",
      kicker: "Highlights",
      title: "Event Highlights",
      cols: 2,
      items: [
        {
          title: "Mentorship from Aviation Leaders",
          body: "Get mentored by industry leaders and gain expert advice to help navigate your aviation career.",
        },
        {
          title: "Interactive Q&A Session",
          body: "Engage directly with experienced pilots and ask questions about the path to becoming a successful commercial pilot.",
        },
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "Cabin Crew Program", href: "/cabin-crew" },
    { label: "Helicopter Training", href: "/helicopter-training" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Ready to start your journey in the skies?",
  ctaText:
    "Whether you're just beginning to explore aviation or ready to train, WindChasers is here to guide you. Take the first step toward a career above the clouds.",
};

export default content;
