"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ease } from "@/lib/motion";

/**
 * A type-only section break on the dark canvas. Two words carry the whole
 * brand: "Ritchie knows." No image, no card. Sits between the hero and the
 * market band, a held breath before the data.
 *
 * Scroll-driven choreography: "Ritchie" drifts in from the left while
 * "knows." trails from the right; both settle centered as the section
 * enters view.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
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
          The whole pitch, two words
        </motion.span>

        {/*
          Clamp floor accommodates the longest word ("Ritchie") inside the
          container at the smallest viewport. Cormorant italic at 48px keeps
          well inside a 280px-48px container even with ~22px scroll drift.
        */}
        <h2 className="mt-10 select-none text-center font-serif font-medium leading-[0.92] tracking-[-0.045em] text-paper [text-shadow:0_4px_70px_oklch(0.08_0.03_264/0.7)]">
          <motion.span
            style={{ x: w1X }}
            className="block text-[clamp(48px,18vw,360px)] tracking-[-0.045em] italic"
          >
            Ritchie
          </motion.span>
          <motion.span
            style={{ x: w2X }}
            className="block text-[clamp(48px,18vw,360px)] tracking-[-0.045em] italic text-crimson-bright"
          >
            knows.
          </motion.span>
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
          about to turn, takes a lifetime in Cenla.
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
