import { cn } from "@/lib/cn";

/**
 * Five-star rating rendered as proper SVG icons (filled).
 *
 * The previous version used `&#9733;` HTML entities, which render with
 * whatever shape the user's installed serif star glyph is \u2014 in some
 * fonts that's a fat outlined asterisk shape, which made the rating
 * read as a placeholder ("five red asterisks") rather than a designed
 * 5-star mark.
 */
export function Stars({
  rating = 5,
  size = 14,
  className,
  label = "Five-star review",
}: {
  rating?: number;
  size?: number;
  className?: string;
  label?: string;
}) {
  const full = Math.round(rating);
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} filled={i < full} />
      ))}
    </div>
  );
}

function Star({ size, filled }: { size: number; filled: boolean }) {
  /* Diamond mark \u2014 same shape as the Ritchie logo, just smaller and
     used as rating glyph. Quiet brand callback without screaming. */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className="text-crimson"
    >
      <polygon
        points="12,2 22,12 12,22 2,12"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
