import { NextRequest, NextResponse } from "next/server";

// Host-aware indexing control.
//
// The canonical site is windchasers.in. The new app is ALSO reachable on
// pilot.windchasers.in (kept live during/after the DNS cutover). To avoid
// duplicate-content in Google, every response on the pilot.* host gets a
// noindex header, and /robots.txt on that host returns a full disallow.
//
// windchasers.in (and www) index normally via app/robots.ts + page metadata.

const NOINDEX_HOSTS = new Set(["pilot.windchasers.in"]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const isNoindexHost = NOINDEX_HOSTS.has(host);

  // robots.txt on the noindex host → full disallow (overrides app/robots.ts).
  if (isNoindexHost && req.nextUrl.pathname === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  const res = NextResponse.next();
  if (isNoindexHost) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
