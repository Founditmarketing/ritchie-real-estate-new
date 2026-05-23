"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Subtle pointer-tracked perspective tilt + scale for a card-shaped
 * region. Tilt angle caps at ~5\u00b0 each axis (intentionally restrained \u2014
 * larger angles read as gimmick rather than craft). Springs smooth out
 * jitter as the pointer moves.
 *
 * Disabled implicitly on touch / coarse pointers because pointer events
 * won't fire continuously there \u2014 the card just sits flat.
 */
export function TiltCard({
  children,
  className,
  maxAngle = 5,
}: {
  children: ReactNode;
  className?: string;
  maxAngle?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxAngle, maxAngle]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxAngle, -maxAngle]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        px.set((e.clientX - (r.left + r.width / 2)) / r.width);
        py.set((e.clientY - (r.top + r.height / 2)) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
