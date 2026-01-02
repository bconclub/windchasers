import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import Analytics from "@/components/Analytics";
import TrackingProvider from "@/components/TrackingProvider";
import FloatingActionButtons from "@/components/FloatingActionButtons";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Windchasers - India's Top Pilot Training Academy- Bangalore",
  description: "DGCA approved pilot training with real cost transparency. Ex-Air Force instructors. No false promises.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/Windhcasers Icon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans" style={{ color: '#ffffff', backgroundColor: '#1A1A1A' }}>
        <Analytics />
        <TrackingProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
          <FloatingActionButtons />
        </TrackingProvider>
      </body>
    </html>
  );
}
