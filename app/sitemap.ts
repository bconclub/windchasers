import type { MetadataRoute } from "next";

const BASE = "https://windchasers.in";

// Canonical, indexable routes migrated from the legacy WordPress site + key app pages.
const routes: string[] = [
  "/",
  // Licenses & ratings
  "/commercial-pilot-license",
  "/private-pilot-license",
  "/airline-transport-pilot-license",
  "/foreign-cpl",
  "/license-conversion-course",
  "/instrument-rating",
  "/multi-engine-rating",
  "/multi-engine-instrument-rating-meir",
  "/certified-flight-instructor",
  "/night-rating-progam",
  // Type ratings
  "/type-rating",
  "/boeing-737-type-rating",
  "/airbus-a320-type-rating",
  // Ground & academics
  "/dgca-ground-classes",
  "/diploma-in-aviation",
  "/ielts-training-program",
  // Cadet & airline programs
  "/airline",
  "/pre-cadet-program",
  "/cadet-pilot-program",
  "/airline-preparation-program",
  "/airline-cadet-program-interview-training",
  // Locations
  "/pilot-training-in-india",
  "/pilot-training-in-usa",
  "/pilot-training-in-canada",
  "/pilot-training-in-australia",
  "/pilot-training-in-new-zealand",
  "/pilot-training-in-south-africa",
  // Other training
  "/helicopter-training",
  "/cabin-crew",
  "/women-in-aviation",
  // Brand
  "/about",
  "/team",
  "/with-the-founder",
  "/contact-us",
  // Blog
  "/blog",
  "/best-aviation-academy-in-india-for-pilot-training-a-career-ready-curriculum",
  "/how-to-start-your-helicopter-flight-training-a-step-by-step-guide",
  "/a-complete-guide-to-dgca-ground-classes-in-india-subjects-duration-and-benefits",
  "/best-online-aviation-courses-in-india-flexible-learning-for-future-flyers",
  // Legal
  "/privacy-policy",
  "/refund-policy",
  "/terms-conditions",
  // Key conversion pages (existing app)
  "/assessment",
  "/demo",
  "/open-house",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
