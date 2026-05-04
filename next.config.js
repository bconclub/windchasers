/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-leaflet', '@react-leaflet/core', 'maplibre-gl'],
  async redirects() {
    return [
      { source: "/webinar/government-aviation", destination: "/webinar/parents", permanent: true },
      { source: "/webinar/pilot-roadmap", destination: "/webinar/students", permanent: true },
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
