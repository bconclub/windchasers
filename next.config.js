/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-leaflet', '@react-leaflet/core', 'maplibre-gl'],
  async redirects() {
    return [
      { source: "/webinar/government-aviation", destination: "/webinar/parents", permanent: true },
      { source: "/webinar/pilot-roadmap", destination: "/webinar/students", permanent: true },

      // --- windchasers.in migration: canonical + junk/duplicate cleanup ---
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/privacy-policy-2", destination: "/privacy-policy", permanent: true },
      { source: "/some", destination: "/license-conversion-course", permanent: true },
      { source: "/home2", destination: "/", permanent: true },
      { source: "/windchasers-anybody-can-fly-top-pilot-training-academy", destination: "/", permanent: true },
      // thin Sept-2023 lead posts → blog
      { source: "/aviation-safety-briefing", destination: "/blog", permanent: true },
      { source: "/industry-partnership-announcement", destination: "/blog", permanent: true },
      { source: "/pilot-career-workshop", destination: "/blog", permanent: true },
      { source: "/advanced-flight-training-demo", destination: "/blog", permanent: true },
      // WordPress category archive → blog
      { source: "/category/blog", destination: "/blog", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://pilot.windchasers.in"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
