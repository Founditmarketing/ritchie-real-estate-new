"use client";

/**
 * Statically renders the value (no zero-to-target tween). The animated
 * count-up was a SaaS cliché that produced a visible "$0k" flash during
 * fast scroll \u2014 the sparkline draw-in in MarketStats is the kinetic
 * moment for that block, the number itself stays still.
 *
 * Kept as a component (not a plain string) so the API doesn't change and
 * we can swap in a real counter later if we ever want one.
 */
export function Counter({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <span>
      {prefix}
      {to.toLocaleString()}
      {suffix}
    </span>
  );
}
