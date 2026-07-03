"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { areas } from "@/content/areas";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { duration, ease } from "@/lib/motion";

/**
 * Cenla area explorer. An editorial list of the cities Ritchie works,
 * paired with a detail panel (tagline, blurb, stats) and links into the
 * full area guides. The stylized SVG "map" was removed: a generic vector
 * blob read as "not really Rapides Parish," so the content carries the
 * section instead.
 */
export function AreasMap() {
  const [active, setActive] = useState(areas[0].slug);
  const area = areas.find((a) => a.slug === active) ?? areas[0];

  return (
    <section id="areas" className="bg-navy-deep py-24 md:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <Eyebrow variant="numbered" num="05" tone="crimson-bright">
                Know the area
              </Eyebrow>
              <h2 className="mt-5 font-serif text-[clamp(36px,5vw,72px)] leading-[0.98] tracking-[-0.02em] text-paper">
                <HeadlineReveal>
                  {["Where Central", <span key="l2">Louisiana <em className="italic">lives.</em></span>]}
                </HeadlineReveal>
              </h2>
            </div>
            <Link
              href="/areas"
              data-cursor-label="Guides"
              className="group inline-flex items-center gap-3 self-start text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright transition-transform duration-150 ease-out active:scale-[0.98] md:self-end"
            >
              <span className="border-b border-current pb-1">All area guides</span>
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-14"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1fr]">
            <AreaPicker active={active} onSelect={setActive} />

            <div className="flex flex-col justify-center lg:pl-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={area.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                >
                  <Eyebrow variant="italic" tone="crimson-bright">
                    {area.tagline}
                  </Eyebrow>
                  <div className="mt-3 font-serif text-[clamp(44px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.02em] text-paper">
                    {area.name}
                    <span className="ml-3 font-serif text-[18px] font-normal italic text-mute">
                      LA
                    </span>
                  </div>
                  <p className="mt-5 max-w-[40ch] text-[15px] font-light leading-[1.7] text-cream-warm">
                    {area.description}
                  </p>

                  <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
                    {area.stats.map((s) => (
                      <div key={s.label}>
                        <b className="block font-serif text-[30px] font-semibold leading-none text-crimson-bright">
                          {s.value}
                        </b>
                        <span className="mt-2 block text-[10.5px] uppercase tracking-[0.16em] text-mute">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/areas#${area.slug}`}
                    data-cursor-label="Explore"
                    className="group mt-9 inline-flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright transition-transform duration-150 ease-out active:scale-[0.98]"
                  >
                    <span className="border-b border-current pb-1">
                      Explore {area.name}
                    </span>
                    <span
                      aria-hidden
                      className="inline-block h-px w-7 bg-current transition-[width] duration-500 ease-out group-hover:w-12"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

function AreaPicker({
  active,
  onSelect,
  className,
}: {
  active: string;
  onSelect: (s: string) => void;
  className?: string;
}) {
  return (
    <ul className={`flex flex-col bg-navy-ink ${className ?? ""}`}>
      {areas.map((a, i) => {
        const on = a.slug === active;
        return (
          <li key={a.slug}>
            <button
              type="button"
              onClick={() => onSelect(a.slug)}
              onMouseEnter={() => onSelect(a.slug)}
              data-cursor-label={a.name}
              className={`group flex w-full items-baseline justify-between gap-4 border-b border-cream/12 px-5 py-5 text-left transition-[background-color,translate,scale] duration-200 ease-out active:scale-[0.99] ${
                on ? "bg-crimson/10" : "hover:bg-cream/5"
              }`}
            >
              <span className="flex items-baseline gap-3 transition-transform duration-300 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1">
                <span
                  className={`font-serif text-[15px] italic transition-colors ${
                    on ? "text-crimson-bright" : "text-mute"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-serif text-[22px] font-medium transition-colors ${
                    on ? "text-paper" : "text-cream-warm"
                  }`}
                >
                  {a.name}
                </span>
              </span>
              <span
                className={`hidden shrink-0 font-sans text-[10.5px] uppercase tracking-[0.18em] transition-colors sm:inline ${
                  on ? "text-crimson-bright" : "text-mute"
                }`}
              >
                {a.tagline}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
