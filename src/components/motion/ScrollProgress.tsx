"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Global scroll-progress hairline: a 2px crimson line that grows across
 * the very top of the viewport as the page scrolls. The always-visible
 * motion cue on phones (where the hero's scroll pip is hidden) and a
 * quiet one on desktop. Sits above the fixed header hairline.
 */
export function ScrollProgress() {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-crimson-bright/80"
    />
  );
}
