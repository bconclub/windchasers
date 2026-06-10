"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plane,
  CalendarDays,
  CreditCard,
  ExternalLink,
} from "lucide-react";

// Admin sections — one dimension per page; the page owns everything it needs.
// Add new sections here and they appear in the sidebar.
const SECTIONS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/flight-schools", label: "Flight Schools", icon: Plane },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
];

export default function AdminNav() {
  const pathname = usePathname() || "/admin";

  const isActive = (s: (typeof SECTIONS)[number]) =>
    s.exact ? pathname === s.href : pathname === s.href || pathname.startsWith(s.href + "/");

  return (
    <>
      {/* ── Desktop: fixed left sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-56 flex-col bg-[#0d0d0d] border-r border-white/10 z-30">
        <div className="px-5 h-16 flex items-center border-b border-white/10">
          <div>
            <span className="text-gold font-bold tracking-[0.18em] text-xs uppercase block">
              WindChasers
            </span>
            <span className="text-white/40 text-[11px]">Admin</span>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {SECTIONS.map((s) => {
            const active = isActive(s);
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/15 text-gold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {s.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </Link>
        </div>
      </aside>

      {/* ── Mobile: top bar with horizontal sections ────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold tracking-[0.18em] text-xs uppercase">
              WindChasers
            </span>
            <span className="text-white/40 text-xs">Admin</span>
          </div>
          <Link href="/" className="text-xs text-white/60 hover:text-white transition-colors">
            View site ↗
          </Link>
        </div>
        <nav className="flex gap-1 px-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => {
            const active = isActive(s);
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
      </header>
    </>
  );
}
