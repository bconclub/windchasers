import type { Featured } from "../lib/featured-order";
import FeaturedCarousel from "./FeaturedCarousel";

/**
 * Renders the featured rail in the order it is given. The order is chosen on
 * the server by pickFeaturedOrder() in page.tsx - never here, because this
 * component is rendered inside a client tree and anything random in it would
 * run twice and break hydration.
 */
export default function FeaturedSchools({ schools }: { schools: Featured[] }) {
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
