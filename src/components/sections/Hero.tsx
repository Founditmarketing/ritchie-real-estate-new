"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ease } from "@/lib/motion";

/**
 * Hero — committed editorial typography over a cinematic Alexandria
 * aerial. Three-beat headline ladder, ambient breathing parallax, soft
 * mousemove drift, animated diamond watermark, scroll cue. The photo is
 * the environment; the type is the statement.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Scroll-linked parallax (subtle, the headline drives the moment).
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const bgScaleScroll = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  // Mousemove drift — gives the hero a sense of physical presence.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const driftX = useSpring(mx, { stiffness: 60, damping: 22, mass: 1 });
  const driftY = useSpring(my, { stiffness: 60, damping: 22, mass: 1 });

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      // -1..1 normalized
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx * 18);
      my.set(ny * 12);
    };
    window.addEventListener("pointermove", handler, { passive: true });
    return () => window.removeEventListener("pointermove", handler);
  }, [mx, my]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-navy-ink text-paper"
    >
      {/* CINEMATIC BACKDROP ----------------------------------------- */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: bgY, scale: bgScaleScroll }}>
        <motion.div
          className="absolute inset-0"
          style={{ x: driftX, y: driftY }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        >
          <Image
            src="/hero/alexandria-riverfront.png"
            alt="Downtown Alexandria, Louisiana, at sunset, with the Red River and the riverfront amphitheater"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_38%]"
          />
        </motion.div>

        {/* Sky breathes (top is sunset-warm + soft-light cast). Darkening
            ramps up earlier so the entire copy zone (~45-100% of viewport
            height) reads cleanly even over busy parts of the photograph.
            Previously the dark only kicked in at 92% which left the italic
            "Ritchie." sitting over the riverfront amphitheater with low
            contrast. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.16_0.07_262/0.18)_0%,oklch(0.16_0.07_262/0.10)_22%,oklch(0.16_0.07_262/0.55)_50%,oklch(0.10_0.05_262/0.88)_82%,oklch(0.10_0.05_262/0.97)_100%)]" />
        {/* Stronger vignette pulling focus to the lower-left where the
            headline lives. Increases ink behind the title without flattening
            the right side where the river/amphitheater detail sits. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_22%_72%,oklch(0.10_0.05_262/0.78)_0%,transparent_55%)]" />
        {/* Warm sunset cast on the upper third */}
        <div className="absolute inset-x-0 top-0 h-[38%] bg-[linear-gradient(180deg,oklch(0.60_0.10_30/0.20)_0%,transparent_100%)] mix-blend-soft-light" />
      </motion.div>

      {/* TOP SLATE — film-style timestamp + brand mark watermark ----- */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] items-start justify-between px-6 pt-32 lg:px-12">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.3 }}
          className="font-sans text-[10.5px] uppercase tracking-[0.32em] text-cream-warm/85"
        >
          <span className="text-crimson-bright">N 31.3°</span>
          <span className="mx-3 text-cream-warm/40">/</span>
          Alexandria, LA
          <span className="mx-3 text-cream-warm/40">/</span>
          Est. 2003
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -10 }}
          animate={{ opacity: 0.55, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, ease: ease.outExpo, delay: 0.45 }}
          className="hidden md:block"
          aria-hidden
        >
          <LogoMark tone="light" size={72} />
        </motion.div>
      </div>

      {/* THE STATEMENT --------------------------------------------- */}
      <motion.div
        style={{ opacity: copyOpacity, y: copyY }}
        className="relative z-10 mx-auto mt-auto w-full max-w-[1440px] px-6 pb-24 sm:pb-28 lg:px-12 lg:pb-32"
      >
        {/*
          Type sized to fit Cormorant Garamond at every breakpoint without
          clipping. At 390px the longest line ("Louisiana") renders at
          ~42px and stays well inside the viewport's 24px padding. The
          italic "Ritchie." caps at a slightly smaller multiple so the
          punctuation tail doesn't crash into the viewport edge either.
        */}
        {/*
          NOTE on line-height: Beat wraps each line in `overflow-hidden`
          for the mask-reveal animation. Cormorant Garamond ascenders and
          descenders extend ~5% past the line-box, so any `leading` value
          below ~1.0 clips glyphs at large desktop sizes. Use 1.02 for
          upright lines and 0.98 for the italic (italics are taller in
          Cormorant; 0.98 leaves room for the dot in "Ritchie." without
          inflating the headline rhythm).
        */}
        <h1 className="font-serif font-medium tracking-[-0.025em] text-paper [text-shadow:0_2px_60px_oklch(0.10_0.05_262/0.6)] max-w-full sm:max-w-[18ch]">
          <Beat block delay={0.05} reduced={reduced} className="text-[clamp(40px,9vw,148px)] leading-[1.02]">
            Central
          </Beat>
          <Beat block delay={0.13} reduced={reduced} className="text-[clamp(40px,9vw,148px)] leading-[1.02]">
            Louisiana
          </Beat>
          <span className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 sm:gap-x-5">
            <Beat
              delay={0.22}
              reduced={reduced}
              className="text-[clamp(26px,4.2vw,68px)] font-light tracking-[-0.01em] text-cream-warm"
            >
              knows
            </Beat>
            <Beat
              delay={0.3}
              reduced={reduced}
              className="text-[clamp(54px,10vw,168px)] italic font-medium leading-[0.98] tracking-[-0.03em] text-crimson-bright"
            >
              Ritchie.
            </Beat>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: ease.outExpo, delay: 1.05 }}
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <div className="max-w-[44ch]">
            <p className="font-serif text-[clamp(18px,1.4vw,22px)] font-normal italic leading-[1.45] text-cream-warm">
              Two decades. A CCIM-credentialed broker. A team that treats every
              address like its own. Residential to commercial.
            </p>
            {/* Brand stamp on its own line: previously sat inline with the
                body copy where it read as a link / CTA rather than a
                tagline punctuation. */}
            <p className="mt-4 flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.26em] text-crimson-bright">
              <span className="h-px w-6 bg-current" />
              Ritchie know.
            </p>
          </div>

          <MagneticButton
            href="/listings"
            className="group inline-flex items-center gap-4 self-start border border-cream/40 bg-transparent px-7 py-4 text-[11.5px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-cream hover:text-navy-ink md:self-end"
            strength={32}
          >
            See what&rsquo;s on the market
            <span
              aria-hidden
              className="inline-block h-px w-9 bg-current transition-[width,transform] duration-500 ease-out group-hover:w-16"
            />
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* SCROLL CUE ------------------------------------------------ */}
      {/* Hidden on small screens: at <768px it reads as a floating widget
          competing with the brand mark. The global ScrollProgress hairline
          at the top of the page is the always-visible motion cue. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: ease.outExpo, delay: 1.6 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-center md:block"
        aria-hidden
      >
        <span className="block font-sans text-[10px] uppercase tracking-[0.32em] text-cream-warm/70">
          Scroll
        </span>
        <span className="relative mx-auto mt-2 block h-9 w-px bg-cream/25 overflow-hidden">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-crimson-bright"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: ease.inOut, repeatDelay: 0.2 }}
          />
        </span>
      </motion.div>
    </section>
  );
}

/**
 * Mask-reveal a single word or phrase. `block` makes the outer container
 * block-level so consecutive Beats stack as separate lines.
 *
 * Duration is 0.55s with a tight 80ms stagger between beats so the
 * "headline emerges from below the line" effect reads as a confident
 * editorial move, not a slow mystery reveal. Total time from delay 0 to
 * last beat settled: under one second.
 *
 * When `reduced` (prefers-reduced-motion) is true, the mask is skipped
 * entirely and we render the text statically. Motion's JS-driven tweens
 * bypass the global CSS reduced-motion override, so we have to opt in.
 */
function Beat({
  children,
  delay = 0,
  className,
  block = false,
  reduced = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  block?: boolean;
  reduced?: boolean;
}) {
  if (reduced) {
    return (
      <span className={`${block ? "block" : "inline-block"} ${className ?? ""}`}>
        {children}
      </span>
    );
  }
  return (
    <span
      className={`${block ? "block" : "inline-block align-baseline"} overflow-hidden`}
    >
      <motion.span
        className={`${block ? "block" : "inline-block"} ${className ?? ""}`}
        initial={{ y: "104%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.55, ease: ease.outExpo, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
