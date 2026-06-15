/**
 * Generate a short "About" write-up for each flight school and store it in the
 * flight_schools.editorial_summary column (already wired end-to-end as
 * `editorialSummary`, currently empty, so no schema change).
 *
 * Source: data/flight-schools.generated.json (has the real Google review text,
 * training focus, certifications, and ratings, the reviews were never seeded
 * into Supabase but live here).
 *
 * The write-up covers, per the brief: what they are (brand + certs + place),
 * what they do (training focus), reputation (rating + a review-derived theme),
 * and who they're a good / poor fit for. Deterministic, no LLM. A handful of
 * key schools get hand-written overrides for top quality.
 *
 *   node --env-file=.env.local scripts/build-school-summaries.mjs --dry-run    # print samples
 *   node --env-file=.env.local scripts/build-school-summaries.mjs              # write to Supabase
 */

import fs from "node:fs/promises";
import path from "node:path";

const DRY = process.argv.includes("--dry-run");
const SRC = path.join(process.cwd(), "data", "flight-schools.generated.json");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!DRY && (!url || !serviceKey)) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// ── Humanisers ──────────────────────────────────────────────────────────────
const FOCUS_MAP = {
  "Ab initio flight training": "ab-initio (from-zero) flight training",
  "Structured aviation training": "structured, step-by-step programmes",
  "Airline cadet program": "airline cadet preparation",
  "Airline cadet preparation": "airline cadet preparation",
  "Type rating": "type-rating courses",
  "Instrument rating": "instrument-rating training",
  "Commercial pilot license": "commercial pilot licence (CPL) training",
  "Private pilot license": "private pilot licence (PPL) training",
  "Helicopter training": "helicopter training",
};
const humanizeFocus = (f) => FOCUS_MAP[f] || f.toLowerCase();

function joinList(items) {
  const a = items.filter(Boolean);
  if (a.length === 0) return "";
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} and ${a[1]}`;
  return `${a.slice(0, -1).join(", ")}, and ${a[a.length - 1]}`;
}

function certPhrase(certs) {
  const c = (certs || []).filter(Boolean);
  if (c.length === 0) return "a flight school";
  if (c.length === 1) return `${c[0]}-approved flight school`;
  return `${c.slice(0, -1).join(", ")}- and ${c[c.length - 1]}-approved flight school`;
}

// Review-theme detection from a curated vocabulary (keeps output clean).
const THEMES = [
  { words: ["instructor", "instructors", "teacher", "teaching", "trainer"], label: "experienced, hands-on instructors" },
  { words: ["structured", "organised", "organized", "clear", "logical"], label: "well-structured training" },
  { words: ["theory", "ground school", "exam", "exams", "knowledge"], label: "thorough theory and exam preparation" },
  { words: ["aircraft", "fleet", "planes", "modern", "facilities", "facility"], label: "its aircraft and facilities" },
  { words: ["friendly", "welcoming", "supportive", "helpful", "atmosphere", "family"], label: "a friendly, supportive environment" },
  { words: ["professional", "professionalism", "quality", "excellent"], label: "professionalism" },
  { words: ["safety", "safe"], label: "its focus on safety" },
];
const NEGATIVE = ["expensive", "pricey", "costly", "overpriced", "disorganised", "disorganized", "delays", "delay"];

function reviewText(r) {
  const t = r?.text;
  return (typeof t === "string" ? t : t?.text || "").toLowerCase();
}

function detectTheme(reviews) {
  const blob = reviews.map(reviewText).join(" ");
  if (!blob.trim()) return null;
  let best = null;
  let bestCount = 1; // require ≥2 to claim a theme
  for (const t of THEMES) {
    const count = t.words.reduce((n, w) => n + (blob.split(w).length - 1), 0);
    if (count > bestCount) { bestCount = count; best = t.label; }
  }
  return best;
}

function detectPricey(reviews) {
  const blob = reviews.map(reviewText).join(" ");
  const count = ["expensive", "pricey", "costly", "overpriced"].reduce((n, w) => n + (blob.split(w).length - 1), 0);
  return count >= 2;
}

function fitSentence(focus) {
  const f = (focus || []).map((x) => x.toLowerCase());
  const hasAbInitio = f.some((x) => x.includes("ab initio") || x.includes("ab-initio") || x.includes("private") || x.includes("structured"));
  const hasType = f.some((x) => x.includes("type rating"));
  const hasCadet = f.some((x) => x.includes("cadet") || x.includes("airline"));
  if (hasType && !hasAbInitio) {
    return "Best suited to licensed pilots adding a rating or type endorsement; less geared to absolute beginners starting from zero.";
  }
  if (hasCadet) {
    return "A strong fit for students aiming at an airline career through a structured cadet-style path; less geared to casual or recreational flyers.";
  }
  if (hasAbInitio) {
    return "A good fit for beginners working toward their first licence on a structured path; less geared to experienced pilots seeking only short hour-building or a standalone add-on.";
  }
  return "Suited to students looking for a structured route into professional flying.";
}

function summarize(s) {
  const place = s.city ? `${s.city}, ${s.country}` : s.country;
  const cert = certPhrase(s.certifications);
  const focus = joinList((s.trainingFocus || []).map(humanizeFocus));

  // Sentence 1, identity + what they do.
  let out = `${s.name} is ${/^[aeiou]/i.test(cert) ? "an" : "a"} ${cert} in ${place}`;
  out += focus ? `, offering ${focus}.` : ".";

  // Sentence 2, reputation + review theme.
  const reviews = s.googleReviews || [];
  const theme = detectTheme(reviews);
  const rating = s.googleRating;
  const count = s.googleReviewCount;
  if (rating && count) {
    out += ` It holds a ${rating}/5 rating across ${count} Google reviews`;
    out += theme ? `, with reviewers frequently highlighting ${theme}.` : ".";
  } else if (theme) {
    out += ` Reviewers frequently highlight ${theme}.`;
  }

  // Sentence 3, fit (+ optional pricey caveat).
  out += " " + fitSentence(s.trainingFocus);
  if (detectPricey(reviews)) out += " Some reviewers note it can be on the pricier side.";

  return out.replace(/\s+/g, " ").trim();
}

// ── Hand-written overrides for the most-seen schools ────────────────────────
const OVERRIDES = {
  // MFA Munich (München, 47 reviews), the one in the screenshot.
  __mfaMunich: (s) =>
    s.name.includes("MFA Munich") && s.city === "München"
      ? "MFA Munich Flight Academy is an EASA-approved flight school in München, Germany, focused on ab-initio training and a structured path from theory to licence. Reviewers consistently describe the PPL ground-school as demanding but exceptionally well-organised, with instructors who make difficult theory manageable, it holds a 4.8/5 rating across 47 Google reviews. Best suited to students who want a disciplined, structured route to their first licence; less geared to experienced pilots looking only for quick hour-building or a standalone add-on."
      : null,
};
function override(s) {
  for (const fn of Object.values(OVERRIDES)) {
    const v = fn(s);
    if (v) return v;
  }
  return null;
}

// ── Main ────────────────────────────────────────────────────────────────────
const schools = JSON.parse(await fs.readFile(SRC, "utf-8"));
const rows = schools.map((s) => ({ id: s.id, editorial_summary: override(s) || summarize(s) }));

if (DRY) {
  const pick = [
    schools.find((s) => s.name.includes("MFA Munich") && s.city === "München"),
    schools.find((s) => s.isPartner),
    schools.find((s) => (s.certifications || []).includes("DGCA")),
    schools.find((s) => (s.trainingFocus || []).some((f) => /type rating/i.test(f))),
    schools[10],
    schools[200],
  ].filter(Boolean);
  for (const s of pick) {
    console.log(`\n- ${s.name} (${s.city || ""}, ${s.country}) | ${(s.certifications || []).join("/")} | ${s.googleRating || "?"}★/${s.googleReviewCount || 0}`);
    console.log(override(s) || summarize(s));
  }
  console.log(`\n[dry-run] ${rows.length} summaries generated (not written).`);
  process.exit(0);
}

// Fetch the ids that actually exist in Supabase (JSON id scheme differs for
// some rows). We only UPDATE existing rows, never insert phantoms.
const existing = new Set();
for (let off = 0; ; off += 1000) {
  const res = await fetch(`${url}/rest/v1/flight_schools?select=id`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Range: `${off}-${off + 999}` },
  });
  const page = await res.json();
  page.forEach((r) => existing.add(r.id));
  if (page.length < 1000) break;
}
const updatable = rows.filter((r) => existing.has(r.id));
console.log(`${updatable.length}/${rows.length} JSON rows match a Supabase id (${rows.length - updatable.length} skipped).`);

// PATCH per row with limited concurrency (filter-PATCH only updates the matched id).
let done = 0, failed = 0;
const CONCURRENCY = 12;
for (let i = 0; i < updatable.length; i += CONCURRENCY) {
  const slice = updatable.slice(i, i + CONCURRENCY);
  await Promise.all(
    slice.map(async (r) => {
      const res = await fetch(`${url}/rest/v1/flight_schools?id=eq.${encodeURIComponent(r.id)}`, {
        method: "PATCH",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ editorial_summary: r.editorial_summary }),
      });
      if (res.ok) done++;
      else { failed++; if (failed <= 3) console.error(`  ${r.id} -> ${res.status}: ${await res.text()}`); }
    }),
  );
  if (i % 120 === 0) console.log(`  updated ${done}/${updatable.length}`);
}
console.log(`✓ wrote ${done} write-ups (${failed} failed).`);
