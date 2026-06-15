import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Flight Training Abroad · Australia",
  title: "Pilot Training in",
  accent: "Australia.",
  intro:
    "Australia combines excellent weather, modern training fleets, and CASA's globally respected standards, making it a top-tier destination for serious aviation students.",
  heroImage: "/migrated/pilot-training-in-australia/australia.webp",
  metaTitle: "Pilot Training in Australia | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Why Train in Australia?",
      paragraphs: [
        "The Civil Aviation Safety Authority (CASA) maintains high standards recognised across the world.",
        "Australia's vast, open airspace and reliable weather give students abundant opportunity to fly and progress quickly.",
      ],
    },
    {
      type: "cards",
      kicker: "Advantages",
      title: "What Makes Australia Different",
      cols: 3,
      items: [
        {
          title: "Ideal Flying Conditions",
          body: "With clear skies for much of the year and wide, uncongested airspace, Australia is ideal for building hours efficiently. The varied terrain, from coastline to outback, develops strong navigation skills.",
        },
        {
          title: "Quality Training Environment",
          body: "Australian flight schools are known for modern fleets and structured, professional instruction. The training culture emphasises safety, discipline, and thorough preparation.",
        },
        {
          title: "Globally Respected Licence",
          body: "CASA's standards are recognised internationally, giving your qualification credibility wherever your aviation career takes you.",
        },
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Program Snapshot",
      items: [
        { label: "Regulator", value: "CASA" },
        { label: "Typical Duration", value: "12–18 mo" },
        { label: "Indicative Cost", value: "AUD 70–95K" },
        { label: "Student Visa", value: "Subclass 500" },
      ],
    },
    {
      type: "richtext",
      kicker: "Immigration",
      title: "Visa & Student Support",
      paragraphs: [
        "International students study on a student visa (subclass 500).",
        "WindChasers helps with enrolment, Confirmation of Enrolment (CoE), and student visa documentation.",
      ],
    },
    {
      type: "list",
      kicker: "Included",
      title: "What's Included",
      items: [
        "CASA ground school",
        "Flight training to CPL standard",
        "Student visa guidance",
        "Ongoing support throughout your stay in Australia",
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
        "A CASA Class 1 aviation medical certificate.",
      ],
    },
    {
      type: "gallery",
      kicker: "Gallery",
      title: "Training in Australia",
      images: [
        "/migrated/pilot-training-in-australia/plane-13.webp",
        "/migrated/pilot-training-in-australia/plane-14.webp",
        "/migrated/pilot-training-in-australia/plane-15.webp",
      ],
    },
  ],
  related: [
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
    { label: "Pilot Training in USA", href: "/pilot-training-in-usa" },
    { label: "Pilot Training in Canada", href: "/pilot-training-in-canada" },
    { label: "Pilot Training in New Zealand", href: "/pilot-training-in-new-zealand" },
    { label: "Pilot Training in South Africa", href: "/pilot-training-in-south-africa" },
    { label: "International Programs", href: "/international" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
  ],
  ctaTitle: "Fly the open skies of Australia.",
  ctaText:
    "Get in touch with WindChasers to begin your aviation training in Australia.",
};

export default content;
