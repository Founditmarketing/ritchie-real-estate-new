"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ease } from "@/lib/motion";

export function Closer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Big background wordmark parallaxes across as you scroll past.
  const wordX = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-navy-ink py-16 text-paper md:py-32"
    >
      {/* Crimson ember glow behind the CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,oklch(0.50_0.19_24/0.20)_0%,transparent_65%)]"
      />
      {/* faint giant wordmark */}
      <motion.span
        aria-hidden
        style={{ x: wordX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[28vw] font-semibold leading-none tracking-tight text-cream/[0.05] whitespace-nowrap"
      >
        Ritchie.
      </motion.span>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center lg:px-12">
        <Eyebrow variant="display" tone="crimson-bright" center>
          Let&rsquo;s get started
        </Eyebrow>
        <h2 className="mt-5 font-serif text-[clamp(36px,5vw,72px)] leading-[1.03] tracking-[-0.02em]">
          <HeadlineReveal>
            {["Your next move", <>begins with a <em className="not-italic italic text-crimson-bright">hello.</em></>]}
          </HeadlineReveal>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: ease.out, delay: 0.1 }}
          className="mt-9 block w-full md:inline-block md:w-auto"
        >
          <MagneticButton
            href="/contact"
            data-cursor-label="Call"
            className="group inline-flex w-full items-center justify-center gap-4 bg-crimson px-8 py-5 text-[13px] font-medium uppercase tracking-[0.22em] text-cream shadow-[0_24px_60px_-16px_oklch(0.40_0.17_20/0.65)] transition-colors hover:bg-crimson-deep md:w-auto md:px-12"
            strength={36}
          >
            Talk to Ritchie
            <span
              aria-hidden
              className="inline-block h-px w-9 bg-current transition-[width] duration-500 ease-out group-hover:w-16"
            />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
