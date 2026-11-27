import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviators of Bengaluru, let's meet! | Bike rally and networking breakfast, 13 Dec",
  description:
    "A fun bike rally and networking breakfast for pilots, instructors, student pilots, engineers, ground professionals and aviation enthusiasts in Bengaluru. Sunday 13 December 2026, 10 am, Moxy Hotel. By Windchasers.",
  alternates: { canonical: "https://windchasers.in/bike-rally" },
  // Not indexed until the start point and fee are confirmed.
  robots: { index: false, follow: false },
  openGraph: {
    title: "Aviators of Bengaluru, let's meet!",
    description: "Bike rally and networking breakfast, Sunday 13 Dec, 10 am, Moxy Hotel, Bengaluru. By Windchasers.",
    url: "https://windchasers.in/bike-rally",
    images: [{ url: "https://windchasers.in/bike-rally/bikes-coffee.webp", width: 941, height: 636, alt: "Bikes, coffee and aviators at sunrise" }],
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
