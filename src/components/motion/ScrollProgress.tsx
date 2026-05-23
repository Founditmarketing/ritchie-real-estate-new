"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A 2px hairline pinned to the very top of the viewport that fills with
 * crimson as the page scrolls. Always-visible proof that the site has a
 * motion layer, even before the user interacts. Driven directly by
 * scrollYProgress through a spring so it has a small amount of inertia.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    mass: 0.3,
  });
  const scaleX = useTransform(smooth, (v) => v);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[9997] h-[2px] origin-left bg-crimson"
      style={{ scaleX }}
    />
  );
}
