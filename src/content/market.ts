/*
 * PLACEHOLDER — MARKET STATS. The four figures below are pitch-stage
 * placeholders, not compiled MLS data. Verify every number against the
 * real Cenla MLS (and set `source` accordingly) before the client domain
 * launches.
 */

export type MarketStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  /** YoY delta in percent. Optional — omit until real data backs it. */
  delta?: number;
  /** Sparkline values, recent-most last. Optional — omit until real data backs it. */
  spark?: number[];
};

export const marketStats: MarketStat[] = [
  {
    value: 248,
    prefix: "$",
    suffix: "k",
    label: "Median Sale Price",
    sub: "Across Rapides Parish",
  },
  {
    value: 39,
    suffix: "d",
    label: "Avg Days on Market",
    sub: "From list to contract",
  },
  {
    value: 98,
    suffix: "%",
    label: "List-to-Sale Ratio",
    sub: "Sellers near asking",
  },
  {
    value: 312,
    label: "Homes Sold YTD",
    sub: "And counting",
  },
];

export const marketMeta = {
  /** Where the numbers were compiled from; null while they are placeholders. */
  source: null as string | null,
  /** Month the snapshot reflects, as YYYY-MM. */
  lastUpdated: "2026-05",
};
