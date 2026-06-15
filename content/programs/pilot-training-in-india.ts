import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Flight Training Abroad · India",
  title: "Pilot Training in",
  accent: "India.",
  intro:
    "Embark on your aviation journey right here at home. India's aviation sector is one of the fastest-growing in the world, and there has never been a better time to train as a pilot on Indian soil.",
  heroImage: "/migrated/pilot-training-in-india/india.webp",
  metaTitle: "Pilot Training in India | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Why Train in India?",
      paragraphs: [
        "Training in India offers a unique blend of affordability, familiarity, and direct alignment with DGCA regulations, the very authority that will license you to fly commercially in the country.",
        "You stay close to family, avoid the cost of international living, and train in the same airspace and conditions you will eventually work in.",
      ],
    },
    {
      type: "cards",
      kicker: "Advantages",
      title: "What Makes India Different",
      cols: 3,
      items: [
        {
          title: "Cost Advantage",
          body: "Pilot training in India is significantly more affordable than many overseas destinations once you factor in living costs, travel, and currency exchange. A full CPL program typically ranges from ₹35 lakh to ₹50 lakh depending on the academy and aircraft type.",
        },
        {
          title: "DGCA Alignment",
          body: "Because you train under DGCA from day one, there is no need for licence conversion later. Your hours, exams, and ratings count directly towards the Indian CPL, saving you both time and money compared to converting a foreign licence.",
        },
        {
          title: "Climate & Diverse Terrain",
          body: "India offers incredibly varied flying conditions, from the coastal weather of the south to the mountainous north. This diversity builds well-rounded airmanship and prepares you for the realities of flying across the subcontinent.",
        },
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Program Snapshot",
      items: [
        { label: "Regulator", value: "DGCA" },
        { label: "Typical Duration", value: "18–24 mo" },
        { label: "Indicative Cost", value: "₹35–50L" },
        { label: "Minimum Age", value: "17 yrs" },
      ],
    },
    {
      type: "list",
      kicker: "Included",
      title: "What's Included",
      intro:
        "Ground school for all DGCA subjects, flight training to CPL standard, instructor support, and guidance through the DGCA examination and licensing process.",
      items: [
        "Ground school covering all DGCA subjects",
        "Flight training to CPL standard",
        "Dedicated instructor support",
        "Guidance through DGCA examinations and licensing",
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Who Can Apply",
      items: [
        "Minimum 17 years of age to begin training.",
        "Completed 10+2 with Physics and Mathematics.",
        "Hold a DGCA Class 1 Medical certificate.",
      ],
    },
    {
      type: "richtext",
      kicker: "Timeline",
      title: "Duration",
      paragraphs: [
        "A typical CPL program in India takes 18 to 24 months to complete, including ground school, flight training, and DGCA examinations.",
        "Weather and aircraft availability can affect timelines.",
      ],
    },
    {
      type: "gallery",
      kicker: "Gallery",
      title: "Training in India",
      images: [
        "/migrated/pilot-training-in-india/plane-10.webp",
        "/migrated/pilot-training-in-india/plane-11.webp",
        "/migrated/pilot-training-in-india/plane-12.webp",
      ],
    },
  ],
  related: [
    { label: "Pilot Training in USA", href: "/pilot-training-in-usa" },
    { label: "Pilot Training in Canada", href: "/pilot-training-in-canada" },
    { label: "Pilot Training in Australia", href: "/pilot-training-in-australia" },
    { label: "Pilot Training in New Zealand", href: "/pilot-training-in-new-zealand" },
    { label: "Pilot Training in South Africa", href: "/pilot-training-in-south-africa" },
    { label: "International Programs", href: "/international" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
  ],
  ctaTitle: "Start your journey at home.",
  ctaText:
    "Contact WindChasers today to learn how we can guide your pilot training journey in India.",
};

export default content;
