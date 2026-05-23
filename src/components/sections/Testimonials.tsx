"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { testimonials } from "@/content/testimonials";
import { ease } from "@/lib/motion";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];

  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % testimonials.length), 7000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal>
          <div className="mx-auto mb-14 max-w-[680px] text-center">
            <Eyebrow variant="display" tone="crimson" center>
              In their words
            </Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.04]">
              Cenla doesn&rsquo;t just hire Ritchie.
              <br />
              It <em className="not-italic italic text-crimson">refers</em> us.
            </h2>
          </div>
        </Reveal>

        <div className="relative mx-auto min-h-[320px] max-w-[880px]">
          {/*
            No `mode="wait"` here: with it, the outgoing slide must
            finish its exit before the new slide starts entering, which
            produced a visible blank gap. Without it, exit and enter
            crossfade in parallel \u2014 we absolutely position the figure
            so they can occupy the same space during the brief overlap.
          */}
          <AnimatePresence initial={false}>
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: ease.outExpo }}
              className="absolute inset-0 flex flex-col items-center text-center"
            >
              <blockquote className="font-serif text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.4] italic text-ink before:mr-1 before:content-['\201c'] before:text-crimson">
                {t.quote}
              </blockquote>
              <div className="mt-7 text-crimson tracking-[4px]" aria-label="Five-star review">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              {t.avatar ? (
                <div className="relative mt-6 h-14 w-14 overflow-hidden rounded-full">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="60px"
                    className="object-cover"
                  />
                </div>
              ) : null}
              <figcaption className="mt-4 font-serif text-[21px] font-semibold not-italic">
                {t.name}
              </figcaption>
              <span className="mt-1 text-[11px] uppercase tracking-[0.13em] text-crimson">
                {t.role}
              </span>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center gap-2.5">
          {testimonials.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Show testimonial ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                n === i ? "scale-125 bg-crimson" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
