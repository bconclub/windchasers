import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Rating · ME",
  title: "Multi Engine",
  accent: "Rating.",
  intro:
    "Multi-engine flying training to operate aircraft with more than one engine, building the skills needed for multi-engine operations and the prerequisites for a Type Rating on aircraft like the Airbus A320.",
  heroImage: "/migrated/multi-engine-rating/gallery-40.webp",
  metaTitle: "Multi Engine Rating (ME) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "About the Multi Engine Rating",
      paragraphs: [
        "The Multi Engine Rating involves flying training to operate aircraft with more than one engine, enabling pilots to acquire the skills necessary for flying multi-engine aircraft and meeting the prerequisites for a Type Rating on aircraft like the Airbus A320 or similar models.",
        "The training follows the syllabus outlined by the DGCA, with the required flying time varying based on individual objectives. Typically, a minimum of 15 hours of multi-engine flying on the actual aircraft (plus 10 hours in a multi-engine simulator) is recommended to qualify for an A320 family aircraft Type Rating.",
        "Throughout the training, participants cover topics such as one-engine performance requirements and handling asymmetric thrust, essential for commercial aviation operations.",
      ],
    },
    {
      type: "list",
      kicker: "Who Can Apply",
      title: "Course Eligibility",
      items: [
        "A current and valid SPL, PPL, CPL or ATPL licence.",
        "A pass in the Technical Specific Exam for the particular multi-engine aircraft used for training, meeting the minimum mark set by DGCA.",
        "A valid Class 1 or Class 2 Medical Assessment, declared fit by DGCA-approved doctors.",
      ],
    },
    {
      type: "list",
      kicker: "Requirements",
      title: "Course Requirements",
      items: [
        "Minimum flying hours: 25.",
        "At least 10 hours on the specific aircraft (per DGCA), or 15 hours on an aircraft for the A320 family.",
        "10 hours on a multi-engine simulator.",
        "Successful completion of the DGCA examination for the specific aircraft, such as the C-310, DA-42 or any other multi-engine aircraft designated by the authority.",
      ],
    },
    {
      type: "steps",
      kicker: "Check Ride",
      title: "Skill Test",
      steps: [
        { title: "General flying test by day", body: "Daytime multi-engine handling." },
        { title: "General flying test by night", body: "Night-time handling under evaluation." },
        { title: "Instrument Rating test", body: "Instrument proficiency on multi-engine aircraft." },
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
    { label: "Multi-Engine Instrument Rating (MEIR)", href: "/multi-engine-instrument-rating-meir" },
    { label: "Instrument Rating", href: "/instrument-rating" },
    { label: "Night Rating", href: "/night-rating-progam" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the next step in your aviation career with WindChasers Aviation Academy, talk to us about batches, aircraft availability and fees.",
};

export default content;
