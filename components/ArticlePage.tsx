'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-headline' });

/* ------------------------------------------------------------------ *
 * Article content model — blog posts are pure data; this component
 * renders them in the WindChasers design system (see ProgramPage.tsx).
 * ------------------------------------------------------------------ */
export type ArticleSection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type RelatedLink = {
  label: string;
  href: string;
};

export type Article = {
  title: string;
  kicker?: string;
  date?: string;
  heroImage: string;
  intro?: string;
  sections: ArticleSection[];
  related?: RelatedLink[];
};

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function ArticlePage({ article }: { article: Article }) {
  const { title, kicker = 'WindChasers · Blog', date, heroImage, intro, sections, related } = article;

  return (
    <div className={manrope.variable} style={{ backgroundColor: '#131313', color: '#fff' }}>
      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 md:px-12 text-center overflow-hidden" style={{ backgroundColor: '#131313' }}>
        <div className="absolute inset-0">
          <Image src={heroImage} alt={title} fill priority className="object-cover opacity-30" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/70 via-[#131313]/80 to-[#131313]" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#C5A572] font-bold tracking-[0.2em] uppercase text-xs mb-5 block">{kicker}</span>
          <h1 className="font-[family-name:var(--font-headline)] text-3xl md:text-5xl font-extrabold tracking-tighter text-white leading-tight mb-4">
            {title}
          </h1>
          {date && <p className="text-white/50 text-sm">{date}</p>}
          {intro && <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mt-5">{intro}</p>}
        </motion.div>
      </section>

      {/* Body */}
      <article className="py-16 px-6 md:px-12" style={{ backgroundColor: '#0e0e0e' }}>
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map((sec, i) => (
            <motion.div key={i} {...reveal} transition={{ duration: 0.5, delay: i * 0.03 }}>
              {sec.heading && (
                <h2 className="font-[family-name:var(--font-headline)] text-2xl md:text-3xl font-extrabold tracking-tight text-[#C5A572] mb-4">
                  {sec.heading}
                </h2>
              )}
              {sec.paragraphs && (
                <div className="space-y-4">
                  {sec.paragraphs.map((p, j) => (
                    <p key={j} className="text-white/70 text-base md:text-lg leading-relaxed">{p}</p>
                  ))}
                </div>
              )}
              {sec.bullets && (
                <ul className="space-y-3 mt-4">
                  {sec.bullets.map((b, k) => (
                    <li key={k} className="flex gap-3 items-start">
                      <span className="text-[#C5A572] mt-0.5 shrink-0">✓</span>
                      <span className="text-white/80 leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </article>

      {/* Related Reading */}
      {related && related.length > 0 && (
        <section className="py-16 px-6 md:px-12" style={{ backgroundColor: '#131313' }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="font-[family-name:var(--font-headline)] text-xl md:text-2xl font-extrabold tracking-tight text-white mb-5">
              Related Reading
            </h2>
            <div className="flex flex-wrap gap-3">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="px-5 py-2.5 rounded-full bg-[#1A1A1A] border border-[#C5A572]/40 text-white/80 text-sm hover:border-[#C5A572]/70 hover:text-white transition-all"
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="py-20 px-6 md:px-12" style={{ backgroundColor: '#131313' }}>
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#C5A572]/15 to-transparent border border-[#C5A572]/30 rounded-2xl p-10">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl font-extrabold tracking-tighter text-white mb-4">
            Ready to take off?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Book a demo session or talk to our team about your aviation career.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/demo" className="inline-block bg-[#C5A572] text-[#1A1A1A] px-9 py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572]/90 transition-all hover:-translate-y-0.5">
              Book a Demo
            </Link>
            <Link href="/contact-us" className="inline-block border-2 border-[#C5A572] text-[#C5A572] px-9 py-3.5 rounded-lg font-bold uppercase tracking-wider hover:bg-[#C5A572] hover:text-[#1A1A1A] transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
