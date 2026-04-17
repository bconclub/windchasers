"use client";

import Script from "next/script";

export default function AgentPage() {
  return (
    <section className="min-h-screen pt-24 pb-10 px-4 md:px-6">
      <Script
        src="https://proxe.windchasers.in/api/widget/embed.js"
        strategy="afterInteractive"
      />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Agent
        </h1>
        <div id="windchasers-web-agent" className="min-h-[560px]" />
      </div>
    </section>
  );
}
