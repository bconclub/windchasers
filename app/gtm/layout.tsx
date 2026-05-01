import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GTM Tracker",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function GTMLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
