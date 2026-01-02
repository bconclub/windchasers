# WindChasers Aviation Academy - Complete Build Documentation

## Project Overview

**Project Name:** WindChasers Aviation Academy  
**Version:** 0.1.0  
**Framework:** Next.js 14.2.3 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS 3.4.3  
**Animation:** Framer Motion 11.0.8

## Build Structure

### Directory Structure

```
Windchasers/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── assessment/
│   │   │   └── route.ts         # Assessment form submission endpoint
│   │   ├── booking/
│   │   │   └── route.ts         # Demo booking form endpoint
│   │   └── leads/
│   │       └── route.ts         # Leads submission endpoint
│   ├── assessment/
│   │   └── page.tsx             # Pilot Aptitude Test page
│   ├── demo/
│   │   └── page.tsx             # Book Demo page
│   ├── dgca/
│   │   └── page.tsx             # DGCA Ground Classes page
│   ├── helicopter/
│   │   └── page.tsx             # Helicopter Pilot License page
│   ├── international/
│   │   └── page.tsx             # Fly Abroad / International Training page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Homepage
├── components/                    # React components
│   ├── AirplanePathModal.tsx     # Modal for airplane training paths
│   ├── Analytics.tsx             # Google Analytics & Microsoft Clarity
│   ├── AssessmentForm.tsx        # Pilot aptitude test form
│   ├── BookingForm.tsx           # Demo booking form
│   ├── Footer.tsx                # Site footer
│   ├── ImageCarousel.tsx         # Image carousel component
│   ├── Navbar.tsx                # Navigation bar
│   ├── PathSelector.tsx          # Training path selector
│   └── VideoCarousel.tsx         # Video carousel component
├── public/                        # Static assets
│   ├── facility/                 # Facility images (WC1-7.webp)
│   ├── images/                   # Image assets
│   │   ├── flags/                # Country flag images
│   │   └── [various images]     # Training images, logos
│   ├── testimonials/             # Testimonial assets
│   ├── favicon.ico               # Site favicon
│   ├── WC HEro.webp              # Hero image
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

### Development Dependencies
- **TypeScript:** ^5 - Type safety
- **Tailwind CSS:** ^3.4.3 - Utility-first CSS framework
- **PostCSS:** ^8.4.38 - CSS processing
- **Autoprefixer:** ^10.4.19 - CSS vendor prefixing
- **ESLint:** ^8 - Code linting
- **ESLint Config Next:** 14.2.3 - Next.js ESLint configuration

## Pages & Routes

### 1. Homepage (`/`)
- **File:** `app/page.tsx`
- **Title:** "WindChasers Aviation Academy | Honest Pilot Training"
- **Features:**
  - Hero section with YouTube video background
  - Trust bar (100+ Successful Pilots, DGCA Approved Curriculum, Top Tier Instructors)
  - Path selection (Airplane/Helicopter split screen)
  - Video carousel
  - Image carousel (facility images)
  - CTA section with "Book a Demo" button

### 2. DGCA Ground Classes (`/dgca`)
- **File:** `app/dgca/page.tsx`
- **Title:** "DGCA Ground Classes | WindChasers Aviation Academy"
- **Content:**
  - Course structure (6 subjects: Air Navigation, Air Regulations, Aviation Meteorology, Technical General, Technical Specific, RTR)
  - Exam format information
  - CTA buttons: "Book a Demo" (with source=dgca), "Take Assessment"

### 3. Helicopter Pilot License (`/helicopter`)
- **File:** `app/helicopter/page.tsx`
- **Title:** "Helicopter Pilot License | WindChasers Aviation Academy"
- **Content:**
  - Training path (3 steps: Ground School, Flight Training, License Issuance)
  - Entry requirements
  - Career opportunities (Offshore Operations, Medical Evacuation, VIP Transport, Tourism, Agriculture, Utility Services)
  - CTA buttons: "Book a Demo" (with source=helicopter), "Take Assessment"

### 4. Fly Abroad / International (`/international`)
- **File:** `app/international/page.tsx`
- **Title:** "Fly Abroad | WindChasers Aviation Academy"
- **Content:**
  - Prerequisites section
  - Country selection (USA, Canada, Hungary, New Zealand, Thailand, Australia)
  - Country-specific information (duration, highlights, flag images)
  - What's included section
  - CTA buttons: "Book a Demo" (with source=abroad), "Take Assessment"

### 5. Book Demo (`/demo`)
- **File:** `app/demo/page.tsx`
- **Title:** "Book Free Demo | WindChasers Aviation Academy"
- **Content:**
  - Online Demo vs Campus Visit comparison
  - Booking form (pre-filled based on source parameter)
  - Source parameters: `?source=dgca`, `?source=helicopter`, `?source=abroad`

### 6. Pilot Assessment Test (`/assessment`)
- **File:** `app/assessment/page.tsx`
- **Title:** "Pilot Aptitude Test | WindChasers Aviation Academy"
- **Content:**
  - Assessment form with 20 questions
  - Instant results with score tiers
  - Personalized guidance based on score

## Components

### 1. Analytics (`components/Analytics.tsx`)
- **Purpose:** Tracking and analytics
- **Integrations:**
  - Google Analytics (G-3WDV2V65F5)
  - Microsoft Clarity (uv11b4d3ex)
- **Strategy:** `afterInteractive` for optimal performance

### 2. Navbar (`components/Navbar.tsx`)
- **Features:**
  - Fixed navigation bar
  - Hamburger menu (mobile/desktop)
  - Slide-in menu panel
  - Links: DGCA Ground, Fly Abroad, Helicopter, Take Assessment, Book a Demo

### 3. Footer (`components/Footer.tsx`)
- **Sections:**
  - Company info
  - Training paths links
  - Resources (Aptitude Test, Book a Demo)
  - Contact information (email, phone)

### 4. BookingForm (`components/BookingForm.tsx`)
- **Features:**
  - Source-aware pre-filling (from URL parameter)
  - Demo type selection (Online/Campus Visit)
  - Date/time selection (Monday-Saturday, hourly slots 10 AM - 5 PM)
  - Education level selection
  - Form validation
  - Submission to `/api/booking`

### 5. AssessmentForm (`components/AssessmentForm.tsx`)
- **Features:**
  - 20-question pilot aptitude test
  - Score calculation
  - Score tier determination (Excellent, Good, Fair, Needs Improvement)
  - Submission to `/api/assessment`

### 6. AirplanePathModal (`components/AirplanePathModal.tsx`)
- **Features:**
  - Modal for airplane training path selection
  - Two paths: "Starting Fresh" (DGCA) and "DGCA Completed" (International)
  - Links to assessment and demo

### 7. VideoCarousel (`components/VideoCarousel.tsx`)
- **Purpose:** Display training videos in carousel format

### 8. ImageCarousel (`components/ImageCarousel.tsx`)
- **Purpose:** Display facility images in carousel format

## API Routes

### 1. Booking API (`/api/booking`)
- **Method:** POST
- **Purpose:** Handle demo booking submissions
- **Fields:**
  - name, email, phone (required)
  - interest (dgca_ground, pilot_training_abroad [Fly Abroad], helicopter_license, other)
  - demoType (online, offline)
  - education (pursuing_10_2, completed_10_2, graduate)
  - preferredDate, preferredTime
- **Status:** Currently logs to console (TODO: Database integration, CRM integration, email notifications)

### 2. Assessment API (`/api/assessment`)
- **Method:** POST
- **Purpose:** Handle assessment test submissions
- **Fields:**
  - name, email (required)
  - score (0-100)
  - answers (array)
- **Response:** Includes scoreTier (excellent, good, fair, needs-improvement)
- **Status:** Currently logs to console (TODO: Database integration, CRM integration, email automation)

### 3. Leads API (`/api/leads`)
- **Method:** POST
- **Purpose:** Handle lead submissions
- **Status:** Implementation pending

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
- **Default Title:** "WindChasers Aviation Academy | Honest Pilot Training"
- **Description:** "DGCA approved pilot training with real cost transparency. Ex-Air Force instructors. No false promises."
- **Favicon:** `/favicon.ico` (with fallback to `/Windhcasers Icon.png`)

### Page-Specific Titles
- Homepage: "WindChasers Aviation Academy | Honest Pilot Training"
- DGCA: "DGCA Ground Classes | WindChasers Aviation Academy"
- Helicopter: "Helicopter Pilot License | WindChasers Aviation Academy"
- International: "Fly Abroad | WindChasers Aviation Academy"
- Demo: "Book Free Demo | WindChasers Aviation Academy"
- Assessment: "Pilot Aptitude Test | WindChasers Aviation Academy"

## User Journey & Source Tracking

### Booking Form Source Parameters
The booking form automatically pre-fills based on the source parameter:
- `?source=dgca` → Pre-fills "DGCA Ground Classes"
- `?source=helicopter` → Pre-fills "Helicopter License"
- `?source=abroad` → Pre-fills "Fly Abroad"

### Button Text Standardization
- **Demo/Booking buttons:** "Book a Demo"
- **Assessment buttons:** "Take Assessment"

## Static Assets

### Images
- **Facility Images:** WC1.webp through WC7.webp
- **Training Images:** Helicopter Training.webp, Helicopter.webp, PIlot Traingin v1.webp, PIlot Traingin.webp
- **Hero Image:** WC HEro.webp
- **Logo:** White transparent.png
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
- All pages implemented with unique metadata
- Responsive navigation and footer
- Booking form with source tracking
- Assessment form with scoring
- Analytics integration (Google Analytics + Microsoft Clarity)
- Image and video carousels
- Country selection for international training
- Form validation and error handling
- Favicon configuration

### 🔄 TODO / Pending Features
- Database integration for bookings and assessments
- PROXe CRM integration
- Email automation (confirmations, results)
- Calendar system for slot management
- Admin dashboard
- Leads API implementation
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

