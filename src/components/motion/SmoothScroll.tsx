"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Mounts a single Lenis instance for the whole app. Lenis hijacks the wheel
 * event and tweens scroll position with an eased curve, which is the
 * foundation every other scroll-driven animation in this site reads from.
 *
 * Disabled automatically for users with prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
