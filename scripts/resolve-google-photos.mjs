/**
 * Resolve Google Places photo references into Supabase Storage.
 *
 * For each row in flight_school_photos where url IS NULL and google_photo_name
 * IS NOT NULL:
 *   1. fetch image bytes from Google Places Photo API (server-side key)
 *   2. upload to the `school-photos` bucket at {school_id}/{photo_id}.jpg
 *   3. write the public URL back to flight_school_photos.url
 *
 * Safe to re-run: skips rows that already have a url.
 *
 *   node --env-file=.env.local scripts/resolve-google-photos.mjs --limit 5
 *   node --env-file=.env.local scripts/resolve-google-photos.mjs --verified-only
 *   node --env-file=.env.local scripts/resolve-google-photos.mjs --school-id google-Ch...
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}
if (!googleKey) {
  console.error("Missing GOOGLE_PLACES_API_KEY in env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET = "school-photos";
const MAX_WIDTH = 800; // Reasonable for hero/drawer use; well under Google's 4800 max
const PHOTOS_PER_SCHOOL = 5;
const REQUEST_DELAY_MS = 100; // Be polite to Google's API

function readArgs() {
  const args = process.argv.slice(2);
  const opts = { limit: null, verifiedOnly: false, schoolId: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
    else if (args[i] === "--verified-only") opts.verifiedOnly = true;
    else if (args[i] === "--school-id" && args[i + 1]) opts.schoolId = args[++i];
    else if (args[i] === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchGooglePhotoBytes(photoName) {
  // Google Places (New) Photo API:
  //   GET https://places.googleapis.com/v1/{photoName}/media?maxWidthPx=...&key=...&skipHttpRedirect=true
  // skipHttpRedirect returns JSON with photoUri instead of 302; saves us a hop.
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${MAX_WIDTH}&skipHttpRedirect=true&key=${googleKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google photo lookup ${res.status}: ${body.slice(0, 200)}`);
  }
  const meta = await res.json();
  const photoUri = meta.photoUri;
  if (!photoUri) throw new Error(`No photoUri in response: ${JSON.stringify(meta).slice(0, 200)}`);

  // Now fetch the actual bytes (Google CDN, no API key needed).
  const imgRes = await fetch(photoUri);
  if (!imgRes.ok) throw new Error(`Image fetch ${imgRes.status} from photoUri`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const contentType = imgRes.headers.get("content-type") || "image/jpeg";
  return { bytes: buf, contentType };
}

async function uploadToStorage(schoolId, photoId, bytes, contentType) {
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `${schoolId}/${photoId}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType,
    upsert: true,
    cacheControl: "31536000", // 1 year — bytes never change for a photo_name
  });
  if (error) throw new Error(`Storage upload: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function fetchPendingPhotos(opts) {
  let query = supabase
    .from("flight_school_photos")
    .select("id,school_id,google_photo_name,position,is_cover")
    .is("url", null)
    .not("google_photo_name", "is", null)
    .order("position", { ascending: true });

  if (opts.schoolId) {
    query = query.eq("school_id", opts.schoolId);
  } else if (opts.verifiedOnly) {
    // Restrict to schools the public can actually see
    const { data: visibleIds, error } = await supabase
      .from("flight_schools")
      .select("id")
      .or("verification_status.eq.verified,is_partner.eq.true");
    if (error) throw error;
    const ids = (visibleIds || []).map((s) => s.id);
    if (ids.length === 0) return [];
    query = query.in("school_id", ids);
  }

  if (opts.limit) query = query.limit(opts.limit);
  else query = query.limit(10000);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function main() {
  const opts = readArgs();
  console.log("Options:", opts);

  const photos = await fetchPendingPhotos(opts);
  if (photos.length === 0) {
    console.log("No pending photos to resolve.");
    return;
  }

  // Cap to PHOTOS_PER_SCHOOL per school so we don't burn quota uploading 8th-9th images
  const perSchoolCount = new Map();
  const work = [];
  for (const p of photos) {
    const n = perSchoolCount.get(p.school_id) || 0;
    if (n >= PHOTOS_PER_SCHOOL) continue;
    perSchoolCount.set(p.school_id, n + 1);
    work.push(p);
  }

  console.log(`Processing ${work.length} photos across ${perSchoolCount.size} schools`);
  console.log(`(input pool was ${photos.length} pending; capped at ${PHOTOS_PER_SCHOOL}/school)\n`);

  if (opts.dryRun) {
    console.log("Dry run — would resolve:");
    work.slice(0, 10).forEach((p) => console.log(`  ${p.school_id} pos=${p.position} name=${p.google_photo_name.slice(0, 60)}...`));
    return;
  }

  let ok = 0;
  let failed = 0;
  for (let i = 0; i < work.length; i++) {
    const p = work[i];
    try {
      const { bytes, contentType } = await fetchGooglePhotoBytes(p.google_photo_name);
      const publicUrl = await uploadToStorage(p.school_id, p.id, bytes, contentType);
      const { error: updErr } = await supabase
        .from("flight_school_photos")
        .update({ url: publicUrl })
        .eq("id", p.id);
      if (updErr) throw new Error(`DB update: ${updErr.message}`);
      ok++;
      if (ok % 10 === 0 || i === work.length - 1) {
        console.log(`  ✓ ${ok}/${work.length}  (latest: ${p.school_id})`);
      }
    } catch (err) {
      failed++;
      console.error(`  ✗ ${p.school_id} pos=${p.position}: ${err.message}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`\nDone. ok=${ok}  failed=${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
