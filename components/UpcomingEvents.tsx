"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Radio, Play } from "lucide-react";
import CardCarousel from "@/components/CardCarousel";
import { getUpcomingEvents, getPastEvents, type WindEvent } from "@/content/shared/events";

function EventCard({ ev, past }: { ev: WindEvent; past?: boolean }) {
  return (
    <div
      className={`group flex flex-col h-full bg-accent-dark border border-white/10 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 ${past ? "opacity-70 hover:opacity-100" : ""}`}
    >
      {/* Teaser media */}
      <div className={`relative aspect-video overflow-hidden bg-dark ${past ? "grayscale group-hover:grayscale-0 transition-[filter] duration-300" : ""}`}>
        {ev.vimeoId ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://vumbnail.com/${ev.vimeoId}.jpg)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gold/90 text-dark shadow-lg">
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              </span>
            </div>
          </>
        ) : ev.image ? (
          <Image src={ev.image} alt={ev.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
        ) : null}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${past ? "bg-white/15 text-white" : "bg-gold text-dark"}`}>
          {past ? "Past · " : ""}{ev.mode}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-gold text-sm font-semibold mb-2">
          <CalendarDays className="w-4 h-4" />
          {ev.when}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2">{ev.title}</h3>
        <p className="text-white/60 text-sm leading-relaxed mb-5 flex-1">{ev.blurb}</p>
        {past ? (
          <Link
            href={ev.registerHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all w-full sm:w-auto border border-gold/40 text-gold hover:border-gold"
          >
            Watch Highlights <ArrowRight className="w-4 h-4" />
          </Link>
        ) : ev.registrationOpen ? (
          <Link
            href={ev.registerHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all w-full sm:w-auto bg-gold text-dark hover:bg-gold/90"
          >
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm w-full sm:w-auto border border-white/15 text-white/50 cursor-default select-none">
            Registration is not open yet
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Homepage events, one carousel. Upcoming first, past events follow (grayed
 * out, still clickable to view highlights). Renders nothing if there are none.
 */
export default function UpcomingEvents() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  const all = [...upcoming, ...past];
  if (all.length === 0) return null;
  const upcomingCount = upcoming.length;

  return (
    <section className="py-20 px-6 lg:px-8 bg-dark">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-gold font-bold tracking-[0.2em] uppercase text-xs mb-4">
            <Radio className="w-4 h-4" /> Live &amp; Upcoming
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white">Events</h2>
          <p className="text-white/60 text-lg mt-4 max-w-2xl mx-auto">
            Free webinars and open houses. Register for what is coming up, or watch highlights from past events.
          </p>
        </motion.div>

        <CardCarousel variant="legacy" cardWidthClass="w-[85%] sm:w-[60%] md:w-[46%] lg:w-[42%]">
          {all.map((ev, i) => (
            <EventCard key={ev.id} ev={ev} past={i >= upcomingCount} />
          ))}
        </CardCarousel>
      </div>
    </section>
  );
}
