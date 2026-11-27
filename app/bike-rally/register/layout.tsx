import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rider details | Aviators bike rally, 13 Dec | Windchasers",
  description: "Lock your spot for the Aviators of Bengaluru bike rally and networking breakfast, Sunday 13 December 2026, Moxy Hotel, Bengaluru.",
  alternates: { canonical: "https://windchasers.in/bike-rally/register" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Lock your spot: Aviators bike rally, 13 Dec",
    description: "2 minutes for rider details. Bike rally and networking breakfast, Sun 13 Dec, 10 am, Moxy Hotel, Bengaluru.",
    url: "https://windchasers.in/bike-rally/register",
    images: [{ url: "https://windchasers.in/bike-rally/riders-group.webp", width: 1080, height: 1344, alt: "Windchasers pilots with their bikes" }],
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
