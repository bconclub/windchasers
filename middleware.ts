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

// ---------------------------------------------------------------------------
// Admin password gate (HTTP Basic Auth).
//
// /admin and everything under it is protected with a username + password read
// from env vars. Set these on the server (VPS env / pm2). They default to
// admin / windchasers2024 so the panel is never open — but you MUST override
// ADMIN_PASSWORD with a real secret:
//   ADMIN_USER=...        (default "admin")
//   ADMIN_PASSWORD=...    (default "windchasers2024" — CHANGE THIS)
// ---------------------------------------------------------------------------
function requireAdminAuth(req: NextRequest): NextResponse | null {
  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASSWORD || "windchasers2024";

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6)); // "user:pass"
      const i = decoded.indexOf(":");
      const u = decoded.slice(0, i);
      const p = decoded.slice(i + 1);
      if (u === user && p === pass) return null; // authorized
    } catch {
      /* malformed header → fall through to 401 */
    }
  }
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="WindChasers Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];

  // pilot.windchasers.in was the cutover host and is no longer a destination.
  // Send ALL of its traffic to the canonical homepage with a permanent (301)
  // redirect, so anyone with an old pilot.* link lands on windchasers.in.
  // (Note: the TLS cert must also cover pilot.windchasers.in or the browser
  // shows a cert warning before this redirect can run — handled via certbot on
  // the VPS.)
  if (host === "pilot.windchasers.in") {
    return NextResponse.redirect("https://windchasers.in/", 301);
  }

  const isNoindexHost = NOINDEX_HOSTS.has(host);
  const path = req.nextUrl.pathname;
  const isAdmin = path === "/admin" || path.startsWith("/admin/");

  // robots.txt on the noindex host → full disallow (overrides app/robots.ts).
  if (isNoindexHost && path === "/robots.txt") {
    return new NextResponse("User-agent: *\nDisallow: /\n", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }

  // Password-protect the admin panel.
  if (isAdmin) {
    const denied = requireAdminAuth(req);
    if (denied) return denied;
  }

  const res = NextResponse.next();
  if (isNoindexHost || isAdmin) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
