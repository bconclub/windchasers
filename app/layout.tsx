import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import Analytics from "@/components/Analytics";
import TrackingProvider from "@/components/TrackingProvider";
import MetaPixelInit from "@/components/MetaPixelInit";
import StickyDemoCTA from "@/components/StickyDemoCTA";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://windchasers.in"),
  title: "Pilot Training in Bangalore | CPL & DGCA Ground Classes | WindChasers",
  description: "Pilot training in Bangalore after 12th. DGCA-aligned ground classes in-house and commercial pilot license (CPL) training with DGCA-approved partner FTOs. Real costs, real guidance, no false promises.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "WindChasers – India's Top Pilot Training Academy, Bangalore",
    description: "DGCA-aligned ground classes and commercial pilot license (CPL) training. Real costs, real guidance, no false promises.",
    url: "https://windchasers.in",
    siteName: "WindChasers Aviation Academy",
    images: [{ url: "/og-image.jpg", width: 1917, height: 942, alt: "WindChasers Aviation Academy" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WindChasers – India's Top Pilot Training Academy, Bangalore",
    description: "DGCA-aligned ground classes and commercial pilot license (CPL) training in Bangalore.",
    images: ["/og-image.jpg"],
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
        {/* Meta Pixel — queue setup only; init + PageView fired by MetaPixelInit */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `,
          }}
        />
        <MetaPixelInit />
        {/* PROXe web-chat widget — loaded globally so the chat launcher is
            available on every page. */}
        <Script
          src="https://proxe.windchasers.in/api/widget/embed.js"
          strategy="afterInteractive"
        />
        <Analytics />
        <TrackingProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <StickyDemoCTA />
          <ConditionalFooter />
        </TrackingProvider>
      </body>
    </html>
  );
}
