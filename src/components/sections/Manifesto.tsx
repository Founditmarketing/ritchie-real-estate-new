"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ease } from "@/lib/motion";

/**
 * A type-only section break on the dark canvas. One plain sentence carries
 * the whole brand: "One closing at a time." — lifted from Matt's own story
 * copy in the Broker section. No image, no card. Sits between the hero and
 * the market band, a held breath before the data.
 *
 * Scroll-driven choreography: the first line drifts in from the left while
 * the second trails from the right; both settle centered as the section
 * enters view.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Small fixed-pixel drift instead of vw units so the words never leave
  // the viewport on small screens. On desktop this still reads as motion
  // because the type is huge relative to the drift; on mobile it stays
  // safely contained within container padding.
  const w1X = useTransform(scrollYProgress, [0, 0.5, 1], [-32, 0, 22]);
  const w2X = useTransform(scrollYProgress, [0, 0.5, 1], [26, 0, -18]);

  // NOTE (perf): the ink fill used to be scroll-LINKED — a useTransform
  // recomputing clip-path on both lines every scroll frame, with
  // will-change: clip-path permanently promoting two full-width layers of
  // 270px type. Repainting text that size per frame blew the frame budget,
  // and because Lenis drives scrolling from rAF, a blown frame doesn't just
  // drop — the whole page stops scrolling ("sticky scroll", reported
  // 2026-07-26). It's now a ONE-SHOT whileInView sweep: same pen-stroke
  // read, zero per-frame cost. Only the cheap compositor-only x drift below
  // stays scroll-linked.

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-navy-deep py-20 md:py-44"
    >
      {/* Crimson ember wash, low and central, lighting the type from below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_120%,oklch(0.50_0.19_24/0.28)_0%,transparent_65%)]"
      />
      {/* Ghost diamond mark, mid-left, distant scale  */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 top-1/2 hidden -translate-y-1/2 md:block"
      >
        <svg width="380" height="440" viewBox="0 0 120 140">
          <polygon
            points="60,4 116,70 60,136 4,70"
            fill="none"
            stroke="oklch(0.64 0.21 24)"
            strokeWidth="0.8"
            opacity="0.22"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: ease.outExpo }}
          className="block text-center font-sans text-[11px] uppercase tracking-[0.32em] text-crimson-bright"
        >
          How this market got learned
        </motion.span>

        {/*
          Clamp floor accommodates the longest line ("One closing") inside
          the container at the smallest viewport: ~11 glyphs of Cormorant
          italic at 40px stays inside a 280px-48px container even with
          ~22px scroll drift. vw multiple drops from 18 to 13.5 for the
          same reason — the lines are longer than the old two words.
        */}
        <h2 className="mt-10 select-none text-center font-serif font-medium leading-[0.92] tracking-[-0.045em] text-paper">
          <InkLine
            drift={w1X}
            animate={!reduced}
            text="One closing"
            fillClass="text-paper"
          />
          <InkLine
            drift={w2X}
            animate={!reduced}
            delay={0.18}
            text="at a time."
            fillClass="text-crimson-bright"
          />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.15 }}
          className="mx-auto mt-9 max-w-[52ch] text-center font-serif text-[clamp(17px,1.4vw,22px)] font-normal italic leading-[1.55] text-cream-warm md:mt-12"
        >
          Anybody can pull a listing off the MLS. Knowing what a Garden
          District lot really trades for, or which commercial corridor is
          about to turn, takes a lifetime in Central Louisiana.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: ease.outExpo, delay: 0.3 }}
          className="mx-auto mt-14 h-px w-24 origin-left bg-crimson-bright"
        />
        <p className="mt-5 text-center font-sans text-[10.5px] uppercase tracking-[0.28em] text-mute">
          Matt Ritchie &mdash; Broker, Owner
        </p>
      </div>
    </section>
  );
}

/**
 * One giant line of the manifesto: a ghost outline of the type sits in
 * the layout, and an identical filled copy floods over it left-to-right
 * when the line enters view. Both copies share the drift transform so
 * they stay perfectly registered; the ghost outline is aria-hidden so AT
 * reads the line once. `animate={false}` (reduced motion) renders only
 * the filled copy, statically.
 *
 * The sweep runs ONCE (`viewport.once`) and is not scroll-linked — see
 * the perf note in Manifesto above. No will-change here on purpose: it
 * would keep a full-width layer of 270px type promoted for the life of
 * the page to buy nothing after the first 0.9s.
 */
function InkLine({
  drift,
  animate,
  delay = 0,
  text,
  fillClass,
}: {
  drift: MotionValue<number>;
  animate: boolean;
  delay?: number;
  text: string;
  fillClass: string;
}) {
  const sizing = "block text-[clamp(40px,13.5vw,270px)] tracking-[-0.045em] italic";
  if (!animate) {
    return (
      <motion.span style={{ x: drift }} className={`${sizing} ${fillClass} relative`}>
        {text}
      </motion.span>
    );
  }
  return (
    <motion.span style={{ x: drift }} className={`${sizing} relative`}>
      {/* Ghost outline — holds layout and reads as the "unwritten" line */}
      <span
        aria-hidden
        className="text-transparent"
        style={{ WebkitTextStroke: "1px color-mix(in oklch, var(--color-cream) 30%, transparent)" }}
      >
        {text}
      </span>
      {/* The ink flooding in — one pass, then it's just static text.
          NOT aria-hidden: this is the copy assistive tech reads (the
          ghost outline above is the decorative one). */}
      <motion.span
        className={`absolute inset-0 ${fillClass}`}
        initial={{ clipPath: "inset(-5% 100% -5% 0)" }}
        whileInView={{ clipPath: "inset(-5% 0% -5% 0)" }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.95, ease: ease.outExpo, delay }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}
