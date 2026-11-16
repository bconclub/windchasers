import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot training in Australia | Seminar with Basair Aviation College, 28 Nov, Bengaluru",
  description:
    "Hear it from David Trevelyan, CEO of Basair Aviation College, in person. Saturday 28 November 2026, 3 to 6 pm, Radisson City Centre, Bengaluru. Register for ₹99.",
  alternates: { canonical: "https://windchasers.in/australia-seminar" },
  openGraph: {
    title: "Pilot training in Australia: seminar with Basair Aviation College",
    description: "Sat 28 Nov, 3 to 6 pm, Radisson City Centre, Bengaluru. Hosted by Windchasers. Register for ₹99.",
    url: "https://windchasers.in/australia-seminar",
    images: [{ url: "https://windchasers.in/australia-seminar/og.jpg", width: 1200, height: 630, alt: "Pilot training in Australia? Seminar with Basair Aviation College, Sat 28 Nov, Radisson City Centre, Bengaluru" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pilot training in Australia: seminar with Basair Aviation College",
    description: "Sat 28 Nov, 3 to 6 pm, Radisson City Centre, Bengaluru. Register for ₹99.",
    images: ["https://windchasers.in/australia-seminar/og.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
