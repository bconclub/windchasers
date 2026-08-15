import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/auth/set-password", "/inactive"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;
  const { response, userId, role, isActive, sessionCurrent } = await refreshSession(request);

  if (!userId) {
    if (isPublic(pathname)) return response;
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // One active session per account. The newer login wins, this one is retired.
  // The login page is exempt so the person can sign back in.
  if (!sessionCurrent && !isPublic(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "session_replaced");
    return NextResponse.redirect(loginUrl);
  }

  // Signed in but deactivated by an admin
  if (!isActive || !role) {
    if (pathname === "/inactive") return response;
    return NextResponse.redirect(new URL("/inactive", request.url));
  }

  const isStaff = role === "admin" || role === "instructor";
  const home = isStaff ? "/admin" : "/dashboard";

  // Only bounce away from the login page when this session is still the live
  // one, otherwise a retired session ping pongs between /login and its home.
  if ((pathname === "/" || pathname === "/login") && sessionCurrent) {
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname.startsWith("/admin") && !isStaff) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals, static files and the auth callback
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
