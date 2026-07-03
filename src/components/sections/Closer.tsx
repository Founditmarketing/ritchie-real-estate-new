"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { ease } from "@/lib/motion";

/**
 * The finale is the site's one committed crimson moment: the accent that
 * has been a hairline and an italic all the way down the page becomes the
 * surface itself, so the closer reads as a destination rather than one
 * more navy band above the footer.
 */
export function Closer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Big background wordmark parallaxes across as you scroll past.
  const wordX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-crimson-deep py-20 text-paper md:py-36"
    >
      {/* Deepen the edges so the field reads graded, not flat */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_80%_at_50%_45%,oklch(0.52_0.19_22/0.85)_0%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_50px_oklch(0.30_0.14_20/0.55)]"
      />
      {/* faint giant wordmark, now a tone-on-tone deboss */}
      <motion.span
        aria-hidden
        style={reduced ? undefined : { x: wordX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[28vw] font-semibold leading-none tracking-tight text-paper/[0.06] whitespace-nowrap"
      >
        Ritchie.
      </motion.span>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <span className="inline-flex items-center justify-center gap-3 font-sans text-[11.5px] font-medium uppercase tracking-[0.26em] text-cream">
          <span aria-hidden className="h-px w-7 bg-cream/70" />
          Let&rsquo;s get started
          <span aria-hidden className="h-px w-7 bg-cream/70" />
        </span>
        <h2 className="mt-5 font-serif text-[clamp(36px,5vw,72px)] leading-[1.03] tracking-[-0.02em] text-paper">
          <HeadlineReveal>
            {["Your next move", <span key="l2">begins with a <em className="italic">hello.</em></span>]}
          </HeadlineReveal>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: ease.out, delay: 0.1 }}
          className="mt-10 flex flex-col items-center gap-5"
        >
          <MagneticButton
            href="/contact"
            data-cursor-label="Hello"
            className="group inline-flex w-full items-center justify-center gap-4 bg-paper px-8 py-5 text-[13px] font-medium uppercase tracking-[0.22em] text-navy-ink shadow-[0_24px_60px_-16px_oklch(0.20_0.12_20/0.7)] transition-colors hover:bg-cream md:w-auto md:px-12"
            strength={36}
          >
            Talk to Ritchie
            <span
              aria-hidden
              className="inline-block h-px w-9 bg-crimson transition-[width] duration-500 ease-out group-hover:w-16"
            />
          </MagneticButton>
          <a
            href="tel:+13184498919"
            className="font-sans text-[12px] uppercase tracking-[0.2em] text-cream/90 transition-colors hover:text-paper"
          >
            or call 318&middot;449&middot;8919
          </a>
        </motion.div>
      </div>
    </section>
  );
}
