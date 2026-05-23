"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  durationSec?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Infinite horizontal scroller. Renders content twice for a seamless loop.
 */
export function Marquee({
  children,
  durationSec = 30,
  reverse = false,
  className,
}: MarqueeProps) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <motion.div
        className="flex w-max gap-12"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: durationSec, ease: "linear", repeat: Infinity }}
      >
        <div className="flex gap-12 shrink-0">{children}</div>
        <div className="flex gap-12 shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
