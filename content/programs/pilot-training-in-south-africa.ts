import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Flight Training Abroad · South Africa",
  title: "Pilot Training in",
  accent: "South Africa.",
  intro:
    "South Africa is one of the most affordable destinations for quality flight training, offering excellent weather and internationally recognised licences.",
  heroImage: "/migrated/pilot-training-in-south-africa/south-africa.webp",
  metaTitle: "Pilot Training in South Africa | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Why Train in South Africa?",
      paragraphs: [
        "The South African Civil Aviation Authority (SACAA) is respected globally.",
        "Combined with low operating costs and superb flying weather, South Africa offers exceptional value without compromising on training quality.",
      ],
    },
    {
      type: "cards",
      kicker: "Advantages",
      title: "What Makes South Africa Different",
      cols: 3,
      items: [
        {
          title: "Affordability",
          body: "South Africa is among the most cost-effective places to train. Favourable exchange rates and lower operating costs mean you can complete your licence for considerably less than in North America or Australia.",
        },
        {
          title: "Excellent Flying Weather",
          body: "With clear skies and stable conditions for most of the year, South Africa allows for consistent, uninterrupted flight training and efficient hour-building.",
        },
        {
          title: "Recognised Licence",
          body: "SACAA standards are respected internationally, so your qualification carries weight as you pursue a global aviation career.",
        },
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Program Snapshot",
      items: [
        { label: "Regulator", value: "SACAA" },
        { label: "Typical Duration", value: "12–18 mo" },
        { label: "Indicative Cost", value: "ZAR 700–950K" },
        { label: "Visa", value: "Study Visa" },
      ],
    },
    {
      type: "richtext",
      kicker: "Cost",
      title: "Cost & Duration",
      paragraphs: [
        "A SACAA CPL typically takes 12 to 18 months and costs approximately ZAR 700,000 to ZAR 950,000 depending on the school and aircraft.",
        "This often works out cheaper than comparable training elsewhere.",
      ],
    },
    {
      type: "list",
      kicker: "Included",
      title: "What's Included",
      items: [
        "SACAA ground school",
        "Flight training to CPL standard",
        "Study visa guidance",
        "Ongoing support during your stay",
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Who Can Apply",
      items: [
        "Minimum 17 years of age.",
        "Secondary school completion.",
        "English proficiency.",
        "A SACAA Class 1 aviation medical certificate.",
      ],
    },
    {
      type: "gallery",
      kicker: "Gallery",
      title: "Training in South Africa",
      images: [
        "/migrated/pilot-training-in-south-africa/plane-16.webp",
        "/migrated/pilot-training-in-south-africa/plane-17.webp",
        "/migrated/pilot-training-in-south-africa/plane-18.webp",
      ],
    },
  ],
  related: [
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
    { label: "Pilot Training in USA", href: "/pilot-training-in-usa" },
    { label: "Pilot Training in Canada", href: "/pilot-training-in-canada" },
    { label: "Pilot Training in Australia", href: "/pilot-training-in-australia" },
    { label: "Pilot Training in New Zealand", href: "/pilot-training-in-new-zealand" },
    { label: "International Programs", href: "/international" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
  ],
  ctaTitle: "Exceptional value, world-class skies.",
  ctaText:
    "Contact WindChasers to begin your pilot training journey in South Africa.",
};

export default content;
