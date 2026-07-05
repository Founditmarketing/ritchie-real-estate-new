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
        // The viewport trigger lives on the MASK (never clipped, so
        // IntersectionObserver sees its true size) and the slide is driven
        // via variant propagation to the inner span — observing the inner
        // directly fails because it starts fully clipped by the mask.
        // pb/-mb slack: Cormorant descenders overhang the line box and the
        // mask was shearing tails off "yard.", "ground.", etc.
        <motion.span
          key={i}
          className="-mb-[0.18em] block overflow-hidden pb-[0.18em]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.span
            className="block"
            variants={{ hidden: { y: "104%" }, visible: { y: "0%" } }}
            transition={{ duration: 0.6, ease: ease.outExpo, delay: delay + i * stagger }}
          >
            {child}
          </motion.span>
        </motion.span>
      ))}
    </>
  );
}
