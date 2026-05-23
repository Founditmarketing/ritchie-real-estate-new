# Ritchie Design System

## Brand mark
The canonical Ritchie mark is a **deep navy diamond outline + crimson
diamond fill + white serif R monogram + RITCHIE wordmark with crimson
underline**. This site uses two variants:

- **`<LogoMark>`** \u2014 SVG diamond + R, recolorable, used inline in the header.
- **`<Logo>`** \u2014 mark + wordmark side by side. Default placement.
- **`<LogoWordmarkImage>`** \u2014 the original PNG, pixel-perfect, for the
  footer, OG image, loading screen, and anywhere the canonical wordmark is
  required.

Logo source PNG lives at `public/brand/ritchie-logo.png`. Footer applies
`brightness-0 invert` so the dark wordmark reads on the navy-ink band.

## Color (committed strategy)
Single committed accent (crimson) over a navy primary on a cream surface.
Cream is warm-tinted, navy is hue-262 not pure blue, crimson is hue-22
(slightly orange-leaning, faithful to the printed logo red).

All values live in `globals.css` `@theme`, OKLCH:

| Token | OKLCH | Use |
|---|---|---|
| `navy` | `0.32 0.12 262` | Primary brand color |
| `navy-deep` | `0.22 0.10 262` | Sub-bands |
| `navy-ink` | `0.16 0.07 262` | Deepest navy: hero floor, footer |
| `navy-soft` | `0.42 0.12 262` | Hover and softer accents |
| `crimson` | `0.50 0.18 22` | Accent: eyebrows, hover lines, CTA |
| `crimson-bright` | `0.62 0.20 24` | Italic emphasis on dark backgrounds |
| `crimson-deep` | `0.40 0.17 20` | Hover on crimson CTAs |
| `cream` | `0.95 0.018 78` | Page surface |
| `cream-warm` | `0.89 0.025 72` | Section alt surface |
| `paper` | `0.97 0.012 80` | Cards, raised surfaces, text on dark |
| `ink` | `0.20 0.020 262` | Primary text (navy-tinted, not grey) |
| `ink-soft` | `0.46 0.025 262` | Secondary text |
| `line` | `ink @ 13% alpha` | Dividers, borders |

**Never:** `#000`, `#fff`, gradient text, side-stripe borders > 1px,
glassmorphism, hero-metric template, identical card grids.

## Typography
- **Serif:** Cormorant Garamond. Headlines, italic emphasis, numerics.
- **Sans:** Outfit. Body, navigation, eyebrows. 300/400/500/600.
- **Body:** 14\u201316px, line-height 1.6\u20131.7, 65\u201375ch max.
- **Italic emphasis** is a brand signature \u2014 "knows *Ritchie*" pattern.
  On cream surfaces, italic emphasis renders in `crimson`. On navy
  surfaces, italic emphasis renders in `crimson-bright` (lighter so it
  earns the contrast).

## Layout
- Page rhythm: `--spacing-pad: 3rem` (mobile collapses to 1.5rem).
- Max content width: 1280px.
- Vary section padding for cadence.
- Cards used sparingly. Most sections rely on grid + typography.
- Search bar overlaps the hero with negative margin (signature placement).

## Motion
- All easings in `lib/motion.ts`. Default `ease.out` = `[0.16, 1, 0.3, 1]`.
- Headline mask-reveal is the signature motion (h1 only).
- Body content uses `<Reveal>` (fade + 32px rise).
- Smooth scroll via Lenis with quartic ease-out, duration 1.1s.
- Route transitions via View Transitions API, 480ms ease-out-expo.
- `prefers-reduced-motion` disables Lenis and clamps CSS to 1ms globally.
- Animate transform/opacity only.

## Primitives
- `Reveal` \u2014 fade + rise on scroll.
- `Counter` \u2014 number animates 0 \u2192 value on first view.
- `MagneticButton` \u2014 cursor-tracked CTA.
- `Marquee` \u2014 seamless infinite scroller.
- `SmoothScroll` \u2014 mount once globally.
- `CustomCursor` \u2014 disc + magnetic affinity.

## Imagery
- Placeholders: Unsplash warm interiors, Cenla exteriors.
- Production: real Ritchie photography to replace.
- Always `next/image` with explicit `sizes`. Hero is `priority`.

## A11y (non-negotiable)
- Contrast minimum 4.5:1 body / 3:1 large text.
- Focus-visible rings on every interactive element (global rule above).
- Drawer traps focus when open.
- All motion respects `prefers-reduced-motion`.
