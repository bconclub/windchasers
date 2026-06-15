import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "About · WindChasers",
  title: "A mother’s mission,",
  accent: "now a runway for many.",
  intro:
    "WindChasers began when one parent set out to help her daughter become a pilot, and ended up building a clear path for every aspiring aviator and their family.",
  heroImage: "/migrated/about/5U2A3973-copy-1.webp",
  metaTitle: "About WindChasers Aviation Academy | Bangalore",
  blocks: [
    {
      type: "richtext",
      kicker: "Our Story",
      title: "How WindChasers started",
      paragraphs: [
        "“Mom, I want to be a pilot.” When Rida said it, her eyes were gleaming. Her mother, Sumaiya Ali, felt pride, and then a wave of worry. What qualifications would Rida need? Where should she start? How could a parent guide a child through a world she knew so little about?",
        "That worry became a mission. Sumaiya spent hours researching, making calls, and trying to understand an aviation industry that felt unfamiliar and daunting. It did not take long to realise she was not alone: parents across the country were supporting children who wanted to touch the skies, unsure where to begin.",
        "A thought took shape, what if this journey could be made easier? What if one place could empower not just her daughter, but every aspiring pilot and their parents with real guidance? And so WindChasers was born: a mother’s desire to pave the way for her daughter, grown into a mission to help young dreamers fly and families navigate an often-intimidating path.",
        "This is not just one family’s story. It is the story of every parent, every dreamer, and every future pilot who refuses to give up.",
      ],
    },
    {
      type: "cards",
      kicker: "What We Do",
      title: "Driven by a vision",
      intro:
        "We specialise in comprehensive pilot training programs based in Bangalore, dedicated to empowering career changers and recent PUC graduates alike.",
      cols: 2,
      items: [
        {
          title: "Guidance every step of the way",
          body: "From the moment you join us, we guide you through every stage, from fundamentals to achieving your Commercial Pilot License (CPL).",
        },
        {
          title: "Making dreams achievable",
          body: "We know financial constraints can hold dreams back, so we help with accessible financing options so cost is not what stops you.",
        },
        {
          title: "Equipping you for success",
          body: "We do not stop at certification. We work to send graduates into a growing aviation sector with the skills and confidence to thrive.",
        },
        {
          title: "A supportive community",
          body: "WindChasers is more than a training institution. It is a community committed to your pilot career, before and after your licence.",
        },
      ],
    },
    {
      type: "list",
      kicker: "Beyond Training",
      title: "Benefits of training with WindChasers",
      intro:
        "Practical support that covers the parts of the journey most academies leave you to figure out alone.",
      items: [
        "Educational loan support",
        "Enrollment support",
        "Visa documentation",
        "Immigration support",
        "Accommodation support",
        "Continuous student guidance",
      ],
    },
    {
      type: "facts",
      kicker: "Find Us",
      title: "WindChasers, Bengaluru",
      items: [
        { label: "Phone", value: "+91 90350 98425" },
        { label: "Alt Phone", value: "+91 95910 04043" },
        { label: "Email", value: "aviators@windchasers.in" },
        { label: "Hours", value: "10:30 AM – 7:30 PM" },
      ],
    },
  ],
  related: [
    { label: "Meet the Team", href: "/windchasers-meet-the-team" },
    { label: "With the Founder", href: "/with-the-founder" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
  ],
  ctaTitle: "Every pilot starts with a dream.",
  ctaText:
    "Tell us where you are today and we will help you map the path from here to the cockpit, one flight at a time.",
};

export default content;
