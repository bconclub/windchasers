"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-headline" });

/* ------------------------------------------------------------------ *
 * Content model — pages are pure data; this component renders them in
 * the WindChasers design system (see docs/DESIGN_SYSTEM.md).
 * ------------------------------------------------------------------ */
export type Block =
  | { type: "richtext"; kicker?: string; title?: string; paragraphs: string[] }
  | { type: "cards"; kicker?: string; title?: string; intro?: string; items: { title: string; body: string }[]; cols?: 2 | 3 | 4 }
  | { type: "list"; kicker?: string; title?: string; intro?: string; items: string[] }
  | { type: "steps"; kicker?: string; title?: string; steps: { title: string; body?: string }[] }
  | { type: "facts"; kicker?: string; title?: string; items: { label: string; value: string }[] }
  | { type: "gallery"; kicker?: string; title?: string; images: string[] };

export type ProgramContent = {
  kicker: string;
  title: string;
  accent?: string;
  intro: string;
  heroImage?: string;
  blocks: Block[];
  faqs?: { q: string; a: string }[];
  ctaTitle?: string;
  ctaText?: string;
  related?: { label: string; href: string }[];
  /** document.title set on mount */
  metaTitle?: string;
};

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function SectionHeader({ kicker, title }: { kicker?: string; title?: string }) {
  if (!kicker && !title) return null;
  return (
    <motion.div {...reveal} className="text-center mb-12">
      {kicker && (
        <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">{kicker}</span>
      )}
      {title && (
        <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
          {title}
        </h2>
      )}
    </motion.div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "richtext":
      return (
        <div className="max-w-4xl mx-auto">
          <SectionHeader kicker={block.kicker} title={block.title} />
          <div className="space-y-5">
            {block.paragraphs.map((p, i) => (
              <motion.p key={i} {...reveal} transition={{ duration: 0.5, delay: i * 0.04 }} className="text-on-surface-variant text-base md:text-lg leading-relaxed">
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      );
    case "cards": {
      const cols = block.cols === 2 ? "md:grid-cols-2" : block.cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";
      return (
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader kicker={block.kicker} title={block.title} />
          {block.intro && <p className="text-on-surface-variant text-center max-w-3xl mx-auto -mt-6 mb-10 leading-relaxed">{block.intro}</p>}
          <div className={`grid grid-cols-1 ${cols} gap-6`}>
            {block.items.map((it, i) => (
              <motion.div key={i} {...reveal} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-7 rounded-2xl bg-surface-container border border-outline-variant/40 hover:border-[#C5A572]/50 transition-all hover:-translate-y-1">
                <h3 className="text-lg font-bold text-white mb-2">{it.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{it.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }
    case "list":
      return (
        <div className="max-w-4xl mx-auto">
          <SectionHeader kicker={block.kicker} title={block.title} />
          {block.intro && <p className="text-on-surface-variant text-center max-w-3xl mx-auto -mt-6 mb-10 leading-relaxed">{block.intro}</p>}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {block.items.map((it, i) => (
              <motion.li key={i} {...reveal} transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex gap-3 items-start p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <span className="text-[#C5A572] mt-0.5 shrink-0">✓</span>
                <span className="text-on-surface-variant text-sm leading-relaxed">{it}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      );
    case "steps":
      return (
        <div className="max-w-4xl mx-auto">
          <SectionHeader kicker={block.kicker} title={block.title} />
          <div className="space-y-4">
            {block.steps.map((s, i) => (
              <motion.div key={i} {...reveal} transition={{ duration: 0.45, delay: i * 0.05 }}
                className="flex gap-5 items-start p-6 rounded-2xl bg-surface-container border border-outline-variant/40">
                <span className="font-[family-name:var(--font-headline)] text-3xl font-extrabold text-[#C5A572] leading-none shrink-0 w-10">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                  {s.body && <p className="text-on-surface-variant text-sm leading-relaxed">{s.body}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case "facts":
      return (
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader kicker={block.kicker} title={block.title} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {block.items.map((f, i) => (
              <motion.div key={i} {...reveal} transition={{ duration: 0.45, delay: i * 0.05 }}
                className="text-center p-6 rounded-2xl bg-surface-container border border-outline-variant/40">
                <div className="font-[family-name:var(--font-headline)] text-2xl md:text-3xl font-extrabold text-[#C5A572] mb-1">{f.value}</div>
                <div className="text-on-surface-variant text-xs uppercase tracking-wider">{f.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className="max-w-[1400px] mx-auto">
          <SectionHeader kicker={block.kicker} title={block.title} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {block.images.map((src, i) => (
              <motion.div key={i} {...reveal} transition={{ duration: 0.45, delay: i * 0.04 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant/40 group">
                <Image src={src} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 33vw" />
              </motion.div>
            ))}
          </div>
        </div>
      );
  }
}

export default function ProgramPage({ content }: { content: ProgramContent }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (content.metaTitle) document.title = content.metaTitle;
  }, [content.metaTitle]);

  return (
    <div className={manrope.variable} style={{ backgroundColor: "#131313", color: "#fff" }}>
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 text-center overflow-hidden" style={{ backgroundColor: "#131313" }}>
        {content.heroImage && (
          <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${content.heroImage})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/70 via-[#131313]/80 to-[#131313]" />
        <motion.div className="relative z-10 max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">{content.kicker}</span>
          <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl font-extrabold tracking-tighter text-white leading-tight mb-5">
            {content.title} {content.accent && <span className="text-[#C5A572] italic">{content.accent}</span>}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{content.intro}</p>
          <div className="mt-9 flex flex-wrap gap-4 justify-center">
            <Link href="/demo" className="inline-block bg-[#C5A572] text-[#1A1A1A] px-9 py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5">
              Book a Demo Session
            </Link>
            <Link href="/contact-us" className="inline-block border-2 border-[#C5A572] text-[#C5A572] px-9 py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572] hover:text-[#1A1A1A] transition-all">
              Talk to an Expert
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Content blocks — alternating backgrounds */}
      {content.blocks.map((block, i) => (
        <section key={i} className="py-20 px-6 md:px-12" style={{ backgroundColor: i % 2 === 0 ? "#0e0e0e" : "#131313" }}>
          <BlockView block={block} />
        </section>
      ))}

      {/* FAQ */}
      {content.faqs && content.faqs.length > 0 && (
        <section className="py-20 px-6 md:px-12" style={{ backgroundColor: content.blocks.length % 2 === 0 ? "#0e0e0e" : "#131313" }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader kicker="Help" title="Frequently Asked Questions" />
            <div className="space-y-3">
              {content.faqs.map((faq, i) => (
                <motion.div key={i} {...reveal} transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="bg-[#1A1A1A] border-t-2 border-[#C5A572]/40 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-bold text-white">{faq.q}</span>
                    <span className="text-[#C5A572] shrink-0 mt-0.5">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed whitespace-pre-line border-t border-white/5">{faq.a}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related links */}
      {content.related && content.related.length > 0 && (
        <section className="py-16 px-6 md:px-12" style={{ backgroundColor: "#131313" }}>
          <div className="max-w-[1400px] mx-auto">
            <SectionHeader kicker="Explore" title="Related Programs" />
            <div className="flex flex-wrap gap-3 justify-center">
              {content.related.map((r) => (
                <Link key={r.href} href={r.href}
                  className="px-5 py-2.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant text-sm hover:border-[#C5A572]/60 hover:text-white transition-all">
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="py-20 px-6 md:px-12 bg-primary-container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl font-extrabold tracking-tighter text-on-primary-container mb-5">
            {content.ctaTitle || "Ready to start your journey?"}
          </h2>
          {content.ctaText && <p className="text-on-primary-container/80 text-lg mb-8 max-w-2xl mx-auto">{content.ctaText}</p>}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo" className="inline-block bg-[#1A1A1A] text-white px-10 py-4 rounded-lg font-bold uppercase tracking-wider hover:-translate-y-0.5 transition-all">
              Book a Demo Session
            </Link>
            <Link href="/assessment" className="inline-block bg-transparent border-2 border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#1A1A1A] hover:text-white transition-all">
              Take the Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
