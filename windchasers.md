# WindChasers Aviation Academy - Build Truth

## Project Overview

**Project Name:** WindChasers Aviation Academy  
**Version:** 0.1.0  
**Framework:** Next.js 14.2.3 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS 3.4.3  
**Animation:** Framer Motion 11.0.8  
**Icons:** lucide-react 0.562.0  
**Analytics:** Google Analytics (G-3WDV2V65F5), Microsoft Clarity (uv11b4d3ex), Meta Pixel (1431602295033185)  
**Chat Widget:** Proxe - loaded via `https://agent.windchasers.in/widget/embed.js`

---

## Documentation freshness

- **This file last updated:** 2026-04-16 (aligned with the workspace snapshot and `git` history below).
- **Repository HEAD (latest commit):** `0b621e3` - 2026-04-13 23:55 +0530 - *fix: rename ATC sheet tab from 'ATC Web Lead' to 'ATC'*
- **“Last changed” in the tables:** `git log -1` on that path (author commit date; timezone as stored by Git, typically `+0530`).

---

## Build Structure

### Directory Structure

```
windchasers/
├── app/
│   ├── api/
│   │   ├── assessment/route.ts       # PAT → Sheets (Assessment) + pat-test webhook
│   │   ├── booking/route.ts          # Demo → Sheets (Booking) + pilot-windchasers
│   │   ├── leads/route.ts            # Routed leads (ATC / Open House / default) + Proxe backup
│   │   ├── atc/route.ts              # Legacy ATC POST → Sheets + Proxe (page uses /api/leads)
│   │   ├── pricing/route.ts          # Pricing → Sheets (Pricing) + pilot-windchasers
│   │   ├── open-house/route.ts       # Open House registration → Google Sheets
│   │   └── summercamp/route.ts       # Summer Camp → Sheets + Proxe (UI not wired yet)
│   ├── assessment/page.tsx           # Pilot Aptitude Test (PAT)
│   ├── atc/page.tsx                  # ATC Training Program page
│   ├── demo/page.tsx                 # Book Demo page
│   ├── dgca/page.tsx                 # DGCA Ground Classes page
│   ├── helicopter/page.tsx           # Helicopter Pilot License page
│   ├── international/page.tsx        # Pilot training abroad page
│   ├── open-house/page.tsx           # Open House event registration (April 11, 2026)
│   ├── pricing/page.tsx              # Pricing page (form-gated)
│   ├── summercamp/page.tsx           # Summer Camp UI (form submit simulated; API exists)
│   ├── summercamp/layout.tsx         # Summer Camp metadata
│   ├── thank-you/page.tsx            # Post-form thank-you page
│   ├── error.tsx                     # Global error UI
│   ├── not-found.tsx                 # Redirects to homepage
│   ├── globals.css
│   ├── layout.tsx                    # Root layout - Proxe widget, Meta Pixel, Analytics
│   └── page.tsx                      # Homepage
├── components/
│   ├── AirplanePathModal.tsx         # Airplane training path modal
│   ├── Analytics.tsx                 # GA + Clarity scripts
│   ├── AssessmentForm.tsx            # 20-question PAT form
│   ├── BookingForm.tsx               # Demo booking form (2-step)
│   ├── ConditionalFooter.tsx         # Footer hidden on /demo, /assessment, /pricing, /open-house, /summercamp, /atc
│   ├── DGCASubjectsGrid.tsx          # DGCA subjects grid
│   ├── FloatingActionButtons.tsx     # Sticky CTAs - REMOVED from layout (Proxe conflict)
│   ├── Footer.tsx                    # Site footer
│   ├── HeroImageCarousel.tsx         # Hero image carousel
│   ├── ImageCarousel.tsx             # Facility image carousel
│   ├── Navbar.tsx                    # Navigation bar (with mobile close button)
│   ├── PathSelector.tsx              # Training path selector
│   ├── PilotJourneyTimeline.tsx      # Pilot journey timeline
│   ├── PricingFormModal.tsx          # Pricing gate modal
│   ├── TrackingProvider.tsx          # Global useTracking() wrapper
│   ├── VideoCarousel.tsx             # Vimeo video carousel
│   └── WhyChooseUsCarousel.tsx       # Key differentiators carousel
├── hooks/
│   └── useTracking.ts                # UTM + session tracking hook
├── lib/
│   ├── analytics.ts                  # GA event helpers
│   ├── sessionStorage.ts             # sessionStorage helpers
│   ├── sheets.ts                     # Google Sheets append (service account)
│   └── tracking.ts                   # UTM, tracking, form data helpers
├── public/
│   ├── atc/                          # ATC_Brochure_Final.pdf
│   ├── facility/                     # WC1–WC7.webp
│   ├── images/                       # Training images + country flags
│   ├── junior aviators/              # 001.webp–006.webp (Summer Camp)
│   ├── open house/                   # Open House event images & videos
│   ├── testimonials/
│   ├── favicon.ico
│   ├── WC HEro.webp
│   ├── Windchasers-Logo.png
│   └── Windhcasers Icon.png
├── next.config.js                    # Allows embedding from pilot.windchasers.in
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Technology Stack

### Core Dependencies
- **Next.js** ^14.2.3
- **React** ^18.3.1
- **Framer Motion** ^11.0.8
- **lucide-react** ^0.562.0
- **googleapis** ^171.4.0

### Dev Dependencies
- TypeScript ^5, Tailwind CSS ^3.4.3, PostCSS ^8.4.38, Autoprefixer ^10.4.19, ESLint ^8

---

## Pages & routes - index (last file change)

| Route / area | Source file | Last changed (commit date) | Commit | Short summary |
|--------------|-------------|-----------------------------|--------|----------------|
| `/` | `app/page.tsx` | 2026-04-13 | `2110ece` | Homepage refresh tied to ATC / Sheets work |
| `/dgca` | `app/dgca/page.tsx` | 2026-02-02 | `e9ac275` | UI updates + Proxe widget fix |
| `/helicopter` | `app/helicopter/page.tsx` | 2026-02-02 | `e9ac275` | UI updates + Proxe widget fix |
| `/international` | `app/international/page.tsx` | 2026-02-02 | `e9ac275` | UI updates + Proxe widget fix |
| `/demo` | `app/demo/page.tsx` | 2026-02-02 | `e9ac275` | UI updates + Proxe widget fix |
| `/assessment` | `app/assessment/page.tsx` | 2026-01-02 | `13b74a6` | Booking UX modal + H1 sizing |
| `/pricing` | `app/pricing/page.tsx` | 2026-01-07 | `47bfb3b` | UTM on pricing form + UI |
| `/atc` | `app/atc/page.tsx` | 2026-04-13 | `0b621e3` | ATC page + sheet tab naming |
| `/atc` (metadata) | `app/atc/layout.tsx` | 2026-04-13 | `9059450` | Dedicated `<title>` / description for ATC |
| `/thank-you` | `app/thank-you/page.tsx` | 2026-01-07 | `dfba7f7` | Assessment CTAs + 404 redirect behavior |
| `/open-house` | `app/open-house/page.tsx` | 2026-04-09 | `333fdd9` | Remove duplicate landing footer |
| `/summercamp` | `app/summercamp/page.tsx` | 2026-04-09 | `333fdd9` | Remove duplicate landing footer |
| `/summercamp` (metadata) | `app/summercamp/layout.tsx` | 2026-04-04 | `71bf39d` | Open House gallery / meta / summer camp images |
| Root shell | `app/layout.tsx` | 2026-04-04 | `c0d4211` | Summer camp–related layout pass |
| Global error UI | `app/error.tsx` | 2026-01-02 | `13b74a6` | Same H1 / booking UX wave |
| Not found | `app/not-found.tsx` | 2026-01-07 | `dfba7f7` | Redirect unknown URLs to `/` |

---

## Pages & Routes

### 1. Homepage (`/`)
**File:** `app/page.tsx` - **Last changed:** 2026-04-13 (`2110ece`)

- **Hero background:** Vimeo video `1160946921` - iframe loads with `autoplay=0` & `muted=0`; user can **play / pause / mute** via bottom-right controls; `postMessage` syncs volume with mute. Framed wide (`min-h-[150vh]`, `left-[70%]` on small screens) to bias toward cockpit.
- **Hero CTA:** "Choose Your Path" → smooth scroll to `#path-selection`
- **Trust bar:** 100+ Successful Pilots · DGCA Approved Curriculum · Top Tier Instructors
- **Path selection:** Split-screen (Airplane → `AirplanePathModal`, Helicopter → `/helicopter`)
- **Video Gallery:** `VideoCarousel` with **10** Vimeo student clips (IDs in code include `1150069889` … `1150072494`; not the hero ID)
- **Why WindChasers:** 6-card grid (Expert Guidance, Flexible Paths, Career Support, Advanced Simulators, Honest Pricing, Proven Track Record)
- **Facility Gallery:** `ImageCarousel` with WC1–WC7.webp
- **CTA section:** "Take Assessment" → `/assessment` | "Book Now" → `/demo`

### 2. DGCA Ground Classes (`/dgca`)
**File:** `app/dgca/page.tsx` - **Last changed:** 2026-02-02 (`e9ac275`)

- 6 DGCA subjects: Air Navigation, Air Regulations, Aviation Meteorology, Technical General, Technical Specific, RTR
- Exam format info + `DGCASubjectsGrid`
- CTA buttons: "Book a Demo" (`?source=dgca`) and "Take Assessment" - Book a Demo button added **below** subjects grid

### 3. Helicopter Pilot License (`/helicopter`)
**File:** `app/helicopter/page.tsx` - **Last changed:** 2026-02-02 (`e9ac275`)

- 3-step training path: Ground School → Flight Training → License Issuance
- Entry requirements + career opportunities (Offshore, Medical, VIP, Tourism, Agriculture, Utility)
- CTA: primary **Book a Demo Session** → `/demo` (no `?source=` on that link today; booking form still understands `?source=helicopter` from other entry points)

### 4. Pilot Training Abroad (`/international`)
**File:** `app/international/page.tsx` - **Last changed:** 2026-02-02 (`e9ac275`)

- Countries: USA, Canada, Hungary, New Zealand, Thailand, Australia (with flags)
- Prerequisites, what's included, country-specific duration + highlights
- CTA: "Book a Demo" (`?source=abroad`) + "Take Assessment"

### 5. Book Demo (`/demo`)
**File:** `app/demo/page.tsx` - **Last changed:** 2026-02-02 (`e9ac275`)

- Online vs campus visit comparison
- `BookingForm`: 2-step, session-prefill, date/time selection (Mon–Sat, 10 AM–5 PM hourly)
- Source params: `?source=dgca|helicopter|abroad`

### 6. Pilot Assessment Test (`/assessment`)
**File:** `app/assessment/page.tsx` - **Last changed:** 2026-01-02 (`13b74a6`) · metadata exported from same file

- 20-question aptitude test via `AssessmentForm`
- **Tier system:**
  - Premium: 140–150
  - Strong: 120–139
  - Moderate: 90–119
  - Needs Improvement: below 90
- Tier-specific headlines, subheads, and CTAs (all CTAs → "Book a Demo")
- Results submitted to `/api/assessment` with full UTM + session tracking payload

### 7. Pricing (`/pricing`)
**File:** `app/pricing/page.tsx` - **Last changed:** 2026-01-07 (`47bfb3b`)

- Gated by `PricingFormModal` (sessionStorage flag)
- Packages: DGCA (4 or 6 subjects) and helicopter pricing
- Query params: `?source=dgca|helicopter|abroad`, `?package=4|6`

### 8. ATC Training (`/atc`)
**File:** `app/atc/page.tsx` - **Last changed:** 2026-04-13 (`0b621e3`) · **Metadata:** `app/atc/layout.tsx` (`9059450`)

- **Hero:** Full-bleed `/facility/WC1.webp` with dark gradient overlay (no hero video on this page)
- **Program highlights:** Four pillar cards (Foundation; Language & Communication; Expert Instruction; Exam Readiness) with bullet lists and lucide icons
- **Eligibility:** Three cards (B.Sc Physics/Maths; B.E/B.Tech; Final-year students)
- **Fee:** Program fee **₹75,000** with CTA to the form
- **Lead form:** Name, Phone, Email, City, Qualification - **submits to `/api/leads`** with `source: "ATC"` → Google Sheets tab **`ATC`**, range **`A:H`** (same spreadsheet ID as other tabs, from `GOOGLE_SHEET_ID` or default in `lib/sheets.ts`). **Proxe webhook** backup from `/api/leads` on all lead payloads.
- **Inline success** on 200 response (no redirect)
- **Legacy / alternate:** `app/api/atc/route.ts` still appends to **`ATC`** and can Proxe-fallback; the **live** ATC page does **not** call this route today
- **Brochure:** `/public/atc/ATC_Brochure_Final.pdf`

### 9. Open House (`/open-house`)
**File:** `app/open-house/page.tsx` - **Last changed:** 2026-04-09 (`333fdd9`)

- **Event:** Pilot Career Open House - April 11, 2026 · Bangalore
- **Target audience:** Students (12th completed+) and Parents
- **SEO:** `next/head` sets title *Pilot Career Open House Bangalore · April 11, 2026 · WindChasers* (+ matching `og:title`)
- **Features:**
  - Hero includes background Vimeo `1160946921` (`autoplay=1`, `muted=1`, `background=1`)
  - Topics: 6-card grid - titles in code: *Step-by-step roadmap*, *Life after CPL*, *Career path after CPL*, *Cadet programme vs CPL*, *Money talk: what is the real cost?*, *Biggest mistakes student pilots make*
  - Past open houses gallery (videos + images)
  - Registration form with role selector (Student/Parent), validation, student-status rules
  - WhatsApp group links (students vs parents)
  - Sticky mobile CTA bar
- **Submission:** `POST /api/open-house` → **Google Sheets** tab **`Open House`** only (`A:H` row)
- **Images:** bundled imports from `/public/open house/` (see **Static Assets**)
- **Videos:** MP4s under `/public/open house/` (see **Static Assets**)

### 10. Thank You (`/thank-you`)
**File:** `app/thank-you/page.tsx` - **Last changed:** 2026-01-07 (`dfba7f7`)

- Types: `type=booking|assessment|pricing`
- Optional `data` payload for booking details or pricing access
- Score display + tier badge on assessment completion

### 11. Summer Camp (`/summercamp`)
**File:** `app/summercamp/page.tsx` - **Last changed:** 2026-04-09 (`333fdd9`) · **Metadata:** `app/summercamp/layout.tsx` (`71bf39d`)

- **Program:** Junior Aviators Summer Camp 2025
- **Target:** Kids aged 8-15
- **Duration:** 5 days (Mon–Fri, 10 AM – 5 PM)
- **5-Day Journey:** Drone → Simulator → Robotics/STEM → Aeromodelling/3D print → Aircraft visit; take-home kit/certificates/T-shirt/badge (as described on page)
- **Features:** Hero, 6 day cards (`/public/junior aviators/001.webp`–`006.webp`), registration UI, checklist, safety, FAQ, final CTA
- **Submission (current code):** Form handler **simulates** submit (`setTimeout` ~1.5s) and shows success - **does not** `fetch` `/api/summercamp`. The API route **`app/api/summercamp/route.ts`** still exists (Sheets + Proxe-style integration) for when the UI is wired.
- **Footer:** Site `Footer` hidden here via `ConditionalFooter` (same as `/atc`, `/open-house`, etc.)

### 12. Error & Not Found
- **`app/error.tsx`** - **Last changed:** 2026-01-02 (`13b74a6`) - global error UI with retry and home actions
- **`app/not-found.tsx`** - **Last changed:** 2026-01-07 (`dfba7f7`) - client redirect to `/` for unknown routes

---

## Components

### Navbar (`components/Navbar.tsx`)
- **Last changed:** 2026-04-13 (`2110ece`)
- Fixed nav, hamburger + full slide-in menu (with explicit **close** control)
- **Logo:** `/images/White transparent.png`
- **Compact header** (logo + call + WhatsApp only, no hamburger labels clutter) on: `/`, `/summercamp`, `/open-house`, `/atc` - full link row hidden on those routes per `pathname`
- **Menu links:** DGCA Ground Classes · Pilot Training Abroad · Helicopter Pilot Training · Take Pilot Assessment · Book a Demo Session
- **Home:** “Admissions Open” pulse + `tel:+919591004043` + WhatsApp preset text for general enquiries
- **ATC / summer camp / open house:** WhatsApp deep links use context-specific default messages

### ConditionalFooter (`components/ConditionalFooter.tsx`)
- **Last changed:** 2026-04-13 (`2110ece`)
- Omits `Footer` on: `/demo`, `/assessment`, `/pricing`, `/open-house`, `/summercamp`, `/atc`

### FloatingActionButtons (`components/FloatingActionButtons.tsx`)
- File exists but **not mounted in layout**
- Removed to prevent z-index conflict with Proxe chat widget

### Proxe Widget
- Loaded in `app/layout.tsx` via `<Script src="https://agent.windchasers.in/widget/embed.js" strategy="afterInteractive" />`
- Replaces floating CTA buttons as the primary engagement mechanism

### BookingForm (`components/BookingForm.tsx`)
- **Last changed:** 2026-02-02 (`e9ac275`)
- Source-aware prefill from URL params + sessionStorage
- Demo type: Online / Campus Visit
- Date/time: Mon–Sat, hourly slots 10 AM–5 PM
- Education level selection
- Submits to `/api/booking` with UTM + tracking payload

### AssessmentForm (`components/AssessmentForm.tsx`)
- **Last changed:** 2026-01-07 (`dfba7f7`)
- 20-question PAT
- Tiered scoring (Premium/Strong/Moderate/Needs Improvement)
- Submits to `/api/assessment`

### Analytics (`components/Analytics.tsx`)
- Google Analytics: `G-3WDV2V65F5`
- Microsoft Clarity: `uv11b4d3ex`
- Both loaded `afterInteractive`

### TrackingProvider + useTracking
- Stores UTM params (first touch), landing page, referrer, page views, time-on-page in sessionStorage
- Persists: name, email, phone, interest, education, assessment/booking completion flags

---

## API Routes

**Spreadsheet:** `appendToSheet` in `lib/sheets.ts` targets `GOOGLE_SHEET_ID` (default `1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk` if env unset). **Last touched there:** 2026-04-13 (`cb52876` logging).

**Proxe base:** `https://build.goproxe.com/webhook/...`

### Dual-write (Google Sheets + Proxe)

| HTTP route | Sheet tab (range) | Proxe webhook | Notes |
|------------|-------------------|---------------|--------|
| `POST /api/booking` | `Booking` `A:N` | `pilot-windchasers` (`type: "booking"`) | Requires name, phone, interest, demoType, preferredDate |
| `POST /api/assessment` | `Assessment` `A:L` | `pat-test` | PAT result + contact |
| `POST /api/pricing` | `Pricing` `A:J` | `pilot-windchasers` | After modal submit |
| `POST /api/summercamp` | `Summer Camp` `A:I` | `pilot-windchasers` (`type: "summer-camp"`) | **Server ready**; **UI on `/summercamp` does not call it yet** |

### Sheets only (no Proxe in handler)

| HTTP route | Sheet tab (range) | Notes |
|------------|-------------------|--------|
| `POST /api/open-house` | `Open House` `A:H` | Used by Open House page |

### `/api/leads` (router + backup webhook)

- **Sheets:** Chooses tab by `source` - `ATC` / `ATC Web Lead` → **`ATC` `A:H`**; `Open House` / `open-house` → **`Open House` `A:H`**; else default **`Leads` `A:J`** (requires name, email, phone on default branch).
- **Proxe:** Always posts `{ type: "lead", ... }` to **`pilot-windchasers`** as backup (even when Sheets succeeds).
- **Used by:** **`/atc` page** (source `"ATC"`).

### Legacy / unused by current UI

| HTTP route | Behavior |
|------------|----------|
| `POST /api/atc` | Same pattern as older ATC handler: **`ATC` tab** + Proxe fallback. **Not** called by `app/atc/page.tsx` (that uses `/api/leads`). |

### Handler source files - last `git` touch

| File | Last changed | Commit |
|------|----------------|--------|
| `app/api/booking/route.ts` | 2026-04-13 | `2110ece` |
| `app/api/assessment/route.ts` | 2026-04-13 | `2110ece` |
| `app/api/pricing/route.ts` | 2026-04-13 | `2110ece` |
| `app/api/open-house/route.ts` | 2026-04-13 | `2110ece` |
| `app/api/summercamp/route.ts` | 2026-04-13 | `2110ece` |
| `app/api/leads/route.ts` | 2026-04-13 | `0b621e3` |
| `app/api/atc/route.ts` | 2026-04-13 | `0b621e3` |

Client components send UTM/session fields where implemented (`BookingForm`, `AssessmentForm`, ATC lead, etc.). **`/api/open-house`** persists the JSON fields it receives; it does not duplicate the full tracking middleware picture.

**TODO:** Database integration, CRM, email automation, calendar slot management, admin dashboard; **wire `/summercamp` form to `POST /api/summercamp`**.

---

## Tracking & Session Storage

### UTM Params
- First-touch capture: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Stored in sessionStorage on landing

### Source Parameters (Booking Prefill)
- `?source=dgca` → "DGCA Ground Classes"
- `?source=helicopter` → "Helicopter License"
- `?source=abroad` → "Pilot Training Abroad"

### Assessment → Booking Bridge
- `?prefill=assessment&name=...&email=...` prefills booking form
- `?demoType=online|offline` preselects demo type

### Flags
- `pricingAccess` - sessionStorage, grants pricing page access
- Assessment/booking completion tracked per session

---

## Styling & Design

### Color Scheme
- **Gold:** `#C5A572` (primary accent)
- **Dark:** `#1A1A1A` (background)
- **Accent Dark:** `#0D0D0D` (secondary background)

### Tailwind Config Classes
- `bg-gold` / `text-gold` - primary accent color
- `bg-dark` - main background
- `bg-accent-dark` - secondary background

### Typography
- **Font:** Inter (Google Fonts), variable `--font-sans`

### Design System
- Mobile-first responsive
- Dark theme + gold accents
- Framer Motion animations (scroll-triggered, entrance)

---

## Metadata & SEO

| Page | Title |
|---|---|
| Default | Windchasers - India's Top Pilot Training Academy- Bangalore |
| Homepage | Same as default (set via `useEffect`) |
| ATC | Air Traffic Controller Training \| WindChasers Aviation Academy (`app/atc/layout.tsx`) |
| DGCA | DGCA Ground Classes \| WindChasers Aviation Academy |
| International | Pilot Training Abroad \| WindChasers Aviation Academy |
| Demo | Book Free Demo \| WindChasers Aviation Academy |
| Pricing | Pricing \| WindChasers Aviation Academy |
| Thank You | Thank You \| WindChasers Aviation Academy |
| Assessment | PAT - Pilot Aptitude Test \| WindChasers Aviation Academy |
| Open House | Pilot Career Open House Bangalore · April 11, 2026 · WindChasers |
| Summer Camp | Summer Camp 2025 \| WindChasers - Drone & Aviation Camp for Kids Bangalore |
| Helicopter | Inherits root `metadata.title` from `app/layout.tsx` (no page-level override) |

---

## Static Assets

### Images (`/public/images/`)
- Training: `PIlot Traingin  v1.webp`, `PIlot Traingin.webp`, `Helicopter Training.webp`, `Helicopter.webp`
- Logo: `White transparent.png`, `Windchasers-Logo.png`
- Hero: `WC HEro.webp`

### Facility (`/public/facility/`)
- `WC1.webp` through `WC7.webp`

### Country Flags (`/public/images/flags/`)
- Canada, USA, Hungary, New Zealand, Thailand, Australia

### Open House (`/public/open house/`)
- Images: `Open HOuse 1.jpg`, `Open Houe 2.jpg`, `Open Hosue 3.jpg`, `Open Hosue 4.jpg`, `WC November 2024.jpg`, `WC Open house April 15.jpg`, `WC Open house April 15 1.jpg`, `WC Open house April 15 2.jpg`
- Videos: `Open hosue 5.mp4`, `Open House May 4.mp4`

### Junior Aviators (`/public/junior aviators/`)
- `001.webp` through `006.webp` (Summer Camp day cards)

### ATC (`/public/atc/`)
- `ATC_Brochure_Final.pdf` (Downloadable brochure)

---

## Configuration

### `next.config.js`
- Allows iframe embedding from `pilot.windchasers.in`

### Build Scripts
```json
"dev": "next dev"
"build": "next build"
"start": "next start"
"lint": "next lint"
```

---

## Deployment

- Node.js (Next.js 14.2.3 compatible)
- Auto-deploy configured (Vercel or equivalent)
- Redeployment triggered via empty commits when needed

---

## Contact

- **Email:** aviators@windchasers.in
- **Phone:** +91 9591004043

---

## Implementation Status

### Completed
- All marketing routes with route-specific layout/behavior
- Responsive navigation (compact vs full), slide-in menu + close control
- Proxe chat widget integrated (replaced FloatingActionButtons)
- Homepage hero Vimeo with **manual play/pause/mute** controls (not autoplay-on-load)
- Booking form (session prefill + UTM tracking) → **Sheets `Booking` tab** + Proxe
- PAT assessment (tier system: Premium/Strong/Moderate/Needs Improvement) → **Sheets `Assessment`** + `pat-test` webhook
- Pricing page (form-gated access) → **Sheets `Pricing`** + Proxe
- UTM/session tracking on booking, assessment, pricing, ATC lead, and related APIs where fields are sent
- Google Analytics + Microsoft Clarity + Meta Pixel
- Image and video carousels (10 Vimeo gallery clips on home)
- DGCA page with Book a Demo below subjects grid
- 404 auto-redirect to homepage
- **Open House** - live `POST /api/open-house` → Sheets
- **ATC** - lead form `POST /api/leads` (`source: "ATC"`) → Sheets **`ATC`** + Proxe backup
- **ConditionalFooter** hides global footer on `/demo`, `/assessment`, `/pricing`, `/open-house`, `/summercamp`, `/atc`

### TODO
- Database integration (bookings, pricing, assessments)
- Proxe CRM API integration (deeper than webhooks)
- Email automation (confirmations, results)
- Calendar slot management
- Admin dashboard
- Testimonials section
- **Connect `/summercamp` registration UI to `POST /api/summercamp`** (server handler already writes Sheets + Proxe)
