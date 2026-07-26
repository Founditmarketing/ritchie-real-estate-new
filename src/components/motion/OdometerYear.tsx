"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The hero's "1997." rolls backwards through the years like an odometer
 * finding its stop — 2026 flickering down to the year Matt sold his first
 * property. Pure vertical mask roll: five stacked rows, decelerating
 * keyframes, landing on 1997. Starts after the BrandIntro curtain clears
 * (first visit) so the roll is actually seen.
 *
 * Accessibility: the wrapper carries aria-label "1997." and the rolling
 * stack is aria-hidden; reduced motion renders the static year.
 */
const ROWS = ["2026.", "2014.", "2005.", "1999.", "1997."];

export function OdometerYear() {
  const reduced = useReducedMotion() ?? false;

  if (reduced) return <>1997.</>;

  return (
    <span
      aria-label="1997."
      role="text"
      className="inline-block overflow-hidden align-baseline"
      // Italic Cormorant digits have no descenders; 1em at the parent's
      // tight leading holds exactly one row. pr keeps the italic tail of
      // "7." from clipping on the mask's right edge.
      style={{ height: "1em", lineHeight: 1, paddingRight: "0.06em" }}
    >
      <motion.span
        aria-hidden
        className="block will-change-transform"
        initial={{ y: "0%" }}
        animate={{ y: ["0%", "-20%", "-40%", "-60%", "-80%"] }}
        transition={{
          delay: 2.6,
          duration: 1.6,
          times: [0, 0.32, 0.58, 0.8, 1],
          ease: "easeOut",
        }}
      >
        {ROWS.map((year) => (
          <span key={year} className="block" style={{ height: "1em", lineHeight: 1 }}>
            {year}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
