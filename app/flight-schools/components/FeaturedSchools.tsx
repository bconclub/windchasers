import { FEATURED_SCHOOLS } from "../lib/featured-schools";
import FeaturedCarousel from "./FeaturedCarousel";

/**
 * One featured rail, not two.
 *
 * India and abroad were split into separate carousels, which framed them as
 * rival choices and buried whichever sat second. They are the same shortlist -
 * schools we vouch for - and the country is already on every card, so the
 * split cost a scroll and bought nothing. India leads because most of this
 * traffic starts there.
 */
export default function FeaturedSchools() {
  const schools = [...FEATURED_SCHOOLS].sort((a, b) => {
    const aIndia = a.country === "India" ? 0 : 1;
    const bIndia = b.country === "India" ? 0 : 1;
    return aIndia - bIndia;
  });

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
