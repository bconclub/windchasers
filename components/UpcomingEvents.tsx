"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Radio, Play } from "lucide-react";
import { getUpcomingEvents, getPastEvents, type WindEvent } from "@/content/shared/events";

function EventCard({ ev, past }: { ev: WindEvent; past?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col bg-accent-dark border border-white/10 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Teaser media */}
      <div className="relative aspect-video overflow-hidden bg-dark">
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
        <Link
          href={ev.registerHref}
          className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all w-full sm:w-auto ${
            past
              ? "border border-gold/40 text-gold hover:border-gold"
              : "bg-gold text-dark hover:bg-gold/90"
          }`}
        >
          {past ? "Watch Highlights" : "Register Now"} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * Homepage events section: upcoming events + a "Past events" row for proof.
 * Renders nothing if there are neither (see content/shared/events.ts).
 */
export default function UpcomingEvents() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  if (upcoming.length === 0 && past.length === 0) return null;

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
            Free webinars and open houses. Watch a clip, then register to join the next one.
          </p>
        </motion.div>

        {upcoming.length > 0 && (
          <div className={`grid gap-6 ${upcoming.length === 1 ? "max-w-3xl mx-auto" : "md:grid-cols-2"}`}>
            {upcoming.map((ev) => (
              <EventCard key={ev.id} ev={ev} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <div className="text-center mt-16 mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white/90">Past events</h3>
              <p className="text-white/50 mt-2">A look at what our community has been part of.</p>
            </div>
            <div className={`grid gap-6 ${past.length === 1 ? "max-w-3xl mx-auto" : "md:grid-cols-2"}`}>
              {past.map((ev) => (
                <EventCard key={ev.id} ev={ev} past />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
