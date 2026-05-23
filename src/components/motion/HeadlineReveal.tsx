"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Scroll-triggered mask reveal for editorial section headlines. Wraps
 * each child in an overflow-hidden span and slides it up from below.
 * Lines must be passed as an array of children (typically <span>s with
 * `block` so each one is its own line). Once-in-view by default.
 *
 * Respects prefers-reduced-motion: returns children inline without
 * masking when set.
 */
export function HeadlineReveal({
  children,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode[];
  stagger?: number;
  delay?: number;
}) {
  const reduced = useReducedMotion() ?? false;

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <>
      {children.map((child, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "104%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: ease.outExpo, delay: delay + i * stagger }}
          >
            {child}
          </motion.span>
        </span>
      ))}
    </>
  );
}
