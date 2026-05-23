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
          animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        >
          {reduced ? (
            /* prefers-reduced-motion: just the poster image, no autoplay. */
            <Image
              src="/hero/hero-poster.jpg"
              alt="Downtown Alexandria, Louisiana, at sunset"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_38%]"
            />
          ) : (
            /* Explicit <source type="..."> with the avc1 codec string
               helps iOS Safari pick the right decoder immediately, which
               is what was making the video render less crisply on iPhone
               than Android. `disablePictureInPicture` + `disableRemotePlayback`
               prevent iOS from showing a tap-to-AirPlay overlay on the hero. */
            <video
              poster="/hero/hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover object-[60%_38%]"
            >
              <source
                src="/hero/hero.mp4"
                type='video/mp4; codecs="avc1.4D4028"'
              />
            </video>
          )}
        </motion.div>

        {/*
          Gradient deliberately restrained: previous version muddied the
          cityscape with a heavy radial vignette. Now the entire upper
          70% of the photo reads almost untouched, with darkening
          confined to the bottom band where the headline copy actually
          sits. The lower-left vignette is tightened to focus only the
          area immediately behind the type.
        */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_40%,oklch(0.10_0.05_262/0.35)_65%,oklch(0.10_0.05_262/0.82)_88%,oklch(0.10_0.05_262/0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_22%_82%,oklch(0.10_0.05_262/0.60)_0%,transparent_70%)]" />
        {/* Warm sunset cast on the upper third \u2014 amplifies the photo's
            existing warmth without changing exposure */}
        <div className="absolute inset-x-0 top-0 h-[42%] bg-[linear-gradient(180deg,oklch(0.65_0.12_30/0.15)_0%,transparent_100%)] mix-blend-soft-light" />
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
          for the mask-reveal animation. Cormorant ascenders/descenders
          extend ~5% past the line-box; any `leading` below ~1.0 clips
          glyphs at large desktop sizes. Use 1.02 for upright and 0.98
          for the italic ("Ritchie.").

          NOTE on width: NEVER constrain this h1 with `ch` units. `ch`
          resolves against the h1's own font-size (inherits 16px from
          body, not the 148px clamp on the children), so a value like
          `max-w-[18ch]` becomes ~144px on desktop and squeezes the huge
          headline text into a sliver \u2014 producing the persistent
          "chopped" rendering bug. The h1 takes full container width;
          each Beat is `block` so words wrap naturally per line.
        */}
        <h1 className="font-serif font-medium tracking-[-0.025em] text-paper [text-shadow:0_2px_60px_oklch(0.10_0.05_262/0.6)]">
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
              Ritchie knows.
            </p>
          </div>

          {/* Primary action: filled crimson on cream label, the loudest
              moment on the hero. Outline rationale was "editorial restraint"
              but it under-cued the most important click on the page. */}
          <MagneticButton
            href="/listings"
            data-cursor-label="Search"
            className="group inline-flex items-center gap-4 self-start bg-crimson px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-cream shadow-[0_18px_40px_-12px_oklch(0.40_0.17_20/0.6)] transition-colors hover:bg-crimson-deep md:self-end"
            strength={32}
          >
            See what&rsquo;s on the market
            <span
              aria-hidden
              className="inline-block h-px w-10 bg-current transition-[width] duration-500 ease-out group-hover:w-16"
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
