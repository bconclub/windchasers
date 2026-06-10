# Changelog

Batch-by-batch record of changes that ship via `git push` to `main`. Newest at top.

## 2026-06-10 · fix(sheets): phones starting with "+" no longer corrupt to #ERROR!

- End-to-end lead test caught it: appendToSheet uses USER_ENTERED, so any cell
  starting with =, +, @ or - is parsed as a formula — "+91…" phone numbers
  landed as #ERROR! in Sheets. Now apostrophe-prefixed (invisible in Sheets) to
  force plain text. Global fix in lib/sheets.ts — protects EVERY form writing
  to ANY sheet (booking, cabin crew, ATC, summercamp, NZ seminar, flight
  schools, PAT backup).
- (`2037330`)

## 2026-06-10 · feat(flight-schools): zoom fix, slimmer filters, dedicated leads sheet, admin sidebar

- Map zoom: globe→map transition now lands at regional zoom 4–5 (was up to 9 —
  city level with no markers visible); country/single-school jumps cap at zoom 6
  (was 9–10). Verified: picking India lands with all 68 markers on screen.
- Filter panel: removed the Globe style / Map style pickers (Blue Marble,
  Day & Night, Satellite/Dark/Terrain/Light). Kept: Switch Globe↔Map, country,
  certifications, WC Partners only. Globe fixed on blue-marble, map on satellite.
- Leads: /api/flight-schools-lead now writes to the dedicated "Flight Training
  Leads" spreadsheet (1ioFXsB7…, tab "Flight Schools Lead"), not the main leads
  sheet. Headers A–K added to the sheet (bold). Env-overridable via
  GOOGLE_SHEET_ID_FLIGHT_SCHOOLS.
- Admin: left sidebar navigation (Overview / Flight Schools / Events / Payments
  + View site) on desktop, top bar on mobile; content offset md:pl-56. The
  flight-schools page is now self-contained — opens straight into the 925-row
  manager; its internal rail + duplicate overview panel removed.
- Also: supabase/migrations/0001_flight_schools_schema.sql — reconstructed
  schema backup (tables, RLS, storage bucket) so the DB is reproducible after
  the free-tier pause incident.
- User-facing: usable map landing zoom, simpler filters, flight-school leads in
  their own sheet, cleaner admin.
- (`b1e0056`)

## 2026-06-05 13:10 IST · seo(pilot-training): match page to live ad keywords (Quality Score)

- Both the DGCA and Pilot Training Google Ads groups point to /pilot-training,
  and several high-spend keywords were "Rarely shown (low Quality Score)"
  because the page didn't contain them. Wove the missing themes into the page:
  - **Meta** (`layout.tsx`): title/description now include "aviation academy",
    "pilot training programs", "DGCA exam coaching", "how to become a pilot in
    India"; added canonical.
  - **Intro copy** (`page.tsx`): "Bangalore aviation academy", "DGCA exam
    coaching", "Commercial Pilot License (CPL)", "pilot training programs"
    (PPL/CPL/ATPL/type rating).
  - **New FAQ section** (8 Q&As) + FAQPage JSON-LD schema targeting the live
    keywords (DGCA ground classes/exam coaching, CPL course cost, eligibility,
    "how to become a commercial pilot in India", pilot training programs,
    aviation academy/institute). Answers use only facts already on the page —
    no invented fees or durations.
- User-facing: richer FAQ on /pilot-training; eligible for Google FAQ snippets.
  Should lift Quality Score on the low-QS keywords → lower CPC.
- (`db84ab2`)

## 2026-06-05 12:05 IST · feat(redirect): pilot.windchasers.in → homepage (301)

- `middleware.ts`: `pilot.windchasers.in` (the DNS-cutover host, served by this
  same app) now 301-redirects ALL its traffic to `https://windchasers.in/`
  instead of serving a noindexed duplicate.
- NOTE (still needed on the VPS): the Let's Encrypt cert only covers
  `windchasers.in` + `www`, NOT `pilot`. Until the cert is expanded
  (`certbot --nginx --expand -d windchasers.in -d www.windchasers.in -d
  pilot.windchasers.in`), browsers show a cert warning *before* this redirect
  runs. pilot already resolves to the VPS, so the HTTP-01 challenge will pass.
- User-facing: old pilot.* links land on the homepage (once cert is expanded,
  with no SSL warning).
- (`1973ce0`)

## 2026-06-04 15:25 IST · fix(favicon+og): transparent jet icon + brand social title

- Favicon: the source logo is gold jets on a SOLID black bg, so the favicon
  rendered as a black square. Keyed out the black (luminance→alpha) and
  regenerated `icon-192.png`, `icon-512.png`, `favicon.ico` as the icon itself —
  transparent background, just the jets. Legible on light AND dark. `apple-icon`
  kept solid (iOS renders transparency as black anyway).
- Social title: shares were showing the SEO title. Set `openGraph.title` +
  `twitter.title` to "WindChasers – India's Top Pilot Training Academy,
  Bangalore". Google `<title>` left unchanged.
- WhatsApp: tags verified correct; WhatsApp caches previews per-URL for days and
  the OG image changed 3× today, so stale previews until its cache clears.
- (`b7a3f84`)

## 2026-06-04 15:05 IST · chore(og+favicon): new OG art + clean square favicons

- OG image: replaced og-image.webp/.jpg with the updated artwork (now 1917×942)
  and updated the declared dimensions in `app/layout.tsx`.
- Favicon: Google was showing the generic-globe placeholder. Root causes: the
  homepage `<head>` declared a non-square (272×259) secondary icon with a SPACE
  in its filename (`/Windhcasers Icon.png`), and Google hadn't re-crawled since
  the WP→Next migration. Generated clean square PNGs from the logo —
  `icon-192.png` (48-multiple, Google's recommended), `icon-512.png`,
  `apple-icon.png` (180) — and rewrote the `icons` metadata to reference only
  clean, square, space-free files. The existing 256×256 `favicon.ico` is kept as
  primary.
- Still requires a Google re-crawl to appear in SERPs (request via GSC URL
  Inspection → "Request indexing" on the homepage; favicons refresh on Google's
  own schedule, days–weeks).
- User-facing: correct logo favicon once Google recrawls; new OG art on shares.
- (`2cfc7b0`)

## 2026-06-04 14:55 IST · fix(og): serve OG image as JPG for universal previews

- Added `public/og-image.jpg` (1915×857, same artwork, flattened on white).
  Switched `openGraph.images` + `twitter.images` in `app/layout.tsx` from the
  `.webp` to the `.jpg`. WebP OG images silently fail to render on iMessage and
  LinkedIn (and inconsistently elsewhere); JPG renders on every platform.
- `og-image.webp` left in `/public` (harmless) but no longer referenced.
- User-facing: link previews now show the artwork everywhere it's shared.
- (`1fd4e96`)

## 2026-06-04 14:49 IST · feat(og): use custom social-share image

- Added `public/og-image.webp` (1915×857, the new "Windchasers OG" artwork).
  Clean, space-free filename so link scrapers (WhatsApp, Twitter, LinkedIn)
  resolve it reliably — the old `/WC HEro.webp` had a space in the URL.
- `app/layout.tsx`: pointed both `openGraph.images` and `twitter.images` at
  `/og-image.webp` (dimensions updated to 1915×857). `metadataBase` already set,
  so the URL resolves absolute for scrapers.
- User-facing: new image shown when windchasers.in is shared on social / chat.
- Build exit 0, tsc 0 errors.
- (`3fd8736`)

## 2026-06-03 · fix(home): sticky "Book a Demo Class" CTA always visible past hero

- The homepage (app/page.tsx) still had the old scroll-up-only logic for the
  sticky "Book a Demo Class" button (it only appeared when scrolling UP). Changed
  to `scrollY > 300` so it stays visible on mobile bottom once past the hero —
  matching the pilot-training page.
- Build exit 0 (86 pages), tsc 0 errors.

## 2026-06-03 · chore: hide homepage events; pilot-training sticky CTA always-on

- Hidden the Events section from the homepage for now (commented out + import
  removed; easy to re-enable). The slide-in menu already has no event pages.
- /pilot-training sticky "Book a Demo Class" mobile button now shows whenever the
  user is past the hero (scrollY > 300) instead of only on scroll-up.
- Build exit 0 (86 pages), tsc 0 errors.

## 2026-06-03 · feat: close event registration; /cabin-crew canonical

- Registration closed for now on all event pages: /webinar, /webinar/parents,
  /webinar/students, /open-house now show "Registration is not open yet" instead
  of the register CTA / lead form. Forms preserved (gated off) for easy re-enable.
- Homepage event cards: upcoming "Register Now" button → "Registration is not
  open yet" label (new `registrationOpen` flag on events, default closed).
- Cabin crew canonical URL is now /cabin-crew (was /cabin-crew-program).
  /cabin-crew-program 301-redirects to /cabin-crew. Removed the duplicate route;
  updated nav, footer, mega menu, sitemap, related links.
- Build exit 0 (86 pages), tsc 0 errors.

## 2026-06-03 · seo(titles): add server-side meta titles to /dgca + /international

- Audited every page's meta title against the old WordPress site (cached). All
  ~40 content pages already have proper, SEO-improved server-side titles EXCEPT
  /dgca and /international, which only set document.title client-side (weak for
  crawlers/social).
- Added app/dgca/layout.tsx and app/international/layout.tsx with proper
  `metadata.title` + description so the <title> is in the server HTML.
- Added docs/windchasers-meta-titles-audit.xlsx (old vs new title per page).
- Build exit 0 (87 pages), tsc 0 errors.

## 2026-06-03 · refactor(home): move Events below the "Ready to start" conversion cluster

- Homepage Events carousel moved from right-after-hero to after the "Ready to
  start your pilot training?" conversion section, before "The Captains of Your
  Career". New order: Hero → Path → Honest → Students Flying → Journey →
  Ready-to-start CTA → Events → Captains → ...
- Verified order live on dev. Build exit 0 (87 pages), tsc 0 errors.

## 2026-06-03 · feat(home): rebuild homepage from pilot-training sections + booking form required fields

- Homepage rebuilt: keeps the original home hero ("Your Career Path to the Cockpit")
  and the Events carousel, then renders ALL of the pilot-training page's rich
  sections (path selection, the honest part, students flying, the journey, the
  captains, why windchasers, testimonials, campus, aptitude test, final CTA).
  The pilot-training hero + inline lead form are NOT on the homepage.
- /pilot-training is UNCHANGED — still its own landing page (own hero + inline
  form, no events). The two pages are independent (no shared component, no redirect).
- Booking form (/demo): Email and City are now REQUIRED (were "Optional"). Added
  client-side validation + dropped the "(Optional)" labels.
- Backups saved to .backups/ before the merge.
- Verified: build exit 0 (87 pages), tsc 0 errors; home H1 = original, no form; /pilot-training intact.

## 2026-06-03 · fix(dgca): rebuild broken "Why Choose Us" carousel as a grid

- The DGCA page "Why Choose Us" drag-stack carousel rendered broken on desktop
  (single narrow card stranded in dead space, fanned back-cards spilling out as
  gold geometric shards). Replaced WhyChooseUsCarousel with a clean responsive
  card grid (1/2/3 cols), image + icon + title + copy. No drag-stack / 3D
  transform artifacts.
- Verified on desktop (1440px): 11 cards, 3 per row, no overflow.
- Build exit 0 (87 pages), tsc 0 errors.

## 2026-06-03 · refactor(events): single carousel, past events grayed inline

- Homepage Events is now ONE carousel (CardCarousel) instead of separate
  "upcoming" + "Past events" sections. Upcoming cards first, past events follow
  grayed out (grayscale + reduced opacity), still clickable → Watch Highlights.
- Verified: build exit 0 (87 pages), tsc 0 errors.

## 2026-06-03 · fix(analytics): correct Microsoft Clarity project to mmlkzcnd2z

- Swapped Clarity project ID from `uv11b4d3ex` to `mmlkzcnd2z` in `components/Analytics.tsx`.
- Verified: next build exit 0 (87 pages), tsc 0 errors.

## 2026-06-03 · fix(analytics): correct GA4 property to G-3THNVEDJK8

- Swapped GA4 measurement ID from `G-3WDV2V65F5` (wrong property) to the correct
  WindChasers property `G-3THNVEDJK8` in `components/Analytics.tsx` (loader + config).
  Updated references in `lib/analytics.ts` comment and `app/gtm/page.tsx` label.
- Verified: next build exit 0 (87 pages), tsc 0 errors.

## 2026-06-02 18:30 IST · feat: pre-launch batch — pixel swap, global web chat, OG, conversion + SEO

- **Meta Pixel swapped** to the WindChasers aviation pixel `1097272771358425` (old `1431602295033185` removed). Single init in `MetaPixelInit.tsx`, so PageView + all Lead events route to the aviation pixel.
- **Web chat global** — PROXe widget moved into `app/layout.tsx`; now loads on every page (was only /pilot-training + /agent). Removed the duplicate from pilot-training.
- **OG / social** — added `metadataBase` + site-wide OpenGraph + Twitter card with `WC HEro.webp` as the share image.
- **Lead capture** — new lean 2-field `InlineLeadForm` (name + phone) on the /pilot-training hero, posts to `/api/leads` (type `page`, form_name `pilot_training_hero`) → PROXe. On submit it swaps to a success tick in place (no redirect, keep exploring) and fires `fbq Lead` + GA `generate_lead`.
- **Pilot-training landing page**: keyword H1 "Pilot Training in Bangalore", DGCA six-papers fix, DGCA-aligned wording (not "approved"), placement promises removed, superlative claims softened, conversion cluster moved up after the 6-step process, SEO meta. Hero shows the cockpit poster (`/hero/cockpit.webp`) with the bg video playing on top.
- **Lazy Vimeo** — new `LazyVimeo` + `StudentsFlyingGallery` video cards mount on scroll-into-view (mobile speed). Simulator reels lazy too.
- **Homepage** reverted to the original (no form), now with an **Events** section (2 upcoming + 2 past) from `content/shared/events.ts`. Events removed from /pilot-training.
- **noindex middleware** — `pilot.windchasers.in` host returns `X-Robots-Tag: noindex` + disallow robots.txt so it won't compete with windchasers.in after the DNS cutover.
- Leads routing: main landing form + WhatsApp popup + assessment + demo/cabin-crew/ATC/students/parents → PROXe. Event forms (flight-schools, NZ seminar, open-house, webinar) stay Sheets-only by design.
- Verified: clean `next build` exit 0 (87 pages), tsc 0 errors.

## 2026-05-31 18:05 IST · feat(design): real hero photos + image bands on every program page

- **`scripts/build-migrated-image-manifest.mjs`** + **`content/shared/migratedImages.ts`** — auto-generated map of each migrated slug → its usable full-size photos (41 slugs, 254 photos; icons/logos/resized-variants filtered out, best hero scored first).
- **`components/ProgramPage.tsx`** — now reads the manifest by URL slug and:
  - **Visible hero** — two-column on desktop (headline + CTAs left, a large framed real photo right) instead of a faint 25%-opacity wash. Falls back to the content hero image.
  - **Image bands** — full-width cinematic photo strips (260–420px) woven between every other content section, so each page is visually broken up, not a wall of text.
  - **End gallery** — leftover photos render as a masonry "A look inside" gallery so all images get used.
- **User-facing:** every license/program/location page now leads with a real hero photo and has distinct image sections — e.g. CPL surfaces 7 photos, Canada 6, DGCA 4.
- Verified: build exit 0 (87 pages), tsc 0 errors; migrated-image refs confirmed rendering on CPL / Canada / DGCA.

## 2026-05-31 16:30 IST · feat(nav): home-only mega menu

- **New `components/MegaMenu.tsx`** — full-width dropdown panel with all migrated programs in 8 categories (Licenses, Ratings, Type Ratings, Ground & Academics, Cadet & Airline, Train Abroad, More Training, Company) — 34 links + Assessment/Demo CTA row. ESC + backdrop-click to close, body-scroll lock while open.
- **`components/Navbar.tsx`** — renders `<MegaMenu />` ONLY when `isHome`, as a "Programs" pill beside the existing call + WhatsApp buttons. No other page header changed; existing buttons untouched.
- **User-facing:** the home header now has a Programs mega menu for quick access to every course page.
- Verified: build exit 0 (87 pages), tsc 0 errors; mega menu present on `/`, absent on leaf pages.

## 2026-05-31 16:00 IST · feat(migration): windchasers.in → Next.js — 43 SEO pages at exact live slugs

The legacy WordPress site (windchasers.in) was compromised; this migrates all ranking content into the Next.js app at the SAME live URLs so rankings carry over.

- **New shared templates** — `components/ProgramPage.tsx` (data-driven program/landing template: richtext/cards/list/steps/facts/gallery blocks + FAQ + related chips + CTA band) and `components/ArticlePage.tsx` (blog article layout).
- **35 leaf pages** rebuilt at exact live slugs: licenses (CPL, PPL, ATPL, foreign-cpl, license-conversion-course), ratings (instrument, multi-engine, MEIR, CFI, night-rating-progam), type ratings (B737, A320), ground (dgca-ground-classes, diploma-in-aviation, ielts-training-program), cadet/airline programs (pre-cadet, cadet-pilot, airline-preparation, airline-cadet-interview-training), 6 location pages (india/usa/canada/australia/new-zealand/south-africa), helicopter-training, cabin-crew-program, women-in-aviation, brand (about, windchasers-meet-the-team, with-the-founder, contact-us), 3 legal pages.
- **2 hub pages** — `/type-rating`, `/airline`. **Blog** — `/blog` index + 4 migrated articles at their live slugs.
- **Content** migrated faithfully from live (eligibility, DGCA requirements, durations, country-specific copy); typos fixed ("Progam"→"Program", "Traning"→"Training"); hype avoided.
- **Images** — 1,059 media files pulled from live WP uploads into `public/migrated/<slug>/`.
- **SEO** — `app/sitemap.ts` (43 canonical URLs) + `app/robots.ts`; 10× 301 redirects in `next.config.js` (about-us→about, privacy-policy-2→privacy-policy, /some, /home2, old home draft, 4 thin posts, /category/blog → /blog); Navbar + Footer relinked to the new tree.
- **User-facing:** full pilot-training catalogue, location pages, blog, and company pages live at their original URLs.
- Verified: `npm run build` exit 0 (85 pages), `tsc --noEmit` 0 errors, all 37 migrated routes HTTP 200.

## 2026-05-21 17:15 IST · fix(attribution): drop `referral:<host>` catch-all + skip self-referrer

Demo Form lead landed in PROXe with `channel: REFERRAL:PILOT.WINDCHASERS.IN` because `deriveTrafficSource` was using a catch-all `return \`referral:${host}\`` for any unknown referrer. Internal navigation from `pilot.windchasers.in/<page>` → another page would store the site itself as the first-touch referrer and surface that string in the CRM source column.

- **`lib/tracking.ts`** — `deriveTrafficSource()` now ONLY returns recognised external networks (google, facebook, instagram, youtube, linkedin, twitter, bing, duckduckgo, reddit, tiktok). Unknown hosts and self-referrers return empty string so the resolver falls through to `"direct"`. Subdomain-aware: pilot.windchasers.in → windchasers.in are both treated as self.
- **`captureAndStoreUTMParams()`** — also skips storing self-referrers at capture time so future sessions can't pollute.
- **`lib/sheets.ts`** + **`app/api/leads/route.ts`** + **`app/api/booking/route.ts`** + **`app/api/assessment-early/route.ts`** — all 4 resolvers now reject any incoming `channel` / `traffic_source` value that starts with `referral:`, in case stale sessionStorage from before this fix still has the old format. They fall through to `"direct"` instead.

User-facing: Source column shows `direct` for organic / internal navigation, never `REFERRAL:PILOT.WINDCHASERS.IN`.

## 2026-05-21 16:30 IST · fix(attribution): channel=whatsapp override fixed; resolver reordered (click-IDs before referrer)

Two real bugs identified in production lead attribution. Both shipped.

**Bug A — hard-coded `channel: "whatsapp"` was clobbering the server-resolved channel.**
- `components/WhatsAppCaptureModal.tsx:144` was sending `data: { channel: "whatsapp", ... }`. In `/api/leads` the `event` case spreads `...restData` AFTER setting `channel`, so the modal's value won.
- WA modal now sends `submission_surface: "whatsapp_popup"` instead (platform context, not marketing channel).
- `/api/leads` event case hardened: client `data.*` fields that match resolver-owned keys (channel, traffic_source, utm_*, *_id, has_click_id, landing_url, referrer, page_url) are filtered out of `restData` so future clients can't accidentally clobber attribution either.
- `lib/sheets.ts` `extractAttributionCells()` also blocks platform tags (`whatsapp`/`web`/`voice`/`call`/`form`) from `data.channel` so the sheet column never gets a platform value either.

**Bug B — resolver was ordered wrong: referrer beat click-IDs.**
- A Meta-ad click carries BOTH a `m.facebook.com` referrer AND an `fbclid`. The old order returned `facebook` (from `traffic_source` step) instead of `facebook_ads` (from `fbclid` step), losing the paid-traffic signal.
- All 4 resolvers (api/leads, api/booking, api/assessment-early, lib/sheets) reordered to: **utm_source → click-IDs → traffic_source → "direct"**.
- Also added missing mappings: `wbraid`/`gbraid` → `google_ads`, `twclid` → `twitter_ads`.

Verified live with two synthetic leads:
- `1007ae7d-…` (IG-ad-like payload with `utm_source: "ig"` and `fbclid`) — should resolve to `channel: "ig"` once deploy lands
- `0dc726f5-…` (no UTM, no click-IDs, no referrer) — should resolve to `channel: "direct"` (NOT `whatsapp`)

## 2026-05-19 19:45 IST · feat(attribution): full attribution to every sheet form + assessment-early → PROXe; scope WA pill to program pages

Two related closes-the-loop pieces.

**1. Attribution is now uniform across every form path.**

- **`lib/sheets.ts`** — `extractAttributionCells()` widened from 7 → 15 cells. Adds gclid, fbclid, msclkid, ttclid, li_fat_id, traffic_source, channel (derived), has_click_id. Channel resolution: utm_source → traffic_source → click-id-derived (`google_ads` / `facebook_ads` / `bing_ads` / `tiktok_ads` / `linkedin_ads`) → "direct".
- **`app/api/open-house/route.ts`** range A:O → A:W. Same for nz-seminar (A:Q → A:Y), webinar (A:P → A:X), summercamp (A:P → A:X), cabin-crew (A:P → A:X), atc (A1:P1 → A1:X1).
- **`app/api/assessment-early/route.ts`** — added 8 new columns N-U (gclid, fbclid, msclkid, ttclid, li_fat_id, traffic_source, channel, has_click_id) without disturbing the existing A:M layout, so old rows still line up. Range A1:M1 → A1:U1. **Also now forwards every submission to PROXe** via `/api/agent/leads/inbound` as a `type: "page"` lead with `notes: "assessment_early"`. Sheet stays as the durable backup; PROXe is best-effort with a 4-second timeout.
- **Client forms** (nz-seminar, open-house, atc, summercamp, cabin-crew, assessment-early) now call `getStoredClickIds()` and `deriveTrafficSource()` and include them in the POST body alongside utm. Same pattern PAT, demo, and the WA capture modal use.

**2. WhatsApp pill scoped to the program funnel pages only.**

- **`components/Navbar.tsx`** — the green WhatsApp pill in the compact header now renders **only** on `/`, `/pilot-training*`, `/dgca`, `/helicopter`, `/international` (where it opens the lead-capture modal) and the two webinar group-invite pages (`/webinar/parents`, `/webinar/students` — direct group link). Every other page (NZ seminar, ATC, cabin crew, summer camp, open house, students, parents, flight schools, thank-you, demo, assessment) gets only the logo + Call button. No more silent direct `wa.me` links that bypass PROXe.

User-facing: WA button removed from non-program pages.

## 2026-05-19 19:00 IST · fix(wa-capture): attribution gap — modal wasn't sending click IDs / referrer / landing

The WhatsApp capture modal (navbar pill on /, /pilot-training*, /dgca, /helicopter, /international) was only sending `utm_*` from localStorage to PROXe. Meta auto-tags ad URLs with `fbclid`, not `utm_*`, so every WA lead from an Instagram or Facebook ad was landing in PROXe with no attribution → bucketed as DIRECT or, when paired with a sentinel name, untriageable.

- **`components/WhatsAppCaptureModal.tsx`** — payload now sends every attribution signal the form/PAT path sends:
  - `landing_url`, `referrer`, `traffic_source`
  - `click_ids` (gclid / fbclid / msclkid / ttclid / li_fat_id / twclid / wbraid / gbraid)
  - utm_* now merges localStorage + sessionStorage with a localStorage preference (so a user who came back days later still carries the original campaign attribution)
- Replaced the fire-and-forget POST with a 2-second awaited fetch + console.warn on failure. We still proceed to the WA redirect even on failure — the worst case is a missing CRM row, recoverable. But now developers can see in the browser console when PROXe rejects.
- Net effect: ad-driven traffic reaching the WA modal now arrives in PROXe with the same `channel` / `fbclid` / `has_click_id` fields that PAT and demo leads carry.

## 2026-05-19 18:30 IST · feat(attribution): capture ad-network click IDs + referrer + landing — stop bucketing ads into "DIRECT"

PROXe was showing **DIRECT** for every lead in the CRM (screenshot: Deepak Ravi from /pilot-training, Himadri from /assessment), because Meta auto-tags ad URLs with `fbclid` and Google Ads with `gclid` — **not** `utm_*`. Our capture only watched `utm_*`, so every ad-driven lead came through unattributed.

What this turn ships:

- **`lib/tracking.ts`** — new `getClickIds()` and `getStoredClickIds()` capture `gclid`, `fbclid`, `msclkid`, `ttclid`, `li_fat_id`, `twclid`, `wbraid`, `gbraid` from the URL on landing. First-touch wins, same as UTMs. New `deriveTrafficSource()` reads the stored referrer hostname and maps it to a coarse channel (`google`, `facebook`, `instagram`, `youtube`, `linkedin`, `twitter`, `bing`, `duckduckgo`, `reddit`, `tiktok`, or `referral:<host>`).
- **`components/AssessmentForm.tsx`** — PAT submit now sends `landing_url`, `referrer`, `traffic_source`, and `click_ids` alongside the existing `utm` block.
- **`components/BookingForm.tsx`** — demo booking submit now includes the same eight click-ID fields + `traffic_source`.
- **`app/api/leads/route.ts`** — `LeadRequest` interface extended with the new fields. All three case branches (`pat`, `page`, `event`) now forward them into PROXe's `custom_fields`, plus a derived `channel` field. Order of preference: `utm_source → traffic_source → click_id-derived ("google_ads"/"facebook_ads"/etc.) → "direct"`. Counsellors can sort/filter on `channel` and stop guessing.
- **`app/api/booking/route.ts`** — same destructure + forward for the demo booking path. Adds `has_click_id` boolean for at-a-glance "this was paid traffic" tagging.

Verified live with two test leads (`28d40a66-…` UTM-tagged, `7758100b-…` fbclid-tagged) — PROXe accepted both payloads with no schema errors.

Note for the PROXe team: please configure the dashboard's **Source** column to read `custom_fields.channel` first, then fall back to `custom_fields.utm_source`. That single change will replace every "DIRECT" badge with the real channel.

## 2026-05-19 17:55 IST · fix(booking): block past-time demo slots (IST + 60-min buffer)

Two production leads booked slots that were already in the past (Himadri samadder at 11 AM today, Thanzeel at 1 PM today) because `isPastDate` only compared calendar days, not the time-of-day, and all date math ran in browser-local time.

- **`lib/booking-time.ts`** (new) — shared helper used by both the client and the API:
  - `getISTNow(now?)` reads the current wall clock in `Asia/Kolkata` via `Intl.DateTimeFormat({ timeZone: "Asia/Kolkata" })` (no new dep) and returns `{ dateStr: "YYYY-MM-DD", timeMins: 0–1439 }`.
  - `isSlotInPast(dateStr, timeStr, now?)` returns true if the slot is at-or-before `now + 60 minutes` in IST. Used to filter the slot grid AND to gate the API submission.
  - `getMinBookingDateIST()` — IST today as `YYYY-MM-DD`, used for `<input type="date" min>`.
  - 60-minute buffer (`BOOKING_BUFFER_MINUTES`) gives the user time to actually reach the call / set up Google Meet.
- **`components/BookingForm.tsx`**:
  - Replaced browser-local `isPastDate` + `getMinDate` with the IST-aware versions.
  - Slot grid now filters out past slots per the selected date. When today has no slots left, shows: *"No slots available today — please pick a date from tomorrow."* and disables the Continue button.
  - `handleStep1Next` re-checks `isSlotInPast` so a stale `preferredTime` (e.g. carried over from sessionStorage, or selected before the user lingered past the cutoff) is rejected with the same copy.
- **`app/api/booking/route.ts`** — server-side guard runs the same `isSlotInPast` predicate before forwarding to PROXe. Returns 400 with *"This slot has already passed. Please pick a future time."* if a clever client tries to bypass the UI. Also logs a warning with date+time+phone so we can spot bypass attempts.

Sanity-checked the helper at 5:47 PM IST on 2026-05-19: every slot in our 11 AM–4 PM range blocks for today, all slots for tomorrow allow, all slots for yesterday block.

## 2026-05-18 15:30 IST · ux(thank-you): minimal header — logo + Call + WhatsApp, no hamburger

`/thank-you` was falling through to the navbar's hamburger-menu branch because it wasn't in the `showCompact` list. After a form submission users don't need a nav drawer — they need a clean confirmation page.

- **`components/Navbar.tsx`** — added `isThankYou = pathname?.startsWith("/thank-you")` to the `showCompact` predicate. Same logo + Call + WhatsApp icon pair as the rest of the funnel pages, identical on mobile and desktop. No menu, no slide-out.
- Did **not** add /thank-you to `useWaCapture` — the WhatsApp pill on the thank-you page links directly to `wa.me` (no point capturing phone again right after they submit).

## 2026-05-18 15:00 IST · fix(pat-backup): auto-create the "PAT Backup" tab on first write

The dual-write safety net was failing in prod because the "PAT Backup" tab didn't exist in the Event Data 2026 spreadsheet yet — `/api/pat-backup` returned `Unable to parse range: 'PAT Backup'!A:V`. Combined with PROXe still down, every PAT lead was being lost.

- **`lib/sheets.ts`** — new `appendToSheetEnsuringTab()` wrapper. Tries to append; on a missing-tab error (regex match against `Unable to parse range`, `not found`, `No such sheet`, `sheet name`), calls `spreadsheets.batchUpdate.addSheet` to create the tab, then retries the append. Also tolerates `already exists` from a concurrent creation.
- **`app/api/pat-backup/route.ts`** — switched from `appendToSheet` to `appendToSheetEnsuringTab`. First successful submission after deploy will create the "PAT Backup" tab automatically.
- No manual sheet setup required anymore. Tab will exist after the first PAT submission in prod.

## 2026-05-18 14:30 IST · feat(pat): dual-write to PROXe + Sheets so a PROXe outage never costs us a PAT lead

PROXe's `/api/agent/leads/inbound` was returning `500 taskErr is not defined` for every PAT submission today. Confirmed via curl against prod `/api/leads` — every PAT lead during the outage was being lost. Fix: dual-write to both destinations and decouple the thank-you redirect from PROXe success.

- **`lib/sheets.ts`** — new `getPatBackupSheetTab()` helper. Default tab name `PAT Backup`; override with `GOOGLE_SHEET_TAB_PAT_BACKUP`.
- **`app/api/pat-backup/route.ts`** (new) — backup endpoint for PAT submissions. Writes 22 columns to the Event Data 2026 workbook:
  ```
  A Date  B Name  C Phone  D Email  E City  F Audience
  G Total  H Tier  I Qual  J Apt  K Read
  L Eligible 12th  M PROXe Status  N PROXe Lead ID  O Answers (JSON)
  P-V utm_source / utm_medium / utm_campaign / utm_term / utm_content
       / landing_page / referrer
  ```
- **`components/AssessmentForm.tsx`** — submit phase now fires `/api/leads` (PROXe) and `/api/pat-backup` (Sheets) **in parallel via `Promise.all`**. Both outcomes are logged.
  - **At least one succeeded** → user proceeds to `/thank-you?type=assessment` and sees their score.
  - **Both failed** (network down, both backends offline) → "Please check your connection and try again."
  - PROXe = system of record when healthy; Sheets = permanent safety net.

Need on the Sheet side:
- Create the **`PAT Backup`** tab in Event Data 2026 (`145KgARkFGEi4_hjwR5dN6Vv8NJlnmzHhX8I7wvNOc-w`).
- Optionally add column headers in row 1 — see the column layout above.
- Once PROXe is fixed and the outage row is reconciled, the team should treat Sheets-only rows (`PROXe Status = pending` or empty `Lead ID`) as leads to manually push into PROXe.

## 2026-05-18 14:00 IST · fix(api/leads): sanitize PROXe runtime errors before showing to user

PAT submissions were failing with the cryptic "taskErr is not defined" message because PROXe's backend was crashing and we were faithfully relaying their JS runtime error to the end user.

- **`app/api/leads/route.ts`** — when the upstream message matches a server-error shape (`is not defined`, `TypeError`, `ReferenceError`, stack-trace fragments like `at func (`), we now log the raw message server-side and surface "We could not save your details just now. Please try again in a moment." to the user.
- Keeps the lead-loss visible (the request still fails with 502) so we know to investigate, but stops leaking PROXe's internals to candidates filling the PAT.

NOTE: this masks a real PROXe-side bug. The PROXe team needs to ship a fix for whatever's throwing `taskErr is not defined`. Until they do, leads from the affected window won't reach the CRM.

## 2026-05-18 13:45 IST · fix(wa-capture): drop duplicate "Hi WindChasers" greeting

The WhatsApp message was reading "Hi! I'm Thanzeel, Hi WindChasers, I'd like to..." because the modal already prepends "Hi! I'm {name}, " and each per-page template also started with "Hi WindChasers, ". Stripped the leading greeting from every template in `components/Navbar.tsx`. Final message now reads naturally: "Hi! I'm Thanzeel, I'd like to know more about pilot training."

## 2026-05-18 13:35 IST · feat(wa-capture): add name field back to WhatsApp modal

The sentinel `"WhatsApp Lead"` name in PROXe was hard to triage — every WA prelaunch row looked the same. Reintroduced a name input above the phone:

- **`components/WhatsAppCaptureModal.tsx`** — new name input (gold user icon, autocomplete=name, autofocus). Microcopy switched from "Phone only" to "Drop your details". Phone input no longer auto-focuses (name takes precedence).
- The captured name is now sent as the real `name` field in the PROXe payload (was `"WhatsApp Lead"` sentinel). Counsellors see the actual lead name in CRM rows.
- WhatsApp redirect message now pre-fills with `Hi! I'm {name}, {messageTemplate}` so the conversation opens with introduction context.
- Validation: name and phone both required; phone still needs ≥ 10 digits.

User-facing: modal asks for name + phone; submit composes `Hi! I'm <name>, I'd like to know more about ...` and opens WhatsApp.

## 2026-05-18 13:20 IST · fix(nz-seminar): May 29, 2026 is a Friday, not Saturday

Calendar check: 2026 starts on a Thursday; May 29 = day 149 of the year; 148 mod 7 = 1; Thursday + 1 = **Friday**. Every "Saturday"/"Sat" reference flipped to "Friday"/"Fri":

- `app/nz-seminar/page.tsx` — meta description, hero event-details row, "Secure Your Seat" subtitle
- `app/thank-you/page.tsx` — NZ seminar confirmation message, next-steps "add to calendar" line

User-facing: every place we tell users the seminar day now matches the actual calendar.

## 2026-05-18 13:10 IST · fix(proxe-widget): pin web agent to bottom-right

- **`app/globals.css`** — added `!important` left/right overrides on the PROXe widget container + launcher selectors. Default embed.js positions the widget bottom-left; new rules force `right: 16px` (mobile) / `right: 24px` (≥768px) and `left: auto`.
- Applies to every page that mounts the PROXe embed script (`/pilot-training`, `/dgca`, `/helicopter`, `/international`, `/agent`).
- Quick removal of clutter: matches the conventional chat-widget position so it doesn't collide with left-side content (sticky CTAs, footer links).

## 2026-05-18 12:50 IST · ux(wa-capture): premium redesign matching the open-house glass hero

Brand-native rebuild of the WhatsApp capture modal. Old version read as a generic SaaS popup; new version mirrors the open-house glass-hero language (gold corner accents, top gradient hairline, eyebrow with live pulse) so it feels native to the rest of the site.

What changed in **`components/WhatsAppCaptureModal.tsx`**:

- **Ambient gold glow halo** behind the card via a 520×420 `bg-[#C5A572]/8 blur-[100px]` orb. Hard to notice consciously, but it makes the dialog feel anchored on the page instead of floating.
- **Gold gradient hairline** along the top edge (`from-transparent via-[#C5A572] to-transparent`). Reuses the open-house hero treatment.
- **L-shaped corner accents** in gold at top-left and bottom-right corners (2px stroke, 20px reach). Same pattern as the open-house glass card.
- **Concierge eyebrow** "AVIATORS DESK · LIVE" with a pulsing green dot (same `animate-ping` pattern as the homepage "Admissions Open" status pill).
- **Headline upgraded** to 28px semibold with a subtle text-shadow for depth.
- **Phone input redesigned** as a single boarding-pass field with a fixed country-code chip ("+91" in gold + "IN" sublabel) on the left, then the number itself. Focus state lights up the border in gold + a soft 3px gold ring.
- **CTA button** still WhatsApp green, but with a Send icon, a hairline white inner highlight, a green-tinted lift shadow on hover, and an animated spinner during "Connecting…" state.
- **Trust strip** under the CTA: two gold checkmark inline-flags ("A real human replies" · "No marketing spam") separated by a thin divider.
- Body scroll is locked while the modal is open so the page can't sneak under.
- Backdrop bumped to `bg-black/80 backdrop-blur-md` for stronger focus.
- Modal width 440 → 480 to accommodate the richer layout without feeling cramped.

User-facing: tapping the WhatsApp pill in the navbar on `/`, `/pilot-training*`, `/dgca`, `/helicopter`, `/international` now opens a designed, on-brand modal instead of the generic dark box.

## 2026-05-18 12:30 IST · feat(wa-capture): all program pages route to marketing WA agent (98424)

- **`components/Navbar.tsx`** — every WA capture entry (home, pilot training, DGCA, helicopter, international) now redirects to `+91 90350 98424` (the marketing/automation agent). Previously DGCA, helicopter, international, and home went to `+91 95910 04043` (general support). All five program pages now hit the same automated funnel.
- Extracted the number into a `MARKETING_WA_AGENT` constant so it's a single point of change next time.

## 2026-05-18 12:20 IST · ux(wa-capture): inline phone input + button, centered on mobile

- **`components/WhatsAppCaptureModal.tsx`** — phone input and "Open WhatsApp" button now sit on the same row (input left, button right) instead of stacked. Modal width up from 360px to 440px to fit both comfortably.
- Mobile: modal is now centered (was sliding up from bottom). Same `items-center` everywhere.
- Title: "Start a chat" (was "Start a WhatsApp chat" from earlier).
- Button label shortens to "Opening..." while submitting so the inline layout doesn't reflow.

## 2026-05-18 12:00 IST · ux(wa-capture): phone-only modal + cleaner PROXe fields

Made the WA capture modal much smaller and stripped the name field — the conversation starts on WhatsApp anyway, so the name surfaces naturally there. Also restructured the PROXe payload so CRM rows show meaningful labels instead of `pilot_training_wa_prelaunch`.

UX:
- **`components/WhatsAppCaptureModal.tsx`** — phone-only single field. Max width `360px` (was `400px`). Compact 5-unit padding (was 6). Headline shrunk from `text-xl` to `text-base`. Added close X button top-right. Slides up from bottom on mobile (`items-end sm:items-center`). Auto-focuses phone on open. Submits on Enter.
- Phone validity check: requires ≥ 10 digits.
- Input style now follows the design system: `bg-[#0D0D0D] border border-[#333]` with gold focus ring + leading phone icon, matching ATC form style.
- CTA button: 11-unit height (was 12), keeps WhatsApp green with gold-tinted hover lift.

PROXe labels:
- `data.event_name` now sends `"WhatsApp Prelaunch"` (was snake_case like `pilot_training_wa_prelaunch`). This becomes the human-readable `notes` field in PROXe.
- `data.touchpoint` carries the per-page slug (`navbar_pilot_training`, `navbar_dgca`, etc.) for analytics filtering.
- `data.channel` = `"whatsapp"`.
- `data.program` = human-readable program name (`"Pilot Training"`, `"DGCA Ground Classes"`, `"Helicopter License"`, `"International Flying"`, `"Homepage"`).
- `data.page` = pathname only (e.g. `/pilot-training`) instead of full URL with query.
- Name no longer captured client-side; sentinel `"WhatsApp Lead"` is sent so PROXe's required-name field is satisfied. The real name surfaces in the WhatsApp chat itself.

## 2026-05-18 11:40 IST · feat(wa-capture): expand to all program pages

- **`components/Navbar.tsx`** — WA capture modal now triggered on `/`, `/pilot-training*`, `/dgca`, `/helicopter`, `/international` (was only `/pilot-training*`). Each page gets its own pre-filled message + PROXe source tag:
  - Home → `home_wa_prelaunch`, "I'd like to know more about Windchasers."
  - Pilot training → `pilot_training_wa_prelaunch`, "I'd like to know more about Windchasers' pilot training programs." (waNumber 919035098424)
  - DGCA → `dgca_wa_prelaunch`, "I'd like to know more about DGCA ground classes."
  - Helicopter → `helicopter_wa_prelaunch`, "I'd like to know more about the Helicopter Pilot License program."
  - International → `international_wa_prelaunch`, "I'd like to explore international pilot training options."
- Everything else (NZ seminar, webinars, ATC, cabin crew, summer camp, open house, students, parents, flight schools) keeps the existing direct `wa.me` anchor.

Verified each page renders the capture button via preview; NZ-seminar still uses the direct anchor.

## 2026-05-18 11:20 IST · feat(wa-capture): name+phone capture before WhatsApp on /pilot-training*

Stop losing the lead when a visitor taps WhatsApp without sending the message. The Navbar WA pill on `/pilot-training*` now opens a small modal asking for name + phone, fires the lead to PROXe (via `/api/leads`, type=event, event_name=`pilot_training_wa_prelaunch`), then redirects to wa.me with the name pre-filled into the message.

- **`components/WhatsAppCaptureModal.tsx`** (new) — reusable modal. Name + phone inputs, validates, fire-and-forget POST to `/api/leads`, then `wa.me` redirect with `Hi! I'm {name}, ...` message body.
- **`lib/attribution.ts`** (new) — first-touch UTM persistence in `localStorage` under `attr_utm_*` keys. Survives tab close and return visits, unlike the existing sessionStorage capture which only lasts the tab session.
- **`hooks/useTracking.ts`** — calls `captureAttributionToLocalStorage()` on first render alongside the existing sessionStorage capture. PAT and sheet forms unaffected (they still read sessionStorage).
- **`components/Navbar.tsx`** — on `/pilot-training*` the green WhatsApp pill is a `<button>` that opens the capture modal. Every other page still uses the direct `<a href="wa.me/...">` (no behavior change). WA business number for pilot training: `+91 90350 98424`.
- Lead is sent to existing PROXe `/api/leads` proxy as `type: "event"` with `data.event_name = "pilot_training_wa_prelaunch"` and full attribution (utm_*, page_url). No new API route or PROXe key exposure.

User-facing: tapping the WhatsApp icon in the navbar on `/pilot-training`, `/pilot-training-students`, `/pilot-training-parents` now opens a 2-field modal before going to WhatsApp.

## 2026-05-17 21:40 IST · fix(sheets): force INSERT_ROWS so new submissions never land shifted

- **`lib/sheets.ts`** — `appendToSheet()` now passes `insertDataOption: "INSERT_ROWS"` to Google Sheets. Previously the API used OVERWRITE mode with table detection: when a row had gap-columns mid-row (e.g. NZ-seminar's blank Stage/Remarks at I/J with attribution data at K-Q), the detector could anchor to the rightmost fragment and write the next submission starting at column P instead of column A.
- Fix is global. Every event form (open-house, nz-seminar, webinar, summercamp, cabin-crew, atc) now inserts cleanly below the last row, anchored to column A.
- Pre-existing misplaced rows in the sheet need to be deleted manually. New submissions from this point will align correctly.

## 2026-05-17 21:25 IST · copy: strip em dashes from thank-you and NZ-seminar content

Brand voice update. Em dashes removed everywhere they appeared in the thank-you flow and the NZ seminar page. Examples:
- thank-you: "You're registered for the NZ Seminar" (was "You're registered — NZ Seminar")
- thank-you next steps: "Watch your WhatsApp. We'll share venue details and a reminder" (was "Watch your WhatsApp — we'll share venue details and a reminder")
- nz-seminar walk-out card: "Private 1:1 conversations with school heads. Your questions, your child, your budget."
- nz-seminar speakers note: "More NZ flying school representatives joining the panel. Full list shared closer to the date."
- early-stage modal: split the dash-joined clauses into two sentences.
- below-12 back link: "I picked the wrong status, go back" (was a dash).
Also cleaned up internal code comments for consistency.

## 2026-05-17 21:15 IST · copy(nz-seminar): Anton role + page meta tags

- **`app/nz-seminar/page.tsx`** — Anton Ramenskiy role shortened to "Senior Manager" (was "Senior Marketing Manager").
- Page meta updated to match the latest hero copy:
  - `<title>` now leads with "Train where the world's best pilots train" + venue/date.
  - `<meta name="description">` rewritten to the new value prop: "Meet the New Zealand flight schools turning students into commercial pilots faster than anywhere else. Free in-person seminar, Bangalore, Sat May 29, 2026 · 3:00 PM. Only 30 seats."
  - `og:title` / `og:description` aligned with the new headline.
  - Added Twitter card meta so link unfurls render properly on X/Twitter too.

## 2026-05-17 21:05 IST · copy(nz-seminar): rewrite hero subtext

- **`app/nz-seminar/page.tsx`** — subtext now reads "Meet the New Zealand flight schools turning students into commercial pilots faster than anywhere else." (was "The fastest route from 12th to commercial pilot starts here."). Names the value prop and the country in one line.

## 2026-05-17 21:00 IST · fix(nz-seminar): hide sticky mobile CTA while hero CTA is on screen

- **`app/nz-seminar/page.tsx`** — sticky mobile "Secure Your Seat" no longer stacks on top of the hero CTA. New behavior:
  - Hero CTA on screen → sticky hidden
  - Scrolled past hero (>60% of viewport scrolled) → sticky shown
  - Register form's submit button on screen → sticky hidden again
- Implementation switched from two IntersectionObservers to a single scroll/resize handler measuring `window.scrollY` vs hero height and `registerRef.getBoundingClientRect()`. More reliable, no flash on first paint.

## 2026-05-17 20:50 IST · copy(nz-seminar): tighten hero headline + subtext

- **`app/nz-seminar/page.tsx`** — hero copy updated:
  - H1: "Train where the world's best **pilots train.**" (was "Train in the world's best country for flight training.")
  - Subtext: "The fastest route from 12th to commercial pilot starts here." (was the longer "Skip Google and Reddit…" line)

## 2026-05-17 20:40 IST · feat(nz-seminar): redirect modal fires on Below/Pursuing select + dropdown reordered

- **`app/nz-seminar/page.tsx`** — Current Status dropdown reordered ascending by stage: Below 12th → Pursuing 12th → Completed 12th → Graduate or above.
- Selecting "Below 12th" or "Pursuing 12th" now triggers the redirect modal **immediately** on change (was submit-time). Users don't waste effort filling the form when we know they need a different flow.
- Blocked panel converted from an inline form replacement to a true centered modal (fixed inset-0, z-100, backdrop blur). Has "Get the early-stage roadmap" + "Chat on WhatsApp" + a "go back, I picked wrong" escape hatch.
- Form alignment now stays clean because the modal floats above instead of swapping body content.

## 2026-05-17 20:15 IST · fix(nz-seminar): remove eligibility note + route Pursuing 12th to early path too

- **`app/nz-seminar/page.tsx`** — removed the inline eligibility note above the form (too noisy). Form now stands clean.
- The status dropdown now routes both `Pursuing 12th` AND `Below 12th` to the early-stage path (was only Below 12th). The seminar's value prop is what-after-12th, so anyone still in school gets a better experience on `/assessment/early`.
- Updated the blocked-state copy: "We have a better fit for you" instead of "This seminar isn't the right fit yet" — friendlier framing, no judgment.

## 2026-05-17 19:55 IST · feat(nz-seminar): eligibility note + dedicated below-12 path

- **`app/nz-seminar/page.tsx`** — added a visible eligibility note above the form: "This seminar is for students who have completed or are currently in 12th. Below 12th? See our early-stage path →" with an inline link to `/assessment/early`.
- When a student selects "Below 12th" and submits, the blocked state now shows a thoughtful message ("This seminar isn't the right fit yet — you have time to plan properly") plus two big CTAs: `Get the early-stage roadmap` (→ `/assessment/early`) and `Chat with us on WhatsApp` (pre-filled message). Auto-redirect target switched from `/` to `/assessment/early` and the timer is now 6s so users can read and click.

## 2026-05-17 19:35 IST · feat(nz-seminar): wire form submissions to "29 NZ Webinar Confirms" tab

- **`lib/sheets.ts`** — `getNzSeminarSheetTab()` default tab is now `29 NZ Webinar Confirms` (matches the actual tab name in Event Data 2026). Was a placeholder `NZ Seminar` before.
- **`app/api/nz-seminar/route.ts`** — pinned to Event Data 2026 spreadsheet (`145KgARkFGEi4_hjwR5dN6Vv8NJlnmzHhX8I7wvNOc-w`) explicitly so no env misconfig sends leads elsewhere. Override still possible via `GOOGLE_SHEET_ID_NZ_SEMINAR` or `EVENT_DATA_2026_SHEET_ID`.
- Column layout updated to match the existing sheet: row writes A Date, B Type, C Name, D Phone, E Email, F City, G With +1, H Current Status, I Stage (blank — counsellor fills), J Remarks (blank — counsellor fills), K-Q utm_source / utm_medium / utm_campaign / utm_term / utm_content / landing_page / referrer. Range expanded `A:O` → `A:Q`.

## 2026-05-17 19:20 IST · fix(nz-seminar): swap biggest-mistakes card image to brand-supplied Indian-family photo

- **`app/nz-seminar/page.tsx`** — replaced stock Unsplash (Surface, father + 2 toddlers) with the user-supplied `/nz-seminar/Parent image.webp` (80KB). On-brief: Indian parents + adult student matching the target audience.

## 2026-05-17 19:05 IST · feat(nz-seminar): use NZ landscape AVIF as hero + consolidate assets under /public/nz-seminar/

- **`app/nz-seminar/page.tsx`** — replaced the generic Vimeo aviation iframe with a static `/nz-seminar/NEw Zealand.avif` (138KB) rendered via `next/image priority`. NZ-specific, no external dependency. Darkened overlays to `0.65 / 0.30` so the glass-morphism card stays readable on the new bg.
- **`public/nz-seminar/`** — assets moved here from `public/webinar/` (Irene King.png, Antony.png, takeoff.mp4) so all NZ-page imagery sits in one folder. Speaker headshot paths in the page updated accordingly.
- Cleaned up the now-unused `heroInView` destructure.

## 2026-05-17 18:50 IST · fix(nz-seminar): topic cards now read as actual cards

- **`app/nz-seminar/page.tsx`** — root cause: card bg `#1A1A1A` matched the section bg, so the card had no visible container. Changes:
  - Card bg lifted to `#1F1F1F` with a `border border-white/10` all the way around + `rounded-2xl` + `shadow-lg shadow-black/30`. Now sits clearly on the `#1A1A1A` section.
  - Hover: subtle `border-[#C5A572]/60` + gold-tinted shadow + `-translate-y-1` + 5% image zoom.
  - Icon moved off the awkward gap between image and text — now a 44px circular badge floating over the top-left of the image (`bg-[#1F1F1F]/85 backdrop-blur-sm`). Image and copy now read as one cohesive card.
  - Gradient overlay updated to fade to the new card bg.

## 2026-05-17 18:30 IST · feat(nz-seminar): wire speaker headshots

- **`app/nz-seminar/page.tsx`** — Irene King and Anton Ramenskiy speaker cards now show real headshots instead of initials fallback. Sourced from existing `/public/webinar/` assets (Irene King.png · 60KB, Antony.png · 46KB).

## 2026-05-16 22:15 IST · feat(pat): display PAT result as score/100 instead of score/150

- **`app/thank-you/page.tsx`** — the big PAT score panel now renders `Math.round(score × 100 / 150)/100` instead of `score/150`. Examples: 150 → 100/100, 120 → 80/100, 90 → 60/100.
- Internal scoring (`PAT_MAX_TOTAL = 150`), the PROXe `total_score` payload, and tier thresholds (premium ≥140, strong ≥120, moderate ≥90) all remain on the original 150 scale. Historical leads stay comparable; only the user-facing display changes.
- User-facing: PAT result reads as a more intuitive percentage.

## 2026-05-16 21:30 IST · feat(attribution): persist first-touch UTMs through every form, write them to all sheet tabs

- **`hooks/useTracking.ts`** — `utmParams` returned by the hook now reads from sessionStorage (`getStoredUTMParams`) instead of the current URL. So a user landing with `?utm_source=fb&utm_campaign=nz-may-26` and clicking through to /open-house, /nz-seminar, /atc still sends the original campaign attribution.
- **`lib/sheets.ts`** — new `extractAttributionCells(data)` helper. Returns a stable 7-cell array `[utm_source, utm_medium, utm_campaign, utm_term, utm_content, landing_page, referrer]` to append to every form's sheet row.
- **`app/api/open-house/route.ts`** — range A:H → A:O. Appends 7 UTM/landing/referrer cells.
- **`app/api/nz-seminar/route.ts`** — range A:H → A:O. Same.
- **`app/api/webinar/route.ts`** — range A:I → A:P.
- **`app/api/summercamp/route.ts`** — range A:I → A:P.
- **`app/api/cabin-crew/route.ts`** — range A:I → A:P.
- **`app/api/atc/route.ts`** — range A1:I1 → A1:P1.
- **`app/cabin-crew/page.client.tsx`** + **`app/summercamp/page.tsx`** — now read stored UTMs/landing/referrer at submit time and include them in the POST body. (Open House, NZ Seminar, ATC already submitted `utmParams` via `useTracking` — now those values are first-touch instead of current-URL.)
- User-facing: no UI change. Sheet-side: rows now show campaign attribution. Verified locally that UTMs persist across page navigation and reach the API payload.

## 2026-05-16 21:00 IST · feat(nz-seminar): add "Meet the speakers" section

- **`app/nz-seminar/page.tsx`** — new section between "You'll spend lakhs..." and "What we'll cover" featuring Irene King (CEO, Ardmore Flying School) and Anton Ramenskiy (Sr. Marketing Manager, Auckland International Pilot Academy). Cards show name, role, school in a horizontal layout with a gold-bordered avatar. Falls back to initials (IK / AR) when no headshot file is present.
- **`public/team-nz/README.md`** — placeholder folder + instructions for dropping the two JPG headshots. Wiring auto-picks them up once present.
- Reordered section backgrounds so alternating `#131313 / #1A1A1A` is preserved after the insertion.

## 2026-05-16 20:40 IST · fix(nz-seminar): swap "biggest mistakes" card image to an affluent family

- **`app/nz-seminar/page.tsx`** — replaced the "Biggest mistakes families make" card photo. Old shot (Frederick Shaw) read as a village family — wrong audience signal. New shot (Surface) shows a father and two kids at a laptop, which matches the target audience (families planning ₹1cr+ flight training spends).
- **`public/unsplash/family-decision-OaD5um45.jpg`** — new 71KB photo.
- **`public/unsplash/family-decision-LfqvVFSo.jpg`** — removed.
- **`public/unsplash/_credits.json`** — credit swapped.

## 2026-05-16 20:15 IST · feat(nz-seminar): add Unsplash imagery to topic cards

- **`app/nz-seminar/page.tsx`** — each of the 6 "What we'll cover" cards now leads with a 16:9 hero image (NZ mountains, cockpit training, financial planning, flight instructor, airline pilot, family decision-making). Icon sits below the image with the existing title + description.
- **`public/unsplash/*.jpg`** — 6 new photos (52–124 KB each, served via `next/image`).
- **`public/unsplash/_credits.json`** — credits appended for the 6 new NZ-seminar photos.
- **`scripts/unsplash-fetch.mjs`** — reusable script that searches Unsplash, downloads at `w=900&q=72`, and updates the credits ledger.
- User-facing: NZ seminar topic cards now have rich imagery instead of just icons.

## 2026-05-16 19:30 IST · feat(nz-seminar): new New Zealand flight training seminar landing page

- **`app/nz-seminar/page.tsx`** — new landing page for the May 29, 2026 NZ Flight Training Seminar in Bangalore. Mirrors `/open-house` structure (glass-morphism hero with NZ flag accent, topics covered, walk-out-with section, who-should-attend, registration form, sticky mobile CTA). Copy is tailored to NZ flying schools, CPL roadmap, and cost transparency.
- **`app/api/nz-seminar/route.ts`** — new POST endpoint that appends seat registrations to the "NZ Seminar" Google Sheet tab (overridable via `GOOGLE_SHEET_TAB_NZ_SEMINAR`).
- **`lib/sheets.ts`** — added `getNzSeminarSheetTab()` helper.
- **`app/thank-you/page.tsx`** — added `nz-seminar` form type: meta-lead tracking, doc title, registration summary card with WhatsApp CTA, and secondary "NZ Seminar details" link. Imported `Plane` icon.
- **`components/Navbar.tsx`** — `/nz-seminar` triggers compact header (logo + Call + WhatsApp), with NZ-specific WhatsApp prefill text.
- User-facing: new public route at `/nz-seminar` where ad traffic lands to book a seat. Form posts to the new sheet tab so leads don't mix with Open House.

## 2026-05-15 · fix(mobile): restore vertical page scroll when touching carousels

- **Root cause**: `touchAction: "pan-x"` on Framer Motion drag elements tells the browser to handle x-panning natively and block y — vertical page scroll dies when a finger lands on any carousel.
- **Correct value**: `touchAction: "pan-y"` — browser handles vertical scroll natively, Framer Motion gets horizontal drag events.
- **`components/VideoCarousel.tsx`** — mobile `motion.div` drag: `pan-x` → `pan-y`
- **`components/WhyChooseUsCarousel.tsx`** — card stack `motion.div` drag: `pan-x` → `pan-y`
- **`components/ImageCarousel.tsx`** — mobile `motion.div` drag: `pan-x` → `pan-y`
- **`components/StudentsFlyingGallery.tsx`** — native CSS scroll container: removed `touch-pan-x` class, replaced with `style={{ touchAction: "pan-x pan-y" }}` so both directions are explicitly allowed.
- User-facing: touching any carousel card no longer traps vertical page scroll on mobile.

## 2026-05-15 · fix(pixel): sessionStorage dedup for Lead event

- **`app/thank-you/page.tsx`** — replaced `useRef` dedup with `sessionStorage` key (`wc_lead_sent:<type>:<search>`). Survives Suspense re-mounts (each mount shares the same sessionStorage), so Lead fires exactly once even when Next.js mounts `ThankYouContent` twice during hydration.
- Removed unused `leadSentRef` and `useRef` import.
- User-facing: no UI change. Pixel Helper should now show exactly 1 Lead per form submission.

## 2026-05-15 · fix(pixel): eliminate double PageView and double Lead events

- **`components/MetaPixelInit.tsx`** — new client component owns `fbq('init')` and `fbq('track', 'PageView')`. `useRef` guarantees `init` fires exactly once per session; `PageView` fires on every pathname change (correct SPA behaviour).
- **`app/layout.tsx`** — inline pixel script now only sets up the fbq queue (IIFE). Removed `fbq('init')`, `fbq('track', 'PageView')`, redundant `__wcFbqInited` flag, and `<noscript>` img fallback that Pixel Helper counted as a second PageView.
- **`app/thank-you/page.tsx`** — replaced window-based dedup Set with `useRef` flag (`leadSentRef`). Ref is tied to the component instance, making it impossible to fire Lead twice in the same page load.
- User-facing: no UI change. Pixel Helper should now show exactly 1 PageView per page and 1 Lead per form submission.

## 2026-05-14 · fix(pilot-training): make sticky demo CTA button visible

- `app/pilot-training/page.tsx`: Replaced semi-transparent glassmorphism button (dark bg, faint gold text) with solid gold button (bg `#C5A572`, black text, gold glow shadow) — was effectively invisible against dark page sections
- User-facing: "Book a Demo Class" sticky button is now a high-contrast solid gold pill, impossible to miss on scroll

## 2026-05-14 · feat: track last-visited program to pre-fill BookingForm interest

- `lib/sessionStorage.ts`: Added `lastVisitedProgram?: string` to `UserSessionData` interface and exported `setLastVisitedProgram(program)` helper that writes to session storage
- `app/dgca/page.tsx`: Calls `setLastVisitedProgram("dgca_ground")` on mount
- `app/helicopter/page.tsx`: Calls `setLastVisitedProgram("helicopter_license")` on mount
- `app/international/page.tsx`: Calls `setLastVisitedProgram("pilot_training_abroad")` on mount
- `app/pilot-training/page.tsx`: Calls `setLastVisitedProgram("pilot_training_abroad")` on mount
- `components/BookingForm.tsx`: Refactored `mapSourceToInterest` to handle direct `InterestSource` values; added fallback that reads `lastVisitedProgram` from session when no URL `source`/`prefill` param is present
- User-facing: BookingForm interest field now auto-selects the correct program when a visitor navigates from a program page without a URL source param

## 2026-05-12 · /dgca: hero + subject cards + Why Choose Us — image-driven

- /dgca hero: facility photo (DSC_0492) painted behind, opacity 35%, dark gradient overlay for legibility.
- DGCASubjectsGrid: each of the 6 cards gets its own facility background image (opacity 15%, fades to 25% on hover), gradient overlay keeps text readable. Border switched to border-t-2 gold to match design system.
- WhyChooseUsCarousel: cards now full-bleed background photos (one per feature, 11 total) with bottom-up dark gradient overlay; icon sits in a gold-tinted square. Height bumped, redundant "Why Choose Us" heading inside the carousel removed (parent page provides it).

## 2026-05-12 · Vimeo thumbnail backdrops (kill the dark-blank flash)

- VimeoReel, StudentsFlyingGallery, VideoCarousel, /pilot-training hero: each Vimeo iframe now has a poster image (vumbnail.com proxy: `https://vumbnail.com/{id}_large.jpg`) painted as the container background.
- StudentsFlyingGallery iframe URL gained `background=1` for more reliable autoplay (matches VimeoReel).
- Result: while a Vimeo iframe is loading or switching, the thumbnail shows instead of a black/dark grey box.

## 2026-05-12 · Meta Pixel: wire booking, pricing, navbar Contact, sticky InitiateCheckout

- /thank-you: "booking" and "pricing" added to META_LEAD_FORM_TYPES allowlist with their own trackMetaLead branches (Demo Booking, Pricing Request). Booking also fires Google Ads conversion.
- Navbar Call (tel:) and WhatsApp links now fire fbq("track","Contact",{method, source_page}) on click — captures phone-call and WhatsApp lead intent that was previously invisible.
- /pilot-training sticky "Book a Demo Class" CTA now fires fbq("track","InitiateCheckout") before opening PROXe widget or redirecting to /demo.
- Fixes the audit gap where the primary demo-booking conversion ran on Facebook's blind side.

## 2026-05-12 · /pilot-training: hero video sound toggle

- Added "Sound on / Sound off" pill button at top-right of hero (glass style, gold hover).
- Click unmutes the hero Vimeo with a 60ms-step fade-in up to 25% volume.
- Auto-fades out + re-mutes when the hero section scrolls out of view (IntersectionObserver, threshold 0.3).
- iframe URL now includes api=1 for postMessage control.

## 2026-05-12 · VimeoReel: add background=1 to non-cover embed URL

- Non-cover mode now uses background=1 alongside api=1 — forces Vimeo to autoplay regardless of browser autoplay policy.
- Fixes: "Building India's next generation" portrait reel (and all other non-cover VimeoReels) stuck on poster/not playing.
- Mute button and autoUnmuteOnView behaviour unchanged.

## 2026-05-12 · /dgca, /helicopter, /international: design system refresh

- All three pages: added Manrope display font, #131313/#0e0e0e section alternation, eyebrow labels, tracking-tighter headings, italic gold headline accent.
- Cards: swapped to WindChasers card pattern (bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl).
- CTA buttons: gold fill, uppercase, tracking-wider, hover lift — matches /demo and /pilot-training.
- /dgca: FAQ converted to accordion (click to expand/collapse) with card pattern.
- /helicopter: numbered training path cards, requirements card, career opportunity cards — all updated.
- /international: country cards keep click-to-expand highlights; borders and fonts updated; What We Provide now uses card pattern.
- User-facing: all three pages now visually consistent with /pilot-training and /demo.

## 2026-05-12 · /demo: mobile card carousel

- Demo type cards (Online / Campus Visit) now use a horizontal snap-scroll carousel on mobile (82vw per card, snap-center).
- Desktop keeps the existing 2-column grid unchanged.

## 2026-05-12 · /demo: hide hero video on mobile

- Hero Vimeo iframe now has `hidden md:block` — not loaded on mobile, desktop-only.
- User-facing: mobile /demo page no longer plays background video (faster load, no heavy iframe).

## 2026-05-12 · Footer: main pages, map embed, logo at bottom

- Added "Pages" column: Home, Our Team, Book a Demo, Pilot Assessment, AI Counsellor, Pricing.
- Added "Pilot Training" and "ATC Courses" to Training Paths column.
- Added Google Maps embed (right side, 2-of-5 columns) for WindChasers Kothanur campus — grayscale by default, full colour on hover.
- Bottom bar now shows faded WindChasers logo centered above the copyright line.
- Layout: 5-column grid (3 nav + 2 map) on desktop, stacked on mobile.

## 2026-05-12 · /pilot-training: fix hero iframe cover sizing

- Replaced 16:9 viewport-math sizing with min-w/min-h cover approach (w-[177.78vh] h-[100vh] min-w-full min-h-full scale-[1.15]) that handles portrait and landscape source videos.
- Added dark solid overlay inside the container so content remains legible regardless of video brightness.
- Fixes: video was escaping overflow and covering the navbar/heading.

## 2026-05-12 · /pilot-training: hero background swapped to Vimeo 1191576047

- Replaced hero iframe video (1160946921 → 1191576047); opacity raised from 40% to 60%.
- User-facing: hero now plays the new aerial reel at higher brightness.

## 2026-05-12 · /pilot-training + BookingForm: button polish, masonry gallery, form tweaks

- Sticky "Book a Demo Class" button: removed Calendar icon, text reduced to text-xs.
- Campus gallery (CampusGallery): switched from uniform grid to CSS columns masonry (columns-2 md:columns-4); image order shuffled (people/vibe shots interleaved with facility shots).
- BookingForm time slots: narrowed from 10 AM–5 PM to 11 AM–4 PM (6 slots).
- BookingForm education dropdown: added "Working Professional" as a 4th option.

## 2026-05-12 · /demo: Vimeo hero background

- Hero section replaced with full-bleed Vimeo embed (1191576047) using background=1 mode, scaled 1.15× to fill frame.
- Dark gradient overlay (from-[#131313]/60 → to-[#131313]) preserves legibility of headline copy.
- User-facing: demo page hero now shows looping aerial footage instead of a flat dark background.

## 2026-05-12 · /demo + BookingForm: design system refresh

- Demo page: Manrope display headline, italic gold accent, WindChasers card pattern (border-t-2 gold, floating pill badge, icon cell) for Online Demo + Campus Visit cards, framer-motion reveals, #131313/#0e0e0e section rhythm.
- BookingForm: glass card (backdrop-blur-20, surface-container bg, outline-variant border), inputs → #1A1A1A/border-[#444]/focus:border-[#C5A572], buttons → gold pill uppercase with hover lift, Back → ghost gold border.

## 2026-05-12 · VimeoReel: gradual audio fade on scroll out

- autoUnmuteOnView: volume now fades out over ~600ms (steps of 0.05 every 60ms) instead of cutting instantly.
- Fade-in also eases up from 0 → 0.5 on scroll-in.
- Fixes: abrupt audio cut when scrolling from section 2 to 3.

## 2026-05-12 · /pilot-training: Book a Demo Class — scroll-up reveal, glass style

- Button only appears when scrolling up (and past 300px from top).
- Style: frosted glass background (blur 16px), gold border glow, gold text — not solid fill.
- Fades in/out with translate animation; hidden while scrolling down.

## 2026-05-12 · /pilot-training: consolidate CTAs — sticky "Book a Demo Class"

- Removed campus button cluster (Book a Demo + See Location pair).
- Removed "Book a campus visit" duplicate from simulator section.
- See Location demoted to a small pill button below the gallery.
- Added fixed bottom-center "Book a Demo Class" button that opens PROXe chat widget (fallback → /demo).

## 2026-05-12 · /pilot-training: campus gallery — 2 rows default + expand

- Campus gallery shows 8 images (2×4 grid) by default.
- "View all 15 photos ↓" button expands to all images; "Show less" collapses back.

## 2026-05-12 · /pilot-training: swap gallery styles

- In the Cockpit (Ch4): restored StudentsFlyingGallery carousel (images + Vimeo mix).
- Bengaluru Campus Vibes (Ch8): replaced ImageCarousel with 4-col masonry grid of all 15 facility images.

## 2026-05-12 · /pilot-training: PROXe chat widget

- Added proxe.windchasers.in/api/widget/embed.js (afterInteractive) to /pilot-training page.
- Widget loads as floating chat bubble — same agent as /agent page.

## 2026-05-12 · /pilot-training: campus section — eyebrow, subtitle, CTA + map popup

- ImageCarousel now supports eyebrow prop; "WindChasers" eyebrow added above title.
- Subtitle updated: "Walk in for a Demo session on Saturdays 11am to 4pm".
- Two CTA buttons added below carousel: "Book a Demo" (→/demo) + "See Location" (opens map modal).
- Map modal shows Google Maps embed for WindChasers Kothanur campus; closes on backdrop click.

## 2026-05-12 · /pilot-training: In the Cockpit — masonry grid

- Replaced StudentsFlyingGallery carousel with CSS columns masonry grid (2-col mobile, 4-col desktop).
- Shows all 11 student images; no carousel, no Vimeo clips in this section.
- Images stagger in with framer-motion on scroll; hover scale-105.

## 2026-05-12 · /dgca: WhyChooseUsCarousel right arrow always visible

- Both nav arrows now always render with justify-between; hidden via `invisible` instead of conditional render.
- Fixes: right arrow missing on first card because justify-between had only one element.

## 2026-05-12 · Navbar: call + WhatsApp on /pilot-training pages

- Added isPilotTraining flag (matches /pilot-training/*) to Navbar.
- /pilot-training routes now show compact navbar: logo + Admissions Open badge + Call + WhatsApp buttons.
- User-facing: phone and WhatsApp icons visible in navbar on all pilot-training pages.

## 2026-05-12 · /pilot-training: Simulator card — DSC_0481 image

- "Industry-grade simulators" Why card now uses /facility/DSC_0481.JPG.webp.

## 2026-05-12 · /pilot-training: Why card 3 — dedicated asset

- "Built around your goal" card image swapped to /why-windchasers/Build Around your goals.webp.

## 2026-05-12 · /pilot-training: Why WindChasers cards — jumbled images

- DGCA-approved partners card now uses /why-windchasers/DGCA Approved.webp (was WC2.webp).
- Built around your goal → DSC_0549.JPG.webp; End-to-end support → Sumaiya Ali.webp; Simulators → 5U2A0673.JPG.webp; Honest pricing → DSC05362.JPG.webp.
- User-facing: each Why card now has a distinct, varied background photo instead of repetitive facility shots.

## 2026-05-12 · /pilot-training: campus gallery — 8 new images + heading update

- Added 8 new facility images to ImageCarousel: 5U2A0673, 5U2A0674 (avif), 5U2A0679, DSC05362, DSC_0481, DSC_0492, DSC_0549, Sumaiya Ali.
- Gallery heading changed: "Inside the Bengaluru campus." → "Bengaluru Campus Vibes."
- User-facing: gallery now shows people/vibe shots alongside facility photos.

## 2026-05-12 · /pilot-training: add 3rd simulator video (1191486085)

- Added Vimeo 1191486085 to SIMULATOR_VIMEO_IDS; grid changed back to 3 columns.
- User-facing: campus section now shows 3 simulator reels side by side.

## 2026-05-12 · /pilot-training: PAT section — replace mock question with score result card

- Right-side mock replaced: "Question 15 of 20" → sample result card with score (84/100), 4/5 stars, "Strong Candidate" tier, counsellor-call note, completed progress bar.
- User-facing: result card is more enticing — shows what a good score looks like rather than a mid-quiz question.

## 2026-05-12 · /pilot-training: swap Navaneeth and Rohan order in captains carousel

- Navaneeth Nagendra moved to 4th position, Rohan Hibare to 5th.

## 2026-05-12 · /pilot-training: fix TypeScript build error

- Removed dead initials-fallback code from captain cards (all members now have real photos).
- Fixes: Type error "Type 'unknown' is not assignable to type 'ReactNode'" at page.tsx:546.

## 2026-05-12 · /team: Navaneeth photo restored

- Set Navaneeth Nagendra's photo to /team/Navneeth.webp on the team page (was null).
- User-facing: "NN" placeholder replaced with real headshot on /team.

## 2026-05-12 · /pilot-training hero heading + VimeoReel volume at 50%

- Hero heading changed: "You. In the cockpit. Inside two years." → "Your Pilot Career Starts Here."
- VimeoReel auto-unmute volume reduced from 100% → 50%.
- User-facing: softer audio on scroll-in; cleaner hero copy.

## 2026-05-12 · VimeoReel: auto-unmute on scroll into view

- Added `autoUnmuteOnView` prop to VimeoReel — uses IntersectionObserver (50% threshold) to unmute on entry, mute on exit.
- Applied to the "Building India's next generation" portrait reel on `/pilot-training`.
- User-facing: audio plays automatically when the video scrolls into view, stops when scrolled past.

## 2026-05-12 · /pilot-training: campus section — carousel first, CTA below

- ImageCarousel ("Inside the Bengaluru campus.") now appears above the "Try the cockpit" CTA + simulator reels.
- Simulator grid changed from 3-col to 2-col (matches 2 available clips, no empty gap).
- Both CTA buttons ("Book a Demo Session" + "Book a campus visit") consolidated in one row below the copy.
- User-facing: visitors see campus photos first, then the CTA to book.

## 2026-05-12 · /pilot-training: captains cards — 2-line text overlay

- Name truncated to 1 line (text-base), role truncated to 1 line — 2 lines total.
- Reduced overlay padding so text sits lower on the face.
- Bio hover text removed from pilot-training cards (kept clean).
- User-facing: text no longer obscures faces.

## 2026-05-12 · Add Navaneeth team photo asset

- Added public/team/Navneeth.webp to the repository.

## 2026-05-12 · /pilot-training: Navaneeth real photo restored

- Navaneeth's card now uses the real /team/Navneeth.webp (file confirmed valid).
- Initials placeholder removed; image renders correctly.

## 2026-05-12 · /pilot-training: Navaneeth card — initials placeholder for broken image

- Navaneeth's image set to null (Navneeth.webp is corrupt); card now shows "NN" initials placeholder.
- Card rendering updated to conditionally show Image or initials fallback.
- User-facing: no broken image — clean placeholder until real photo is supplied.

## 2026-05-12 · /pilot-training: captains carousel — restore staggered offset

- Alternate cards offset down (mt-12) inside the carousel, restoring the up/down stagger look.
- User-facing: 4 cards visible with staggered heights + arrow to Navaneeth.

## 2026-05-12 · /pilot-training: captains section converted to carousel (4-up + arrows)

- Replaced 5-column grid with CardCarousel — shows 4 cards at a time, arrow to reveal Navaneeth (5th).
- All cards remain linked to /team.
- User-facing: layout no longer crowded; arrows navigate to the 5th instructor.

## 2026-05-12 · /pilot-training: add Navaneeth as 5th captain, link all to /team

- Added Navaneeth Nagendra (Senior Ground Instructor) to the Captains grid on `/pilot-training`.
- Grid updated from 4 to 5 columns (lg:grid-cols-5) to accommodate the new member.
- All captain cards now link to `/team`.
- User-facing: visitors can now see all 5 instructors and click any card to reach the full team page.

## 2026-05-12 · /pilot-training: reorder page sections

- New section order: Hero → Path Selection → Honest Part → In the Cockpit (gallery) → From here to your CPL → Captains → Why WindChasers → Testimonials → Campus → PAT → CTA
- Previously: Captains and Why WindChasers appeared before the gallery and CPL steps.
- User-facing: social proof (gallery) and the CPL roadmap now appear much earlier in the funnel.

## 2026-05-12 · /pilot-training: replace Kothanur with Bengaluru in campus section

- Campus image carousel title changed from "Inside the Kothanur campus." → "Inside the Bengaluru campus."
- User-facing: campus section now correctly names the city instead of the neighbourhood.

## 2026-05-12 · windchasers.md refresh + CHANGELOG bootstrap

- Update `windchasers.md` to reflect the new `/pilot-training`, `/pilot-training-parents`, `/pilot-training-students` and `/team` routes.
- Document new reusable components: `StudentsFlyingGallery`, `CardCarousel`, `VimeoReel`, `StudentLeadForm`, `FacilityLightbox`, `AirplanePathModal` updates, `lib/batch-date.ts`.
- Document new public asset folders: `/students-flying`, `/team`, `/brand`, `/why-windchasers`.
- Updated `ConditionalFooter` entry — `/pilot-training-students` no longer hides the footer.
- Bootstrap this CHANGELOG.md per the updated build-review skill.
- (commit pending)

## 2026-05-12 · /pilot-training: regroup sections, real team, unmute on about video

- New chapter order on `/pilot-training`: Promise → Captains (Honest Part + Team) → Story (Why) → Proof (Gallery + Testimonials) → Path (Journey + Campus/Sim merged + PAT + Final CTA).
- The Honest Part section moved to sit with Captains in Chapter 2.
- Facility `ImageCarousel` folded into the Simulator section as one "Train at our Campus" section.
- Replace 4 placeholder captains with real team: Sumaiya Ali, Rida Maryam Ali, Hemanth Kumar R, Rohan Hibare.
- About-section video drops `cover` mode so the unmute button shows; keeps `zoom={1.5}` to fill the frame.
- User-facing: page narrative now lands the founder + instructors much earlier, and visitors can hear the about-section reel.
- (`6f60727`)

## 2026-05-12 · Add pilot-training pages + team, rebuild students page, supporting components

- New routes: `/pilot-training` (Stitch-style 12-section funnel), `/pilot-training-parents` (founder note, parent-focused), `/team` (dedicated team page).
- `/pilot-training-students` fully rebuilt: dynamic next-batch date (`lib/batch-date.ts`), `StudentLeadForm` posting to `/api/leads` with first-touch UTM, `FacilityLightbox` modal viewer, Voices testimonial MP4s + flying Vimeo reels, 7 programs (no ATPL/Cabin Crew/Airport Ops/Drone).
- Removes flagged copy across `/pilot-training-students`: "elite", "AI-driven", "100% Exam Pass", "ex-Air Force", "CAA certified", "premier", etc.
- New reusable components: `StudentsFlyingGallery` (horizontal Vimeo + image carousel with per-card unmute toggle, nav arrows above), `CardCarousel` (generic horizontal card scroller), `VimeoReel` (portrait / landscape embed with cover-fill + zoom + custom mute control).
- New asset folders: `public/brand/`, `public/students-flying/`, `public/team/`, `public/why-windchasers/`.
- `ConditionalFooter` re-enables the global footer on `/pilot-training-students`.
- User-facing: three new pages, dedicated team page, lead capture funnel on the students page wired end-to-end.
- (`fecdbb2`)
