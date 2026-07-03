import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Variant = "rule" | "numbered" | "stamp" | "display" | "italic";
type Tone = "crimson" | "crimson-bright" | "ink-soft" | "cream";

type EyebrowProps = {
  children: ReactNode;
  /** Layout flavour. Vary across sections to break template feel. */
  variant?: Variant;
  /** Color tone (depends on background). */
  tone?: Tone;
  /** Required when variant === "numbered". */
  num?: string;
  className?: string;
  /** Center the rule + content. */
  center?: boolean;
};

const toneClass: Record<Tone, string> = {
  crimson: "text-crimson",
  "crimson-bright": "text-crimson-bright",
  "ink-soft": "text-ink-soft",
  cream: "text-cream-warm",
};

/**
 * Editorial section label. Five variants exist so consecutive sections
 * don't all open with the identical horizontal-rule + ALL CAPS treatment.
 *
 * - `rule`        — classic short rule + small caps (the page default)
 * - `numbered`    — "01" prefix in italic serif, no rule
 * - `stamp`       — boxed brand stamp (works on dark or light)
 * - `display`     — serif italic, larger, for hero-adjacent moments
 * - `italic`      — single italic serif phrase, no caps, no rule
 */
export function Eyebrow({
  children,
  variant = "rule",
  // crimson-bright: the base crimson reads under 3:1 on the dark canvas
  tone = "crimson-bright",
  num,
  className,
  center = false,
}: EyebrowProps) {
  const color = toneClass[tone];

  if (variant === "numbered") {
    return (
      <span
        className={cn(
          "inline-flex items-baseline gap-3 font-serif text-[16px] italic",
          color,
          className,
        )}
      >
        <span className="font-medium">{num ?? "01"}</span>
        <span className="not-italic font-sans text-[11px] uppercase tracking-[0.24em]">
          {children}
        </span>
      </span>
    );
  }

  if (variant === "stamp") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]",
          tone === "cream" || tone === "crimson-bright"
            ? "border-cream/35"
            : "border-current/30",
          color,
          className,
        )}
      >
        <span className="h-1 w-1 rounded-full bg-current" />
        {children}
      </span>
    );
  }

  if (variant === "display") {
    return (
      <span
        className={cn(
          "block font-serif italic text-[clamp(18px,1.6vw,26px)] leading-tight",
          color,
          center && "text-center",
          className,
        )}
      >
        {children}
      </span>
    );
  }

  if (variant === "italic") {
    return (
      <span
        className={cn(
          "block font-serif italic text-[15px]",
          color,
          center && "text-center",
          className,
        )}
      >
        &mdash;&nbsp;{children}
      </span>
    );
  }

  /* default: rule */
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.26em]",
        color,
        center && "justify-center",
        className,
      )}
    >
      <span className="h-px w-7 bg-current" />
      {children}
      {center ? <span className="h-px w-7 bg-current" /> : null}
    </span>
  );
}
