#!/usr/bin/env node
// Fetch top Unsplash result for each query and download as WebP-quality jpg (Mode B).
// Outputs: /public/unsplash/<slug>.jpg + appends to /public/unsplash/_credits.json
import fs from "node:fs/promises";
import path from "node:path";

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) { console.error("missing UNSPLASH_ACCESS_KEY"); process.exit(1); }

const slots = [
  { slug: "nz-aviation", query: "new zealand mountains aviation", desc: "Why New Zealand for flight training" },
  { slug: "cockpit-training", query: "cockpit student pilot training", desc: "Fastest route from 12th to CPL" },
  { slug: "financial-planning", query: "financial planning calculator desk", desc: "Full cost breakdown in INR" },
  { slug: "flight-instructor", query: "flight instructor cockpit briefing", desc: "How NZ standards protect your investment" },
  { slug: "airline-pilot", query: "commercial airline pilot uniform", desc: "Career path after CPL" },
  { slug: "family-decision", query: "indian family laptop discussion", desc: "Biggest mistakes families make" },
];

const outDir = path.resolve("public/unsplash");
await fs.mkdir(outDir, { recursive: true });

const creditsPath = path.join(outDir, "_credits.json");
let credits = [];
try {
  const raw = await fs.readFile(creditsPath, "utf8");
  credits = JSON.parse(raw);
  if (!Array.isArray(credits)) credits = [];
} catch {}

const picks = [];
for (const slot of slots) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(slot.query)}&orientation=landscape&per_page=5&content_filter=high`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  if (!res.ok) { console.error(`search failed for ${slot.query}: ${res.status}`); process.exit(1); }
  const data = await res.json();
  const top = data.results?.[0];
  if (!top) { console.error(`no results for ${slot.query}`); continue; }

  const imgUrl = `https://images.unsplash.com/${top.urls.regular.split("?")[0].split("/").pop()}?auto=format&fit=crop&w=800&q=70`;
  // Construct properly using the raw base id
  const base = top.urls.raw.split("?")[0];
  const finalUrl = `${base}?auto=format&fit=crop&w=900&q=72`;

  const headRes = await fetch(finalUrl, { method: "HEAD" });
  if (headRes.status !== 200) { console.error(`HEAD failed: ${finalUrl} -> ${headRes.status}`); continue; }

  const bin = await fetch(finalUrl);
  const buf = Buffer.from(await bin.arrayBuffer());
  const filename = `${slot.slug}-${top.id.slice(0, 8)}.jpg`;
  await fs.writeFile(path.join(outDir, filename), buf);

  // Skip duplicate credits
  if (!credits.find(c => c.id === top.id)) {
    credits.push({
      id: top.id,
      used_at: "/nz-seminar",
      slot: slot.slug,
      photographer: top.user.name,
      photographer_url: top.user.links.html,
      photo_url: top.links.html,
    });
  }
  picks.push({ slot: slot.slug, desc: slot.desc, filename, kb: Math.round(buf.byteLength / 1024), photographer: top.user.name });
  console.log(`✓ ${slot.slug} → ${filename} (${Math.round(buf.byteLength / 1024)} KB) by ${top.user.name}`);
}

await fs.writeFile(creditsPath, JSON.stringify(credits, null, 2) + "\n");
console.log("\nCredits updated:", creditsPath);
console.log(JSON.stringify(picks, null, 2));
