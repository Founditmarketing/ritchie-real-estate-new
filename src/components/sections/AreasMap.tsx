"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { areas } from "@/content/areas";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { duration, ease } from "@/lib/motion";

/**
 * Cenla map. Hand-traced parish boundary + Red River + tributaries +
 * compass rose + scale bar + animated path drawing on first view. The
 * pins are graded by population (Alexandria largest, then Pineville,
 * etc) so the visual weight reads correctly at a glance.
 */
export function AreasMap() {
  const [active, setActive] = useState(areas[0].slug);
  const area = areas.find((a) => a.slug === active) ?? areas[0];

  return (
    <section id="areas" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <Eyebrow variant="numbered" num="05" tone="crimson">
                Know the area
              </Eyebrow>
              <h2 className="mt-5 font-serif text-[clamp(36px,5vw,72px)] leading-[0.98] tracking-[-0.02em] text-navy-ink">
                Where Central
                <br />
                Louisiana <em className="not-italic italic text-crimson">lives.</em>
              </h2>
            </div>
            <Link
              href="/areas"
              data-cursor-label="Guides"
              className="group inline-flex items-center gap-3 self-start text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson md:self-end"
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
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.25fr_0.75fr]">
            {/* Desktop: crafted SVG map (labels remain legible at \u2265 lg width).
                Mobile/tablet: a stacked area-picker that respects tap-target
                ergonomics and keeps the area names readable at any size. */}
            <div className="hidden lg:block">
              <CenlaMap active={active} onSelect={setActive} />
            </div>
            <AreaPicker active={active} onSelect={setActive} className="lg:hidden" />

            <div className="flex flex-col justify-center lg:pl-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={area.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: duration.base, ease: ease.out }}
                >
                  <Eyebrow variant="italic" tone="crimson">
                    {area.tagline}
                  </Eyebrow>
                  <div className="mt-3 font-serif text-[clamp(44px,5vw,72px)] font-semibold leading-[0.95] tracking-[-0.02em] text-navy-ink">
                    {area.name}
                    <span className="ml-3 font-serif text-[18px] font-normal italic text-ink-soft">
                      LA
                    </span>
                  </div>
                  <p className="mt-5 max-w-[40ch] text-[15px] font-light leading-[1.7] text-ink-soft">
                    {area.description}
                  </p>

                  <div className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t border-line pt-7">
                    {area.stats.map((s) => (
                      <div key={s.label}>
                        <b className="block font-serif text-[30px] font-semibold leading-none text-crimson">
                          {s.value}
                        </b>
                        <span className="mt-2 block text-[10.5px] uppercase tracking-[0.16em] text-ink-soft">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/areas/${area.slug}`}
                    data-cursor-label="Explore"
                    className="group mt-9 inline-flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson"
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
              data-cursor-label={a.name}
              className={`flex w-full items-baseline justify-between gap-4 border-b border-cream/12 px-5 py-5 text-left transition-colors ${
                on ? "bg-crimson/10" : "hover:bg-cream/5"
              }`}
            >
              <span className="flex items-baseline gap-3">
                <span
                  className={`font-serif text-[14px] italic transition-colors ${
                    on ? "text-crimson-bright" : "text-cream-warm/55"
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
              {/* Tagline shown only at \u2265sm. On phones the active row's full
                  detail panel below repeats it, so hiding here avoids the
                  overflow that was clipping "Bayou Jean de Jean." */}
              <span
                className={`hidden shrink-0 font-sans text-[10.5px] uppercase tracking-[0.18em] transition-colors sm:inline ${
                  on ? "text-crimson-bright" : "text-cream-warm/50"
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

function CenlaMap({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (s: string) => void;
}) {
  // Rapides Parish outline (stylized, hand-traced for editorial feel)
  const parish =
    "M 60 360 L 90 330 L 130 320 L 175 285 L 220 270 L 280 230 L 320 210 L 360 195 L 415 180 L 470 175 L 520 195 L 555 230 L 575 280 L 580 330 L 565 380 L 540 425 L 500 460 L 445 480 L 380 485 L 320 475 L 260 460 L 200 440 L 145 410 L 95 395 L 60 380 Z";
  // Red River — winds top-right to bottom-left
  const river =
    "M 550 100 Q 480 160 430 190 Q 380 220 330 240 Q 270 270 220 290 Q 170 320 130 360 Q 90 400 60 450";
  // Bayou Robert — eastern tributary
  const bayou1 = "M 380 250 Q 360 285 340 310 Q 320 340 300 360";
  // Bayou Rapides — western tributary
  const bayou2 = "M 220 290 Q 200 320 180 345 Q 160 365 145 385";

  return (
    <div className="relative overflow-hidden bg-navy-ink">
      <svg
        viewBox="0 0 640 520"
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="hash" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M -1 1 L 7 -7 M 0 6 L 6 0" stroke="oklch(0.50 0.18 22 / 0.06)" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* Backdrop wash */}
        <rect width="640" height="520" fill="oklch(0.18 0.08 262)" />

        {/* Parish fill + crosshatch (out-of-parish stays solid navy) */}
        <motion.path
          d={parish}
          fill="oklch(0.22 0.10 262)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: ease.outExpo }}
        />
        <motion.path
          d={parish}
          fill="url(#hash)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.1 }}
        />
        <motion.path
          d={parish}
          fill="none"
          stroke="oklch(0.62 0.20 24 / 0.5)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.8, ease: ease.outExpo }}
        />

        {/* Bayous (drawn before river, so river overlays) */}
        {[bayou1, bayou2].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="oklch(0.50 0.18 22 / 0.55)"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: ease.outExpo, delay: 0.6 + i * 0.15 }}
          />
        ))}

        {/* Red River — animated draw, bold */}
        <motion.path
          d={river}
          fill="none"
          stroke="oklch(0.62 0.20 24)"
          strokeWidth="2.4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.2, ease: ease.outExpo, delay: 0.3 }}
        />

        {/* River name */}
        <motion.text
          x="500"
          y="135"
          fontFamily="var(--font-serif)"
          fontStyle="italic"
          fontSize="13"
          fill="oklch(0.75 0.10 78)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          Red River
        </motion.text>

        {/* "Rapides Parish" label inside the shape */}
        <motion.text
          x="320"
          y="335"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="10"
          letterSpacing="3"
          fill="oklch(0.75 0.10 78 / 0.55)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          RAPIDES PARISH
        </motion.text>

        {/* Pins */}
        {areas.map((a, i) => {
          const on = a.slug === active;
          const cx = mapX(a.pin.x);
          const cy = mapY(a.pin.y);
          const r = a.pinR ?? 9;
          return (
            <g
              key={a.slug}
              data-cursor-label={a.name}
              tabIndex={0}
              role="button"
              aria-label={`Show ${a.name}`}
              onMouseEnter={() => onSelect(a.slug)}
              onFocus={() => onSelect(a.slug)}
              onClick={() => onSelect(a.slug)}
              className="cursor-pointer outline-none"
            >
              {on ? (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  initial={{ r: r, opacity: 0.55 }}
                  animate={{ r: r + 26, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: ease.out }}
                  fill="oklch(0.62 0.20 24)"
                />
              ) : null}
              <motion.circle
                cx={cx}
                cy={cy}
                initial={{ r, opacity: 0 }}
                whileInView={{ r, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: ease.outExpo, delay: 1.6 + i * 0.08 }}
                animate={{ r: on ? r + 4 : r }}
                fill={on ? "oklch(0.62 0.20 24)" : "oklch(0.50 0.18 22)"}
                stroke={on ? "oklch(0.95 0.018 78)" : "transparent"}
                strokeWidth={1.5}
              />
              <motion.text
                x={cx + r + 10}
                y={cy + 4}
                fontFamily="var(--font-sans)"
                fontSize={on ? 13 : 12}
                fontWeight={on ? 600 : 400}
                fill={on ? "oklch(0.97 0.012 80)" : "oklch(0.89 0.025 72)"}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.7 + i * 0.08 }}
                className="pointer-events-none transition-[fill,font-size,font-weight]"
              >
                {a.name}
              </motion.text>
            </g>
          );
        })}

        {/* Compass rose, top-right */}
        <motion.g
          transform="translate(595 60)"
          initial={{ opacity: 0, rotate: -20 }}
          whileInView={{ opacity: 0.7, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: ease.outExpo, delay: 1.8 }}
        >
          <circle r="18" fill="none" stroke="oklch(0.89 0.025 72 / 0.5)" strokeWidth="0.6" />
          <path d="M 0 -18 L 3 0 L 0 18 L -3 0 Z" fill="oklch(0.62 0.20 24)" />
          <text y="-22" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="9" fill="oklch(0.89 0.025 72)">N</text>
        </motion.g>

        {/* Scale bar, bottom-left */}
        <motion.g
          transform="translate(30 485)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          <line x1="0" y1="0" x2="80" y2="0" stroke="oklch(0.89 0.025 72 / 0.6)" strokeWidth="0.8" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="oklch(0.89 0.025 72 / 0.6)" strokeWidth="0.8" />
          <line x1="40" y1="-3" x2="40" y2="3" stroke="oklch(0.89 0.025 72 / 0.4)" strokeWidth="0.8" />
          <line x1="80" y1="-3" x2="80" y2="3" stroke="oklch(0.89 0.025 72 / 0.6)" strokeWidth="0.8" />
          <text y="14" fontFamily="var(--font-sans)" fontSize="8" fill="oklch(0.89 0.025 72 / 0.6)" letterSpacing="1.5">
            {"0 \u2014 5 \u2014 10 MI"}
          </text>
        </motion.g>

        {/* Coordinate gridlines (subtle) */}
        <g stroke="oklch(0.89 0.025 72 / 0.05)" strokeWidth="0.5">
          <line x1="160" y1="0" x2="160" y2="520" />
          <line x1="320" y1="0" x2="320" y2="520" />
          <line x1="480" y1="0" x2="480" y2="520" />
          <line x1="0" y1="130" x2="640" y2="130" />
          <line x1="0" y1="260" x2="640" y2="260" />
          <line x1="0" y1="390" x2="640" y2="390" />
        </g>

        {/* Coordinate corner labels */}
        <text x="6" y="14" fontFamily="var(--font-sans)" fontSize="8" letterSpacing="2" fill="oklch(0.89 0.025 72 / 0.4)">
          {"31.45\u00b0N / 92.7\u00b0W"}
        </text>
        <text x="634" y="514" textAnchor="end" fontFamily="var(--font-sans)" fontSize="8" letterSpacing="2" fill="oklch(0.89 0.025 72 / 0.4)">
          {"31.2\u00b0N / 92.3\u00b0W"}
        </text>
      </svg>
    </div>
  );
}

// Scale 600x520 pin coords (existing data) into the new 640x520 viewport
function mapX(x: number) {
  return x * (640 / 600);
}
function mapY(y: number) {
  return y;
}
