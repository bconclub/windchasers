import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import { WEBINAR_ZOOM_REGISTER_URL } from "@/lib/webinar";

export const metadata: Metadata = {
  title: "Live Webinars · WindChasers",
  description: "Parents and students webinars - April 25, 2026 on Zoom.",
};

const WEBINARS = [
  {
    href: "/webinar/parents",
    title: "Parents webinar",
    blurb: "For parents: career paths, planning, and how to support your child.",
  },
  {
    href: "/webinar/students",
    title: "Pilot Training after +2 Complete Roadmap 2026",
    blurb: "For students: full 2026 roadmap after Class 12, DGCA, costs, cadet vs CPL.",
  },
] as const;

export default function WebinarIndexPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <p className="text-[#C5A572] text-xs uppercase tracking-[0.35em] mb-3">Upcoming</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">WindChasers live webinars</h1>
        <p className="text-white/65 text-lg mb-6">
          April 25, 2026 · Zoom · free registration
        </p>
        <a
          href={WEBINAR_ZOOM_REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#C5A572] text-[#1A1A1A] px-8 py-3.5 font-semibold text-base hover:bg-[#C5A572]/90 transition-colors shadow-lg shadow-[#C5A572]/20"
        >
          Register on Zoom
        </a>
      </div>
      <ul className="max-w-xl mx-auto space-y-4">
        {WEBINARS.map((w) => (
          <li key={w.href}>
            <Link
              href={w.href}
              className="group flex items-start gap-4 rounded-2xl border border-[#C5A572]/35 bg-black/35 backdrop-blur-sm p-6 hover:border-[#C5A572]/55 hover:bg-black/50 transition-colors"
            >
              <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C5A572]/15 text-[#C5A572]">
                <Plane className="w-5 h-5" aria-hidden />
              </span>
              <span className="flex-1 text-left">
                <span className="block text-white font-semibold text-lg group-hover:text-[#C5A572] transition-colors">
                  {w.title}
                </span>
                <span className="block text-white/55 text-sm mt-1">{w.blurb}</span>
              </span>
              <ArrowRight className="w-5 h-5 text-[#C5A572]/70 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
