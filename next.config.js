/** @type {import('next').NextConfig} */
const nextConfig = {
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
