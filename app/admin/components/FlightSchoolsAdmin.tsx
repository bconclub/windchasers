"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";
import { intentScore, intentTier, isVisible } from "@/lib/flight-schools/intent";

type Summary = {
  generatedAt: string;
  total: number;
  publicReady: number;
  needsReview: number;
  byCountry: Record<string, number>;
  byClassification: Record<string, number>;
  byStatus: Record<string, number>;
};

type Props = { schools: FlightSchool[]; summary: Summary };

export default function FlightSchoolsAdmin({ schools, summary }: Props) {
  return (
    <main className="bg-surface-container-lowest text-on-surface">
      <FlightSchoolsPanel schools={schools} summary={summary} />
    </main>
  );
}

function FlightSchoolsPanel({ schools, summary }: Props) {
  const [list, setList] = useState<FlightSchool[]>(schools);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [visibility, setVisibility] = useState<"" | "visible" | "hidden">("");
  const [sort, setSort] = useState<"intent" | "reviews" | "name">("intent");
  const [selected, setSelected] = useState<FlightSchool | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const countries = useMemo(
    () => Object.keys(summary.byCountry).sort((a, b) => a.localeCompare(b)),
    [summary.byCountry],
  );

  // Precompute intent score once.
  const scored = useMemo(
    () => list.map((s) => ({ s, intent: intentScore(s), visible: isVisible(s) })),
    [list],
  );
  const visibleCount = scored.filter((x) => x.visible).length;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let r = scored.filter(({ s, visible }) => {
      if (country && s.country !== country) return false;
      if (visibility === "visible" && !visible) return false;
      if (visibility === "hidden" && visible) return false;
      if (!q) return true;
      return [s.name, s.city, s.country, s.website, s.formattedAddress, s.certifications.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    r = r.sort((a, b) => {
      if (sort === "intent") return b.intent - a.intent;
      if (sort === "reviews") return (b.s.googleReviewCount ?? 0) - (a.s.googleReviewCount ?? 0);
      return a.s.name.localeCompare(b.s.name);
    });
    return r;
  }, [scored, query, country, visibility, sort]);

  async function setVisible(school: FlightSchool, visible: boolean) {
    setBusyId(school.id);
    setError(null);
    // optimistic
    const apply = (v: boolean): FlightSchool => ({
      ...school,
      verificationStatus: v ? "verified" : "hidden",
      isPartner: v ? school.isPartner : false,
    });
    setList((prev) => prev.map((s) => (s.id === school.id ? apply(visible) : s)));
    setSelected((sel) => (sel && sel.id === school.id ? apply(visible) : sel));
    try {
      const res = await fetch("/api/admin/flight-schools/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: school.id, visible }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Failed");
    } catch (e) {
      // revert
      setList((prev) => prev.map((s) => (s.id === school.id ? apply(!visible) : s)));
      setSelected((sel) => (sel && sel.id === school.id ? apply(!visible) : sel));
      setError(`Couldn't update "${school.name}". ${(e as Error).message}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Directory curation</p>
          <h2 className="mt-1.5 text-2xl md:text-3xl font-semibold">Flight schools</h2>
          <p className="mt-1.5 text-sm text-on-surface-variant/68">
            {rows.length.toLocaleString()} of {list.length.toLocaleString()} ·{" "}
            <span className="text-emerald-300">{visibleCount.toLocaleString()} live on site</span>
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(220px,360px)_150px_140px_140px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, city, website…"
              className="h-10 w-full rounded-lg bg-surface px-9 text-sm outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/60"
            />
          </label>
          <Select icon={Filter} value={country} onChange={setCountry}>
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          <Select icon={Eye} value={visibility} onChange={(v) => setVisibility(v as typeof visibility)}>
            <option value="">All</option>
            <option value="visible">Live on site</option>
            <option value="hidden">Hidden</option>
          </Select>
          <Select icon={SlidersHorizontal} value={sort} onChange={(v) => setSort(v as typeof sort)}>
            <option value="intent">Sort: Intent ↓</option>
            <option value="reviews">Sort: Reviews ↓</option>
            <option value="name">Sort: A–Z</option>
          </Select>
        </div>
      </div>

      {error && <p className="mb-3 rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}

      <div className="max-h-[calc(100vh-180px)] overflow-auto pr-1">
        <table className="w-full min-w-[920px] border-separate border-spacing-y-1 text-sm">
          <thead className="sticky top-0 z-10 bg-surface-container-lowest text-[10px] uppercase tracking-[0.16em] text-on-surface-variant/48">
            <tr>
              <Th>Live</Th>
              <Th>School</Th>
              <Th>Location</Th>
              <Th>Intent</Th>
              <Th>Certifications</Th>
              <Th>Google</Th>
              <Th>Links</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ s, intent, visible }) => {
              const tier = intentTier(intent);
              return (
                <tr key={s.id} onClick={() => setSelected(s)} className="group cursor-pointer">
                  <Td first>
                    <Toggle
                      on={visible}
                      busy={busyId === s.id}
                      onToggle={(next) => setVisible(s, next)}
                    />
                  </Td>
                  <Td width="34%">
                    <div className="max-w-[460px] truncate font-medium">{s.name}</div>
                    <div className="mt-0.5 max-w-[460px] truncate text-xs text-on-surface-variant/48">
                      {(s.images?.length ?? 0) > 0 ? `${s.images!.length} photos` : "no photos"}
                      {s.trainingFocus?.length ? ` · ${s.trainingFocus[0]}` : ""}
                    </div>
                  </Td>
                  <Td>
                    <div className="truncate">{s.city || "—"}</div>
                    <div className="text-xs text-on-surface-variant/52">{s.country}</div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${tier.tone}`}>{tier.label}</span>
                      <span className="text-xs text-on-surface-variant/50">{intent}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex max-w-[200px] flex-wrap gap-1">
                      {s.certifications.slice(0, 3).map((c) => (
                        <span key={c} className="rounded-md bg-surface-container-high px-1.5 py-0.5 text-[11px] text-on-surface-variant">{c}</span>
                      ))}
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Star className="h-3.5 w-3.5 text-primary" />
                      <span>{s.googleRating ?? s.rating ?? "—"}</span>
                      <span className="text-on-surface-variant/42">({s.googleReviewCount ?? 0})</span>
                    </div>
                  </Td>
                  <Td last>
                    <div className="flex items-center gap-2 text-on-surface-variant/55">
                      {s.website && <ExternalLink className="h-4 w-4" />}
                      {s.googleMapsUrl && <MapPin className="h-4 w-4" />}
                      {s.phone && <Phone className="h-4 w-4" />}
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <SchoolModal
          school={selected}
          intent={intentScore(selected)}
          visible={isVisible(selected)}
          busy={busyId === selected.id}
          onToggle={(next) => setVisible(selected, next)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ── Modal — verify a school before switching it on ──────────────────────────
function SchoolModal({
  school,
  intent,
  visible,
  busy,
  onToggle,
  onClose,
}: {
  school: FlightSchool;
  intent: number;
  visible: boolean;
  busy: boolean;
  onToggle: (next: boolean) => void;
  onClose: () => void;
}) {
  const tier = intentTier(intent);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs ${tier.tone}`}>Intent {tier.label} · {intent}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${visible ? "bg-emerald-400/15 text-emerald-200" : "bg-white/8 text-on-surface-variant/60"}`}>
                {visible ? "Live on site" : "Hidden"}
              </span>
            </div>
            <h2 className="text-xl font-semibold leading-tight">{school.name}</h2>
            <p className="mt-1 text-sm text-on-surface-variant/65">
              {school.formattedAddress || `${school.city}, ${school.country}`}
            </p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Photos — eyeball that it's a real flight school */}
        {school.images && school.images.length > 0 ? (
          <div className="-mx-6 mb-5 flex gap-2 overflow-x-auto px-6 pb-1">
            {school.images.map((src, i) => (
              <img key={i} src={src} alt="" loading="lazy" className="h-32 w-48 flex-shrink-0 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
            ))}
          </div>
        ) : (
          <div className="mb-5 rounded-lg bg-surface-container px-4 py-6 text-center text-sm text-on-surface-variant/50">No photos — verify on the website / map before going live.</div>
        )}

        {/* Verify-out buttons */}
        <div className="mb-5 grid grid-cols-2 gap-2">
          <a href={school.website || "#"} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${school.website ? "bg-surface-container hover:text-primary" : "pointer-events-none opacity-40"}`}>
            <ExternalLink className="h-4 w-4" /> Website
          </a>
          <a href={school.googleMapsUrl || "#"} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${school.googleMapsUrl ? "bg-surface-container hover:text-primary" : "pointer-events-none opacity-40"}`}>
            <MapPin className="h-4 w-4" /> Google Maps
          </a>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Info label="Rating" value={`${school.googleRating ?? school.rating ?? "—"}/5`} />
          <Info label="Reviews" value={String(school.googleReviewCount ?? 0)} />
          <Info label="Score (raw)" value={String(school.wcScore ?? 0)} />
          <Info label="Phone" value={school.phone || "—"} />
        </div>

        {(school.certifications.length > 0 || (school.trainingFocus?.length ?? 0) > 0) && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">Certifications & focus</p>
            <div className="flex flex-wrap gap-1.5">
              {school.certifications.map((c) => (
                <span key={c} className="rounded-md bg-[#C5A572]/15 px-2 py-1 text-xs text-[#e4c28c]">{c}</span>
              ))}
              {(school.trainingFocus ?? []).map((f) => (
                <span key={f} className="rounded-md bg-surface-container-high px-2 py-1 text-xs text-on-surface-variant">{f}</span>
              ))}
            </div>
          </div>
        )}

        {school.editorialSummary && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">About (shown on site)</p>
            <p className="text-sm leading-relaxed text-on-surface-variant/75">{school.editorialSummary}</p>
          </div>
        )}

        {/* The decision: show on site or not */}
        <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-container p-4">
          <div>
            <p className="text-sm font-medium">Show on the public site</p>
            <p className="text-xs text-on-surface-variant/55">Visitors only see schools switched on here.</p>
          </div>
          <Toggle on={visible} busy={busy} onToggle={onToggle} large />
        </div>
      </div>
    </div>
  );
}

// ── Bits ────────────────────────────────────────────────────────────────────
function Toggle({ on, busy, onToggle, large }: { on: boolean; busy?: boolean; onToggle: (next: boolean) => void; large?: boolean }) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={(e) => { e.stopPropagation(); onToggle(!on); }}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors ${large ? "h-7 w-12" : "h-5 w-9"} ${on ? "bg-emerald-500" : "bg-white/15"} ${busy ? "opacity-50" : ""}`}
      aria-pressed={on}
      title={on ? "Live on site — click to hide" : "Hidden — click to show"}
    >
      <span className={`inline-block rounded-full bg-white transition-transform ${large ? "h-5 w-5" : "h-3.5 w-3.5"} ${on ? (large ? "translate-x-6" : "translate-x-[18px]") : "translate-x-1"}`} />
    </button>
  );
}

function Select({ icon: Icon, value, onChange, children }: { icon: typeof Filter; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="relative block">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-lg bg-surface px-9 text-sm outline-none focus:ring-1 focus:ring-primary/60">
        {children}
      </select>
    </label>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 pb-2 text-left font-medium">{children}</th>;
}

function Td({ children, width, first, last }: { children: React.ReactNode; width?: string; first?: boolean; last?: boolean }) {
  return (
    <td
      className={`bg-surface px-4 py-3 align-middle transition-colors group-hover:bg-surface-container-low ${first ? "rounded-l-xl" : ""} ${last ? "rounded-r-xl" : ""}`}
      style={width ? { width } : undefined}
    >
      {children}
    </td>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-container p-3">
      <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-on-surface-variant/52">{label}</div>
      <div className="truncate text-sm text-on-surface">{value}</div>
    </div>
  );
}
