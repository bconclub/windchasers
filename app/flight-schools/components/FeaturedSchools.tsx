import { FEATURED_SCHOOLS } from "../lib/featured-schools";
import FeaturedCarousel from "./FeaturedCarousel";

export default function FeaturedSchools() {
  const india = FEATURED_SCHOOLS.filter((s) => s.country === "India");
  const abroad = FEATURED_SCHOOLS.filter((s) => s.country !== "India");

  return (
    <section className="bg-[#060b14]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-20 space-y-14">
        <FeaturedCarousel
          eyebrow="Handpicked by WindChasers"
          title="Featured Flight Schools in India"
          schools={india}
        />
        <FeaturedCarousel
          eyebrow="Handpicked by WindChasers"
          title="Featured Flight Schools Abroad"
          schools={abroad}
        />
      </div>
    </section>
  );
}
