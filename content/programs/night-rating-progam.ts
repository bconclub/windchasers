import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Rating · Night",
  title: "Night Rating",
  accent: "Program.",
  intro:
    "The Night Rating course equips pilots with the skills to safely navigate and operate aircraft during night conditions under Visual Flight Rules (VFR) — essential for broadening your flying capabilities.",
  heroImage: "/migrated/night-rating-progam/gallery-29.webp",
  metaTitle: "Night Rating Program | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "About the Night Rating",
      paragraphs: [
        "The Night Rating course equips pilots with the necessary skills to safely navigate and operate aircraft during night conditions under Visual Flight Rules (VFR).",
        "A night rating is essential for aviators aiming to broaden their flying capabilities and adaptability to diverse conditions.",
      ],
    },
    {
      type: "list",
      kicker: "Who Can Apply",
      title: "Requirements",
      items: [
        "Holder of a valid and current Private Pilot License (PPL).",
        "Holder of a valid and current Class 1 Medical Certificate.",
        "Holder of an English Language Proficiency endorsement.",
        "A minimum of 15 hours of flight training in total.",
        "10 hours of dual instruction, including 5 hours of night training (with 2 hours dedicated to cross-country flights).",
        "5 hours of instrument training (a total of 10 hours of instrument training is required, typically with 5 hours completed during the Private course).",
        "5 hours of solo flight during night conditions.",
        "There is no formal practical or written examination, but candidates must demonstrate proficiency in the required skills.",
      ],
    },
    {
      type: "richtext",
      kicker: "Important Note",
      title: "Flying Hours Vary by Country",
      paragraphs: [
        "The hours outlined are in accordance with the standards and guidelines set forth by the DGCA.",
        "These hours may vary based on the specific requirements of the country chosen for flight training. Each country has its own regulations and expectations, so aspiring pilots should be prepared for potential differences.",
      ],
    },
  ],
  related: [
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Multi-Engine Rating", href: "/multi-engine-rating" },
    { label: "Multi-Engine Instrument Rating (MEIR)", href: "/multi-engine-instrument-rating-meir" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the next step in your aviation career with WindChasers Aviation Academy — talk to us about batches, aircraft availability and fees.",
};

export default content;
