"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Img = { src: string; alt: string };

/** Horizontal travel (px) that must clearly beat the vertical travel
    before a touch counts as a photo swipe rather than a page scroll. */
const SWIPE_THRESHOLD = 48;

/**
 * Cinematic gallery for a listing detail page. Dominant 16/9 hero with
 * cross-fade between frames, "01 / 04" counter overlaid, and a thin thumb
 * strip below. Arrow keys advance frames; on touch the frame swipes
 * (the editorial chevrons are desktop-only — at phone widths they were
 * covering half the photograph they exist to serve).
 */
export function ListingGallery({ images }: { images: Img[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const swipe = useRef<{ x: number; y: number; done: boolean } | null>(null);
  const active = images[i] ?? images[0];
  const count = images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowRight") setI((v) => (v + 1) % count);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  if (!active) return null;

  // Touch/pen swipe. touch-pan-y on the frame keeps vertical page scroll
  // native; a decisively horizontal drag advances the frame once per
  // gesture. Mouse users have the chevrons and arrow keys.
  const onPointerDown = (e: React.PointerEvent) => {
    if (count < 2 || e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY, done: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = swipe.current;
    if (!s || s.done) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    s.done = true;
    setI((v) => (dx < 0 ? (v + 1) % count : (v - 1 + count) % count));
  };
  const onPointerEnd = () => {
    swipe.current = null;
  };

  return (
    <section className="relative bg-navy-ink pb-4 pt-2">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <Eyebrow variant="italic" tone="crimson-bright">
            Photographs
          </Eyebrow>
          <span className="font-serif text-[15px] italic text-mute">
            <span className="text-paper">{String(i + 1).padStart(2, "0")}</span>
            <span className="mx-1.5">/</span>
            <span>{String(count).padStart(2, "0")}</span>
          </span>
        </div>

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          className="relative aspect-[16/9] w-full touch-pan-y overflow-hidden bg-navy"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.src}
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, ease: ease.outExpo }}
              className="absolute inset-0"
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority={i === 0}
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
                  "relative aspect-[4/3] overflow-hidden transition-[opacity,scale] duration-200 active:scale-[0.97]",
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
        "group absolute top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center bg-cream/85 text-navy-ink transition hover:bg-cream active:scale-95 md:flex",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      {/* Chevron nudges in the direction of travel — arrow-nudge vocabulary */}
      <span
        className={cn(
          "font-serif text-[26px] leading-none transition-transform duration-300 ease-out",
          side === "left"
            ? "group-hover:-translate-x-0.5"
            : "group-hover:translate-x-0.5",
        )}
      >
        {side === "left" ? "‹" : "›"}
      </span>
    </button>
  );
}
