# Changelog

Batch-by-batch record of changes that ship via `git push` to `main`. Newest at top.

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
