"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/SignOutButton";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function NavShell({
  items,
  userName,
  userRole,
  children,
}: {
  items: NavItem[];
  userName: string;
  userRole: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isCurrent = (href: string): boolean =>
    pathname === href || (href !== "/admin" && href !== "/dashboard" && pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-dark-50">
      <header className="sticky top-0 z-40 border-b border-dark-100 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href={items[0]?.href ?? "/"} className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-dark">WindChasers</span>
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold">Exams</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isCurrent(item.href)
                    ? "bg-gold-50 font-medium text-gold-700"
                    : "text-dark-500 hover:bg-dark-50 hover:text-dark"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-dark">{userName}</p>
              <p className="text-xs capitalize leading-tight text-dark-400">{userRole}</p>
            </div>
            <SignOutButton />
          </div>
        </div>

        {open ? (
          <nav className="border-t border-dark-100 bg-white px-4 py-2 lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                  isCurrent(item.href)
                    ? "bg-gold-50 font-medium text-gold-700"
                    : "text-dark-500 hover:bg-dark-50"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
