/**
 * Motion design tokens. Re-export easing curves and durations so every
 * component pulls from one source. Exponential ease-out curves, no bounce.
 */

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  outExpo: [0.19, 1, 0.22, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
} as const;

export const duration = {
  instant: 0.15,
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
  cinematic: 1.2,
} as const;

export const stagger = {
  tight: 0.04,
  base: 0.08,
  loose: 0.14,
} as const;
