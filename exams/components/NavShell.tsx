"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/SignOutButton";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const STORAGE_KEY = "wc-exams-sidebar-collapsed";

/**
 * Left sidebar shell. The dark rail carries the brand so the working canvas
 * stays quiet, and a vertical list scales past the five item ceiling a
 * horizontal bar runs into once reports are added.
 *
 * Three states: expanded, collapsed to icons, and an off canvas drawer under
 * lg. The collapse choice is remembered per browser.
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  // Read the stored preference after mount so the server and client markup
  // match on the first paint.
  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  }, [collapsed, ready]);

  // Close the drawer on navigation, otherwise it hangs over the new page.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const isCurrent = (href: string): boolean =>
    pathname === href || (href !== "/admin" && href !== "/dashboard" && pathname.startsWith(href));

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const home = items[0]?.href ?? "/";

  const rail = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/10",
          collapsed ? "justify-center px-2" : "px-5"
        )}
      >
        <Link href={home} className="flex items-center" aria-label="WindChasers Exams home">
          {collapsed ? (
            <Image
              src="/brand/windchasers-mark.png"
              alt="WindChasers"
              width={34}
              height={32}
              className="h-8 w-auto"
              priority
            />
          ) : (
            <Image
              src="/brand/windchasers-logo.png"
              alt="WindChasers Aviation Academy"
              width={500}
              height={134}
              className="h-8 w-auto"
              priority
            />
          )}
        </Link>
      </div>

      {/* Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {!collapsed ? (
          <p className="mb-2 px-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-dark-400">
            Exams
          </p>
        ) : null}
        <ul className="space-y-1">
          {items.map((item) => {
            const current = isCurrent(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "relative flex h-11 items-center rounded-lg text-[0.8125rem] transition-colors duration-feedback ease-out",
                    collapsed ? "justify-center px-0" : "gap-3 px-3",
                    current
                      ? "bg-white/10 font-medium text-white"
                      : "text-dark-200 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {current ? (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-gold" />
                  ) : null}
                  <span className={cn("shrink-0", current ? "text-gold" : "")}>{item.icon}</span>
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Person */}
      <div className={cn("shrink-0 border-t border-white/10 p-3", collapsed && "px-2")}>
        <div
          className={cn(
            "mb-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5",
            collapsed && "justify-center px-0"
          )}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 text-[0.6875rem] font-semibold text-gold">
            {initials || "WC"}
          </span>
          {!collapsed ? (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[0.8125rem] font-medium text-white">
                {userName}
              </span>
              <span className="block text-[0.6875rem] capitalize text-dark-300">{userRole}</span>
            </span>
          ) : null}
        </div>
        <SignOutButton collapsed={collapsed} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop rail */}
      <aside
        className={cn(
          "shell-dark fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 transition-[width] duration-state ease-out lg:block",
          collapsed ? "w-[4.5rem]" : "w-64"
        )}
      >
        {rail}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 grid h-6 w-6 place-items-center rounded-full border border-line bg-surface text-dark-400 shadow-card transition-colors duration-feedback ease-out hover:text-dark"
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-dark/60 lg:hidden"
          />
          <aside className="shell-dark fixed inset-y-0 left-0 z-50 w-64 lg:hidden">{rail}</aside>
        </>
      ) : null}

      <div className={cn("transition-[padding] duration-state ease-out", collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64")}>
        {/* Mobile top bar, only reason it exists is to reach the drawer */}
        <header className="shell-dark sticky top-0 z-30 flex h-16 items-center gap-3 px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            className="-ml-2 grid h-11 w-11 place-items-center rounded-lg text-dark-200 transition-colors duration-feedback ease-out hover:bg-white/10 hover:text-white"
          >
            {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href={home} aria-label="WindChasers Exams home">
            <Image
              src="/brand/windchasers-logo.png"
              alt="WindChasers Aviation Academy"
              width={500}
              height={134}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
