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

    // Tuning note (2026-07-26, "scrolling feels stuck"): this used to be
    // duration 1.1 with a quartic ease-out. Quartic has a very long, very
    // slow tail — the page kept creeping for the better part of a second
    // after the wheel stopped, and a new wheel tick landing inside that
    // tail read as unresponsive. Shorter duration + cubic settles crisply
    // and still glides. Touch is deliberately left native (Lenis only
    // syncs touch when syncTouch is on, which it is not) — iOS momentum
    // scrolling is better than anything we'd re-implement.
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Same-page anchors ride Lenis instead of the browser's instant jump,
    // so one scroll physics governs the whole site. Offset clears the
    // fixed header; focus keeps keyboard/AT context at the target.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href*="#"]',
      );
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", url.hash);
      // Kept in step with the wheel duration above so an anchor jump and a
      // manual scroll feel like the same page.
      lenis.scrollTo(target, { offset: -96, duration: 0.9 });
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
