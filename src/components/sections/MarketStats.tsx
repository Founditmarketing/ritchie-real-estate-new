"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { marketMeta, marketStats, type MarketStat } from "@/content/market";
import { ease } from "@/lib/motion";

/**
 * The four headline numbers, sourced from src/content/market.ts. Trend
 * deltas and sparklines were removed on purpose: the underlying data is
 * placeholder, and inventing a curve would be a claims problem. When real
 * MLS data is wired in (with `delta`/`spark` populated and `source` set),
 * a trend treatment can return — crimson is a pure accent here, never a
 * good/bad signal.
 */

/** "2026-05" → "May 2026". */
function formatMonthYear(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  if (!y || !m) return iso;
  return new Date(y, m - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function MarketStats() {
  const stampLabel = marketMeta.source
    ? `Compiled from ${marketMeta.source}`
    : "Market snapshot";

  return (
    // Tighter than the showcase sections: a data band, not a destination.
    <section className="relative overflow-hidden bg-navy-deep py-16 text-paper md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,oklch(0.55_0.20_24/0.22),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <Eyebrow variant="stamp" tone="crimson-bright">
              The Central Louisiana market, right now
            </Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(30px,3.2vw,46px)] leading-[1.05] tracking-[-0.015em]">
              <HeadlineReveal>
                {["We don’t guess the market.", <>We <em className="italic text-crimson-bright">track</em> it.</>]}
              </HeadlineReveal>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-cream-warm/70 md:text-right">
              <span className="text-crimson-bright">{stampLabel}</span>
              <span>{formatMonthYear(marketMeta.lastUpdated)}</span>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-px bg-cream/15 lg:grid-cols-4">
          {marketStats.map((s, i) => (
            <StatTile key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatTile({ stat, index }: { stat: MarketStat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: ease.outExpo, delay: index * 0.08 }}
      className="bg-navy-ink px-4 pb-6 pt-6 md:px-7 md:pb-10 md:pt-10"
    >
      <span className="text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="mt-5 flex items-baseline gap-1 font-serif leading-none md:mt-7">
        <span className="text-[clamp(38px,11vw,80px)] font-semibold tracking-[-0.02em] text-paper">
          {stat.prefix}
          <Counter to={stat.value} />
        </span>
        {stat.suffix ? (
          <span className="text-[clamp(16px,4vw,32px)] font-light text-crimson-bright">
            {stat.suffix}
          </span>
        ) : null}
      </div>

      <div className="mt-5 border-t border-cream/15 pt-4 md:mt-6">
        <div className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-cream md:text-[12px] md:tracking-[0.16em]">
          {stat.label}
        </div>
        <div className="mt-1.5 text-[11.5px] font-light text-cream-warm/65 md:text-[12px]">
          {stat.sub}
        </div>
      </div>
    </motion.div>
  );
}
