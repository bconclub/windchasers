/**
 * The WindChasers roster.
 *
 * Extracted from app/page.tsx so the homepage and event pages render the same
 * people from one list - previously it was an inline const, so a second use
 * would have meant a second copy to keep in sync.
 *
 * `offset` is a homepage-only layout hint (staggered card grid); event pages
 * ignore it.
 */
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  offset?: boolean;
};

export const TEAM: TeamMember[] = [
  {
    name: "Sumaiya Ali",
    role: "Founder & CEO",
    bio: "Founded WindChasers in 2024 to give parents and aspiring pilots an honest path to the cockpit.",
    image: "/team/Sumaiya Ali.webp",
    offset: false,
  },
  {
    name: "Rida Maryam Ali",
    role: "Managing Director",
    bio: "Trained commercial pilot. Brings aviation discipline and strategic leadership to every cohort.",
    image: "/team/Rida Ali.webp",
    offset: true,
  },
  {
    name: "Hemanth Kumar R",
    role: "Chief Ground Instructor · B737NG Type-Rated",
    bio: "CPL holder, ATPL-cleared aeronautical engineer. Five years guiding students through DGCA exams.",
    image: "/team/Hemanth.webp",
    offset: false,
  },
  {
    name: "Navaneeth Nagendra",
    role: "Senior Ground Instructor",
    bio: "Eight years in aviation training across Aeronautical, Maintenance, and Industrial Engineering. Builds robust academic foundations aligned with the DGCA syllabus.",
    image: "/team/Navneeth.webp",
    offset: true,
  },
  {
    name: "Rohan Hibare",
    role: "Ground Instructor · CPL",
    bio: "Makes complex aviation concepts exam-ready through clear, methodical instruction.",
    image: "/team/Rohan.webp",
    offset: false,
  },
];
