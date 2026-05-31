import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/agent", "/gtm", "/stitch"],
    },
    sitemap: "https://windchasers.in/sitemap.xml",
  };
}
