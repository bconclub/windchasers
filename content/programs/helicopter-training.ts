import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Pilot Training · Helicopter",
  title: "Helicopter Pilot",
  accent: "Training.",
  intro:
    "DGCA-approved Commercial Helicopter Pilot License (CHPL) training with experienced instructors and a structured path into India's growing rotor-wing aviation industry.",
  heroImage: "/migrated/helicopter-training/HPL.webp",
  metaTitle: "Helicopter Pilot Training (CHPL) | WindChasers Aviation Academy",
  blocks: [
    {
      type: "richtext",
      kicker: "Overview",
      title: "Your Path to a Commercial Helicopter Pilot License",
      paragraphs: [
        "Commercial helicopter pilots are trained professionals skilled in flying helicopters across a range of industries. The Commercial Helicopter Pilot License (CHPL) program spans one year, covering ground classes and 150 hours of flying training, leading to license issuance.",
        "At WindChasers, our helicopter flight training program prepares you thoroughly for a career in rotor-wing aviation through a structured course. Lessons are conducted by experienced instructors who bring years of rotorcraft flying experience to the classroom and the cockpit, with personalised instruction so each student gets the attention they need to succeed.",
      ],
    },
    {
      type: "facts",
      kicker: "At a Glance",
      title: "Course Overview",
      items: [
        { label: "Duration", value: "1 Year" },
        { label: "Ground Classes", value: "3–6 Months" },
        { label: "Flying Hours", value: "150 hrs" },
        { label: "Approval", value: "DGCA" },
      ],
    },
    {
      type: "list",
      kicker: "Who Can Apply",
      title: "Eligibility Criteria",
      items: [
        "12th pass with Physics and Mathematics from a recognised board.",
        "Minimum 17 years old at the time of admission.",
        "Must clear the Class 2 medical (before flying training) and the Class 1 medical (for CPL issuance).",
      ],
    },
    {
      type: "list",
      kicker: "Ground School",
      title: "Subjects Covered",
      intro:
        "Our helicopter classes begin with an in-depth study of the subjects required by the Directorate General of Civil Aviation (DGCA), building a strong theoretical foundation before flying.",
      items: [
        "Air Navigation",
        "Aviation Meteorology",
        "Air Regulations",
        "Technical General",
        "Technical Specific",
        "Radio Telephony",
      ],
    },
    {
      type: "cards",
      kicker: "Skills You Build",
      title: "Responsibilities of a CHPL Pilot",
      items: [
        {
          title: "Navigate and operate helicopters safely",
          body: "Students learn to safely navigate various weather conditions and terrains, preparing them to handle different flight scenarios and emergencies while operating a helicopter.",
        },
        {
          title: "Communicate with Air Traffic Control (ATC)",
          body: "Clear communication with ATC is a critical skill. Students practise relaying accurate information and receiving instructions for safe, efficient flights that adhere to aviation protocols.",
        },
        {
          title: "Perform pre-flight checks & ensure payload safety",
          body: "Training emphasises pre-flight safety checks so students can properly inspect the aircraft and verify all systems are operational, protecting passengers and cargo.",
        },
        {
          title: "Monitor and maintain onboard systems",
          body: "Students learn to monitor vital onboard systems such as fuel levels, navigation instruments, and communication devices — crucial for safe operations on long or complex missions.",
        },
      ],
    },
    {
      type: "gallery",
      kicker: "Gallery",
      title: "Inside the Programme",
      images: [
        "/migrated/helicopter-training/commercial-private-helicopter-pilot.webp",
        "/migrated/helicopter-training/HPL.webp",
        "/migrated/helicopter-training/aircrew-member-flying-plane-from-cockpit-with-dashboard-command-control-panel-using-steering-wheel-control-panel-windscreen-navigation-woman-using-lever-fly-aircraft.webp",
        "/migrated/helicopter-training/pilot-20.webp",
        "/migrated/helicopter-training/pilot-21.webp",
        "/migrated/helicopter-training/pilot-22.webp",
      ],
    },
    {
      type: "richtext",
      kicker: "Important Note",
      title: "Flying Hours May Vary",
      paragraphs: [
        "Flight training hours may vary based on DGCA guidelines and country-specific regulations. You can also explore our DGCA ground classes to complement your pilot training with expert theory instruction.",
      ],
    },
  ],
  related: [
    { label: "Commercial Pilot License", href: "/commercial-pilot-license" },
    { label: "Private Pilot License", href: "/private-pilot-license" },
    { label: "DGCA Ground Classes", href: "/dgca-ground-classes" },
    { label: "Diploma in Aviation", href: "/diploma-in-aviation" },
    { label: "Women in Aviation", href: "/women-in-aviation" },
  ],
  ctaTitle: "Your skyward adventure awaits.",
  ctaText:
    "Take the first step toward a challenging and rewarding career in helicopter aviation. Elevate your aspirations with WindChasers, where we turn dreams of flight into reality.",
};

export default content;
