import type { Metadata } from "next";

// Pay-only link the team sends on WhatsApp. Not for search: the seminar page is the public one.
export const metadata: Metadata = {
  title: "Pay ₹99 | Australia pilot training seminar, 28 Nov, Bengaluru",
  description: "Reserve your seat at the Basair Aviation College seminar. Saturday 28 November 2026, 3 to 6 pm, Radisson City Centre, Bengaluru.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Reserve your seat: ₹99",
    description: "Pilot training in Australia, seminar with Basair Aviation College. Sat 28 Nov, 3 to 6 pm, Radisson City Centre, Bengaluru.",
    url: "https://windchasers.in/australia-seminar/pay",
    images: [{ url: "https://windchasers.in/australia-seminar/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
