"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

/**
 * Animates from 0 → `to` the first time it scrolls into view.
 */
export function Counter({ to, prefix = "", suffix = "", duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.19, 1, 0.22, 1],
      onUpdate(v) {
        setVal(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}
