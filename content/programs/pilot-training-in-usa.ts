import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Flight Training Abroad · USA",
  title: "Pilot Training in the",
  accent: "USA.",
  intro:
    "The United States is home to the world's largest and most established general aviation industry, making it one of the most popular destinations for aspiring pilots from around the globe.",
  heroImage: "/migrated/pilot-training-in-usa/national-flag-united-states-america-usa-background-with-flag-united-states-america-usa.webp",
  metaTitle: "Pilot Training in USA | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Why Train in the USA?",
      paragraphs: [
        "The USA offers an unmatched density of flight schools, airports, and experienced instructors.",
        "Training under the FAA — the world's most influential aviation regulator — gives your licence global recognition and credibility.",
      ],
    },
    {
      type: "cards",
      kicker: "Advantages",
      title: "What Makes the USA Different",
      cols: 3,
      items: [
        {
          title: "Favourable Weather",
          body: "States like Florida, Arizona, and California offer year-round clear skies, allowing for uninterrupted flight training. More flyable days means you finish faster and build hours more consistently than in many other countries.",
        },
        {
          title: "World-Class Infrastructure",
          body: "The USA has thousands of airports and a highly developed air traffic system. Training here exposes you to busy, controlled airspace and complex radio communication — invaluable experience for an airline career.",
        },
        {
          title: "Competitive Market",
          body: "The sheer number of flight schools keeps hourly rates reasonable, and an FAA CPL can be completed in around 12 to 18 months.",
        },
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Program Snapshot",
      items: [
        { label: "Regulator", value: "FAA" },
        { label: "Typical Duration", value: "12–18 mo" },
        { label: "Indicative Cost", value: "$55–80K" },
        { label: "Student Visa", value: "M-1" },
      ],
    },
    {
      type: "richtext",
      kicker: "Immigration",
      title: "Visa & Immigration Support",
      paragraphs: [
        "International students train on an M-1 visa.",
        "WindChasers guides you through the SEVIS process, school enrolment (I-20), and visa interview preparation to make your transition smooth.",
      ],
    },
    {
      type: "list",
      kicker: "Included",
      title: "What's Included",
      items: [
        "FAA ground school",
        "Flight training to CPL standard",
        "TSA clearance guidance",
        "Full support with M-1 visa documentation and SEVIS registration",
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Who Can Apply",
      items: [
        "Minimum 17 years of age.",
        "Proficiency in English.",
        "A valid passport.",
        "An FAA medical certificate issued by an authorised aviation medical examiner.",
      ],
    },
    {
      type: "gallery",
      kicker: "Gallery",
      title: "Training in the USA",
      images: [
        "/migrated/pilot-training-in-usa/private-singleengined-pistonpowered-aircraft-taxiing-airfield.webp",
        "/migrated/pilot-training-in-usa/young-handsome-businessman-standing-near-private-plane.webp",
        "/migrated/pilot-training-in-usa/cheerful-woman-flight-attendant-standing-outdoors-airport.webp",
      ],
    },
  ],
  related: [
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
    { label: "Pilot Training in Canada", href: "/pilot-training-in-canada" },
    { label: "Pilot Training in Australia", href: "/pilot-training-in-australia" },
    { label: "Pilot Training in New Zealand", href: "/pilot-training-in-new-zealand" },
    { label: "Pilot Training in South Africa", href: "/pilot-training-in-south-africa" },
    { label: "International Programs", href: "/international" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
  ],
  ctaTitle: "Train where the industry began.",
  ctaText:
    "Contact WindChasers to begin your FAA pilot training journey in the United States.",
};

export default content;
