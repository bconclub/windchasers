"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Radio } from "lucide-react";
import { getUpcomingEvents } from "@/content/shared/events";

/**
 * Homepage "Upcoming Events" section.
 * Shows future webinars / open houses with a teaser clip and a Register CTA.
 * Renders nothing when there are no upcoming events (see content/shared/events.ts).
 */
export default function UpcomingEvents() {
  const events = getUpcomingEvents();
  if (events.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest border-y border-outline-variant/10">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary font-bold tracking-[0.25em] uppercase text-xs mb-4">
            <Radio className="w-4 h-4" /> Live & Upcoming
          </span>
          <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-white">
            Upcoming Events
          </h2>
          <p className="text-on-surface-variant text-lg mt-4 max-w-2xl mx-auto">
            Free webinars, open houses, and seminars. Watch a clip, then register to join.
          </p>
        </motion.div>

        <div className={`grid gap-6 md:gap-8 ${events.length === 1 ? "max-w-3xl mx-auto" : "md:grid-cols-2"}`}>
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group flex flex-col bg-surface-container-low border border-outline-variant/20 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Teaser media */}
              <div className="relative aspect-video overflow-hidden bg-surface-container">
                {ev.vimeoId ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(https://vumbnail.com/${ev.vimeoId}.jpg)` }}
                    />
                    <iframe
                      src={`https://player.vimeo.com/video/${ev.vimeoId}?background=1&autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&dnt=1&playsinline=1`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={ev.title}
                    />
                  </>
                ) : ev.image ? (
                  <Image src={ev.image} alt={ev.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 50vw" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-primary text-on-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {ev.mode}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-7">
                <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-3">
                  <CalendarDays className="w-4 h-4" />
                  {ev.when}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{ev.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1">{ev.blurb}</p>
                <Link
                  href={ev.registerHref}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-lg font-bold hover:bg-primary-container transition-all w-full sm:w-auto"
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
