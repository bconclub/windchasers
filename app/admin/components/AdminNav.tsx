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
      {/* ── Desktop: collapsed icon rail that expands on hover ──────────
          Sits at a fixed 64px (w-16); content is offset md:pl-16 so it gets
          full width. Hovering expands the rail to 224px on top of the content. */}
      <aside className="group hidden md:flex fixed inset-y-0 left-0 z-40 w-16 hover:w-56 flex-col overflow-hidden border-r border-white/10 bg-[#0d0d0d] transition-[width] duration-200 ease-out">
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold text-sm font-bold text-dark">
            W
          </div>
          <div className="min-w-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <p className="truncate text-xs font-bold uppercase tracking-[0.18em] text-gold">WindChasers</p>
            <p className="truncate text-[11px] text-white/40">Admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-3">
          {SECTIONS.map((s) => {
            const active = isActive(s);
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                title={s.label}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                  active ? "bg-gold/15 text-gold" : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {s.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-3">
          <Link
            href="/"
            target="_blank"
            title="View site"
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="truncate opacity-0 transition-opacity duration-150 group-hover:opacity-100">View site</span>
          </Link>
        </div>
      </aside>

      {/* ── Mobile: top bar with horizontal sections ────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur border-b border-white/10">
        <div className="px-4 flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold tracking-[0.18em] text-xs uppercase">WindChasers</span>
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
                  active ? "border-gold text-white" : "border-transparent text-white/55 hover:text-white"
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
