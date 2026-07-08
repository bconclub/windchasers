/**
 * Enrich the 18 brand-curated FEATURED_SCHOOLS with a real photo pulled from
 * Google Places (New) Text Search + Photo API, so the featured cards can lead
 * with an image instead of a wall of text.
 *
 * Matches each school by "<name> <place> <country>", takes the first result's
 * cover photo, uploads it to the same `school-photos` Supabase bucket the
 * directory already uses (path: featured/<id>.<ext>), and rewrites
 * app/flight-schools/lib/featured-schools.ts with an `image` field added.
 *
 *   node --env-file=.env.local scripts/enrich-featured-schools.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !serviceKey) { console.error("Missing Supabase env."); process.exit(1); }
if (!googleKey) { console.error("Missing GOOGLE_PLACES_API_KEY."); process.exit(1); }

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const BUCKET = "school-photos";
const MAX_WIDTH = 900;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// Pull the current FEATURED_SCHOOLS array out of the TS file without a full
// TS parser — it's a plain array of object literals with template-string values.
function loadFeatured() {
  const src = readFileSync("app/flight-schools/lib/featured-schools.ts", "utf8");
  const start = src.indexOf("export const FEATURED_SCHOOLS");
  const arrStart = src.indexOf("[", start);
  const arrText = src.slice(arrStart);
  // eslint-disable-next-line no-eval
  const arr = eval(arrText.replace(/;\s*$/, ""));
  return { src, arr };
}

async function searchPlace(query) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": googleKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.photos,places.rating,places.googleMapsUri",
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.places?.[0] || null;
}

async function fetchPhotoBytes(photoName) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${MAX_WIDTH}&skipHttpRedirect=true&key=${googleKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`photo media ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const meta = await res.json();
  if (!meta.photoUri) throw new Error("No photoUri");
  const imgRes = await fetch(meta.photoUri);
  if (!imgRes.ok) throw new Error(`image fetch ${imgRes.status}`);
  return { bytes: Buffer.from(await imgRes.arrayBuffer()), contentType: imgRes.headers.get("content-type") || "image/jpeg" };
}

async function upload(id, bytes, contentType) {
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `featured/${id}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType, upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(`upload: ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function main() {
  const { src, arr } = loadFeatured();
  console.log(`Loaded ${arr.length} featured schools.`);

  const results = [];
  for (const s of arr) {
    const query = [s.name, s.place, s.country].filter(Boolean).join(" ");
    let image = null, rating = null, mapsUrl = null;
    try {
      const place = await searchPlace(query);
      if (place) {
        rating = place.rating ?? null;
        mapsUrl = place.googleMapsUri ?? null;
        const photoName = place.photos?.[0]?.name;
        if (photoName) {
          const { bytes, contentType } = await fetchPhotoBytes(photoName);
          image = await upload(s.id, bytes, contentType);
        }
      }
      console.log(`  ${image ? "✓" : "·"} ${s.name}  ${image ? "" : "(no photo found)"}`);
    } catch (err) {
      console.error(`  ✗ ${s.name}: ${err.message}`);
    }
    results.push({ ...s, image, rating, mapsUrl });
    await sleep(150);
  }

  // Rewrite the TS file with the new fields.
  function esc(s) { return String(s ?? "").replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${"); }
  const lines = [];
  lines.push("export interface FeaturedSchool {");
  lines.push("  id: string;");
  lines.push("  country: string;");
  lines.push("  place: string;");
  lines.push("  name: string;");
  lines.push("  about: string;");
  lines.push("  website: string;");
  lines.push("  image: string | null;");
  lines.push("  rating: number | null;");
  lines.push("  mapsUrl: string | null;");
  lines.push("}");
  lines.push("");
  lines.push("// Curated by the brand -- the schools WindChasers actively features and");
  lines.push("// vouches for, separate from the wider auto-imported directory below.");
  lines.push("// image/rating/mapsUrl enriched from Google Places (scripts/enrich-featured-schools.mjs).");
  lines.push("export const FEATURED_SCHOOLS: FeaturedSchool[] = [");
  for (const r of results) {
    lines.push("  {");
    lines.push(`    id: "${r.id}",`);
    lines.push(`    country: "${esc(r.country)}",`);
    lines.push(`    place: \`${esc(r.place)}\`,`);
    lines.push(`    name: \`${esc(r.name)}\`,`);
    lines.push(`    about: \`${esc(r.about)}\`,`);
    lines.push(`    website: "${esc(r.website)}",`);
    lines.push(`    image: ${r.image ? `"${esc(r.image)}"` : "null"},`);
    lines.push(`    rating: ${r.rating != null ? r.rating : "null"},`);
    lines.push(`    mapsUrl: ${r.mapsUrl ? `"${esc(r.mapsUrl)}"` : "null"},`);
    lines.push("  },");
  }
  lines.push("];");
  writeFileSync("app/flight-schools/lib/featured-schools.ts", lines.join("\n") + "\n");

  const withImage = results.filter((r) => r.image).length;
  console.log(`\nDone. ${withImage}/${results.length} schools got a photo.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
