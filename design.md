# WindChasers — Design System

Single source of truth for how windchasers.in looks and behaves. Every value here was read out of the live codebase, not invented. When code and this file disagree, the code is right and this file needs updating.

Scope: the marketing site (`C:\Users\user\Builds\Windchasers`). The PROXe dashboard is a separate product with its own conventions.

Related: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) is an older page-level audit of ATC / Summer Camp / Pilot Training. This file supersedes it and adds the event-page language.

---

## 1. Foundations

### 1.1 The one constant

`#C5A572` — gold. Used 769 times across the codebase. It is the brand. Everything else is a surface for it to sit on.

Gold is for **one thing per view**: the action you want taken. When gold appears three times on a screen it stops meaning anything.

### 1.2 Colour tokens

**Brand core** (defined in `tailwind.config.ts`)

| Token | Hex | Use |
|---|---|---|
| `gold` | `#C5A572` | Primary accent. CTA fills, icons, rules, emphasis words, scrollbar |
| — | `#d4b789` | Gold hover only. Never a resting state |
| — | `#E7D5B3` | Pale gold. Eyebrow labels, secondary-button text, names in cards |
| `dark` | `#1A1A1A` | Page background, and text colour **on** gold fills |
| `accent-dark` | `#0D0D0D` | Input wells, deepest zebra band |

**Event-page surfaces** (Wings of Freedom, webinar, demo class)

| Hex | Use |
|---|---|
| `#141417` | Base section |
| `#171719` | Alternate section |
| `#1B1B1E` | Third step, for a run of three consecutive sections |
| `#1F1F1F` | Modal card |

These replaced a near-black `#0B0B0D` / `#0E0E10` pair that made long pages feel like a void. Keep the steps this shallow: the rhythm should be felt, not seen.

**Stitch / Material 3 set** — `primary #e4c28c`, `surface #131313`, `surface-container-* `, `on-surface #e5e2e1`, `outline-variant #4d463b`. Used **only** by `app/pilot-training-students`. Do not mix these with the brand core in one view; they read as a different product.

**State**

| Use | Value |
|---|---|
| Error text | `text-red-400` |
| Live / open badge | `bg-green-500` dot with `animate-ping` halo |
| Divider | `border-white/5` between sections, `border-white/10` on cards |

### 1.3 Type

- **Body and UI:** Inter, loaded in `app/layout.tsx` as `--font-sans`. Everything inherits it.
- **Display:** Manrope as `--font-headline`, weights 400/600/700/800. Currently only `pilot-training-students`. Reach for it when a page wants a distinct editorial voice, not by default.

Scale in practice:

| Role | Classes |
|---|---|
| Hero h1 | `text-4xl md:text-6xl lg:text-7xl font-bold` |
| Section h2 | `text-3xl md:text-4xl font-bold text-white` |
| Card h3 | `text-lg sm:text-xl font-semibold text-white` |
| Body | `text-gray-400`, `text-[13.5px]` to `text-[14px]`, `leading-relaxed` |
| Eyebrow | `text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]` |
| Fine print | `text-[11px] leading-snug text-white/35` |

Two-tone headings are the house move: white base, one word in gold. One highlighted word per heading.

`tracking-tighter` belongs to Manrope display headings only. Wide tracking (`0.18em`, `3px`) belongs to uppercase eyebrows only. Never both.

### 1.4 Shape

| Radius | Where |
|---|---|
| `rounded-full` | Buttons, pills, chips, badges. 277 uses — the default for anything clickable |
| `rounded-xl` | Inputs, small tiles, inner blocks |
| `rounded-2xl` | Feature cards, section panels |
| `rounded-[20px]` | Modal cards |

Rule: the container is always at least as round as the things inside it.

### 1.5 Spacing and layout

- **Section padding:** `px-4 py-16 sm:px-6 sm:py-20 lg:px-8` on newer pages. Older pages use `py-20 px-6`; match whichever the page already uses rather than mixing.
- **Containers:** `max-w-6xl` for section grids, `max-w-2xl` for a paragraph of copy, `max-w-3xl` for FAQ and narrow reading, `max-w-7xl` for full-bleed layouts.
- **Grid gaps:** `gap-4 sm:gap-5`. Cards go `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- **Scroll offset:** `scroll-padding-top: 100px` (90px under 768px) so anchors clear the fixed navbar. Set globally, do not re-solve per page.

---

## 2. Components

### 2.1 Primary button

```
group inline-flex items-center gap-2 rounded-full bg-[#C5A572]
px-6 py-3 text-sm font-semibold text-[#1A1A1A]
transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#d4b789]
```

Optional lift shadow on hero-weight buttons: `shadow-[0_12px_34px_rgba(197,165,114,0.35)]`, size up to `px-8 py-4 text-base`.

Trailing `<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />` when the button navigates. No arrow when it opens a modal.

### 2.2 Secondary button

```
group inline-flex items-center gap-2 rounded-full border border-[#C5A572]/40
bg-[#C5A572]/5 px-6 py-3 text-sm font-semibold text-[#E7D5B3]
transition-all duration-300 hover:border-[#C5A572]/70 hover:bg-[#C5A572]/12
```

Never place two primaries side by side. A pair is always primary plus secondary, and on mobile the secondary drops to a centred text link rather than a second full-width bar.

### 2.3 Card

```
group rounded-2xl border border-white/10 bg-white/[0.02] p-6
transition-colors hover:border-[#C5A572]/40 hover:bg-white/[0.04]
```

Cards lift on border and background, not on transform. Only buttons translate.

Image-topped card: image in `relative h-44 sm:h-52 overflow-hidden`, `object-cover`, `group-hover:scale-[1.04] duration-500`, with a bottom scrim `bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/25 to-transparent`.

### 2.4 Section header

```tsx
<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E7D5B3]">Eyebrow</p>
<h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">Heading</h2>
<span className="mt-3 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#C5A572] to-transparent" />
<p className="mt-3 max-w-2xl text-gray-400">Sub-copy.</p>
```

The fading gold rule under an h2 is the signature. Use it on every section heading.

### 2.5 Chips

```
rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-gray-300
```

### 2.6 Inputs

```
h-11 w-full rounded-xl border border-white/10 bg-[#0D0D0D] px-4 text-[14px] text-white
placeholder:text-white/25 focus:border-[#C5A572] focus:outline-none
```

Focus is a gold border, never a browser ring. Selects need `style={{ colorScheme: "dark" }}` or the native menu renders white.

Segmented control (day picker, track picker, age band): a `grid` inside `rounded-xl border border-white/10 bg-[#0D0D0D] p-1`, selected item `bg-[#C5A572] text-[#1A1A1A]`, unselected `text-white/35 hover:text-white/70`. Always `aria-pressed`.

### 2.7 Modal

```
overlay: fixed inset-0 z-[200] flex justify-center overflow-y-auto overscroll-contain
         bg-black/80 p-3 backdrop-blur-md sm:p-5
card:    relative my-auto w-full max-w-[560px] rounded-[20px]
         border border-[#C5A572]/30 bg-[#1F1F1F] px-5 py-6 sm:px-8 sm:py-7
```

Non-negotiable rules, each of which was a real bug:

1. **The overlay scrolls, not the page.** `overflow-y-auto` on the overlay plus `my-auto` on the card. Do **not** use `items-center` on a scrolling flex parent — it clips the top of a tall card out of reach.
2. **Lock the body** while open (`document.body.style.overflow = "hidden"`), and restore the previous value on close.
3. **Escape closes.** Backdrop click closes only when `e.target === e.currentTarget`.
4. **If a form outgrows one viewport, split it into steps** rather than letting it grow. Step 1 gets a `Continue` button, step 2 gets submit plus `Back`, and `Back` preserves what was typed.

Decoration: a `h-[2px]` gold gradient hairline across the top, and gold corner brackets at `top-3.5 left-3.5` / `bottom-3.5 right-3.5`.

### 2.8 Media and galleries

- Grid of thumbnails, click to open a lightbox. No inline captions on mobile — the images carry it.
- Compress photos to **128–150 KB**. Nothing on a landing page justifies more.
- Poster frames must be **local files**. Third-party thumbnail services return 200 to curl and then never paint in the browser.
- Looping hero video: crossfade the tail over the head so the loop is seamless, `muted playsInline loop`, with a poster for first paint.

---

## 3. Motion

| Thing | Duration |
|---|---|
| Colour and border | 300ms |
| Button lift | 300ms, `-translate-y-0.5` |
| Image zoom | 500ms, `scale-[1.04]` |
| Modal enter | 240ms, `[0.22, 1, 0.36, 1]`, from `y: 20, scale: 0.97` |

Motion is confirmation, never decoration. If it does not tell the user something happened, cut it.

Respect `prefers-reduced-motion`. If smooth scrolling appears broken, check the OS setting before touching code — that preference is the user's to make, not ours to override.

---

## 4. Accessibility

- Every interactive element is a real `<button>` or `<a>`. Never a clickable `<div>`.
- Toggles carry `aria-pressed`. Modals carry `role="dialog"`, `aria-modal`, `aria-labelledby`.
- Decorative images take `alt=""` and `aria-hidden`. Everything else gets a description of what is happening in it, not a filename.
- Body text stays at or above `text-gray-400` on these surfaces. `text-white/35` is for fine print only, never for anything a user must read to act.
- Target size on mobile: 44px minimum. `h-11` inputs and `py-3` buttons satisfy this.
- FAQ uses native `<details>` so it is crawlable and keyboard-operable with no JS.

---

## 5. Content voice

- **No em dashes or en dashes.** Anywhere. Use a comma, a colon, or a full stop. This applies to UI copy, alt text and outbound messages.
- Plain words. "Book my slot", not "Secure your reservation".
- Say the constraint plainly and early. "Free to attend, women only" beats a disclaimer at the bottom.
- Never imply an outcome that has not happened. An application is "open, not decided". A form submission is a registration, not an award.
- Numbers and money stay off the open page when the page is about opportunity. Put them one click in, behind a clearly labelled control.
- Use "women", "candidates", "you". Never "girls" or "ladies". Frame inclusion as building a room, never as a prohibition.

---

## 6. Page anatomy

The order that works, proven across the event pages:

1. **Hero** — eyebrow, two-tone h1, one paragraph, primary plus secondary CTA, a meta row (date / time / venue with icons), countdown if the thing has a date.
2. **Proof** — real photographs of the real thing. This goes high, before any asking.
3. **The offer, split** — two cards making the two ways to take part explicit.
4. **What happens** — numbered cards, six is the right number.
5. **Detail** — tracks, agenda, tiers. Deeper content behind a modal so the page does not repeat itself.
6. **Process** — if there is a selection or a commitment, show its stages openly. Never hide what someone is signing up for behind a click.
7. **People** — faces, grayscale, colour on hover.
8. **Terms** — visible, not accordioned, when a checkbox claims they were read.
9. **FAQ**
10. **Footer** — keep it. Long pages that ask for a commitment need the policy links and the address.

Landing pages for a single event drop the nav menu (logo-only header) and keep the footer. One sticky mobile CTA, never two.

---

## 7. Backgrounds

Hero: full-bleed image at `opacity-[0.34]` over the base colour, then two scrims — a horizontal `from-[#141417] via-[#141417]/85 to-[#141417]/55` for text legibility, and a vertical `from-[#141417] via-transparent to-[#141417]/45` to seat it on the page.

If the copy is hard to read, deepen the scrim. Do not dim the photograph further — that is what made the pages feel like a void in the first place.

Ambient glow, used sparingly: `absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-[#C5A572]/8 blur-[120px]`.

---

## 8. Conventions that bite

- **Tailwind arbitrary values need exact hex.** `bg-[#141417]` works, a variable does not. Changing a surface colour means changing every scrim that references it in the same component.
- **Never put a JSX comment between `return (` and its element.** It parses as a child expression and fails the build.
- **`next/head` is a no-op in a `"use client"` App Router page.** Metadata belongs in a sibling server `layout.tsx`, along with JSON-LD.
- **Wide content scrolls inside its own container.** The page body never scrolls horizontally.
- **One `.next` per dev server.** Concurrent sessions sharing a build directory corrupt chunks and present as "the design isn't showing".
