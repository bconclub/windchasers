# WindChasers Aviation Academy - Complete Build Documentation

## Project Overview

**Project Name:** WindChasers Aviation Academy  
**Version:** 0.1.0  
**Framework:** Next.js 14.2.3 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS 3.4.3  
**Animation:** Framer Motion 11.0.8  
**Icons:** lucide-react 0.562.0  
**Analytics:** Google Analytics, Microsoft Clarity, Meta Pixel

## Build Structure

### Directory Structure

```
Windchasers/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── assessment/
│   │   │   └── route.ts         # Assessment submission endpoint
│   │   ├── booking/
│   │   │   └── route.ts         # Demo booking endpoint
│   │   ├── leads/
│   │   │   └── route.ts         # Lead submission endpoint
│   │   └── pricing/
│   │       └── route.ts         # Pricing inquiry endpoint
│   ├── assessment/
│   │   └── page.tsx             # Pilot Aptitude Test page
│   ├── demo/
│   │   └── page.tsx             # Book Demo page
│   ├── dgca/
│   │   └── page.tsx             # DGCA Ground Classes page
│   ├── error.tsx                 # Global error UI
│   ├── helicopter/
│   │   └── page.tsx             # Helicopter Pilot License page
│   ├── international/
│   │   └── page.tsx             # Pilot training abroad page
│   ├── not-found.tsx             # Not-found handler (redirects to home)
│   ├── pricing/
│   │   └── page.tsx             # Pricing page (gated)
│   ├── thank-you/
│   │   └── page.tsx             # Thank-you page for forms
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Homepage
├── components/                    # React components
│   ├── AirplanePathModal.tsx     # Modal for airplane training paths
│   ├── Analytics.tsx             # Google Analytics & Microsoft Clarity
│   ├── AssessmentForm.tsx        # Pilot aptitude test form
│   ├── BookingForm.tsx           # Demo booking form
│   ├── ConditionalFooter.tsx     # Footer wrapper for route conditions
│   ├── DGCASubjectsGrid.tsx      # DGCA subjects grid
│   ├── FloatingActionButtons.tsx # Sticky CTA buttons
│   ├── Footer.tsx                # Site footer
│   ├── HeroImageCarousel.tsx     # Hero image carousel
│   ├── ImageCarousel.tsx         # Image carousel component
│   ├── Navbar.tsx                # Navigation bar
│   ├── PathSelector.tsx          # Training path selector
│   ├── PilotJourneyTimeline.tsx  # Pilot journey timeline
│   ├── PricingFormModal.tsx      # Pricing access form modal
│   ├── TrackingProvider.tsx      # Global tracking hook wrapper
│   ├── VideoCarousel.tsx         # Video carousel component
│   └── WhyChooseUsCarousel.tsx   # Carousel for key differentiators
├── hooks/
│   └── useTracking.ts            # Page view and UTM tracking hook
├── lib/
│   ├── analytics.ts              # Google Analytics event helpers
│   ├── sessionStorage.ts         # Session storage helpers
│   └── tracking.ts               # Tracking, UTM, and form data helpers
├── public/                        # Static assets
│   ├── facility/                 # Facility images (WC1-7.webp)
│   ├── images/                   # Image assets and flags
│   ├── testimonials/             # Testimonial assets
│   ├── favicon.ico               # Site favicon
│   ├── WC HEro.webp              # Hero image
│   ├── Windchasers-Logo.png      # Brand logo
│   └── Windhcasers Icon.png      # Brand icon
├── next.config.js                 # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## Technology Stack

### Core Dependencies
- **Next.js:** ^14.2.3 - React framework with App Router
- **React:** ^18.3.1 - UI library
- **React DOM:** ^18.3.1 - React DOM renderer
- **Framer Motion:** ^11.0.8 - Animation library
- **lucide-react:** ^0.562.0 - Icon library

### Development Dependencies
- **TypeScript:** ^5 - Type safety
- **Tailwind CSS:** ^3.4.3 - Utility-first CSS framework
- **PostCSS:** ^8.4.38 - CSS processing
- **Autoprefixer:** ^10.4.19 - CSS vendor prefixing
- **ESLint:** ^8 - Code linting
- **ESLint Config Next:** 14.2.3 - Next.js ESLint configuration
- **@types/node:** ^20 - Node.js typings
- **@types/react:** ^18 - React typings
- **@types/react-dom:** ^18 - React DOM typings

## Pages & Routes

### 1. Homepage (`/`)
- **File:** `app/page.tsx`
- **Title:** "Windchasers - India's Top Pilot Training Academy- Bangalore"
- **Features:**
  - Hero section with YouTube video background
  - Trust bar (100+ Successful Pilots, DGCA Approved Curriculum, Top Tier Instructors)
  - Path selection (Airplane modal, Helicopter link)
  - Video carousel (Vimeo embeds)
  - Why WindChasers grid
  - Image carousel (facility images)
  - CTA section with "Take Assessment" and "Book Now"

### 2. DGCA Ground Classes (`/dgca`)
- **File:** `app/dgca/page.tsx`
- **Title:** "DGCA Ground Classes | WindChasers Aviation Academy"
- **Content:**
  - Course structure (6 subjects: Air Navigation, Air Regulations, Aviation Meteorology, Technical General, Technical Specific, RTR)
  - Exam format information
  - CTA buttons: "Book a Demo" (source=dgca), "Take Assessment"

### 3. Helicopter Pilot License (`/helicopter`)
- **File:** `app/helicopter/page.tsx`
- **Title:** Uses root layout title (no page-specific override)
- **Content:**
  - Training path (3 steps: Ground School, Flight Training, License Issuance)
  - Entry requirements
  - Career opportunities (Offshore Operations, Medical Evacuation, VIP Transport, Tourism, Agriculture, Utility Services)
  - CTA: "Take Assessment" (from=helicopter)

### 4. Pilot Training Abroad (`/international`)
- **File:** `app/international/page.tsx`
- **Title:** "Pilot Training Abroad | WindChasers Aviation Academy"
- **Content:**
  - Prerequisites section
  - Country selection (USA, Canada, Hungary, New Zealand, Thailand, Australia)
  - Country-specific information (duration, highlights, flag images)
  - What's included section
  - CTA buttons: "Book a Demo" (source=abroad), "Take Assessment"

### 5. Book Demo (`/demo`)
- **File:** `app/demo/page.tsx`
- **Title:** "Book Free Demo | WindChasers Aviation Academy"
- **Content:**
  - Online demo vs campus visit comparison
  - Two-step booking form with validation and session prefill
  - Source parameters: `?source=dgca`, `?source=helicopter`, `?source=abroad`

### 6. Pilot Assessment Test (`/assessment`)
- **File:** `app/assessment/page.tsx`
- **Title:** "PAT - Pilot Aptitude Test | WindChasers Aviation Academy"
- **Content:**
  - 20-question pilot aptitude test
  - Instant results with tiered readiness scoring
  - Personalized guidance based on score

### 7. Pricing (`/pricing`)
- **File:** `app/pricing/page.tsx`
- **Title:** "Pricing | WindChasers Aviation Academy"
- **Content:**
  - Pricing access gated by `PricingFormModal`
  - Package views for DGCA (4 or 6 subjects) and helicopter pricing
  - Query params: `?source=dgca|helicopter|abroad`, `?package=4|6`

### 8. Thank You (`/thank-you`)
- **File:** `app/thank-you/page.tsx`
- **Title:** "Thank You | WindChasers Aviation Academy"
- **Content:**
  - Supports `type=booking|assessment|pricing`
  - Optional `data` payload for booking details or pricing access

### 9. Error and Not Found
- **Files:** `app/error.tsx`, `app/not-found.tsx`
- **Behavior:**
  - Global error UI with retry and home actions
  - Not-found redirects users to homepage

## Components

### 1. Analytics (`components/Analytics.tsx`)
- **Purpose:** Tracking and analytics
- **Integrations:**
  - Google Analytics (G-3WDV2V65F5)
  - Microsoft Clarity (uv11b4d3ex)
- **Strategy:** `afterInteractive` for optimal performance

### 2. TrackingProvider (`components/TrackingProvider.tsx`)
- **Purpose:** Mounts `useTracking()` globally
- **Behavior:** Stores UTM params, landing page, referrer, and page view timing in sessionStorage

### 3. Navbar (`components/Navbar.tsx`)
- **Features:**
  - Fixed navigation bar
  - Hamburger menu (mobile/desktop)
  - Slide-in menu panel
  - Links: DGCA Ground, Fly Abroad, Helicopter, Take Assessment, Book a Demo

### 4. Footer (`components/Footer.tsx`)
- **Sections:**
  - Company info
  - Training paths links
  - Resources (Aptitude Test)
  - Contact information (email, phone)

### 5. BookingForm (`components/BookingForm.tsx`)
- **Features:**
  - Source-aware pre-filling (URL parameters and session storage)
  - Demo type selection (Online/Campus Visit)
  - Date/time selection (Monday-Saturday, hourly slots 10 AM - 5 PM)
  - Education level selection
  - Form validation with two-step flow
  - Submission to `/api/booking` with UTM and tracking payloads

### 6. AssessmentForm (`components/AssessmentForm.tsx`)
- **Features:**
  - 20-question pilot aptitude test
  - Readiness scoring (Excellent, Good, Fair, Needs Improvement)
  - Submission to `/api/assessment`

### 7. PricingFormModal (`components/PricingFormModal.tsx`)
- **Purpose:** Collects lead data and grants pricing access
- **Storage:** Session storage flag for gated access

### 8. FloatingActionButtons (`components/FloatingActionButtons.tsx`)
- **Purpose:** Sticky CTAs for "Take Assessment" and "Book a Demo"
- **Behavior:** Hides on /assessment, /demo, /thank-you and after completion

### 9. Media Components
- **VideoCarousel:** Training videos
- **ImageCarousel:** Facility images
- **HeroImageCarousel / WhyChooseUsCarousel / PilotJourneyTimeline:** Home-page visual sections

## API Routes

### 1. Booking API (`/api/booking`)
- **Method:** POST
- **Purpose:** Handle demo booking submissions
- **Required Fields:** name, phone, interest, demoType, preferredDate
- **Optional Fields:** email, city, parentGuardianName, education, preferredTime, source
- **Tracking Fields:** UTM params, landing page, referrer, session/page views
- **Status:** Sends to webhook (`https://build.goproxe.com/webhook/pilot-windchasers`)
- **TODO:** Database, CRM, emails, calendar availability

### 2. Assessment API (`/api/assessment`)
- **Method:** POST
- **Purpose:** Handle assessment submissions
- **Required Fields:** firstName, lastName, email, phone, scores, tier
- **Data:** answers, readiness breakdown, source, tracking and UTM params
- **Status:** Sends to webhook (`https://build.goproxe.com/webhook/pat-test`)
- **TODO:** Database, CRM, email automation

### 3. Leads API (`/api/leads`)
- **Method:** POST
- **Purpose:** Handle lead submissions
- **Required Fields:** name, email, phone
- **Status:** Sends to webhook (`https://build.goproxe.com/webhook/pilot-windchasers`)
- **TODO:** PROXe CRM API integration

### 4. Pricing API (`/api/pricing`)
- **Method:** POST
- **Purpose:** Capture pricing inquiries and tracking data
- **Required Fields:** name, phone, startTimeline
- **Optional Fields:** email, interest, source, tracking and UTM params
- **Status:** Sends to webhook (`https://build.goproxe.com/webhook/pilot-windchasers`)
- **TODO:** Database, CRM, email confirmation

## Styling & Design

### Color Scheme
- **Gold:** #C5A572 (Primary accent color)
- **Dark:** #1A1A1A (Background)
- **Accent Dark:** #0D0D0D (Secondary background)

### Typography
- **Font:** Inter (Google Fonts)
- **Font Variable:** `--font-sans`

### Design System
- Responsive design (mobile-first)
- Dark theme with gold accents
- Smooth animations (Framer Motion)
- Modern UI with gradients and borders

## Metadata & SEO

### Root Layout Metadata
- **Default Title:** "Windchasers - India's Top Pilot Training Academy- Bangalore"
- **Description:** "DGCA approved pilot training with real cost transparency. Ex-Air Force instructors. No false promises."
- **Favicon:** `/favicon.ico` (with fallback to `/Windhcasers Icon.png`)

### Page-Specific Titles
- Homepage: "Windchasers - India's Top Pilot Training Academy- Bangalore"
- DGCA: "DGCA Ground Classes | WindChasers Aviation Academy"
- International: "Pilot Training Abroad | WindChasers Aviation Academy"
- Demo: "Book Free Demo | WindChasers Aviation Academy"
- Pricing: "Pricing | WindChasers Aviation Academy"
- Thank You: "Thank You | WindChasers Aviation Academy"
- Assessment: "PAT - Pilot Aptitude Test | WindChasers Aviation Academy"
- Helicopter: Uses default title (no override)

## User Journey & Source Tracking

### Booking Form Source Parameters
The booking form automatically pre-fills based on the source parameter:
- `?source=dgca` → Pre-fills "DGCA Ground Classes"
- `?source=helicopter` → Pre-fills "Helicopter License"
- `?source=abroad` → Pre-fills "Pilot Training Abroad"

### Assessment Prefill Parameters
- `?prefill=assessment` with `name` and `email` to prefill booking form
- `?demoType=online|offline` to preselect the demo type

### Tracking and Session Storage
- Stores UTM params (first touch), landing page, and referrer
- Tracks page views and time-on-page
- Persists user data (name, email, phone, interest, education)
- Flags completed assessment/booking and pricing access

### Button Text Standardization
- **Demo/Booking buttons:** "Book a Demo"
- **Assessment buttons:** "Take Assessment"

## Static Assets

### Images
- **Facility Images:** WC1.webp through WC7.webp
- **Training Images:** Helicopter Training.webp, Helicopter.webp, PIlot Traingin  v1.webp, PIlot Traingin.webp
- **Hero Image:** WC HEro.webp
- **Logo:** White transparent.png, Windchasers-Logo.png
- **Icons:** favicon.ico, Windhcasers Icon.png

### Country Flags
- Canada: `/images/canada-flag-png-large.png`
- USA: `/images/flags/united-states-of-america-flag-png-large.png`
- Hungary: `/images/flags/hungary-flag-png-large.png`
- New Zealand: `/images/flags/new-zealand-flag-png-large.png`
- Thailand: `/images/flags/thailand-flag-png-large.png`
- Australia: `/images/flags/flag-jpg-xl-9-2048x1024.jpg`

## Build Scripts

```json
{
  "dev": "next dev",        // Development server
  "build": "next build",    // Production build
  "start": "next start",    // Start production server
  "lint": "next lint"       // Run ESLint
}
```

## Current Implementation Status

### ✅ Completed Features
- All pages implemented with route-specific behavior
- Responsive navigation, conditional footer, and floating CTAs
- Booking form with session-based prefill and tracking
- Assessment form with scoring and tiered results
- Pricing page with gated access and inquiry capture
- Analytics integration (Google Analytics + Microsoft Clarity + Meta Pixel)
- Image and video carousels
- Country selection for international training
- Form validation and error handling
- Favicon configuration

### 🔄 TODO / Pending Features
- Database integration for bookings, pricing, and assessments
- PROXe CRM integration
- Email automation (confirmations, results)
- Calendar system for slot management
- Admin dashboard
- Testimonials section population
- Content management system

## Deployment

### Environment Requirements
- Node.js (version compatible with Next.js 14.2.3)
- npm or yarn package manager

### Build Process
1. Install dependencies: `npm install`
2. Development: `npm run dev`
3. Production build: `npm run build`
4. Start production: `npm start`

### Configuration Files
- `next.config.js` - Next.js configuration (currently default)
- `tailwind.config.ts` - Tailwind CSS theme and colors
- `tsconfig.json` - TypeScript compiler options
- `postcss.config.js` - PostCSS processing

## Contact Information

- **Email:** aviators@windchasers.in
- **Phone:** +91 9591004043

## Last Updated

This documentation reflects the current state of the WindChasers Aviation Academy website as of the latest build. All features, routes, and components are documented based on the actual implementation in the codebase.

