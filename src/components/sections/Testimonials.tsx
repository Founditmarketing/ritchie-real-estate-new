"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stars } from "@/components/ui/Stars";
import { testimonials } from "@/content/testimonials";
import { ease } from "@/lib/motion";

/**
 * Testimonials carousel. The previous version felt empty because every
 * piece of evidence was just typed words. This version:
 *
 *   - Renders a giant ghosted serif open-quote behind the testimonial
 *     so the section has visual weight even before the body kicks in.
 *   - Pulls the quote bigger and gives the avatar/name a left rail.
 *   - Surfaces the property + transaction value beneath the role line,
 *     turning "review" into "case study" \u2014 each quote anchored to a
 *     real Cenla property with a real number.
 *   - Stars are SVG (see ui/Stars) so they read as designed marks
 *     instead of Unicode placeholder asterisks.
 *   - Cross-fades in-place without `mode="wait"` so the slide area
 *     never goes blank between transitions.
 */
export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonials[i];

  useEffect(() => {
    const id = window.setInterval(
      () => setI((v) => (v + 1) % testimonials.length),
      8000,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-navy-deep py-24 md:py-32">
      {/* Giant ghost open-quote, anchored upper-left, ambient. */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-[-2vw] top-[18%] font-serif text-[42vw] font-medium leading-[0.7] text-crimson-bright/[0.07] select-none md:left-[-1vw] md:text-[30vw]"
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal>
          <div className="mx-auto mb-12 max-w-[680px] text-center">
            <Eyebrow variant="display" tone="crimson-bright" center>
              In their words
            </Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.04] text-paper">
              Cenla doesn&rsquo;t just hire Ritchie.
              <br />
              It <em className="not-italic italic text-crimson-bright">refers</em> us.
            </h2>
          </div>
        </Reveal>

        <div className="relative mx-auto min-h-[420px] max-w-[960px] md:min-h-[360px]">
          <AnimatePresence initial={false}>
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55, ease: ease.outExpo }}
              className="absolute inset-0 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-[auto_1fr] md:items-start"
            >
              {/* LEFT: avatar + name + role + property */}
              <figcaption className="flex flex-col items-center text-center md:items-start md:text-left">
                {t.avatar ? (
                  <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-cream/20">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="mt-5 font-serif text-[22px] font-semibold not-italic text-paper">
                  {t.name}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-crimson-bright">
                  {t.role}
                </div>
                {t.property ? (
                  <div className="mt-5 max-w-[28ch] border-t border-line pt-4 font-serif text-[14px] italic leading-[1.5] text-mute md:max-w-none">
                    {t.property}
                    {t.transaction ? (
                      <span className="ml-2 font-sans text-[11px] not-italic uppercase tracking-[0.2em] text-cream">
                        {t.transaction}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </figcaption>

              {/* RIGHT: quote + stars */}
              <div className="md:pl-10 md:border-l md:border-line">
                <Stars rating={t.rating ?? 5} size={15} />
                <blockquote className="mt-5 font-serif text-[clamp(22px,2.4vw,32px)] font-medium leading-[1.35] italic text-paper">
                  <span aria-hidden className="mr-1 text-crimson-bright">
                    &ldquo;
                  </span>
                  {t.quote}
                  <span aria-hidden className="ml-0.5 text-crimson-bright">
                    &rdquo;
                  </span>
                </blockquote>
              </div>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center gap-2.5">
          {testimonials.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Show testimonial ${n + 1}`}
              data-cursor-label={`${n + 1}/${testimonials.length}`}
              onClick={() => setI(n)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                n === i ? "scale-125 bg-crimson-bright" : "bg-cream/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
