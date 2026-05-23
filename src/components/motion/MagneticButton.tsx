"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MagneticButtonProps = Omit<ComponentProps<typeof motion.a>, "ref" | "children"> & {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/**
 * Anchor that subtly tracks the cursor when it's nearby. The visible content
 * also translates a bit on top of the magnetic shell for added depth.
 */
export function MagneticButton({
  children,
  strength = 24,
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });

  return (
    <motion.a
      ref={ref}
      className={cn("relative inline-flex select-none", className)}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        x.set((mx / r.width) * strength);
        y.set((my / r.height) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
