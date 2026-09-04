import { FEATURED_SCHOOLS } from "./featured-schools";

export type Featured = (typeof FEATURED_SCHOOLS)[number];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * One featured order per request, decided ON THE SERVER.
 *
 * This must run in page.tsx (a server component on a force-dynamic route) and
 * be passed down as a prop. It used to run inside FeaturedSchools, which is
 * imported by a "use client" component, so the shuffle ran again in the
 * browser, disagreed with the server HTML, and React threw hydration errors
 * (#418/#423) on every visit.
 *
 * Weighted, not a coin toss: schools outside India with a photo first (this
 * page exists to show training abroad, and a card without a photo is a grey
 * box), then those with one of the two, then the rest. Random within a tier.
 */
export function pickFeaturedOrder(): Featured[] {
  const hasImage = (s: Featured) => typeof s.image === "string" && s.image.startsWith("http");
  const abroad = (s: Featured) => s.country !== "India";
  const tier1 = FEATURED_SCHOOLS.filter((s) => abroad(s) && hasImage(s));
  const tier2 = FEATURED_SCHOOLS.filter((s) => abroad(s) !== hasImage(s));
  const tier3 = FEATURED_SCHOOLS.filter((s) => !abroad(s) && !hasImage(s));
  return [...shuffle(tier1), ...shuffle(tier2), ...shuffle(tier3)];
}
