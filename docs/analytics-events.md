# WindChasers — Analytics Event Reference

One source of truth for everything the site fires to GA4 + Meta Pixel.

- **GA4 property:** `G-3THNVEDJK8` (loaded in `components/Analytics.tsx`)
- **Meta Pixel:** `1097272771358425` (aviation pixel; `components/MetaPixelInit.tsx`)
- **Microsoft Clarity:** `mmlkzcnd2z`
- **Central registry:** `lib/analytics/events.ts` — every event name + the
  `track()`, `trackMeta()`, `trackLead()` helpers. Add new events there first,
  then fire them via `track(EVENTS.x, params)`. Never inline raw `gtag()` calls.

Every `track()` call auto-stamps `page_location` + `page_path`, so you don't
repeat them per caller.

---

## Event catalogue

### Leads & conversions (the money events)

| Event (GA4) | When it fires | Key params | Fired from |
|---|---|---|---|
| `lead_submit` | Any lead form submitted successfully | `form_name`, `audience`, `source` | InlineLeadForm, StudentLeadForm, BookingForm, AssessmentForm, WhatsApp capture (via `trackLead`) |
| `generate_lead` | GA4 recommended alias, fired alongside `lead_submit` | same as above | same (via `trackLead`) |
| `demo_book` | Demo / counsellor session booked | `form_name`, `interest`, `demo_type`, `source` | BookingForm |
| `assessment_start` | PAT entered the question phase | `audience` | AssessmentForm |
| `assessment_complete` | PAT finished (score computed) | `audience`, `tier`, `score`, `source` | AssessmentForm |
| `early_stage_lead` | Class-12 "not completed" branch lead | `form_name` | StudentLeadForm |
| `contact_call` | Phone / call button tapped | `source_page` | Navbar |
| `contact_whatsapp` | WhatsApp button tapped / WA capture opened | `source_page` | Navbar |

**Meta Pixel:** `trackLead()` also fires Meta `Lead`. The WhatsApp capture modal
fires Meta `Lead` separately (with richer params) via `trackMetaLead`, plus the
GA4 `lead_submit`/`generate_lead` here. Call & WhatsApp taps fire Meta `Contact`.

### Engagement

| Event (GA4) | When it fires | Key params | Fired from |
|---|---|---|---|
| `cta_click` | A primary CTA button click | `cta_location`, `label`, `link_url` | Navbar menu CTAs |
| `sticky_cta_click` | Floating "Book a Demo" button | `cta_location`, `label` | Home + Pilot Training sticky button |
| `menu_open` | Slide-in nav menu opened | `source_page` | Navbar hamburger |
| `nav_click` | A nav / menu link clicked | `link_label`, `link_url`, `source_page` | Navbar menu links |
| `video_play` | A reel played on purpose (tap / unmute) | `video_id`/`video_title` or `source`, `card_index` | LazyVimeo (tap), StudentsFlyingGallery (unmute) |
| `gallery_interact` | Gallery prev/next | `source`, `action` | StudentsFlyingGallery |
| `scroll_depth` | 25 / 50 / 75 / 100% reached (once each, per page) | `percent`, `page_path` | ScrollDepthTracker (global) |

Background autoplay-on-view embeds are decorative and do **not** fire
`video_play` — only a deliberate tap or unmute counts.

### Page / section views

| Event (GA4) | When it fires | Key params | Fired from |
|---|---|---|---|
| `key_page_view` | A high-value program page viewed | `page_title` | `trackKeyPageView()` (dgca, international, helicopter) |
| `section_view` | A tracked section scrolled into view | `section` | _reserved — wire per-section as needed_ |
| `program_view` | Program/course page viewed | `course` | _reserved_ |

### Form funnel detail

| Event (GA4) | When it fires | Key params | Fired from |
|---|---|---|---|
| `form_start` | User focused / first touched a form | `form_name` | InlineLeadForm, BookingForm |
| `form_step` | Multi-step form advanced a step | `form_name`, `step` | BookingForm (step 1 → 2) |
| `form_error` | A validation error was shown | `form_name`, `field` | BookingForm |
| `form_abandon` | Left with a partially-filled form | `form_name` | _reserved_ |

---

## How to add a new event

1. Add the name to `EVENTS` in `lib/analytics/events.ts` (snake_case).
2. Fire it where it happens: `track(EVENTS.MY_EVENT, { ...params })`.
3. For a lead, prefer `trackLead({ form_name, audience })` so GA4 + Meta stay
   consistent in one call.
4. Document it in the table above.

## GA4 setup checklist (in the GA4 UI)

- Mark `lead_submit`, `demo_book`, `assessment_complete` as **conversions**.
- `generate_lead` is a GA4 recommended event — it shows up automatically.
- Custom dimensions worth registering: `form_name`, `tier`, `interest`,
  `cta_location`, `source_page`, `percent`.

## Legacy events (kept for history continuity)

`lib/analytics.ts` still emits the older Title-Case names
(`Key Page View`, `DGCA Pilot Lead`, `assessment_started`, …) alongside the new
registry events so historical GA4 reports stay continuous. New work should use
the registry only.
