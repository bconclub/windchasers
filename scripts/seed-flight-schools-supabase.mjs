/**
 * One-shot seed: upsert data/flight-schools.generated.json into Supabase.
 *
 *   Schools  -> public.flight_schools
 *   Photos   -> public.flight_school_photos       (from images[] + googlePhotoNames[])
 *   Reviews  -> public.flight_school_reviews      (from googleReviews[])
 *
 * Safe to re-run: uses upsert by id / unique keys.
 *
 *   node --env-file=.env.local scripts/seed-flight-schools-supabase.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "data", "flight-schools.generated.json");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  console.error("Run: node --env-file=.env.local scripts/seed-flight-schools-supabase.mjs");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function makeUniqueSlug(base, used) {
  let slug = base || "school";
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n++}`;
  }
  used.add(slug);
  return slug;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function mapSchool(s, slug) {
  return {
    id: s.id,
    slug,
    name: s.name,
    country_code: s.countryCode,
    city: s.city || null,
    lat: s.lat,
    lng: s.lng,
    formatted_address: s.formattedAddress || null,
    short_formatted_address: s.shortFormattedAddress || null,
    utc_offset_minutes: s.utcOffsetMinutes ?? null,

    website: s.website || null,
    phone: s.phone || null,
    national_phone_number: s.nationalPhoneNumber || null,
    international_phone_number: s.internationalPhoneNumber || null,

    certifications: s.certifications ?? [],
    dgca_approved: s.countryCode === "IN" ? null : null,
    dgca_convertible: typeof s.dgcaConvertible === "boolean" ? s.dgcaConvertible : null,
    is_partner: !!s.isPartner,
    training_focus: s.trainingFocus ?? [],

    fleet_size: s.fleetSize ?? null,
    duration_months: s.durationMonths ?? null,
    approx_cost_usd: s.approxCostUSD ?? null,
    cost_min_usd: Array.isArray(s.costRangeUSD) ? s.costRangeUSD[0] : null,
    cost_max_usd: Array.isArray(s.costRangeUSD) ? s.costRangeUSD[1] : null,

    rating: s.rating ?? null,
    google_rating: s.googleRating ?? null,
    google_review_count: s.googleReviewCount ?? null,

    google_place_id: s.googlePlaceId || null,
    google_maps_url: s.googleMapsUrl || null,
    business_status: s.businessStatus || null,
    google_types: s.googleTypes ?? [],
    google_primary_type: s.googlePrimaryType || null,
    editorial_summary: s.editorialSummary || null,
    regular_opening_hours: s.regularOpeningHours ?? null,
    current_opening_hours: s.currentOpeningHours ?? null,

    source_status: s.sourceStatus || "google_found",
    verification_status: s.verificationStatus || "unreviewed",
    wc_score: typeof s.wcScore === "number" ? s.wcScore : null,
    wc_classification: s.wcClassification || null,
    wc_score_reasons: s.wcScoreReasons ?? [],
    notes: s.notes || null,

    discovery_query: s.discoveryQuery || null,
    first_discovered_at: s.firstDiscoveredAt || null,
    last_checked_at: s.lastCheckedAt || null,
  };
}

function mapPhotos(s) {
  const rows = [];
  let pos = 0;
  for (const url of s.images ?? []) {
    rows.push({
      school_id: s.id,
      url,
      source: s.sourceStatus === "partner" || s.sourceStatus === "curated" ? "admin" : "google",
      position: pos,
      is_cover: pos === 0,
    });
    pos += 1;
  }
  for (const photoName of s.googlePhotoNames ?? []) {
    rows.push({
      school_id: s.id,
      google_photo_name: photoName,
      source: "google",
      position: pos,
      is_cover: pos === 0,
    });
    pos += 1;
  }
  return rows;
}

function mapReviews(s) {
  const rows = [];
  for (const r of s.googleReviews ?? []) {
    rows.push({
      school_id: s.id,
      source: "google",
      external_id: r.name || r.id || null,
      author_name: r.authorAttribution?.displayName || r.author_name || null,
      author_avatar_url: r.authorAttribution?.photoUri || null,
      rating: typeof r.rating === "number" ? r.rating : null,
      text: r.text?.text || (typeof r.text === "string" ? r.text : null),
      language: r.text?.languageCode || r.language || null,
      published_at: r.publishTime || null,
      relative_published_text: r.relativePublishTimeDescription || null,
    });
  }
  return rows;
}

async function upsertChunked(table, rows, opts) {
  let total = 0;
  for (const batch of chunk(rows, 500)) {
    const { error, count } = await supabase
      .from(table)
      .upsert(batch, { onConflict: opts.onConflict, ignoreDuplicates: opts.ignoreDuplicates ?? false, count: "exact" });
    if (error) {
      console.error(`[${table}] upsert error:`, error.message);
      throw error;
    }
    total += count ?? batch.length;
  }
  return total;
}

async function ensureCountries(json) {
  const seen = new Map();
  for (const s of json) {
    if (!s.countryCode) continue;
    if (!seen.has(s.countryCode)) {
      seen.set(s.countryCode, s.country || s.countryCode);
    }
  }
  const rows = Array.from(seen.entries()).map(([code, name]) => ({
    code,
    name,
    display_order: 999,
  }));
  if (rows.length === 0) return 0;
  // Insert any missing; existing rows untouched (ignoreDuplicates).
  const { error } = await supabase
    .from("countries")
    .upsert(rows, { onConflict: "code", ignoreDuplicates: true });
  if (error) throw error;
  return rows.length;
}

async function main() {
  const json = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  console.log(`Loaded ${json.length} schools from ${DATA_PATH}`);

  console.log("Ensuring all referenced countries exist...");
  const ensured = await ensureCountries(json);
  console.log(`  ✓ ${ensured} country codes confirmed`);

  const usedSlugs = new Set();
  const schoolRows = json.map((s) => {
    const base = slugify(`${s.name}-${s.city || s.country || ""}`);
    const slug = makeUniqueSlug(base || slugify(s.id), usedSlugs);
    return mapSchool(s, slug);
  });

  console.log("Upserting schools...");
  const schoolsCount = await upsertChunked("flight_schools", schoolRows, { onConflict: "id" });
  console.log(`  ✓ ${schoolsCount} schools upserted`);

  // Photos: easiest to wipe and re-insert per school (sources are upstream-managed).
  // Using delete-then-insert keeps positions clean across re-seeds.
  const allPhotos = json.flatMap(mapPhotos);
  if (allPhotos.length > 0) {
    console.log("Replacing photos...");
    const ids = json.map((s) => s.id);
    for (const idBatch of chunk(ids, 500)) {
      const { error } = await supabase.from("flight_school_photos").delete().in("school_id", idBatch);
      if (error) throw error;
    }
    let inserted = 0;
    for (const batch of chunk(allPhotos, 1000)) {
      const { error, count } = await supabase
        .from("flight_school_photos")
        .insert(batch, { count: "exact" });
      if (error) throw error;
      inserted += count ?? batch.length;
    }
    console.log(`  ✓ ${inserted} photos inserted`);
  }

  // Reviews: upsert by (source, external_id) when external_id present; insert others.
  const allReviews = json.flatMap(mapReviews);
  const reviewsWithExt = allReviews.filter((r) => r.external_id);
  const reviewsWithoutExt = allReviews.filter((r) => !r.external_id);
  if (reviewsWithExt.length > 0) {
    console.log("Upserting reviews with external ids...");
    const n = await upsertChunked("flight_school_reviews", reviewsWithExt, {
      onConflict: "source,external_id",
      ignoreDuplicates: true,
    });
    console.log(`  ✓ ${n} reviews upserted`);
  }
  if (reviewsWithoutExt.length > 0) {
    console.log(`Skipping ${reviewsWithoutExt.length} reviews without external_id (would duplicate on re-seed)`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
