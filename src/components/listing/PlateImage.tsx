"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { type Listing } from "@/lib/listings";

/**
 * Cover image for a listing plate that crossfades to a second photo on
 * hover for multi-image listings. Single-image listings degrade
 * gracefully (just the regular image, no hover swap). Composes the
 * existing scale-on-hover by letting the wrapper handle the scale
 * while we handle the fade.
 *
 * Lives in its own client island so server plates can include it
 * without forcing the whole plate to be client-rendered.
 */
export function PlateImage({
  listing,
  sizes,
  priority = false,
}: {
  listing: Listing;
  sizes: string;
  priority?: boolean;
}) {
  const cover = listing.images[0];
  const second = listing.images[1];
  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute inset-0 transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover saturate-[0.88]"
      />
      <AnimatePresence>
        {second && hover ? (
          <motion.div
            key="second"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={second.src}
              alt={second.alt}
              fill
              sizes={sizes}
              className="object-cover saturate-[0.88]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {/*
        Unified photographic grade — every plate (including the hover
        crossfade above) passes through the same warm-dusk treatment so
        mixed-source photography reads as one world:
        1. a navy bed rising from the bottom seats the photo into the
           dark canvas;
        2. a soft-light sodium cast reusing the hero's exact warm value
           (oklch 0.65 0.12 36) matches the cinematic temperature.
        Kept at /0.10 so listings stay honest photos, not renders.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-ink/40 via-transparent to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[oklch(0.65_0.12_36/0.10)] mix-blend-soft-light"
      />
    </div>
  );
}
