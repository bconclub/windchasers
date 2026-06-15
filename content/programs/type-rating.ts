import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Type Ratings",
  title: "Aircraft Type",
  accent: "Ratings.",
  intro:
    "A type rating qualifies a licensed commercial pilot to operate a specific aircraft type. WindChasers offers type rating programs for the most widely flown narrow-body jets.",
  heroImage: "/migrated/boeing-737-type-rating/boeing737.webp",
  metaTitle: "Aircraft Type Ratings | WindChasers Aviation Academy",
  blocks: [
    {
      type: "cards",
      kicker: "Programs",
      title: "Available Type Ratings",
      intro:
        "Choose the aircraft you want to fly. Both programs follow the same structure of ground school, simulator training, and base training, tailored to the airframe.",
      cols: 2,
      items: [
        {
          title: "Airbus A320 Type Rating",
          body:
            "The A320 family is one of the most common narrow-body fleets at airlines across India and the Gulf. This program covers Airbus systems, fly-by-wire handling, and standard operating procedures, building the competence to fly the line. See the Airbus A320 Type Rating page for full details.",
        },
        {
          title: "Boeing 737 Type Rating",
          body:
            "The Boeing 737 remains a backbone of short and medium-haul operations worldwide. This program covers 737 systems, conventional flight-deck handling, and operating procedures from ground school through to base training. See the Boeing 737 Type Rating page for full details.",
        },
      ],
    },
    {
      type: "list",
      kicker: "Structure",
      title: "What a Type Rating Involves",
      items: [
        "Ground school covering the aircraft's systems, limitations, and operating procedures.",
        "Full-flight simulator sessions to practise normal, abnormal, and emergency scenarios.",
        "MCC and JOC, multi-crew cooperation and jet orientation to work effectively as a flight crew.",
        "Base training on the actual aircraft to complete the rating.",
      ],
    },
    {
      type: "list",
      kicker: "Eligibility",
      title: "Who Can Apply",
      items: [
        "A valid CPL with an Instrument Rating (IR).",
        "A current Class 1 Medical certificate.",
        "ICAO Level 4 English proficiency or higher.",
      ],
    },
  ],
  related: [
    { label: "Airbus A320 Type Rating", href: "/airbus-a320-type-rating" },
    { label: "Boeing 737 Type Rating", href: "/boeing-737-type-rating" },
    { label: "Airline Transport Pilot License", href: "/airline-transport-pilot-license" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Airline Preparation Program", href: "/airline-preparation-program" },
  ],
  ctaTitle: "Ready to type-rate for the line?",
  ctaText:
    "Talk to our team about which type rating fits your career plans and the airlines you're aiming for.",
};

export default content;
