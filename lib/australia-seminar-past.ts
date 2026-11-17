// Windchasers' past seminars and sessions, shown on /australia-seminar.
// Files live in public/australia-seminar/past/. Sources: Windchasers'
// Instagram (college seminars, months from the post dates), the Playbook
// boards (academy sessions) and photos Z sent on 17 Nov 2026.
export type PastPhoto = { src: string; caption: string };
export type PastEvent = { place: string; what: string; when?: string; src: string; pos?: string };

export const PAST_EVENTS: PastEvent[] = [
  { place: "Windchasers, Bengaluru", what: "New Zealand flight training seminar", when: "May 2026", src: "/australia-seminar/past/nz-02.webp" },
  { place: "REVA University, Bengaluru", what: "Aviation careers seminar", when: "April 2025", src: "/australia-seminar/past/reva-group.webp" },
  { place: "Alva's College, Mangalore", what: "Aviation careers seminar", when: "April 2025", src: "/australia-seminar/past/alvas-talk.webp", pos: "50% 60%" },
  { place: "Oxford College of Engineering, Bengaluru", what: "Aviation careers seminar", when: "March 2025", src: "/australia-seminar/past/oxford-room.webp" },
  { place: "Dayananda Sagar College of Engineering, Bengaluru", what: "Aviation careers seminar", when: "March 2025", src: "/australia-seminar/past/dsce-cadet.webp", pos: "50% 25%" },
  { place: "Windchasers, Bengaluru", what: "Careers in aviation session", src: "/australia-seminar/past/wc-full-room.webp" },
];

export const PAST_PHOTOS: PastPhoto[] = [
  { src: "/australia-seminar/past/wc-team-cadets.webp", caption: "The Windchasers team with our cadets" },
  { src: "/australia-seminar/past/oxford-sumaiya.webp", caption: "With students at Oxford College of Engineering, Bengaluru" },
  { src: "/australia-seminar/past/wc-cadet-family.webp", caption: "Cadets answering questions one to one" },
  { src: "/australia-seminar/past/wc-careers-talk.webp", caption: "Windchasers instructors on careers in aviation" },
  { src: "/australia-seminar/past/wc-mother-daughter.webp", caption: "A parent and student at a Windchasers session" },
  { src: "/australia-seminar/past/oxford-cadets.webp", caption: "Windchasers pilots taking questions at Oxford College of Engineering" },
  { src: "/australia-seminar/past/wc-nz-speaker.webp", caption: "A guest speaker on flight training in New Zealand" },
  { src: "/australia-seminar/past/wc-taking-notes.webp", caption: "Taking notes during the session" },
];
