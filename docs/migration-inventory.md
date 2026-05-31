# windchasers.in → Next.js Migration Inventory

> Source of truth: live Rank Math sitemaps fetched 2026-05-30.
> `sitemap_index.xml` → `page-sitemap.xml` (74), `post-sitemap.xml` (9), `category-sitemap.xml` (1).
> Goal (per user): live content, temp-site design, **match live slugs exactly** so rankings carry over.

## Security audit status
Scanned raw HTML of home, about-us, contact-us, privacy-policy:
- **No spam keywords** (casino/pharma/crypto/etc.). Only "loan" = legit education-loan financing.
- **External link domains all clean:** instagram, facebook, linkedin, bconclub.com (agency), gmpg.org, and 4 press sites (Deccan Chronicle, The Hindu, Financial Express, Silicon India).
- No cloaked/hidden-text injection beyond normal menu `display:none`.
- ⚠️ Could not yet rule out hidden hacked pages *not listed in the sitemap* (hackers often exclude them). A deeper crawl / WP-admin or host file review is needed to be 100% sure.
- ⚠️ Prices NOT yet captured — course pages need a clean re-fetch (first attempt used wrong slugs).

## Contact facts (verified)
- Phone: +91 90350 98425, +91 95910 04043
- Email: aviators@windchasers.in
- Address: Site No 1, Opp Poorna Prajna Education Center, 3rd floor, New Airport Road, Hennur Bagalur Main Rd, Kothanur, Bengaluru, Karnataka 560077
- Founder story: Sumaiya Ali

---

## A. Core SEO / content pages — MIGRATE (rankings matter)

### Licenses & ratings
- [ ] /commercial-pilot-license/
- [ ] /private-pilot-license/
- [ ] /airline-transport-pilot-license/
- [ ] /instrument-rating/
- [ ] /multi-engine-rating/
- [ ] /multi-engine-instrument-rating-meir/
- [ ] /certified-flight-instructor/
- [ ] /night-rating-progam/   ← note live typo "progam"
- [ ] /foreign-cpl/
- [ ] /license-conversion-course/

### Type ratings
- [ ] /boeing-737-type-rating/
- [ ] /airbus-a320-type-rating/

### Ground / academic
- [ ] /dgca-ground-classes/
- [ ] /diploma-in-aviation/
- [ ] /ielts-training-program/

### Programs / cadet
- [ ] /pre-cadet-program/
- [ ] /cadet-pilot-program/
- [ ] /airline-preparation-program/
- [ ] /airline-cadet-program-interview-training/
- [ ] /airline/

### Other training
- [ ] /helicopter-training/
- [ ] /cabin-crew-program/
- [ ] /women-in-aviation/

### Geo / location pages (high SEO value)
- [ ] /pilot-training-in-india/
- [ ] /pilot-training-in-usa/
- [ ] /pilot-training-in-canada/
- [ ] /pilot-training-in-australia/
- [ ] /pilot-training-in-new-zealand/
- [ ] /pilot-training-in-south-africa/

### Brand / info
- [ ] / (home)
- [ ] /about/  and/or  /about-us/  (two exist — confirm which is canonical)
- [ ] /windchasers-meet-the-team/
- [ ] /with-the-founder/
- [ ] /contact-us/

### Blog
- [ ] /blog/ (index)
- [ ] /category/blog/ (archive)
- [ ] post: best-aviation-academy-in-india-for-pilot-training-a-career-ready-curriculum
- [ ] post: how-to-start-your-helicopter-flight-training-a-step-by-step-guide
- [ ] post: a-complete-guide-to-dgca-ground-classes-in-india-subjects-duration-and-benefits
- [ ] post: best-online-aviation-courses-in-india-flexible-learning-for-future-flyers

### Legal
- [ ] /privacy-policy/
- [ ] /refund-policy/
- [ ] /terms-conditions/

---

## B. Funnel / landing / event pages — CONFIRM scope (many already exist in temp app)
- /join-windchasers/ , /join-windchasers-proxe/
- /airport-operations-webinar/ , /airport-operations-webinar-parents/
- /open-house/
- /scholarship-application-form/
- /pilot-training-consultation/
- /cpl-enquiry/
- /e-registration/
- /nz-event-rsvp/
- /dgca-demo-sessions/
- /priority-pass/
- /pilot-roadmap-guide-2025/
- /pilot-assessment-test/ , /pilot-assesment-test/ , /pat2/ , /pat3/ , /pat4-0/ , /pilot-assesment-student-onbaording/

## C. Thank-you / confirmation — SKIP (transactional, no SEO)
- /thank-you/ , /about-thank-you/ , /pat-thank-you/ , /cabincrew-thankyou/
- /pilot-assesment-thank-you/ , /pilot-assessment-thank-you-2/
- /cabin-crew-purchase-confirm/ , /cabin-crew-launch/

## D. WooCommerce — likely DROP (confirm)
- /shop/ , /cart/ , /checkout/ , /my-account/

## E. Suspect / junk / duplicate — VERIFIED, drop or redirect
- /some/  → VERIFIED junk: titled "some" but body is duplicate of License Conversion Course. Draft slug. DROP.
- /home2/  → VERIFIED duplicate homepage draft. DROP (or redirect → /).
- /windchasers-anybody-can-fly-top-pilot-training-academy/  ← likely old home draft (not yet fetched)
- /privacy-policy-2/  ← duplicate of privacy-policy. DROP.
- 4 thin Sept-2023 lead-capture posts (NOT spam, NOT hacked — just low value):
  - aviation-safety-briefing → thin demo-session lead page
  - pilot-career-workshop → thin event lead page
  - advanced-flight-training-demo → thin event lead page
  - industry-partnership-announcement → actually "Open House for Female Pilot Aspirants" lead page
  Decision: skip or fold into one events/landing template.

## Audit conclusion
No hacked / spam / injected content found in the sampled pages. The live site is *messy*
(drafts, duplicate slugs, thin lead pages) but clean. Main risk to rankings = the Section A pages.

---

## Notes
- Earlier round-1 questions (cabin-crew-2, dated /YYYY/MM/DD/ blog URLs, /category/uncategorized) were based on
  assumed URLs that DO NOT exist on the live site. Disregard those answers.
- Temp Next.js app already has overlapping routes: pilot-training, dgca, helicopter, international,
  flight-schools, assessment, team, open-house, thank-you, webinar, cabin-crew, summercamp.
  Migration = map live SEO slugs onto these / create new, keeping live slugs canonical.
