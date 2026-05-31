import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "About · WindChasers",
  title: "Meet the",
  accent: "team.",
  intro:
    "Instructors, advisors and operators who have flown, taught and examined across the world — and now guide WindChasers students every day.",
  heroImage: "/WC HEro.webp",
  metaTitle: "Meet the Team | WindChasers Aviation Academy",
  blocks: [
    {
      type: "cards",
      kicker: "Our People",
      title: "Instructors & advisors",
      cols: 2,
      items: [
        {
          title: "Hemanth Kumar R — Ground Instructor",
          body: "Aeronautical Engineering graduate who holds a CPL from the FAA and DGCA, with a Boeing 737 NG type rating. Teaches DGCA ground subjects and supports students through computer-based applications and eGCA processes. Expertise: navigation instruction, e-logbook management, and eGCA applications.",
        },
        {
          title: "Vijay Bhargav GS — Ground Instructor",
          body: "Mechanical Engineering graduate, formerly a mechanical engineer at DRDO, and a qualified senior flight instructor (Category B) from New Zealand. Over 1,500 hours of flight experience including 1,200 instructional hours, and A-320 type rated. Expertise: aviation meteorology, air navigation, and principles of flight.",
        },
        {
          title: "Shreyas Nair — Operations Manager",
          body: "B.Sc. in Aviation with a CPL from the FAA and TTCAA. Manages sales, streamlines processes, collaborates with flight schools across countries, and counsels future aviators. Expertise: flying, handling flight-related inquiries, and building tailored aviation plans for prospective students.",
        },
        {
          title: "Ramabrahmam Kanakandi — Advisor, CPL Training",
          body: "Over 30 years of aviation experience and 10,000+ flight hours. Former military pilot, instructor and examiner on the Dornier 228, with 2,800+ hours in command of the Airbus A320/A321. Expertise: military aviation, aircraft instruction, flight training, and leadership in commercial aviation.",
        },
        {
          title: "Capt. Adil — Advisor, Helicopter Pilot Training",
          body: "Helicopter pilot with over 14 years of experience and 3,500+ flight hours across four aircraft, including the Airbus H130 and H135 (multi-engine). Holds licences from four countries — FAA (US), DGCA (India), DCA (Malaysia) and TCAA (Canada). Expertise: search and rescue, medical evacuation, tourism, and VIP transport.",
        },
        {
          title: "Zabida Zainuddin — Cabin Crew Trainer",
          body: "Ten years of flying with Saudi Arabian Airlines and ten years as senior cabin crew with Emirates. Trains and develops students into professional cabin crew candidates. Expertise: student management, coaching, and helping students bring out their best potential.",
        },
      ],
    },
  ],
  related: [
    { label: "About WindChasers", href: "/about" },
    { label: "With the Founder", href: "/with-the-founder" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Pilot Training in India", href: "/pilot-training-in-india" },
  ],
  ctaTitle: "Learn from people who have flown the route.",
  ctaText:
    "Book a session and talk to the instructors and advisors who will guide your training from day one.",
};

export default content;
