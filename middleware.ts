import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCredentials, adminSessionToken } from "@/lib/admin-auth";

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
// Admin password gate.
//
// /admin and everything under it requires a session cookie set by the on-site
// login page (/admin-login → /api/admin/login). Credentials come from env vars
// on the server (VPS env / pm2), defaulting to admin / windchasers2024 — you
// MUST override ADMIN_PASSWORD with a real secret:
//   ADMIN_USER=...        (default "admin")
//   ADMIN_PASSWORD=...    (default "windchasers2024" — CHANGE THIS)
// A valid HTTP Basic header is still accepted as a fallback so curl/scripts
// keep working — but browsers never get a 401 challenge (no native popup).
// ---------------------------------------------------------------------------
async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  // 1. Session cookie from the on-site login.
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie && cookie === (await adminSessionToken())) return true;

  // 2. Basic auth fallback (scripts / health checks). Never challenged for.
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6)); // "user:pass"
      const i = decoded.indexOf(":");
      const { user, pass } = adminCredentials();
      if (decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) return true;
    } catch {
      /* malformed header → unauthorized */
    }
  }
  return false;
}

export async function middleware(req: NextRequest) {
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

  // Password-protect the admin panel — unauthenticated browsers go to the
  // on-site login page instead of getting a native Basic-auth popup.
  if (isAdmin && !(await isAdminAuthorized(req))) {
    const login = req.nextUrl.clone();
    login.pathname = "/admin-login";
    login.search = path !== "/admin" ? `?from=${encodeURIComponent(path)}` : "";
    return NextResponse.redirect(login);
  }

  const res = NextResponse.next();
  if (isNoindexHost || isAdmin || path === "/admin-login") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  // Run on everything except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
