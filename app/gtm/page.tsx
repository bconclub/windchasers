"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Star, RotateCcw, Copy, ChevronDown } from "lucide-react";

type Owner = "you" | "me" | "both";

type Item = {
  id: string;
  label: string;
  owner: Owner;
  mvp: boolean;
};

type Category = {
  id: string;
  name: string;
  time: string;
  ownerHint: string;
  items: Item[];
};

const CATEGORIES: Category[] = [
  {
    id: "decisions",
    name: "Decisions to lock",
    time: "15 min",
    ownerHint: "You",
    items: [
      { id: "dec-1", label: "Lead magnets: rebuild PAT and Guide, or reuse existing", owner: "you", mvp: true },
      { id: "dec-2", label: "Demo type: Zoom group webinar, or 1:1 counsellor call", owner: "you", mvp: true },
      { id: "dec-3", label: "PROXe embed: iframe, popup, or script-tag", owner: "you", mvp: true },
      { id: "dec-4", label: "Sheets: new tabs on pilot sheet, or separate sheet", owner: "you", mvp: true },
      { id: "dec-5", label: "Campus visit slots: days and counsellor hosts", owner: "you", mvp: true },
    ],
  },
  {
    id: "pages",
    name: "Pages",
    time: "4 to 6 hr",
    ownerHint: "Me",
    items: [
      { id: "pg-1", label: "/students route built", owner: "me", mvp: true },
      { id: "pg-2", label: "/parents route built", owner: "me", mvp: true },
      { id: "pg-3", label: "Custom navbar with Call and WhatsApp only", owner: "me", mvp: true },
      { id: "pg-4", label: "Lead form on each page", owner: "me", mvp: true },
      { id: "pg-5", label: "PROXe widget loads on new pages (already global in layout)", owner: "me", mvp: true },
      { id: "pg-6", label: "Mobile QA on real devices", owner: "both", mvp: true },
      { id: "pg-7", label: "Deploy to VPS (you trigger or grant SSH)", owner: "both", mvp: true },
      { id: "pg-8", label: "Approve copy approach for /students (atc template / my draft / your copy)", owner: "you", mvp: true },
      { id: "pg-9", label: "Approve copy approach for /parents (atc template / my draft / your copy)", owner: "you", mvp: true },
    ],
  },
  {
    id: "capture",
    name: "Lead capture",
    time: "1 hr",
    ownerHint: "Me",
    items: [
      { id: "cap-1", label: "Sheet tabs created in Google Sheets UI", owner: "you", mvp: true },
      { id: "cap-2", label: "Google Sheets API wired to new tabs", owner: "me", mvp: true },
      { id: "cap-3", label: "WhatsApp redirect on success per role", owner: "me", mvp: true },
      { id: "cap-4", label: "UTM parser extended to new tabs", owner: "me", mvp: true },
      { id: "cap-5", label: "Counsellor team notification (you pick channel)", owner: "both", mvp: true },
    ],
  },
  {
    id: "magnets",
    name: "Lead magnets",
    time: "2 to 3 hr",
    ownerHint: "Both",
    items: [
      { id: "mag-1", label: "PAT live or linked (you supply URL or content)", owner: "both", mvp: false },
      { id: "mag-2", label: "Cost Guide 2025 PDF (you supply PDF, I host)", owner: "both", mvp: false },
      { id: "mag-3", label: "Auto-deliver on form submit", owner: "me", mvp: false },
      { id: "mag-4", label: "Download tracked as conversion", owner: "me", mvp: false },
    ],
  },
  {
    id: "demo",
    name: "Demo and visit booking",
    time: "1 to 2 hr",
    ownerHint: "Both",
    items: [
      { id: "demo-1", label: "Slot times defined", owner: "you", mvp: true },
      { id: "demo-2", label: "Booking flow built", owner: "me", mvp: true },
      { id: "demo-3", label: "Confirmation message (you write copy, I send)", owner: "both", mvp: true },
      { id: "demo-4", label: "Reminder 24 hr before (cron set up)", owner: "both", mvp: true },
    ],
  },
  {
    id: "creatives",
    name: "Ad creatives",
    time: "3 to 4 hr",
    ownerHint: "You",
    items: [
      { id: "cr-1", label: "Best performers from past data identified", owner: "you", mvp: true },
      { id: "cr-2", label: "5 to 8 student creatives ready", owner: "you", mvp: true },
      { id: "cr-3", label: "5 to 8 parent creatives ready", owner: "you", mvp: true },
      { id: "cr-4", label: "Lead magnet ads built", owner: "you", mvp: true },
    ],
  },
  {
    id: "campaigns",
    name: "Ad campaigns",
    time: "2 hr",
    ownerHint: "You",
    items: [
      { id: "cm-1", label: "Meta student campaign cold and retarget", owner: "you", mvp: true },
      { id: "cm-2", label: "Meta parent campaign cold and retarget", owner: "you", mvp: true },
      { id: "cm-3", label: "Google Search CPL keywords live", owner: "you", mvp: true },
      { id: "cm-4", label: "Daily budget set for 40 leads per day", owner: "you", mvp: true },
      { id: "cm-5", label: "UTM convention locked", owner: "both", mvp: true },
    ],
  },
  {
    id: "tracking",
    name: "Tracking",
    time: "1 hr",
    ownerHint: "Me",
    items: [
      { id: "tr-1", label: "GA4 lead events firing on new pages (G-3WDV2V65F5 already wired)", owner: "me", mvp: true },
      { id: "tr-2", label: "Meta Pixel Lead event firing on new pages (Pixel already wired)", owner: "me", mvp: true },
      { id: "tr-3", label: "Google Ads conversion tag live (you supply AW- Conv. ID)", owner: "both", mvp: true },
      { id: "tr-4", label: "Test fire all events and verify in dashboards", owner: "both", mvp: true },
    ],
  },
  {
    id: "ops",
    name: "Operations",
    time: "30 min",
    ownerHint: "You",
    items: [
      { id: "op-1", label: "Counsellor team briefed on 15-min SLA", owner: "you", mvp: true },
      { id: "op-2", label: "WA templates ready for student and parent", owner: "you", mvp: true },
      { id: "op-3", label: "Demo and visit confirmation flow live", owner: "both", mvp: true },
      { id: "op-4", label: "Daily lead review owner assigned", owner: "you", mvp: true },
    ],
  },
  {
    id: "launch",
    name: "Soft launch",
    time: "30 min",
    ownerHint: "Both",
    items: [
      { id: "lc-1", label: "Mobile and desktop QA passed (you on real devices)", owner: "both", mvp: true },
      { id: "lc-2", label: "Test lead submission from each form", owner: "me", mvp: true },
      { id: "lc-3", label: "UTM writes verified in Sheet", owner: "me", mvp: true },
      { id: "lc-4", label: "10 percent of ad budget pushed for first 4 hr", owner: "you", mvp: true },
      { id: "lc-5", label: "Watch for breaks for 1 hr", owner: "both", mvp: true },
    ],
  },
];

const CRITICAL_PATH = ["decisions", "pages", "capture", "ops", "launch"];
const STORAGE_KEY = "wc-gtm-v1";

// Items already shipped in code by Claude during this session. Seeded as ticked
// on load. Stored localStorage state overrides per item, so anything you
// explicitly untick stays unticked across reloads.
const SHIPPED_IDS: readonly string[] = [
  "pg-3", // navbar recognises /students and /parents with per-role WA copy
  "pg-5", // Proxe widget already global in app/layout.tsx
  "cap-2", // Google Sheets API wired (lib/sheets.ts helpers + /api/students + /api/parents)
  "cap-4", // UTM parser passthrough confirmed in both new API routes
];

function seedShippedDefaults(): Record<string, boolean> {
  const seed: Record<string, boolean> = {};
  for (const id of SHIPPED_IDS) seed[id] = true;
  return seed;
}

type FilterMode = "all" | "mvp" | "critical";

const GOLD = "#C5A572";
const DARK = "#1A1A1A";

function ownerBadge(owner: Owner): { label: string; cls: string } {
  if (owner === "you") return { label: "You", cls: "bg-[#C5A572] text-[#1A1A1A]" };
  if (owner === "me") return { label: "Me", cls: "bg-white text-[#1A1A1A]" };
  return { label: "Both", cls: "border border-[#C5A572] text-[#C5A572]" };
}

export default function GTMTrackerPage() {
  // Seed with shipped defaults so SSR markup matches first client paint and
  // already-done items render ticked immediately (no flash).
  const [ticked, setTicked] = useState<Record<string, boolean>>(() =>
    seedShippedDefaults()
  );
  const [filter, setFilter] = useState<FilterMode>("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Load from localStorage on mount and merge OVER shipped defaults so the
  // user's explicit choices always win (including explicit unticks).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          if (parsed.ticked && typeof parsed.ticked === "object") {
            setTicked({ ...seedShippedDefaults(), ...parsed.ticked });
          }
          if (typeof parsed.lastUpdated === "string") {
            setLastUpdated(parsed.lastUpdated);
          }
        }
      }
    } catch {
      // ignore parse errors, start fresh
    }
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration to avoid clobbering on first paint)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ticked, lastUpdated })
      );
    } catch {
      // ignore quota/private mode errors
    }
  }, [ticked, lastUpdated, hydrated]);

  const toggleItem = (id: string) => {
    setTicked((prev) => ({ ...prev, [id]: !prev[id] }));
    setLastUpdated(new Date().toLocaleString());
  };

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allItems = useMemo(() => CATEGORIES.flatMap((c) => c.items), []);
  const totalItems = allItems.length;
  const doneOverall = allItems.filter((i) => ticked[i.id]).length;

  const criticalMvpItems = useMemo(
    () =>
      CATEGORIES.filter((c) => CRITICAL_PATH.includes(c.id)).flatMap((c) =>
        c.items.filter((i) => i.mvp)
      ),
    []
  );
  const criticalMvpTotal = criticalMvpItems.length;
  const criticalMvpDone = criticalMvpItems.filter((i) => ticked[i.id]).length;

  const overallPct =
    totalItems > 0 ? Math.round((doneOverall / totalItems) * 100) : 0;
  const criticalPct =
    criticalMvpTotal > 0
      ? Math.round((criticalMvpDone / criticalMvpTotal) * 100)
      : 0;

  const handleReset = () => {
    // Reset back to shipped-defaults (not fully blank) so already-done items
    // stay ticked. Use the Export button first if you want to keep a record.
    setTicked(seedShippedDefaults());
    setLastUpdated("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setConfirmReset(false);
  };

  const handleExport = async () => {
    const data = JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        lastUpdated,
        ticked,
        progress: {
          overall: { done: doneOverall, total: totalItems, percent: overallPct },
          criticalMvp: {
            done: criticalMvpDone,
            total: criticalMvpTotal,
            percent: criticalPct,
          },
        },
      },
      null,
      2
    );
    try {
      await navigator.clipboard.writeText(data);
      setShowCopied(true);
      window.setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // Clipboard API can fail outside secure context. Fallback: log so user sees it.
      // eslint-disable-next-line no-console
      console.log(data);
    }
  };

  const filterItemsForCategory = (cat: Category): Item[] => {
    if (filter === "critical" && !CRITICAL_PATH.includes(cat.id)) return [];
    if (filter === "mvp") return cat.items.filter((i) => i.mvp);
    return cat.items;
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                GTM Tracker
              </h1>
              <span className="block h-1 w-16 bg-[#C5A572] mt-2 rounded-full" />
              <p className="text-gray-400 mt-4 text-base">
                CPL funnel launch. 24-hour critical path.
              </p>
            </div>
            <div className="text-xs text-gray-500 mt-2 sm:text-right">
              {lastUpdated ? (
                <>
                  <span className="block uppercase tracking-wide text-gray-600">
                    Last updated
                  </span>
                  <span className="block text-gray-400 mt-0.5">
                    {lastUpdated}
                  </span>
                </>
              ) : (
                <span className="text-gray-600">Not yet updated</span>
              )}
            </div>
          </div>
        </div>

        {/* Overall progress card */}
        <div className="bg-[#252525] border border-[#C5A572] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-baseline justify-between mb-2 gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Overall
                </span>
                <span className="text-sm text-gray-200 tabular-nums">
                  {doneOverall} of {totalItems}
                  <span className="text-[#C5A572] ml-2">{overallPct}%</span>
                </span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C5A572] transition-all duration-150"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-2 gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                  Critical path MVP
                </span>
                <span className="text-sm text-gray-200 tabular-nums">
                  {criticalMvpDone} of {criticalMvpTotal}
                  <span className="text-[#C5A572] ml-2">{criticalPct}%</span>
                </span>
              </div>
              <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C5A572] transition-all duration-150"
                  style={{ width: `${criticalPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(
            [
              { v: "all", label: "All" },
              { v: "mvp", label: "MVP only" },
              { v: "critical", label: "Critical path only" },
            ] as const
          ).map((opt) => {
            const isActive = filter === opt.v;
            return (
              <button
                key={opt.v}
                onClick={() => setFilter(opt.v)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-[#C5A572] text-[#1A1A1A] border border-[#C5A572]"
                    : "bg-[#1A1A1A] border border-[#C5A572] text-[#C5A572] hover:bg-[#C5A572]/10"
                }`}
                aria-pressed={isActive}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const filteredItems = filterItemsForCategory(cat);
            if (filteredItems.length === 0) return null;

            const catDone = cat.items.filter((i) => ticked[i.id]).length;
            const catTotal = cat.items.length;
            const catPct = catTotal > 0 ? (catDone / catTotal) * 100 : 0;
            const isCollapsed = !!collapsed[cat.id];

            return (
              <div
                key={cat.id}
                className="bg-[#252525] border border-white/10 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/5 transition-colors duration-150 text-left"
                  aria-expanded={!isCollapsed}
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-150 ${
                      isCollapsed ? "-rotate-90" : ""
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-x-3 gap-y-1 flex-wrap">
                      <h2 className="text-base sm:text-lg font-semibold text-white">
                        {cat.name}
                      </h2>
                      <span className="text-xs text-[#C5A572] font-medium">
                        {cat.time}
                      </span>
                      <span className="text-xs text-gray-500">
                        {cat.ownerHint}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-200 flex-shrink-0 bg-[#1A1A1A] px-2.5 py-1 rounded-full border border-white/10 tabular-nums">
                    {catDone}/{catTotal}
                  </span>
                </button>

                {/* Per-category progress bar */}
                <div className="h-1 bg-[#1A1A1A]">
                  <div
                    className="h-full bg-[#C5A572] transition-all duration-150"
                    style={{ width: `${catPct}%` }}
                  />
                </div>

                {!isCollapsed && (
                  <ul className="divide-y divide-white/5">
                    {filteredItems.map((item) => {
                      const isTicked = !!ticked[item.id];
                      const isShipped = SHIPPED_IDS.includes(item.id);
                      const badge = ownerBadge(item.owner);
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-[#C5A572]/5 transition-colors duration-150 text-left"
                            aria-pressed={isTicked}
                          >
                            <span
                              className={`w-5 h-5 border-2 rounded-sm flex-shrink-0 flex items-center justify-center transition-colors duration-150 ${
                                isTicked
                                  ? "bg-[#C5A572] border-[#C5A572]"
                                  : "bg-transparent border-[#C5A572]"
                              }`}
                            >
                              {isTicked && (
                                <Check
                                  className="w-3.5 h-3.5 text-[#1A1A1A]"
                                  strokeWidth={3}
                                />
                              )}
                            </span>
                            <span
                              className={`flex-1 text-sm leading-snug transition-all duration-150 ${
                                isTicked
                                  ? "line-through opacity-60 text-gray-300"
                                  : "text-white"
                              }`}
                            >
                              {item.label}
                            </span>
                            {isShipped && (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 uppercase tracking-wide bg-[#C5A572]/15 text-[#C5A572] border border-[#C5A572]/40"
                                title="Shipped in code by Claude this session"
                              >
                                Shipped
                              </span>
                            )}
                            <span
                              className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 uppercase tracking-wide ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                            {item.mvp && (
                              <Star
                                className="w-4 h-4 text-[#C5A572] flex-shrink-0 fill-[#C5A572]"
                                aria-label="MVP"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-wrap items-center gap-3">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#C5A572] text-[#C5A572] rounded-lg text-sm font-medium hover:bg-[#C5A572]/10 transition-colors duration-150"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 bg-[#252525] border border-[#C5A572] rounded-lg px-3 py-2 flex-wrap">
              <span className="text-sm text-gray-200">Clear all progress?</span>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-[#C5A572] text-[#1A1A1A] rounded text-xs font-semibold hover:bg-[#C5A572]/90 transition-colors duration-150"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 text-gray-400 text-xs hover:text-white transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#C5A572] text-[#C5A572] rounded-lg text-sm font-medium hover:bg-[#C5A572]/10 transition-colors duration-150"
          >
            <Copy className="w-4 h-4" />
            Export
          </button>

          {showCopied && (
            <span className="text-sm text-[#C5A572] font-medium" role="status">
              Copied
            </span>
          )}

          <span className="ml-auto text-xs text-gray-600">
            Internal use only
          </span>
        </div>
      </div>
    </div>
  );
}
