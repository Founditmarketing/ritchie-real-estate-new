import Image from "next/image";
import { cn } from "@/lib/cn";

type Tone = "light" | "dark";

/**
 * Compact diamond + R mark. Rebuilt as SVG so we can recolor for any
 * background (the source PNG is fixed-color). Visually faithful to the
 * brokerage's existing logo.
 */
export function LogoMark({
  className,
  tone = "dark",
  size = 44,
}: {
  className?: string;
  tone?: Tone;
  size?: number;
}) {
  const border = tone === "light" ? "var(--color-cream)" : "var(--color-navy)";
  const diamond = "var(--color-crimson)";
  const r = tone === "light" ? "var(--color-cream)" : "var(--color-paper)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 140"
      role="img"
      aria-label="Ritchie Real Estate"
      className={cn("shrink-0", className)}
    >
      {/* outer border diamond */}
      <polygon
        points="60,4 116,70 60,136 4,70"
        fill="none"
        stroke={border}
        strokeWidth="5"
        strokeLinejoin="miter"
      />
      {/* inner red diamond */}
      <polygon
        points="60,14 108,70 60,126 12,70"
        fill={diamond}
        stroke={border}
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      {/* serif R monogram */}
      <text
        x="60"
        y="92"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', 'Times New Roman', serif"
        fontWeight="700"
        fontSize="78"
        fill={r}
        style={{ letterSpacing: "-0.03em" }}
      >
        R
      </text>
    </svg>
  );
}

/**
 * Diamond mark + side wordmark, color-aware. Use in header / footer / hero.
 */
export function Logo({
  tone = "dark",
  href = "/",
  className,
  showTagline = true,
}: {
  tone?: Tone;
  href?: string;
  className?: string;
  showTagline?: boolean;
}) {
  const text = tone === "light" ? "text-cream" : "text-navy";
  const accent = tone === "light" ? "text-crimson-bright" : "text-crimson";
  return (
    <a
      href={href}
      aria-label="Ritchie Real Estate, home"
      className={cn("inline-flex items-center gap-2.5 md:gap-3", className)}
    >
      {/* Diamond mark scales down a notch on small screens so the header
          breathes alongside the hamburger button. */}
      <LogoMark tone={tone} size={32} className="md:hidden" />
      <LogoMark tone={tone} size={36} className="hidden md:block" />
      <span className="leading-none">
        <span
          className={cn(
            "block font-serif text-[20px] font-semibold tracking-[0.02em] md:text-[22px]",
            text,
          )}
        >
          RITCHIE<span className={accent}>.</span>
        </span>
        {showTagline ? (
          /* Tagline is desktop-only \u2014 on mobile it competes with the
             hamburger and reads as accidental kerning. */
          <span
            className={cn(
              "mt-1 hidden font-sans text-[8px] tracking-[0.28em] uppercase opacity-80 md:block",
              text,
            )}
          >
            Real Estate &middot; Est. 2003
          </span>
        ) : null}
      </span>
    </a>
  );
}

/**
 * Full PNG wordmark for special placements (footer, loading, OG image).
 * Keeps the canonical brand mark intact wherever you want pixel-perfect.
 */
export function LogoWordmarkImage({
  className,
  width = 240,
  height,
  priority = false,
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/ritchie-logo.png"
      alt="Ritchie Real Estate"
      width={width}
      height={height ?? Math.round(width / 2.07)}
      priority={priority}
      className={cn("h-auto", className)}
    />
  );
}
