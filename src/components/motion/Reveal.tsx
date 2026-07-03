"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "section" | "header" | "footer" | "article" | "li" | "p" | "h1" | "h2" | "h3";
  className?: string;
  /** Stop watching after first reveal. Defaults to true. */
  once?: boolean;
  amount?: number;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade + rise on scroll. Single source of truth for "appear" motion across
 * the site so the cadence stays consistent.
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  as = "div",
  className,
  once = true,
  amount = 0.25,
}: RevealProps) {
  const MotionTag = motion[as] as typeof motion.div;
  // JS-driven tweens bypass the global CSS reduced-motion clamp, so the
  // gate has to live here (see DESIGN.md's reduced-motion contract).
  const reduced = useReducedMotion() ?? false;
  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: duration.slow, ease: ease.out, delay }}
    >
      {children}
    </MotionTag>
  );
}

export { variants as revealVariants };
