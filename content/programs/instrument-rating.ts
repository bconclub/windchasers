import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Rating · IR",
  title: "Instrument",
  accent: "Rating.",
  intro:
    "An instrument rating is the key that unlocks the skies even when the weather turns sour — equipping pilots to navigate safely through Instrument Meteorological Conditions (IMC).",
  heroImage: "/migrated/instrument-rating/pilot-3.webp",
  metaTitle: "Instrument Rating (IR) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "What an Instrument Rating Gives You",
      paragraphs: [
        "An instrument rating is not just a qualification; it is a key that unlocks the skies even when the weather turns sour. Pilots with this rating are equipped to navigate through Instrument Meteorological Conditions (IMC), ensuring safe passage through adverse weather.",
        "The instrument rating tests, available for both single and multi-engine aircraft, open up new horizons of exploration and adventure for pilots — granting them the freedom to soar even when the clouds loom dark and heavy.",
      ],
    },
    {
      type: "list",
      kicker: "What It Covers",
      title: "Course Focus",
      items: [
        "Eligibility criteria and pre-requisites for instrument flying.",
        "Flying requirements as laid down by DGCA.",
        "Theory examinations covering the principles of instrument flight.",
        "Technical specifics: the intricate aspects of instrument flying, so pilots can navigate challenging conditions with skill and precision.",
        "Instrument rating checkride to demonstrate proficiency.",
      ],
    },
    {
      type: "richtext",
      kicker: "Important Note",
      title: "Flying Hours Vary by Country",
      paragraphs: [
        "The hours outlined are in accordance with the standards and guidelines set forth by the Directorate General of Civil Aviation (DGCA).",
        "These hours may vary based on the specific requirements of the country chosen for flight training. Each country has its own regulations and expectations, so aspiring pilots should be prepared for potential differences on their journey.",
      ],
    },
  ],
  related: [
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "Multi-Engine Instrument Rating (MEIR)", href: "/multi-engine-instrument-rating-meir" },
    { label: "Night Rating", href: "/night-rating-progam" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the next step in your aviation career with WindChasers Aviation Academy — talk to us about batches, aircraft availability and fees.",
};

export default content;
