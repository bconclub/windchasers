"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Manrope } from "next/font/google";
import {
  Check, ArrowRight, Sparkles,
  Plane, Compass, Radio, Wrench, CloudRain, Scale, GraduationCap, ShieldCheck,
  BookOpen, Target, Globe, Award, Users, Briefcase, MapPin, Gauge, PlaneTakeoff,
} from "lucide-react";

// Rotating aviation icon set so card sections read like ATC / pilot-training
// (icon-rich) instead of plain numbered boxes.
const CARD_ICONS = [
  Plane, Compass, Radio, Wrench, CloudRain, Scale, GraduationCap, ShieldCheck,
  BookOpen, Target, Globe, Award, Users, Briefcase, MapPin, Gauge, PlaneTakeoff,
];
// Pick an icon by keyword first, else fall back to rotation by index.
function pickIcon(text: string, i: number) {
  const s = text.toLowerCase();
  if (/navigat|compass|route/.test(s)) return Compass;
  if (/radio|rtr|communicat|language|english/.test(s)) return Radio;
  if (/tech|engine|aircraft|systems|maintenance/.test(s)) return Wrench;
  if (/weather|meteor|climate/.test(s)) return CloudRain;
  if (/regulation|law|rule|legal/.test(s)) return Scale;
  if (/instructor|teach|ground|class|theory|exam|study/.test(s)) return GraduationCap;
  if (/medical|safety|fitness|secure/.test(s)) return ShieldCheck;
  if (/career|airline|placement|job|interview/.test(s)) return Briefcase;
  if (/global|abroad|international|country|visa/.test(s)) return Globe;
  if (/book|diploma|syllabus|curriculum/.test(s)) return BookOpen;
  if (/cockpit|fly|flight|hours|simulator/.test(s)) return PlaneTakeoff;
  if (/team|mentor|support|community/.test(s)) return Users;
  return CARD_ICONS[i % CARD_ICONS.length];
}
import StudentsFlyingGallery from "@/components/StudentsFlyingGallery";
import CardCarousel from "@/components/CardCarousel";
import { testimonialGallery, campusImages } from "@/content/shared/galleries";
import { migratedImages } from "@/content/shared/migratedImages";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-headline" });

/* ------------------------------------------------------------------ *
 * Content model. Pages are pure data; this renders them rich and
 * section-wise in the WindChasers design system (mirrors /pilot-training):
 * two-column image+text splits, card carousels, journey steps, stat
 * bands, student reels and the campus gallery.
 * ------------------------------------------------------------------ */
export type Block =
  | { type: "richtext"; kicker?: string; title?: string; paragraphs: string[] }
  | { type: "split"; kicker?: string; title?: string; paragraphs: string[]; image?: string; flip?: boolean; bullets?: string[] }
  | { type: "cards"; kicker?: string; title?: string; intro?: string; items: { title: string; body: string }[]; cols?: 2 | 3 | 4 }
  | { type: "list"; kicker?: string; title?: string; intro?: string; items: string[] }
  | { type: "steps"; kicker?: string; title?: string; steps: { title: string; body?: string }[] }
  | { type: "facts"; kicker?: string; title?: string; items: { label: string; value: string }[] }
  | { type: "contact"; kicker?: string; title?: string; items: { label: string; value: string; href?: string }[] }
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
  metaTitle?: string;
  /** Hide hero action buttons on legal/informational pages. */
  heroActions?: boolean;
  /** Hide the bottom conversion CTA band on legal/informational pages. */
  cta?: boolean;
  /** Explicit photo list (overrides the slug→manifest lookup). */
  images?: string[];
  /** Show the reusable student testimonials reel. Default: true. */
  testimonials?: boolean;
  /** Show the "A look inside our campus" facility gallery. Default: true. Set false on legal pages. */
  campus?: boolean;
};

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function Header({ kicker, title }: { kicker?: string; title?: string }) {
  if (!kicker && !title) return null;
  return (
    <motion.div {...reveal} className="text-center mb-12 md:mb-16">
      {kicker && <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-4 block">{kicker}</span>}
      {title && (
        <h2 className="font-[family-name:var(--font-headline)] text-3xl md:text-5xl font-extrabold tracking-tighter text-white">
          {title}
        </h2>
      )}
      <div className="w-16 h-1 bg-primary mx-auto mt-6" />
    </motion.div>
  );
}

/* A framed photo tile used inside split layouts (mirrors pilot-training). */
function PhotoTile({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={`relative aspect-[4/3] rounded-[28px] overflow-hidden border border-outline-variant/30 shadow-2xl ${className}`}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[28px]" />
    </motion.div>
  );
}

/* Two-column image + text. side = which side the image sits on. */
function Split({
  kicker, title, children, image, side,
}: { kicker?: string; title?: string; children: React.ReactNode; image?: string; side: "left" | "right" }) {
  const imageRight = side === "right";
  return (
    <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <motion.div {...reveal} className={imageRight ? "" : "lg:order-2"}>
        {kicker && <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-4 block">{kicker}</span>}
        {title && (
          <h2 className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-white mb-6 leading-tight">
            {title}
          </h2>
        )}
        {children}
      </motion.div>
      {image && <PhotoTile src={image} alt={title || ""} className={imageRight ? "" : "lg:order-1"} />}
    </div>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="space-y-4">
      {items.map((p, i) => (
        <p key={i} className="text-on-surface-variant text-base md:text-lg leading-relaxed">{p}</p>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((b, i) => (
        <li key={i} className="flex gap-3 items-start text-on-surface-variant">
          <span className="mt-1 w-5 h-5 shrink-0 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
            <Check className="w-3 h-3 text-primary" />
          </span>
          <span className="text-sm md:text-base leading-relaxed">{b}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders a content block. `photo` is an optional page image assigned to this
 * block so text/list sections become two-column splits; `side` alternates.
 */
function BlockView({ block, photo, side }: { block: Block; photo?: string; side: "left" | "right" }) {
  switch (block.type) {
    case "richtext":
      // With a photo → split layout; without → centered prose.
      return photo ? (
        <Split kicker={block.kicker} title={block.title} image={photo} side={side}>
          <Paragraphs items={block.paragraphs} />
        </Split>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          <Paragraphs items={block.paragraphs} />
        </div>
      );

    case "split":
      return (
        <Split kicker={block.kicker} title={block.title} image={block.image || photo} side={block.flip ? "left" : side}>
          <Paragraphs items={block.paragraphs} />
          {block.bullets && block.bullets.length > 0 && <div className="mt-6"><Bullets items={block.bullets} /></div>}
        </Split>
      );

    case "list":
      // With a photo → split (text bullets beside image); else 2-col grid.
      return photo ? (
        <Split kicker={block.kicker} title={block.title} image={photo} side={side}>
          {block.intro && <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-6">{block.intro}</p>}
          <Bullets items={block.items} />
        </Split>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          {block.intro && <p className="text-on-surface-variant text-center max-w-3xl mx-auto -mt-8 mb-12 leading-relaxed">{block.intro}</p>}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {block.items.map((it, i) => (
              <motion.li key={i} {...reveal} transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex gap-3 items-start p-5 rounded-2xl bg-surface-container-low border border-outline-variant/25 hover:border-primary/40 transition-colors">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </span>
                <span className="text-on-surface-variant text-sm md:text-base leading-relaxed">{it}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      );

    case "cards":
      return (
        <div className="max-w-[1400px] mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          {block.intro && <p className="text-on-surface-variant text-center max-w-3xl mx-auto -mt-8 mb-12 leading-relaxed">{block.intro}</p>}
          <CardCarousel cardWidthClass="w-[80%] sm:w-[60%] md:w-[42%] lg:w-[31%]">
            {block.items.map((it, i) => {
              const Icon = pickIcon(it.title + " " + it.body, i);
              return (
                // The WindChasers signature card: gold top-stripe, floating gold
                // badge pill, lucide icon, white title, 60% body (see ATC page).
                <div key={i} className="group relative h-full bg-surface-container-low border-t-2 border-primary rounded-2xl p-8 pt-9 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 transition-all duration-300">
                  <span className="absolute -top-3 left-6 bg-primary text-on-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="w-9 h-9 text-primary mb-5 mt-1" strokeWidth={1.5} />
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{it.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{it.body}</p>
                </div>
              );
            })}
          </CardCarousel>
        </div>
      );

    case "steps":
      return (
        <div className="max-w-[1200px] mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {block.steps.map((s, i) => {
              const final = i === block.steps.length - 1;
              return (
                <motion.div key={i} {...reveal} transition={{ duration: 0.5, delay: i * 0.06 }}
                  className={`group relative p-8 rounded-3xl border transition-colors duration-500 overflow-hidden ${
                    final ? "bg-gradient-to-br from-primary/15 to-primary/5 border-primary/50" : "bg-surface-container-low border-outline-variant/15 hover:border-primary/30"
                  }`}>
                  <div className="font-[family-name:var(--font-headline)] font-black text-6xl text-primary/15 group-hover:text-primary/100 transition-colors mb-4 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  {s.body && <p className="text-on-surface-variant text-sm leading-relaxed">{s.body}</p>}
                </motion.div>
              );
            })}
          </div>
        </div>
      );

    case "facts":
      return (
        <div className="max-w-[1200px] mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {block.items.map((f, i) => (
              <motion.div key={i} {...reveal} transition={{ duration: 0.45, delay: i * 0.05 }}
                className="text-center p-7 rounded-2xl bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant/25">
                <div className="font-[family-name:var(--font-headline)] text-3xl md:text-4xl font-extrabold text-primary mb-2">{f.value}</div>
                <div className="text-on-surface-variant text-xs uppercase tracking-[0.15em]">{f.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="max-w-[1100px] mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {block.items.map((c, i) => {
              const inner = (
                <>
                  <div className="text-on-surface-variant text-[11px] uppercase tracking-[0.18em] mb-2">{c.label}</div>
                  <div className="font-semibold text-primary text-base md:text-lg leading-snug break-words [overflow-wrap:anywhere]">
                    {c.value}
                  </div>
                </>
              );
              const cardClass =
                "h-full flex flex-col justify-center text-center p-6 rounded-2xl bg-gradient-to-b from-surface-container to-surface-container-low border border-outline-variant/25 transition-colors";
              return (
                <motion.div key={i} {...reveal} transition={{ duration: 0.45, delay: i * 0.05 }} className="h-full">
                  {c.href ? (
                    <a href={c.href} className={`${cardClass} hover:border-primary/50`}>
                      {inner}
                    </a>
                  ) : (
                    <div className={cardClass}>{inner}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="max-w-[1400px] mx-auto">
          <Header kicker={block.kicker} title={block.title} />
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {block.images.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3) }}
                className="break-inside-avoid rounded-2xl overflow-hidden border border-outline-variant/25 group">
                <Image src={src} alt="" width={500} height={400} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 33vw" />
              </motion.div>
            ))}
          </div>
        </div>
      );
  }
}

export default function ProgramPage({ content, slug: slugProp }: { content: ProgramContent; slug?: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const showTestimonials = content.testimonials !== false;
  const pathname = usePathname();
  const slug = (slugProp || pathname || "").replace(/^\/+|\/+$/g, "");
  const imgs = content.images || migratedImages[slug] || [];
  const heroImage = imgs[0] || content.heroImage;
  // Remaining photos to attach to text/list sections as split imagery.
  const splitPhotos = imgs.slice(1);

  useEffect(() => {
    if (content.metaTitle) document.title = content.metaTitle;
  }, [content.metaTitle]);

  let sectionIdx = 0;
  const nextBg = () => (sectionIdx++ % 2 === 0 ? "bg-background" : "bg-surface-container-lowest");

  // Assign a photo to each text/list block, alternating image side.
  let photoCursor = 0;
  let splitSide: "left" | "right" = "right";

  return (
    <div className={`${manrope.variable} bg-background text-on-surface`}>
      {/* Hero — two-column on desktop with a framed photo */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pb-24 px-6 md:px-12">
        {heroImage && (
          <div className="absolute inset-0">
            <Image src={heroImage} alt="" fill priority className="object-cover opacity-25 lg:hidden" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background lg:hidden" />
          </div>
        )}
        <div className="relative z-10 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center lg:text-left">
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-xs mb-5 block">{content.kicker}</span>
            <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.05] mb-6">
              {content.title} {content.accent && <span className="text-primary italic">{content.accent}</span>}
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">{content.intro}</p>
            {content.heroActions !== false && (
              <div className="mt-9 flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/demo" className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-bold hover:bg-primary-container transition-all" style={{ boxShadow: "0 0 20px rgba(197,165,114,0.2)" }}>
                  Book a Demo Session <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact-us" className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-all">
                  Talk to an Expert
                </Link>
              </div>
            )}
          </motion.div>

          {heroImage && (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="relative hidden lg:block aspect-[4/3] rounded-[28px] overflow-hidden border border-outline-variant/30 shadow-2xl">
              <Image src={heroImage} alt={content.title} fill priority className="object-cover" sizes="50vw" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[28px]" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Content blocks. richtext/list/split get a paired photo (alternating sides). */}
      {content.blocks.map((block, i) => {
        const wantsPhoto = block.type === "richtext" || block.type === "list" || block.type === "split";
        const hasOwnImage = block.type === "split" && !!block.image;
        let photo: string | undefined;
        if (wantsPhoto && !hasOwnImage && photoCursor < splitPhotos.length) {
          photo = splitPhotos[photoCursor++];
        }
        const side = splitSide;
        if (wantsPhoto && (photo || hasOwnImage)) splitSide = splitSide === "right" ? "left" : "right";
        return (
          <section key={i} className={`py-20 md:py-28 px-6 md:px-12 ${nextBg()}`}>
            <BlockView block={block} photo={photo} side={side} />
          </section>
        );
      })}

      {/* Student testimonials reel */}
      {showTestimonials && (
        <section className="py-20 md:py-28 px-6 md:px-12 bg-surface-container-lowest border-y border-outline-variant/10">
          <StudentsFlyingGallery items={testimonialGallery} eyebrow="Proof in Flight" title="They were where you are. Now they fly." subtitle="Real students. Their own words." variant="stitch" />
        </section>
      )}

      {/* Real WindChasers campus gallery */}
      {content.campus !== false && (
        <section className={`py-20 md:py-28 px-6 md:px-12 ${nextBg()}`}>
          <BlockView block={{ type: "gallery", kicker: "WindChasers", title: "A look inside our campus", images: campusImages }} photo={undefined} side="right" />
        </section>
      )}

      {/* FAQ */}
      {content.faqs && content.faqs.length > 0 && (
        <section className={`py-20 md:py-28 px-6 md:px-12 ${nextBg()}`}>
          <div className="max-w-3xl mx-auto">
            <Header kicker="Help" title="Frequently Asked Questions" />
            <div className="space-y-3">
              {content.faqs.map((faq, i) => (
                <motion.div key={i} {...reveal} transition={{ duration: 0.4, delay: i * 0.03 }} className="bg-surface-container-low border-t-2 border-primary/40 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-bold text-white">{faq.q}</span>
                    <span className="text-primary shrink-0 mt-0.5 text-xl leading-none">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <div className="px-6 pb-5 text-on-surface-variant text-sm leading-relaxed whitespace-pre-line border-t border-white/5">{faq.a}</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {content.related && content.related.length > 0 && (
        <section className={`py-16 px-6 md:px-12 ${nextBg()}`}>
          <div className="max-w-[1200px] mx-auto">
            <Header kicker="Explore" title="Related Programs" />
            <div className="flex flex-wrap gap-3 justify-center">
              {content.related.map((r) => (
                <Link key={r.href} href={r.href} className="px-5 py-2.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant text-sm hover:border-primary/60 hover:text-white transition-all">
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      {content.cta !== false && (
        <section className="py-20 md:py-28 px-6 md:px-12 bg-primary-container">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-10 h-10 text-on-primary-container/70 mx-auto mb-6" />
            <h2 className="font-[family-name:var(--font-headline)] text-3xl md:text-5xl font-extrabold tracking-tighter text-on-primary-container mb-5">
              {content.ctaTitle || "Ready to start your journey?"}
            </h2>
            {content.ctaText && <p className="text-on-primary-container/80 text-lg mb-8 max-w-2xl mx-auto">{content.ctaText}</p>}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/demo" className="inline-flex items-center gap-2 bg-black text-white px-9 py-4 rounded-lg font-bold hover:-translate-y-0.5 transition-all">
                Book a Demo Session <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/assessment" className="inline-flex items-center gap-2 bg-transparent border-2 border-black text-black px-9 py-4 rounded-lg font-bold hover:bg-black hover:text-white transition-all">
                Take the Assessment
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
