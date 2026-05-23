"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
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
      className="relative overflow-hidden bg-navy py-24 text-paper md:py-32"
    >
      {/* faint giant wordmark */}
      <motion.span
        aria-hidden
        style={{ x: wordX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[28vw] font-semibold leading-none tracking-tight text-cream/[0.045] whitespace-nowrap"
      >
        Ritchie.
      </motion.span>

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 text-center lg:px-12">
        <Eyebrow variant="display" tone="crimson-bright" center>
          Let&rsquo;s get started
        </Eyebrow>
        <h2 className="mt-5 font-serif text-[clamp(36px,5vw,72px)] leading-[1.03] tracking-[-0.02em]">
          Your next move
          <br />
          begins with a{" "}
          <em className="not-italic italic text-crimson-bright">hello.</em>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: ease.out, delay: 0.1 }}
          className="mt-9 inline-block"
        >
          <MagneticButton
            href="/contact"
            data-cursor-label="Call"
            className="inline-flex items-center gap-3 bg-paper px-10 py-4.5 text-[12px] font-medium uppercase tracking-[0.14em] text-navy transition-colors hover:bg-cream-warm"
          >
            Talk to Ritchie
            <span aria-hidden>&rarr;</span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
