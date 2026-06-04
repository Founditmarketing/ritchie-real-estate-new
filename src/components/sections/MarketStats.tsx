"use client";

import { motion } from "motion/react";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ease } from "@/lib/motion";

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  /** YoY delta in percent (positive or negative). */
  delta: number;
  /** Sparkline values, recent-most last. Auto-scaled. */
  spark: number[];
};

const STATS: Stat[] = [
  {
    value: 248,
    prefix: "$",
    suffix: "k",
    label: "Median Sale Price",
    sub: "Across Rapides Parish",
    delta: 4.8,
    spark: [212, 220, 218, 228, 234, 240, 245, 248],
  },
  {
    value: 39,
    suffix: "d",
    label: "Avg Days on Market",
    sub: "From list to contract",
    delta: -11.4,
    spark: [56, 52, 50, 48, 45, 42, 41, 39],
  },
  {
    value: 98,
    suffix: "%",
    label: "List-to-Sale Ratio",
    sub: "Sellers near asking",
    delta: 1.2,
    spark: [94, 95, 96, 96, 97, 97, 98, 98],
  },
  {
    value: 312,
    label: "Homes Sold YTD",
    sub: "And counting",
    delta: 8.6,
    spark: [180, 205, 232, 248, 268, 284, 300, 312],
  },
];

export function MarketStats() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 text-paper md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,oklch(0.55_0.20_24/0.22),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <Reveal>
            <Eyebrow variant="stamp" tone="crimson-bright">
              The Cenla market, right now
            </Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(30px,3.2vw,46px)] leading-[1.05] tracking-[-0.015em]">
              <HeadlineReveal>
                {["We don\u2019t guess the market.", <>We <em className="not-italic italic text-crimson-bright">track</em> it.</>]}
              </HeadlineReveal>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-1 text-[11px] uppercase tracking-[0.22em] text-cream-warm/70 md:text-right">
              <span className="text-crimson-bright">Market snapshot</span>
              <span>Compiled from Cenla MLS &middot; May 2026</span>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-px bg-cream/15 md:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatTile key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatTile({ stat, index }: { stat: Stat; index: number }) {
  const positive = stat.delta >= 0;
  /* "down is good" for days-on-market — flip the visual cue */
  const colorIsGood =
    stat.label.toLowerCase().includes("days") ? !positive : positive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: ease.outExpo, delay: index * 0.08 }}
      className="bg-navy-ink px-6 pt-8 pb-9 md:px-7 md:pb-10 md:pt-10"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
          {String(index + 1).padStart(2, "0")}
        </span>
        <DeltaBadge value={stat.delta} good={colorIsGood} />
      </div>

      <div className="mt-7 flex items-baseline gap-1 font-serif leading-none">
        <span className="text-[clamp(54px,5vw,80px)] font-semibold tracking-[-0.02em] text-paper">
          {stat.prefix}
          <Counter to={stat.value} />
        </span>
        {stat.suffix ? (
          <span className="text-[clamp(22px,2vw,32px)] font-light text-crimson-bright">
            {stat.suffix}
          </span>
        ) : null}
      </div>

      <Sparkline values={stat.spark} good={colorIsGood} className="mt-5" />

      <div className="mt-6 border-t border-cream/15 pt-4">
        <div className="text-[12px] font-medium uppercase tracking-[0.16em] text-cream">
          {stat.label}
        </div>
        <div className="mt-1.5 text-[12px] font-light text-cream-warm/65">
          {stat.sub}
        </div>
      </div>
    </motion.div>
  );
}

function DeltaBadge({ value, good }: { value: number; good: boolean }) {
  const arrow = value >= 0 ? "\u2197" : "\u2198";
  const cls = good
    ? "text-crimson-bright border-crimson-bright/40"
    : "text-cream-warm/70 border-cream/25";
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] ${cls}`}
    >
      <span aria-hidden>{arrow}</span>
      {Math.abs(value).toFixed(1)}% YoY
    </span>
  );
}

function Sparkline({
  values,
  good,
  className,
}: {
  values: number[];
  good: boolean;
  className?: string;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 200;
  const H = 38;
  const step = W / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = H - ((v - min) / range) * H;
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  const stroke = good
    ? "var(--color-crimson-bright)"
    : "color-mix(in oklch, var(--color-cream) 60%, transparent)";
  const lastX = points[points.length - 1][0];
  const lastY = points[points.length - 1][1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={`block h-9 w-full ${className ?? ""}`}
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="1" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill="url(#spark-fade)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.25 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: ease.outExpo, delay: 0.1 }}
      />
      <motion.circle
        cx={lastX}
        cy={lastY}
        r="2.4"
        fill={stroke}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: ease.outExpo, delay: 1.2 }}
      />
    </svg>
  );
}
