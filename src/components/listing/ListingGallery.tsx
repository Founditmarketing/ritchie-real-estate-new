"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Img = { src: string; alt: string };

/**
 * Cinematic gallery for a listing detail page. Dominant 16/9 hero with
 * cross-fade between frames, "01 / 04" counter overlaid, navigation
 * arrows that read as editorial chevrons, and a thin thumb strip below.
 * Arrow keys advance frames.
 */
export function ListingGallery({ images }: { images: Img[] }) {
  const [i, setI] = useState(0);
  const active = images[i] ?? images[0];
  const count = images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setI((v) => (v + 1) % count);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  if (!active) return null;

  return (
    <section className="relative bg-navy-ink pb-4 pt-2">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <Eyebrow variant="italic" tone="crimson-bright">
            Photographs
          </Eyebrow>
          <span className="font-serif text-[14px] italic text-mute">
            <span className="text-paper">{String(i + 1).padStart(2, "0")}</span>
            <span className="mx-1.5 text-mute/50">/</span>
            <span>{String(count).padStart(2, "0")}</span>
          </span>
        </div>

        <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.src}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: ease.outExpo }}
              className="absolute inset-0"
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {count > 1 ? (
            <>
              <NavButton
                side="left"
                onClick={() => setI((v) => (v - 1 + count) % count)}
              />
              <NavButton
                side="right"
                onClick={() => setI((v) => (v + 1) % count)}
              />
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-6">
            {images.map((img, k) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Show photo ${k + 1}`}
                data-cursor-label={`Photo ${k + 1}`}
                className={cn(
                  "relative aspect-[4/3] overflow-hidden transition",
                  k === i
                    ? "outline outline-2 outline-crimson-bright outline-offset-2"
                    : "opacity-65 hover:opacity-100",
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      data-cursor-label={side === "left" ? "Prev" : "Next"}
      className={cn(
        "absolute top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center bg-cream/85 text-navy-ink transition hover:bg-cream",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <span className="font-serif text-[26px] leading-none">
        {side === "left" ? "\u2039" : "\u203a"}
      </span>
    </button>
  );
}
