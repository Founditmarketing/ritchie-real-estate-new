"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { type Listing } from "@/lib/listings";
import { ease } from "@/lib/motion";

/**
 * Full-bleed cinematic hero for a single listing. Title settles in the
 * lower-left at gigantic size, slate metadata sits top-right like a film
 * credit. Photo parallaxes gently on scroll. Replaces the previous
 * left-aligned "header above gallery" approach.
 */
export function ListingHero({ listing }: { listing: Listing }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const cover = listing.images[0];

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[88svh] flex-col overflow-hidden bg-navy-ink text-paper"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y: photoY, scale: photoScale }}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Bottom darken for type contrast; top lightly washed */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.16_0.07_262/0.32)_0%,transparent_28%,oklch(0.16_0.07_262/0.30)_55%,oklch(0.10_0.05_262/0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_82%,oklch(0.10_0.05_262/0.55)_0%,transparent_60%)]" />
      </motion.div>

      {/* TOP SLATE — addresses & plate # */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] items-start justify-between px-6 pt-32 lg:px-12"
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.25 }}
          className="font-sans text-[10.5px] uppercase tracking-[0.32em] text-cream-warm/85"
        >
          <span className="text-crimson-bright">
            {listing.status === "active" ? "Active" : listing.status}
          </span>
          <span className="mx-3 text-cream-warm/40">/</span>
          {listing.address.city}, LA
          <span className="mx-3 text-cream-warm/40">/</span>
          {listing.type}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.35 }}
          className="text-right font-sans text-[10.5px] uppercase tracking-[0.32em] text-cream-warm/85"
        >
          {listing.address.neighborhood ? (
            <>
              {listing.address.neighborhood}
              <span className="mx-3 text-cream-warm/40">/</span>
            </>
          ) : null}
          {listing.address.zip}
        </motion.div>
      </motion.div>

      {/* TITLE BLOCK */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="relative z-10 mx-auto mt-auto w-full max-w-[1440px] px-6 pb-20 lg:px-12 lg:pb-28"
      >
        {listing.badge ? (
          <Beat delay={0.05} reduced={reduced}>
            <span className="inline-block border border-cream/40 px-3 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.22em] text-cream">
              {listing.badge}
            </span>
          </Beat>
        ) : null}

        {/* Do NOT add a `ch`-based max-width here. `ch` resolves against
            the h1's inherited 16px font-size, not the 140px clamp on the
            children inside the Beat \u2014 it would shrink the container to
            ~144px and clip the property title. Width is bounded by the
            outer 1440px container. */}
        <h1 className="mt-7 font-serif font-medium tracking-[-0.025em] text-paper [text-shadow:0_2px_60px_oklch(0.10_0.05_262/0.55)]">
          <Beat delay={0.13} block reduced={reduced}>
            {/* leading 1.02 keeps Cormorant ascenders/descenders inside
                the Beat's overflow-hidden mask. */}
            <span className="block text-[clamp(50px,9vw,140px)] leading-[1.02]">
              {listing.title}
            </span>
          </Beat>
        </h1>

        <Beat delay={0.22} block reduced={reduced}>
          <p className="mt-6 flex items-center gap-3 font-serif text-[clamp(15px,1.4vw,20px)] italic text-cream-warm">
            <span className="h-px w-7 bg-crimson-bright" />
            {listing.address.street}, {listing.address.city}
          </p>
        </Beat>
      </motion.div>

      {/* SCROLL CUE \u2014 desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: ease.outExpo, delay: 1.2 }}
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 text-center md:block"
        aria-hidden
      >
        <span className="block font-sans text-[10px] uppercase tracking-[0.32em] text-cream-warm/70">
          Below
        </span>
        <span className="relative mx-auto mt-2 block h-9 w-px overflow-hidden bg-cream/25">
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

function Beat({
  children,
  delay = 0,
  block = false,
  reduced = false,
}: {
  children: React.ReactNode;
  delay?: number;
  block?: boolean;
  reduced?: boolean;
}) {
  if (reduced) {
    return <span className={block ? "block" : "inline-block"}>{children}</span>;
  }
  return (
    <span className={`${block ? "block" : "inline-block"} overflow-hidden`}>
      <motion.span
        className={block ? "block" : "inline-block"}
        initial={{ y: "104%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.55, ease: ease.outExpo, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
