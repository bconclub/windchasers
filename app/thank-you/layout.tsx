// Server-component layout for /thank-you so we can mark the route segment as
// dynamic. The page itself is "use client" (reads URL params) — Route Segment
// Config options can only live in server components or layouts.
//
// Why force-dynamic:
//   /thank-you is statically pre-rendered by default, which causes nginx to
//   cache the SSR'd HTML for a year (s-maxage=31536000). After a fresh build
//   the webpack chunk filenames change, but the cached HTML still references
//   the old hashes → 404 on webpack-*.js → completely blank page. Forcing
//   dynamic rendering sends `Cache-Control: private, no-cache, no-store,
//   max-age=0, must-revalidate` and prevents the stale-HTML failure mode.
export const dynamic = "force-dynamic";

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return children;
}
