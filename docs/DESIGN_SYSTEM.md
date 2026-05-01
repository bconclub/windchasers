# WindChasers — Page Design Reference

A descriptive snapshot of the visual / structural patterns used across **ATC**, **Summer Camp**, and **Pilot Training (Students)** pages. Use this as the source of truth when designing the next pilot-training pages so they remain visually coherent.

Pages audited:
- [app/atc/page.tsx](../app/atc/page.tsx)
- [app/summercamp/page.tsx](../app/summercamp/page.tsx)
- [app/pilot-training-students/page.tsx](../app/pilot-training-students/page.tsx)
- Tokens: [tailwind.config.ts](../tailwind.config.ts)

---

## 1. Color Tokens

### Brand / Legacy palette (used in ATC + Summer Camp)
| Token | Hex | Usage |
|---|---|---|
| `gold` / `#C5A572` | Gold | Primary accent — CTA buttons, badge fills, icons, list bullets, "highlight" words in headings |
| `dark` / `#1A1A1A` | Near-black | Primary page background, button text on gold |
| `accent-dark` / `#0D0D0D` | Deeper black | Alternate section background (zebra rhythm) |
| `#1E1E1E` | Soft black | Tertiary section bg (ATC eligibility) |
| `#252525` | Form card bg | ATC form container |
| `#444` | Input border | ATC inputs |
| `green-500` / `green-400` | Live status dot ("Admissions Open") | Hero "live" badge only |
| `red-400` / `red-500` | Form error states | All forms |

### Stitch / Material palette (used in Pilot Training Students)
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#e4c28c` | Lighter gold — accent color in M3 surfaces |
| `primary-container` | `#c5a572` | Hover state for `primary` |
| `on-primary` | `#412d04` | Text on gold buttons |
| `background` / `surface` | `#131313` | Page background |
| `surface-container-lowest` | `#0e0e0e` | Section zebra (deepest) |
| `surface-container` | `#20201f` | Glass / floating cards |
| `surface-container-low` | `#1c1b1b` | — |
| `surface-container-high` | `#2a2a2a` | Image frame border on testimonial |
| `surface-container-highest` | `#353535` | Pill chip bg, icon cell bg, testimonial card |
| `on-surface` | `#e5e2e1` | Body text |
| `on-surface-variant` | `#d1c5b6` | Secondary text, captions |
| `outline-variant` | `#4d463b` | Subtle borders / dividers |
| `stone-950` | Tailwind | Bottom of image gradient overlays |

> **Rule of thumb:** ATC + Summer Camp use the **legacy `gold/dark`** palette. The Pilot Training Students page shifts to the **Stitch / M3 token set** (`primary`, `surface-container-*`, `on-surface`). When extending pilot-training pages, prefer the Stitch tokens for consistency.

---

## 2. Typography

| Page | Headline font | Body font | Notes |
|---|---|---|---|
| ATC | Inherits global sans | Inherits global sans | `text-4xl md:text-5xl lg:text-6xl font-bold` h1 |
| Summer Camp | Inherits global sans | Inherits global sans | `text-4xl md:text-6xl lg:text-7xl font-bold` h1, gold-highlighted span for keywords |
| Pilot Training Students | **Manrope** loaded as `--font-headline` (weights 400/600/700/800) | Inherits | `text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter`, italic gold span for hook word |

**Heading patterns**
- Two-tone heading: white base + a `text-gold` (or `text-primary`) word for emphasis.
- `tracking-tighter` only on Pilot Training (Manrope display style).
- Section eyebrows: `text-primary text-xs uppercase tracking-[0.2em]` (Pilot) or `text-[#C5A572] text-xs uppercase tracking-[3px]` (ATC fee section).

---

## 3. Backgrounds & Section Rhythm

### Hero backgrounds
- **ATC + Summer Camp**: Full-bleed `Image` from `/facility/WC1.webp` with `object-cover`, then a vertical darkening gradient: `bg-gradient-to-b from-dark/80 via-dark/90 to-dark`. Sets dramatic dark-cinema mood.
- **Pilot Training Students**: Full-bleed `<img>` from `lh3.googleusercontent.com` (Stitch-generated cockpit photo) at `opacity-60`, with inline `linear-gradient(to bottom, rgba(19,19,19,0) 0%, rgba(19,19,19,1) 100%)` — fades the image into the page's dark base.

### Section background rhythm
ATC and Summer Camp alternate sections to create zebra-like depth:
- `bg-[#1A1A1A]` ↔ `bg-[#1E1E1E]` ↔ `bg-gradient-to-b from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A]`
- Summer Camp swaps in `bg-accent-dark` (`#0D0D0D`) for the day-cards and FAQ sections.

Pilot Training Students uses the Stitch tokens for the same effect:
- `bg-background` ↔ `bg-surface-container-lowest` between sections.
- Section dividers via `border-y border-outline-variant/10`.

### Closing CTA background pattern (Pilot Training)
- Image at `opacity-30` + a flat overlay `bg-stone-950/80` for high-contrast closing message.

### Final CTA card (Summer Camp)
- `bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-3xl` — soft gold glow card.

---

## 4. Blurs, Blobs & Glow Effects

| Effect | Where | Exact treatment |
|---|---|---|
| **Soft blob** | Pilot Training social-proof image | `absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl` behind the photo card. The only true "blob" in the audited pages. |
| **Backdrop-blur card (glass)** | Pilot Training hero side card | `bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 p-8 rounded-2xl` |
| **Backdrop-blur button** | ATC mute button | `bg-black/50 hover:bg-black/70 backdrop-blur-sm` round button |
| **Backdrop-blur info chips** | Summer Camp hero stats | `bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm` |
| **Backdrop-blur sticky CTA** | ATC mobile sticky | `bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10` |
| **Gold glow shadow** | Pilot Training & Summer Camp CTAs | inline `boxShadow: "0 0 20px rgba(197,165,114,0.15)"` or Tailwind `hover:shadow-[0_15px_40px_rgba(197,165,114,0.4)]` / `shadow-lg shadow-gold/20` |
| **Card lift hover** | All card grids | `hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20` (or `shadow-gold/10` on Summer Camp) |
| **Ghost number** (deboss) | Pilot Training "3 Steps" | Huge `text-[8rem] md:text-[12rem] font-black text-white/5` digit behind each step — gives the depth/blob feel without using `blur` |

> The aesthetic is **cinematic dark + targeted gold glow** — no broad neon blurs, no rainbow gradients. Glow is reserved for CTAs and one image accent.

---

## 5. Imagery

### Local assets in use
- `/facility/WC1.webp` — shared hero background for ATC and Summer Camp.
- `/junior aviators/001.webp` … `006.webp` — six day-card photos in the Summer Camp 5-Day Journey grid.

### Remote / generated assets
- Pilot Training Students currently sources **all 5 hero/section/testimonial images from `lh3.googleusercontent.com/aida-public/...`** (Stitch / Google AI generations, 4 photos + 1 closing-CTA image). These should eventually be migrated to local `/public` assets for production reliability.

### Vimeo embed
- ATC hero uses `https://player.vimeo.com/video/1181225660?autoplay=1&muted=1&controls=0&badge=0&byline=0&portrait=0&title=0&loop=1&background=1`.
- Two synced iframes (desktop + mobile), 340×600 / 340×520, frame radius `rounded-[24px]`.
- Custom mute toggle (no native controls).

### Image card patterns
- **Square hero portrait** (Pilot Training social proof): `border-8 border-surface-container-high rounded-[40px]` — heavy frame.
- **Tall card with bottom-gradient overlay** (Pilot Training experience cards): `h-[500px] md:h-[600px] rounded-3xl overflow-hidden` with `bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent` revealing copy on hover.
- **Photo-on-top card** (Summer Camp days): 160px image + `bg-gradient-to-t from-dark to-transparent` foot fade + content panel below.
- **Hover scale on images**: `transition-transform duration-700 group-hover:scale-110`.

---

## 6. Iconography (lucide-react)

All three pages use `lucide-react` — outline style, generally `w-5 h-5` to `w-8 h-8`, color `text-[#C5A572]` / `text-gold` / `text-primary`.

### ATC icons
`Clock, User, Calculator, Building, BookOpen, Mic, GraduationCap, Radio, Signal, BarChart, ClipboardList, Headphones, ChevronDown, MessageSquare, Target, FlaskConical, Cpu, CalendarCheck, Phone`
(Active in render: `BookOpen`, `MessageSquare`, `GraduationCap`, `Target`, `FlaskConical`, `Cpu`, `CalendarCheck`, `ChevronDown`.)

### Summer Camp icons
`Plane, Monitor, Cpu, Printer, Ticket, Gift, CheckCircle, Shield, Users, MapPin, Clock, ChevronDown, Phone, Mail, User, Sparkles, Award, Star`

### Pilot Training Students icons
`ArrowRight, Globe, BadgeCheck, GraduationCap, PlaneTakeoff, CheckCircle, Star`

### Inline SVGs (not lucide)
- Speaker / mute icons on the Vimeo player (hand-rolled SVG paths).
- WhatsApp glyph in the ATC submission-error block.

### Icon "containers"
A repeating pattern: a small rounded square or circle holding the icon.
- `w-12 h-12 rounded-xl bg-gold/10 border border-gold/20` (Summer Camp day cards)
- `w-14 h-14 rounded-xl bg-gold/10 border border-gold/20` (Summer Camp safety cards)
- `w-16 h-16 rounded-2xl bg-surface-container-highest text-primary` → flips to `bg-primary text-on-primary` on hover (Pilot Training "3 Steps")
- `w-12 h-12 rounded-full bg-primary/10 text-primary` (Pilot Training hero side card)

---

## 7. Component Patterns

### Live-status pill (hero badge)
```
inline-flex items-center gap-2 bg-{accent}/20 border border-{accent}/40 rounded-full px-4 py-2
```
- ATC: green dot + ping (`animate-ping`) → "Admissions Open"
- Summer Camp: `<Sparkles>` + gold styling → "Summer 2026 Enrollment Open"
- Pilot Training: solid pulsing dot (`animate-pulse`) → "Elite Flight Training" in `tracking-[0.2em] uppercase`

### Card with top-edge gold accent (ATC signature)
```
bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8
+ floating "badge" pill: absolute -top-3 left-6
+ hover:-translate-y-1 hover:shadow-xl
```

### Card with photo + day badge (Summer Camp signature)
```
bg-dark border border-white/10 rounded-2xl overflow-hidden
+ image (h-40) with bottom fade
+ floating day badge top-32 left-4 (gold pill)
+ icon cell w-12 h-12 rounded-xl bg-gold/10
+ hover:border-gold/50 hover:-translate-y-1
```

### Glass info card (Pilot Training signature)
```
bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 rounded-2xl
```

### Ghost-number step card (Pilot Training)
- Massive `text-white/5` digit absolutely behind a left-aligned step block. Never bordered.

### Form fields
- **ATC**: `bg-[#1A1A1A] border border-[#444] rounded-lg px-4 h-12 focus:border-[#C5A572]` — minimal, hairline border.
- **Summer Camp**: `bg-white/5 border border-white/20 rounded-xl py-3 pl-12 min-h-[56px] focus:border-gold` — taller, leading-icon inputs (`User`, `Phone`, `Mail`).
- **No form** on Pilot Training Students (CTA links to `/demo`).

### Buttons
- **Primary CTA (gold pill)**: `bg-[#C5A572] text-[#1A1A1A]` (or `bg-primary text-on-primary` on Stitch pages), `rounded-lg` (ATC) → `rounded-xl` (Summer Camp) → `rounded-full` (Pilot final CTA). Hover: `-translate-y-0.5` + gold-tinted shadow, or `hover:scale-105`.
- **Secondary CTA (ghost)**: `border border-outline-variant text-white px-8 py-4 rounded-lg hover:bg-white/5` (Pilot Training "Explore Programs").

### Sticky mobile CTA (ATC pattern)
- `md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-t border-white/10`

### Scroll indicator (Summer Camp hero)
- `w-6 h-10 border-2 border-white/30 rounded-full` with a `1.5×1.5` gold dot animated `y: [0, 8, 0]` infinite.

### FAQ accordion (Summer Camp)
- `bg-dark border border-white/10 rounded-xl` row, chevron rotates 180°, expands via `max-h-0` → `max-h-40` transition.

---

## 8. Motion (framer-motion)

ATC and Summer Camp consistently use:
- **Hero**: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}` with delays 0.1 → 0.6.
- **Section reveal**: `initial={{ opacity: 0, y: 16-24 }} whileInView={{ ... }} viewport={{ once: true }} transition={{ duration: 0.5-0.6, delay: i * 0.1 }}`.
- **Stagger container**: `whileInView={{ transition: { staggerChildren: 0.1 } }}` on Summer Camp.
- **Scale-in card**: `initial={{ opacity: 0, scale: 0.95 }}` for big feature cards / forms.
- **Reduced motion**: ATC checks `useReducedMotion()` and short-circuits all motion to `0`-duration. **The Pilot Training page has no motion** — it relies on CSS hover transitions only.

---

## 9. Layout / Spacing Conventions

| Concern | Convention |
|---|---|
| Container width | `max-w-7xl` (ATC + Summer Camp) / `max-w-[1400px]` (Pilot Training) |
| Horizontal padding | `px-6 lg:px-8` (legacy) / `px-6 md:px-12` (Pilot) |
| Section vertical | `py-20` (legacy) / `py-24 md:py-32` (Pilot) |
| Hero top padding | `pt-20` (account for fixed nav) |
| Card grid | `grid md:grid-cols-2 lg:grid-cols-3 gap-6-8` |
| Hero grid | `grid md:grid-cols-2 gap-12 items-center` (legacy) / `grid lg:grid-cols-12` (Pilot Training) |
| Border radius scale | inputs/buttons `rounded-lg` → cards `rounded-xl` / `rounded-2xl` → hero photos `rounded-3xl` / `rounded-[40px]` |

---

## 10. What's Different on Pilot Training Students (and worth carrying forward)

These are the upgrades the new pilot-training pages should likely match:

1. **Manrope display font** for headlines (`var(--font-headline)`).
2. **Stitch / M3 token set** (`primary`, `surface-container-*`, `on-surface`) instead of legacy `gold/dark`.
3. **`max-w-[1400px]` containers** (slightly wider than `max-w-7xl`).
4. **Glass hero side card** with `backdrop-blur-xl`.
5. **Asymmetric image grid** — middle card offset with `md:mt-24` for a magazine layout.
6. **Hover-reveal copy** on photo cards (`opacity-0 group-hover:opacity-100`).
7. **Ghost-number** step layout with extreme display digits at `text-white/5`.
8. **Soft blob** (`blur-3xl bg-primary/10`) behind the testimonial photo — currently the only blur-blob in the system.
9. **Pull-quote pattern**: heavy bordered photo + floating testimonial card overlapping its bottom-right corner.
10. **Italic gold accent word** in the H1 for emotional emphasis (`text-primary italic`).

---

## 11. Things to Watch / Inconsistencies

- ATC and Summer Camp use legacy `gold` (`#C5A572`) while Pilot Training uses `primary` (`#e4c28c`, slightly lighter). They are visually similar but not identical — pick one per page family and stay consistent.
- Pilot Training fetches all imagery from `lh3.googleusercontent.com` (AI-generated). Replace with local `/public` assets before launch.
- Pilot Training has no `framer-motion`. If matching the rest of the system, add the same in-view reveal pattern.
- Pilot Training has no lead-capture form — every CTA dead-ends at `/demo`. Decide whether new pilot-training pages should embed a form (ATC pattern) or continue routing to `/demo`.
- "Summer 2025" copy still appears in the Summer Camp final CTA even though batches are 2026 — out of scope here, just flagging.

---

## Quick reference: the "WindChasers card"

If you only remember one component pattern, it is this:

```tsx
<div className="group relative bg-[#1A1A1A] border-t-2 border-[#C5A572] rounded-xl p-8
                hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
  <span className="absolute -top-3 left-6 bg-[#C5A572] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
    Badge
  </span>
  <Icon className="w-8 h-8 text-[#C5A572] mb-5 mt-2" />
  <h3 className="text-lg font-bold text-white">Title</h3>
  <p className="text-white/60 text-sm leading-relaxed">Subtext</p>
</div>
```

Dark base, gold top-edge stripe, floating gold uppercase pill, gold lucide icon, white title, 60%-white body. That single recipe carries most of the brand feel.
