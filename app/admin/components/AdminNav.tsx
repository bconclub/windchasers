"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/flight-schools", label: "Flight Schools" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/payments", label: "Payments" },
];

export default function AdminNav() {
  const pathname = usePathname() || "/admin";

  return (
    <header className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold tracking-[0.18em] text-xs uppercase">
              WindChasers
            </span>
            <span className="text-white/40 text-xs">Admin</span>
          </div>
          <Link
            href="/"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            View site ↗
          </Link>
        </div>
        {/* Section tabs — horizontal scroll on mobile, never wraps/breaks */}
        <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => {
            const active = s.exact
              ? pathname === s.href
              : pathname === s.href || pathname.startsWith(s.href + "/");
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`whitespace-nowrap px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-gold text-white"
                    : "border-transparent text-white/55 hover:text-white"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
