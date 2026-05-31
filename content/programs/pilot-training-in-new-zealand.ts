import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Flight Training Abroad · New Zealand",
  title: "Pilot Training in",
  accent: "New Zealand.",
  intro:
    "New Zealand offers breathtaking scenery, uncongested skies, and high training standards, making it a hidden gem for pilot training.",
  heroImage: "/migrated/pilot-training-in-new-zealand/NEWZEALAND.webp",
  metaTitle: "Pilot Training in New Zealand | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Why Train in New Zealand?",
      paragraphs: [
        "The Civil Aviation Authority of New Zealand (CAA NZ) upholds rigorous standards.",
        "With low air traffic and diverse terrain, students get plenty of hands-on flying in some of the most beautiful airspace in the world.",
      ],
    },
    {
      type: "cards",
      kicker: "Advantages",
      title: "What Makes New Zealand Different",
      cols: 3,
      items: [
        {
          title: "Uncongested Airspace",
          body: "New Zealand's relatively quiet skies mean less time waiting and more time flying. Students often progress quickly thanks to the abundant access to runways and practice areas.",
        },
        {
          title: "Challenging, Diverse Terrain",
          body: "From coastal plains to mountainous regions, New Zealand's geography trains pilots to handle a wide variety of conditions — building confidence and sharp decision-making skills.",
        },
        {
          title: "High Training Standards",
          body: "CAA NZ's rigorous approach produces well-prepared pilots with a qualification respected by employers worldwide.",
        },
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Program Snapshot",
      items: [
        { label: "Regulator", value: "CAA NZ" },
        { label: "Typical Duration", value: "18–24 mo" },
        { label: "Indicative Cost", value: "NZD 80–110K" },
        { label: "Minimum Age", value: "17 yrs" },
      ],
    },
    {
      type: "richtext",
      kicker: "Immigration",
      title: "Visa & Student Support",
      paragraphs: [
        "International students require a student visa.",
        "WindChasers assists with school enrolment, visa documentation, and the process of settling into New Zealand.",
      ],
    },
    {
      type: "list",
      kicker: "Included",
      title: "What's Included",
      items: [
        "CAA NZ ground school",
        "Flight training to CPL standard",
        "Student visa guidance",
        "Support throughout your training journey",
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
        "A CAA NZ Class 1 medical certificate.",
      ],
    },
    {
      type: "gallery",
      kicker: "Gallery",
      title: "Training in New Zealand",
      images: [
        "/migrated/pilot-training-in-new-zealand/pilot-3.webp",
        "/migrated/pilot-training-in-new-zealand/pilot-4.webp",
        "/migrated/pilot-training-in-new-zealand/pilot-5.webp",
      ],
    },
  ],
  related: [
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
    { label: "Pilot Training in USA", href: "/pilot-training-in-usa" },
    { label: "Pilot Training in Canada", href: "/pilot-training-in-canada" },
    { label: "Pilot Training in Australia", href: "/pilot-training-in-australia" },
    { label: "Pilot Training in South Africa", href: "/pilot-training-in-south-africa" },
    { label: "International Programs", href: "/international" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
  ],
  ctaTitle: "Discover a hidden gem for flight training.",
  ctaText:
    "Contact WindChasers to begin your pilot training adventure in New Zealand.",
};

export default content;
