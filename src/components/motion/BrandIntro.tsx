"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { ease } from "@/lib/motion";

const SEEN_KEY = "rre-intro-seen";
/** Curtain starts lifting at this point; total occupation ~2.6s. */
const LIFT_AT_MS = 1900;

/**
 * Opening title sequence — the Ritchie diamond draws itself, the wordmark
 * tracks in, then the whole overlay lifts like a curtain onto the hero.
 * Once per browser session (sessionStorage), any tap/click skips it, and
 * prefers-reduced-motion never sees it. Dark-scope so the field stays
 * cinematic royal navy in both the dark and light themes.
 *
 * Server-renders visible (opaque cover) so first paint IS the title card —
 * no hero flash before it. Repeat visitors get one dark frame that fades
 * out immediately in the mount effect.
 */
export function BrandIntro() {
  const reduced = useReducedMotion() ?? false;
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (reduced) {
      setShow(false);
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked — play it; worst case it repeats */
    }
    if (seen) {
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(false), LIFT_AT_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="presentation"
          onClick={() => setShow(false)}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: ease.outExpo }}
          className="dark-scope fixed inset-0 z-[90] flex flex-col items-center justify-center bg-navy-ink"
        >
          {/* Faint ember floor, same family as the hero's glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_115%,oklch(0.48_0.185_14/0.30)_0%,transparent_65%)]"
          />

          {/* The diamond draws itself */}
          <svg
            width="92"
            height="108"
            viewBox="0 0 120 140"
            fill="none"
            aria-hidden
            className="relative"
          >
            <motion.polygon
              points="60,4 116,70 60,136 4,70"
              stroke="var(--color-cream)"
              strokeWidth="2.5"
              fill="none"
              strokeLinejoin="miter"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut", delay: 0.1 }}
            />
            <motion.polygon
              points="60,14 107,70 60,126 13,70"
              fill="var(--color-crimson)"
              stroke="none"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: ease.outExpo, delay: 0.75 }}
              style={{ transformOrigin: "60px 70px" }}
            />
            <motion.text
              x="60"
              y="86"
              textAnchor="middle"
              fontSize="46"
              fontFamily="var(--font-serif), serif"
              fontWeight="500"
              fill="var(--color-paper)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            >
              R
            </motion.text>
          </svg>

          {/* Wordmark tracks in */}
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.55em", y: 8 }}
            animate={{ opacity: 1, letterSpacing: "0.34em", y: 0 }}
            transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.7 }}
            className="relative mt-8 pl-[0.34em] font-serif text-[19px] font-medium uppercase text-cream"
          >
            Ritchie Real Estate
          </motion.span>

          {/* Cranberry rule + the fact line */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: ease.outExpo, delay: 1.15 }}
            className="relative mt-6 h-px w-16 bg-crimson-bright"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.35 }}
            className="relative mt-5 font-sans text-[10.5px] uppercase tracking-[0.32em] text-cream-warm"
          >
            Central Louisiana &middot; Since 1997
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
