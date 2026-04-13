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
**Chat Widget:** Proxe — loaded via `https://agent.windchasers.in/widget/embed.js`

---

## Build Structure

### Directory Structure

```
windchasers/
├── app/
│   ├── api/
│   │   ├── assessment/route.ts       # Assessment submission → Proxe webhook
│   │   ├── booking/route.ts          # Demo booking submission → Proxe webhook
│   │   ├── leads/route.ts            # Lead capture → Proxe webhook
│   │   ├── atc/route.ts              # ATC Training leads → Google Sheets
│   │   ├── open-house/route.ts       # Open House registration → Google Sheets
│   │   ├── pricing/route.ts          # Pricing inquiry → Proxe webhook
│   │   └── summercamp/route.ts       # Summer Camp registration → Proxe + Google Sheets
│   ├── assessment/page.tsx           # Pilot Aptitude Test (PAT)
│   ├── atc/page.tsx                  # ATC Training Program page
│   ├── demo/page.tsx                 # Book Demo page
│   ├── dgca/page.tsx                 # DGCA Ground Classes page
│   ├── helicopter/page.tsx           # Helicopter Pilot License page
│   ├── international/page.tsx        # Pilot training abroad page
│   ├── open-house/page.tsx           # Open House event registration (April 11, 2026)
│   ├── pricing/page.tsx              # Pricing page (form-gated)
│   ├── summercamp/page.tsx           # Summer Camp 2025 (Junior Aviators)
│   ├── summercamp/layout.tsx         # Summer Camp metadata
│   ├── thank-you/page.tsx            # Post-form thank-you page
│   ├── error.tsx                     # Global error UI
│   ├── not-found.tsx                 # Redirects to homepage
│   ├── globals.css
│   ├── layout.tsx                    # Root layout — Proxe widget, Meta Pixel, Analytics
│   └── page.tsx                      # Homepage
├── components/
│   ├── AirplanePathModal.tsx         # Airplane training path modal
│   ├── Analytics.tsx                 # GA + Clarity scripts
│   ├── AssessmentForm.tsx            # 20-question PAT form
│   ├── BookingForm.tsx               # Demo booking form (2-step)
│   ├── ConditionalFooter.tsx         # Footer hidden on /demo, /assessment, /thank-you
│   ├── DGCASubjectsGrid.tsx          # DGCA subjects grid
│   ├── FloatingActionButtons.tsx     # Sticky CTAs — REMOVED from layout (Proxe conflict)
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

## Pages & Routes

### 1. Homepage (`/`)
**File:** `app/page.tsx`

- **Hero background:** Vimeo video `1160946921` (autoplay, muted, no controls) — shifted right on mobile (`left-[70%]`) to frame cockpit
- **Hero CTA:** "Choose Your Path" → smooth scroll to `#path-selection`
- **Trust bar:** 100+ Successful Pilots · DGCA Approved Curriculum · Top Tier Instructors
- **Path selection:** Split-screen (Airplane → `AirplanePathModal`, Helicopter → `/helicopter`)
- **Video Gallery:** `VideoCarousel` with 10 Vimeo embeds (student journey clips)
- **Why WindChasers:** 6-card grid (Expert Guidance, Flexible Paths, Career Support, Advanced Simulators, Honest Pricing, Proven Track Record)
- **Facility Gallery:** `ImageCarousel` with WC1–WC7.webp
- **CTA section:** "Take Assessment" → `/assessment` | "Book Now" → `/demo`

### 2. DGCA Ground Classes (`/dgca`)
**File:** `app/dgca/page.tsx`

- 6 DGCA subjects: Air Navigation, Air Regulations, Aviation Meteorology, Technical General, Technical Specific, RTR
- Exam format info + `DGCASubjectsGrid`
- CTA buttons: "Book a Demo" (`?source=dgca`) and "Take Assessment" — Book a Demo button added **below** subjects grid

### 3. Helicopter Pilot License (`/helicopter`)
**File:** `app/helicopter/page.tsx`

- 3-step training path: Ground School → Flight Training → License Issuance
- Entry requirements + career opportunities (Offshore, Medical, VIP, Tourism, Agriculture, Utility)
- CTA: "Take Assessment" (`?from=helicopter`)

### 4. Pilot Training Abroad (`/international`)
**File:** `app/international/page.tsx`

- Countries: USA, Canada, Hungary, New Zealand, Thailand, Australia (with flags)
- Prerequisites, what's included, country-specific duration + highlights
- CTA: "Book a Demo" (`?source=abroad`) + "Take Assessment"

### 5. Book Demo (`/demo`)
**File:** `app/demo/page.tsx`

- Online vs campus visit comparison
- `BookingForm`: 2-step, session-prefill, date/time selection (Mon–Sat, 10 AM–5 PM hourly)
- Source params: `?source=dgca|helicopter|abroad`

### 6. Pilot Assessment Test (`/assessment`)
**File:** `app/assessment/page.tsx`

- 20-question aptitude test via `AssessmentForm`
- **Tier system:**
  - Premium: 140–150
  - Strong: 120–139
  - Moderate: 90–119
  - Needs Improvement: below 90
- Tier-specific headlines, subheads, and CTAs (all CTAs → "Book a Demo")
- Results submitted to `/api/assessment` with full UTM + session tracking payload

### 7. Pricing (`/pricing`)
**File:** `app/pricing/page.tsx`

- Gated by `PricingFormModal` (sessionStorage flag)
- Packages: DGCA (4 or 6 subjects) and helicopter pricing
- Query params: `?source=dgca|helicopter|abroad`, `?package=4|6`

### 8. ATC Training (`/atc`)
**File:** `app/atc/page.tsx`

- **Hero:** Dark background (no video), left-aligned content with ATC tower placeholder image
- **Program Highlights:** 12 cards (4-col desktop, 2-col mobile) with lucide-react icons
- **Eligibility:** 3 gold-bordered cards (B.Sc Physics/Maths, B.E/B.Tech, Final-year students)
- **Fee Section:** INR 75,000 with CTA to form
- **Lead Form:** Name, Phone, Email, City, Qualification select
  - Submit to `/api/atc` → Google Sheets
  - Inline confirmation on success (no redirect)
- **API:** `app/api/atc/route.ts` → Google Sheets (Sheet ID: `1J5cwsCuKI2XnIlUAbmqrl0uIm2fG_wenYx1xnZdQdgk`, Tab: `ATC`)
- **Brochure:** `/public/atc/ATC_Brochure_Final.pdf`

### 10. Thank You (`/thank-you`)
**File:** `app/thank-you/page.tsx`

- Types: `type=booking|assessment|pricing`
- Optional `data` payload for booking details or pricing access
- Score display + tier badge on assessment completion

### 9. Open House (`/open-house`)
**File:** `app/open-house/page.tsx`

- **Event:** Pilot Career Open House — April 11, 2026 · Bangalore
- **Target audience:** Students (12th completed+) and Parents
- **Features:**
  - Glass morphism hero with event details
  - Topics covered (6-card grid): CPL roadmap, Life after CPL, Career paths, Cadet vs CPL, Cost breakdown, Common mistakes
  - Past open houses gallery (videos + images)
  - Registration form with role selector (Student/Parent)
  - Form validation with student status filtering (redirects if Below 12th)
  - WhatsApp group links (separate for students & parents)
  - Sticky mobile CTA bar
- **Submission:** `/api/open-house` → Google Sheets
- **Images:** 6 photos from `/public/open house/`
- **Videos:** 2 MP4s from `/public/open house/`

### 11. Summer Camp (`/summercamp`)
**File:** `app/summercamp/page.tsx`

- **Program:** Junior Aviators Summer Camp 2025
- **Target:** Kids aged 8-15
- **Duration:** 5 days (Mon–Fri, 10 AM – 5 PM)
- **5-Day Journey:**
  - Day 1: Drone Mastery (real outdoor flying)
  - Day 2: Flight Simulator Training
  - Day 3: Robotics & Aerospace STEM
  - Day 4: Aeromodelling & 3D Printing
  - Day 5: Aircraft Visit (real cockpit exploration)
  - Take Home: STEM Kit, 2 Certificates, T-shirt, Badge
- **Features:**
  - Hero with event details bar
  - 6 day cards with images
  - Registration form with batch selection (April 6-10 / April 20-24)
  - Camp includes checklist (9 items)
  - Safety & Supervision section
  - FAQ accordion (5 items)
  - Final CTA section
- **Submission:** `/api/summercamp` → Google Sheets + Proxe webhook
- **Images:** 6 photos from `/public/junior aviators/001.webp` to `006.webp`

### 12. Error & Not Found
- `app/error.tsx` — global error UI with retry and home actions
- `app/not-found.tsx` — auto-redirects to homepage

---

## Components

### Navbar (`components/Navbar.tsx`)
- Fixed nav, hamburger menu (mobile + desktop)
- Slide-in menu panel with **close button** (added)
- Links: DGCA Ground · Fly Abroad · Helicopter · Take Assessment · Book a Demo

### FloatingActionButtons (`components/FloatingActionButtons.tsx`)
- File exists but **not mounted in layout**
- Removed to prevent z-index conflict with Proxe chat widget

### Proxe Widget
- Loaded in `app/layout.tsx` via `<Script src="https://agent.windchasers.in/widget/embed.js" strategy="afterInteractive" />`
- Replaces floating CTA buttons as the primary engagement mechanism

### BookingForm (`components/BookingForm.tsx`)
- Source-aware prefill from URL params + sessionStorage
- Demo type: Online / Campus Visit
- Date/time: Mon–Sat, hourly slots 10 AM–5 PM
- Education level selection
- Submits to `/api/booking` with UTM + tracking payload

### AssessmentForm (`components/AssessmentForm.tsx`)
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

### Proxe Webhooks
All routes send to Proxe webhooks at `https://build.goproxe.com/webhook/...`

| Route | Webhook | Required Fields |
|---|---|---|
| `/api/booking` | `pilot-windchasers` | name, phone, interest, demoType, preferredDate |
| `/api/assessment` | `pat-test` | firstName, lastName, email, phone, scores, tier |
| `/api/leads` | `pilot-windchasers` | name, email, phone |
| `/api/pricing` | `pilot-windchasers` | name, phone, startTimeline |

### Google Sheets Integration
| Route | Destination | Purpose |
|---|---|---|
| `/api/atc` | Google Sheets | ATC Training leads |
| `/api/open-house` | Google Sheets | Open House registrations |
| `/api/summercamp` | Google Sheets + Proxe | Summer Camp registrations |

All routes include UTM params, landing page, referrer, sessionId, pageViews, formSubmissions.

**TODO:** Database integration, CRM, email automation, calendar slot management, admin dashboard.

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
- `pricingAccess` — sessionStorage, grants pricing page access
- Assessment/booking completion tracked per session

---

## Styling & Design

### Color Scheme
- **Gold:** `#C5A572` (primary accent)
- **Dark:** `#1A1A1A` (background)
- **Accent Dark:** `#0D0D0D` (secondary background)

### Tailwind Config Classes
- `bg-gold` / `text-gold` — primary accent color
- `bg-dark` — main background
- `bg-accent-dark` — secondary background

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
| ATC | ATC Training Program Bangalore \| WindChasers Aviation Academy |
| DGCA | DGCA Ground Classes \| WindChasers Aviation Academy |
| International | Pilot Training Abroad \| WindChasers Aviation Academy |
| Demo | Book Free Demo \| WindChasers Aviation Academy |
| Pricing | Pricing \| WindChasers Aviation Academy |
| Thank You | Thank You \| WindChasers Aviation Academy |
| Assessment | PAT - Pilot Aptitude Test \| WindChasers Aviation Academy |
| Open House | Pilot Career Open House Bangalore · April 11, 2026 · WindChasers |
| Summer Camp | Summer Camp 2025 \| WindChasers - Drone & Aviation Camp for Kids Bangalore |
| Helicopter | Uses default title |

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
- All pages with route-specific behavior
- Responsive navigation with mobile close button
- Proxe chat widget integrated (replaced FloatingActionButtons)
- Vimeo hero video background
- Booking form (session prefill + UTM tracking)
- PAT assessment (new tier system: Premium/Strong/Moderate/Needs Improvement)
- Pricing page (form-gated access)
- Full UTM/session tracking on all form submissions
- Google Analytics + Microsoft Clarity + Meta Pixel
- Image and video carousels (10 Vimeo clips)
- DGCA page with Book a Demo below subjects grid
- 404 auto-redirect to homepage
- **Open House page** — Event registration with Google Sheets integration
- **Summer Camp page** — Kids aviation camp with registration
- **ATC Training page** — ATC program with lead form and Google Sheets integration

### TODO
- Database integration (bookings, pricing, assessments)
- PROXe CRM API integration
- Email automation (confirmations, results)
- Calendar slot management
- Admin dashboard
- Testimonials section
