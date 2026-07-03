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

/* The composite mark-plus-wordmark <Logo> component was removed as dead
   code: every placement uses <LogoMark> or the pixel-perfect
   <LogoWordmarkImage> PNG instead. */

/**
 * Full PNG wordmark for special placements (footer, loading, OG image).
 * Keeps the canonical brand mark intact wherever you want pixel-perfect.
 */
export function LogoWordmarkImage({
  className,
  width = 240,
  height,
  priority = false,
  light = false,
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** Use the bone-white wordmark variant for dark backgrounds. */
  light?: boolean;
}) {
  return (
    <Image
      src={light ? "/brand/ritchie-logo-light.png" : "/brand/ritchie-logo.png"}
      alt="Ritchie Real Estate"
      width={width}
      // True intrinsic ratio of the PNG is 1554x733 ≈ 2.12
      height={height ?? Math.round(width / 2.12)}
      priority={priority}
      // Inline height:auto is what next/image checks when CSS resizes width
      style={{ height: "auto" }}
      className={cn("h-auto", className)}
    />
  );
}
