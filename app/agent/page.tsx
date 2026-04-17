"use client";

import Link from "next/link";
import Script from "next/script";

export default function AgentPage() {
  return (
    <section className="min-h-screen pt-32 pb-16 px-6 lg:px-8">
      <Script
        src="https://proxe.windchasers.in/api/widget/embed.js"
        strategy="afterInteractive"
      />

      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-accent-dark to-dark p-8 md:p-12">
          <p className="text-gold text-sm md:text-base font-semibold tracking-wide uppercase">
            WindChasers Agent
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold text-white">
            Agent Workspace
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg max-w-3xl">
            This page is ready for web-agent integration. We can plug in the
            live agent widget, custom prompt controls, and session tracking here.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-white font-semibold">Widget Container</p>
              <p className="text-white/60 text-sm mt-1">
                Script loaded. Agent UI will render once the widget bootstraps.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-white font-semibold">Prompt Actions</p>
              <p className="text-white/60 text-sm mt-1">
                Space for quick actions and predefined user intents.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-white font-semibold">Session Insights</p>
              <p className="text-white/60 text-sm mt-1">
                Placeholder for lead capture and interaction telemetry.
              </p>
            </div>
          </div>

          <div
            id="windchasers-web-agent"
            className="mt-8 min-h-[420px] rounded-xl border border-dashed border-gold/40 bg-black/30 p-4"
          >
            <p className="text-white/60 text-sm">
              Waiting for `https://proxe.windchasers.in/api/widget/embed.js` to mount the agent.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-gold px-5 py-3 font-semibold text-dark hover:bg-gold/90 transition-colors"
            >
              Back to Home
            </Link>
            <a
              href="https://pilot.windchasers.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-gold/50 px-5 py-3 font-semibold text-gold hover:bg-gold hover:text-dark transition-colors"
            >
              Open Live Site
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
