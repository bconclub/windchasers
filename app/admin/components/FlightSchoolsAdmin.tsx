"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Filter,
  LayoutDashboard,
  MapPin,
  Phone,
  Plane,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import type { FlightSchool } from "@/types/flight-school";

type Summary = {
  generatedAt: string;
  total: number;
  publicReady: number;
  needsReview: number;
  byCountry: Record<string, number>;
  byClassification: Record<string, number>;
  byStatus: Record<string, number>;
};

type Props = {
  schools: FlightSchool[];
  summary: Summary;
};

const labels: Record<string, string> = {
  verified_school: "Verified",
  likely_school: "Likely",
  possible_school: "Possible",
  needs_review: "Review",
};

function formatStatus(value?: string) {
  if (!value) return "Unknown";
  return labels[value] ?? value.replace(/_/g, " ");
}

function statusTone(value?: string) {
  if (value === "verified_school") return "bg-[#C5A572]/16 text-[#e4c28c]";
  if (value === "likely_school") return "bg-white/8 text-white/72";
  if (value === "possible_school") return "bg-amber-400/10 text-amber-100";
  return "bg-red-400/10 text-red-100";
}

function scoreTone(score = 0) {
  if (score >= 85) return "text-[#e4c28c]";
  if (score >= 65) return "text-white/78";
  if (score >= 40) return "text-amber-100";
  return "text-red-100";
}

export default function FlightSchoolsAdmin({ schools, summary }: Props) {
  // One page = one dimension: this page IS the flight-schools manager.
  // Global navigation lives in the admin layout's left sidebar (AdminNav);
  // the old internal rail + duplicate overview panel were removed.
  return (
    <main className="bg-surface-container-lowest text-on-surface">
      <header className="flex h-14 items-center justify-between border-b border-outline-variant/20 px-1 mb-2">
        <h1 className="text-lg font-semibold tracking-normal">Flight schools</h1>
        <a
          href="/flight-schools"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-surface-container px-3 text-sm text-on-surface-variant transition-colors hover:text-primary"
        >
          View page
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </header>
      <FlightSchoolsPanel schools={schools} summary={summary} />
    </main>
  );
}

function FlightSchoolsPanel({ schools, summary }: Props) {
  const countries = useMemo(
    () => Object.keys(summary.byCountry).sort((a, b) => a.localeCompare(b)),
    [summary.byCountry]
  );
  const classifications = useMemo(
    () => Object.keys(summary.byClassification).sort(),
    [summary.byClassification]
  );

  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [classification, setClassification] = useState("");
  const [selected, setSelected] = useState<FlightSchool | null>(null);

  const filteredSchools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return schools.filter((school) => {
      if (country && school.country !== country) return false;
      if (classification && school.wcClassification !== classification) return false;
      if (!normalizedQuery) return true;
      return [
        school.name,
        school.city,
        school.country,
        school.website,
        school.phone,
        school.formattedAddress,
        school.certifications.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [classification, country, query, schools]);

  return (
    <div className="px-6 py-7">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Directory review</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal">Flight schools</h2>
          <p className="mt-2 text-sm text-on-surface-variant/68">
            {filteredSchools.length.toLocaleString()} of {schools.length.toLocaleString()} records
          </p>
        </div>

        <div className="grid gap-2 lg:grid-cols-[minmax(320px,480px)_190px_160px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-lg bg-surface px-9 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/45 focus:ring-1 focus:ring-primary/60"
            />
          </label>
          <label className="relative block">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="h-10 w-full rounded-lg bg-surface px-9 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary/60"
            >
              <option value="">Countries</option>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="relative block">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <select
              value={classification}
              onChange={(event) => setClassification(event.target.value)}
              className="h-10 w-full rounded-lg bg-surface px-9 text-sm text-on-surface outline-none focus:ring-1 focus:ring-primary/60"
            >
              <option value="">Scores</option>
              {classifications.map((item) => (
                <option key={item} value={item}>
                  {formatStatus(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="max-h-[calc(100vh-190px)] overflow-auto pr-1">
        <table className="w-full min-w-[1000px] border-separate border-spacing-y-1 text-sm">
          <thead className="sticky top-0 z-10 bg-surface-container-lowest text-[10px] uppercase tracking-[0.16em] text-on-surface-variant/48">
            <tr>
              <Th>School</Th>
              <Th>Location</Th>
              <Th>Score</Th>
              <Th>Status</Th>
              <Th>Certifications</Th>
              <Th>Google</Th>
              <Th>Contact</Th>
            </tr>
          </thead>
          <tbody>
            {filteredSchools.map((school) => (
              <tr
                key={school.id}
                onClick={() => setSelected(school)}
                className="group cursor-pointer"
              >
                <Td first width="38%">
                  <div className="max-w-[520px] truncate font-medium text-on-surface">{school.name}</div>
                  <div className="mt-0.5 max-w-[520px] truncate text-xs text-on-surface-variant/48">
                    {school.sourceStatus || school.discoveryQuery || "local record"}
                  </div>
                </Td>
                <Td>
                  <div className="truncate text-on-surface/90">{school.city || "Unknown city"}</div>
                  <div className="text-xs text-on-surface-variant/52">{school.country}</div>
                </Td>
                <Td>
                  <span className={`font-semibold ${scoreTone(school.wcScore)}`}>{school.wcScore ?? 0}</span>
                </Td>
                <Td>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${statusTone(school.wcClassification)}`}>
                    {formatStatus(school.wcClassification)}
                  </span>
                </Td>
                <Td>
                  <div className="flex max-w-[230px] flex-wrap gap-1">
                    {school.certifications.slice(0, 3).map((cert) => (
                      <span key={cert} className="rounded-md bg-surface-container-high px-1.5 py-0.5 text-[11px] text-on-surface-variant">
                        {cert}
                      </span>
                    ))}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Star className="h-3.5 w-3.5 text-primary" />
                    <span>{school.googleRating ?? school.rating ?? "NA"}</span>
                    <span className="text-on-surface-variant/42">({school.googleReviewCount ?? 0})</span>
                  </div>
                </Td>
                <Td last>
                  <div className="flex items-center gap-2 text-on-surface-variant/55">
                    {school.website && <ExternalLink className="h-4 w-4" />}
                    {school.phone && <Phone className="h-4 w-4" />}
                    {school.googleMapsUrl && <MapPin className="h-4 w-4" />}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && <SchoolDrawer school={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function SchoolDrawer({ school, onClose }: { school: FlightSchool; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close school details" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[440px] overflow-y-auto bg-surface p-6 shadow-2xl">
        <div className="mb-7 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              {school.verificationStatus === "verified" ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-amber-200" />
              )}
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant/55">
                {school.verificationStatus || "unreviewed"}
              </span>
            </div>
            <h2 className="text-xl font-semibold leading-tight tracking-normal">{school.name}</h2>
            <p className="mt-1 text-sm leading-5 text-on-surface-variant/65">
              {school.formattedAddress || `${school.city}, ${school.country}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface"
            aria-label="Close school details"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          <Info label="Score" value={`${school.wcScore ?? 0}`} />
          <Info label="Status" value={formatStatus(school.wcClassification)} />
          <Info label="Country" value={school.country} />
          <Info label="City" value={school.city || "Unknown"} />
          <Info label="Rating" value={`${school.googleRating ?? school.rating ?? "NA"} / 5`} />
          <Info label="Reviews" value={String(school.googleReviewCount ?? 0)} />
        </div>

        <Section title="Contact">
          <LinkRow label="Website" href={school.website} />
          <LinkRow label="Google Maps" href={school.googleMapsUrl} />
          <ValueRow label="Phone" value={school.phone} />
        </Section>

        <Section title="Training">
          <ChipList values={school.certifications} />
          <ChipList values={school.trainingFocus ?? []} />
        </Section>

        <Section title="Notes">
          <p className="text-sm leading-6 text-on-surface-variant/70">{school.notes || "No WindChasers notes yet."}</p>
        </Section>

        <Section title="Score reasons">
          <ChipList values={school.wcScoreReasons ?? []} />
        </Section>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface p-5">
      <div className="text-3xl font-semibold text-on-surface">{value.toLocaleString()}</div>
      <div className="mt-2 text-xs uppercase tracking-[0.16em] text-on-surface-variant/55">{label}</div>
    </div>
  );
}

function Readiness({ label, value, total, muted }: { label: string; value: number; total: number; muted?: boolean }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm text-on-surface-variant/74">{label}</span>
        <span className="text-sm font-medium">{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
        <div className={`h-full rounded-full ${muted ? "bg-on-surface-variant/40" : "bg-primary"}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 pb-2 text-left font-medium">{children}</th>;
}

function Td({
  children,
  width,
  first,
  last,
}: {
  children: React.ReactNode;
  width?: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <td
      className={`bg-surface px-4 py-3 align-middle transition-colors group-hover:bg-surface-container-low ${
        first ? "rounded-l-xl" : ""
      } ${last ? "rounded-r-xl" : ""}`}
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
      <div className="text-sm leading-5 text-on-surface">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-4">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-primary">{title}</h3>
      {children}
    </section>
  );
}

function LinkRow({ label, href }: { label: string; href?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="shrink-0 text-on-surface-variant/58">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-1 text-primary hover:text-primary-fixed">
          <span className="truncate">{href.replace(/^https?:\/\//, "")}</span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <span className="text-on-surface-variant/35">Missing</span>
      )}
    </div>
  );
}

function ValueRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span className="shrink-0 text-on-surface-variant/58">{label}</span>
      <span className="break-all text-right text-on-surface-variant/76">{value || "Missing"}</span>
    </div>
  );
}

function ChipList({ values }: { values: string[] }) {
  if (values.length === 0) return <p className="text-sm text-on-surface-variant/45">Nothing captured yet.</p>;

  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {values.map((value) => (
        <span key={value} className="rounded-md bg-surface-container-high px-2 py-1 text-xs text-on-surface-variant">
          {value}
        </span>
      ))}
    </div>
  );
}
