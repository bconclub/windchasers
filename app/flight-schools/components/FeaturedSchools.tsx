import { FEATURED_SCHOOLS } from "../lib/featured-schools";
import FeaturedCarousel from "./FeaturedCarousel";

/**
 * One featured rail, freshly ordered on every visit.
 *
 * The page is force-dynamic, so this runs per request and the shuffle is real -
 * two visitors see two orders. That matters because whatever sits first gets
 * most of the attention, and a fixed list quietly turns three schools into
 * "the" schools.
 *
 * It is a WEIGHTED shuffle, not a coin toss. Two things earn a place in the
 * front tier: a photo, because a card without one is a grey box nobody clicks,
 * and being outside India, because this page exists to show training abroad
 * and the Indian schools are already reachable everywhere else on the site.
 * Within a tier the order is random.
 */
type Featured = (typeof FEATURED_SCHOOLS)[number];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FeaturedSchools() {
  const hasImage = (s: Featured) => typeof s.image === "string" && s.image.startsWith("http");
  const abroad = (s: Featured) => s.country !== "India";

  const tier1 = FEATURED_SCHOOLS.filter((s) => abroad(s) && hasImage(s));
  const tier2 = FEATURED_SCHOOLS.filter((s) => abroad(s) !== hasImage(s)); // exactly one of the two
  const tier3 = FEATURED_SCHOOLS.filter((s) => !abroad(s) && !hasImage(s));

  const schools = [...shuffle(tier1), ...shuffle(tier2), ...shuffle(tier3)];

  return (
    <section className="bg-[#060b14]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <FeaturedCarousel
          eyebrow="Handpicked by WindChasers"
          title="Featured Flight Schools"
          schools={schools}
        />
      </div>
    </section>
  );
}
