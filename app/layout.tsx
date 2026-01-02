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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:26',message:'RootLayout HTML rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(function(){});
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans" style={{ color: '#ffffff', backgroundColor: '#1A1A1A' }}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:38',message:'Body rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(function(){});
                  window.addEventListener('error', function(e) {
                    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:39',message:'Global error caught',data:{message:e.message,filename:e.filename,lineno:e.lineno,error:e.error?.toString()?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(function(){});
                  });
                  window.addEventListener('unhandledrejection', function(e) {
                    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/layout.tsx:40',message:'Unhandled promise rejection',data:{reason:e.reason?.toString()?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(function(){});
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
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
