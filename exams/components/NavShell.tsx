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

/**
 * Dark chrome over a warm working canvas. The chrome carries the brand so the
 * content plane can stay quiet and legible, which is what an Operate surface
 * needs when it is full of question text and dense tables.
 */
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

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-canvas">
      <header className="shell-dark sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6">
          <button
            type="button"
            className="-ml-2 grid h-11 w-11 place-items-center rounded-lg text-dark-200 transition-colors duration-feedback ease-out hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href={items[0]?.href ?? "/"} className="group flex items-baseline gap-2">
            <span className="text-[0.9375rem] font-semibold tracking-tight text-white">
              WindChasers
            </span>
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Exams
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
            {items.map((item) => {
              const current = isCurrent(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3 py-2 text-[0.8125rem] transition-colors duration-feedback ease-out",
                    current
                      ? "bg-white/10 font-medium text-white"
                      : "text-dark-200 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                  {current ? (
                    <span className="absolute inset-x-3 -bottom-[9px] h-px bg-gold" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/15 text-[0.6875rem] font-semibold text-gold">
                {initials || "WC"}
              </span>
              <span className="leading-tight">
                <span className="block text-[0.8125rem] font-medium text-white">{userName}</span>
                <span className="block text-[0.6875rem] capitalize text-dark-300">{userRole}</span>
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>

        {open ? (
          <nav className="border-t border-white/10 px-3 pb-3 pt-2 lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm",
                  isCurrent(item.href)
                    ? "bg-white/10 font-medium text-white"
                    : "text-dark-200 hover:bg-white/5"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
