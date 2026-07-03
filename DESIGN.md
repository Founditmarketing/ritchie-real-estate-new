# Ritchie Design System — dark cinematic

> Updated 2026-07-03 to match the shipped "dark cinematic makeover"
> (commit 167e64a and everything since). The earlier cream-surface light
> system this file used to describe is retired; do not resurrect it.

## Direction
The canvas is a near-black royal navy pulled from the cinematic
Alexandria hero footage (cool steel + warm sodium). Crimson is the single
live accent. Bone-white serif type carries the statement. Warm-steel
hairlines, never gold. A fixed film-grain overlay (`.grain`) sits above
everything for texture. The voice is preppy American heritage shot at
dusk: confident, established, a little smoldering.

## Brand mark
The canonical Ritchie mark is a **deep navy diamond outline + crimson
diamond fill + white serif R monogram + RITCHIE wordmark with crimson
underline**.

- **`<LogoMark>`** — SVG diamond + R, recolorable (`tone` prop), header
  and hero watermark.
- **`<Logo>`** — mark + wordmark side by side. Default placement.
- **`<LogoWordmarkImage>`** — the original PNG, pixel-perfect, for the
  footer, OG image, and anywhere the canonical wordmark is required.

Logo source PNG lives at `public/brand/ritchie-logo.png`. Footer applies
`brightness-0 invert` so the dark wordmark reads on the navy-ink band.

## Color (committed dark strategy)
All values live in `src/app/globals.css` `@theme`, OKLCH:

| Token | OKLCH | Use |
|---|---|---|
| `navy-ink` | `0.145 0.030 264` | Page canvas, deepest |
| `navy-deep` | `0.190 0.040 264` | Section panels |
| `navy` | `0.255 0.048 264` | Raised surfaces |
| `navy-soft` | `0.340 0.050 264` | Hover / lifted |
| `crimson` | `0.52 0.19 22` | The only saturated accent: CTAs, pins, selection |
| `crimson-bright` | `0.64 0.21 24` | Italic emphasis, eyebrows, live details on dark |
| `crimson-deep` | `0.42 0.17 20` | Hover on crimson CTAs |
| `paper` | `0.965 0.008 85` | Brightest — headings |
| `cream` | `0.925 0.013 80` | Primary body text |
| `cream-warm` | `0.840 0.022 68` | Secondary text |
| `mute` | `0.660 0.022 262` | Muted captions on dark |
| `steel` | `0.740 0.025 245` | Warm-steel hairline accents |
| `ink` / `ink-soft` | `0.180 0.020 264` / `0.640 0.024 262` | Rare light insets |
| `line` / `line-strong` | bone `@ 12% / 22%` alpha | Hairlines on dark |

**Never:** `#000`, `#fff`, gradient text, side-stripe borders > 1px,
glassmorphism, hero-metric template, identical card grids, gold.

## Typography
- **Serif:** Cormorant Garamond 400–700 + italics. Headlines, stat
  numerals, italic emphasis.
- **Sans:** Outfit 300–600. Body, navigation, eyebrows, labels.
- **Body:** 14–16px, line-height 1.6–1.7, 65–75ch max.
- **Italic emphasis** is the brand signature — "knows *Ritchie.*"
  renders in `crimson-bright` on the dark canvas. Body copy stays upright
  roman; italics are reserved for accent words.
- **Eyebrows:** `.eyebrow` class — 11.5px, 0.26em tracking, uppercase,
  `crimson-bright`, leading hairline rule.

## Hero (signature surface)
- Full-viewport cinematic video (`/hero/hero.mp4`, poster
  `/hero/hero-poster.jpg`) of downtown Alexandria at sunset, restrained
  grading: bottom-band darkening for the type, warm sodium cast up top,
  crimson ember glow behind the headline, edge vignette.
- `prefers-reduced-motion` renders the poster `next/image` only, no
  autoplay.
- Three-beat headline ladder ("Central / Louisiana / knows *Ritchie.*")
  via `Beat` mask-reveal, 0.55s, 80ms stagger, done in under a second.
- Film-slate coordinates line (N 31.3° / Alexandria, LA / Est. 2003) and
  diamond watermark.
- Primary CTA opens the Ask Ritchie concierge; browsing is the quieter
  secondary path.

## Layout
- Page rhythm: `--spacing-pad: 3rem`; varied section padding for cadence.
- Max content width 1280px (hero frame runs to 1440px).
- Cards used sparingly; most sections are grid + typography.
- Mobile homepage is a trimmed app-shell flow (8 sections) with the
  `MobileDock` as persistent bottom navigation; the concierge lives in
  the dock on phones.

## Motion
- All easings/durations/staggers in `src/lib/motion.ts`. Default
  `ease.out = [0.16, 1, 0.3, 1]`; `outExpo` for hero beats. No bounce.
- Hero `Beat` mask-reveal is the signature motion (h1 only).
- Body content uses `<Reveal>` (fade + rise). Stats use `<Counter>`.
- Smooth scroll via Lenis. Route transitions via View Transitions API,
  480ms ease-out-expo.
- **Reduced-motion contract:** global CSS clamps animation/transition to
  1ms; Lenis is disabled; and every JS-driven tween (motion library)
  must opt in via `useReducedMotion` the way `Hero` does — the CSS
  override cannot reach them.
- Animate transform/opacity only.

## Primitives
`Reveal`, `Counter`, `MagneticButton` (cursor-tracked CTA, `strength`
prop), `Marquee`, `SmoothScroll`, `CustomCursor` (disc + labels via
`data-cursor-label`), `HeadlineReveal`, `TiltCard`, `PlateImage`,
route-level `RouteTransitions`.

## Explore / concierge surfaces
- `/explore` is a dark-themed Leaflet map app: `.rre-pin` crimson price
  pins (cream when active), navy-ink map chrome, brand-styled
  attribution.
- Ask Ritchie concierge drawer: `.chat-scroll` thin dark scrollbar,
  crimson hover thumb.

## Imagery
- Hero: real Alexandria footage (video + poster).
- Listings/areas: Unsplash placeholders pending real Ritchie
  photography — warm dusk exteriors, moody interiors; keep the graded
  cinematic mood, no bright daylight stock.
- Always `next/image` with explicit `sizes`. Hero poster is `priority`.

## A11y (non-negotiable)
- Contrast minimum 4.5:1 body / 3:1 large text — checked against the
  dark tokens above.
- Focus-visible: global 2px crimson outline, 3px offset, on every
  interactive element.
- Drawer and concierge trap focus when open.
- All motion respects `prefers-reduced-motion`, including JS tweens
  (see Motion contract).
