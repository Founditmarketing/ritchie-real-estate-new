"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { PlateImage } from "@/components/listing/PlateImage";
import { formatPrice, formatSqft, type Listing } from "@/lib/listings";
import { cn } from "@/lib/cn";

/**
 * Mobile-only swipe carousel for featured listings. Snap scrolling, a
 * peeking next card to signal the gesture, live pagination dots, and the
 * centered card lifted into focus. Reads like a native app feed, not a
 * stacked web grid.
 */
export function FeaturedCarousel({ items }: { items: Listing[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el || el.children.length === 0) return;
    const first = el.children[0] as HTMLElement;
    const step = first.offsetWidth + 16; // card + gap-4
    const i = Math.round(el.scrollLeft / step);
    setActive(Math.max(0, Math.min(items.length - 1, i)));
  }, [items.length]);

  const goTo = (i: number) => {
    const el = ref.current;
    const child = el?.children[i] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className="md:hidden">
      <div
        ref={ref}
        onScroll={onScroll}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((l, i) => {
          const facts: string[] = [];
          if (l.beds > 0) facts.push(`${l.beds} bed`);
          if (l.baths > 0) facts.push(`${l.baths} bath`);
          if (l.sqft > 0) facts.push(`${formatSqft(l.sqft)} sqft`);
          else if (l.lotAcres) facts.push(`${l.lotAcres} acres`);
          const factLine = facts.slice(0, 3).join("  \u00b7  ");
          const isActive = i === active;
          return (
            <Link
              key={l.id}
              href={`/listings/${l.id}`}
              className={cn(
                // active:scale = touch press feedback on the swipe deck
                "group w-[80%] shrink-0 snap-start transition-all duration-500 ease-out active:scale-[0.99]",
                isActive ? "opacity-100" : "opacity-55",
              )}
            >
              <div className="flex items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-mute">
                <span className="font-serif text-[16px] italic font-medium text-crimson-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{l.type}</span>
              </div>
              <div
                className={cn(
                  "relative mt-3 aspect-[4/5] overflow-hidden bg-navy transition-transform duration-500 ease-out",
                  isActive ? "scale-100" : "scale-[0.96]",
                )}
              >
                <PlateImage listing={l} sizes="80vw" />
                {l.badge ? (
                  <span className="absolute left-3 top-3 z-10 bg-paper px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-crimson">
                    {l.badge}
                  </span>
                ) : null}
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-[22px] leading-[1.08] text-paper">
                  {l.title}
                </h3>
                <p className="mt-1.5 text-[12.5px] font-light text-mute">
                  {l.address.street}, {l.address.city}
                </p>
              </div>
              <div className="mt-4 border-t border-cream/15 pt-3.5">
                <span className="font-serif text-[26px] font-semibold leading-none tracking-[-0.015em] text-paper">
                  {formatPrice(l.price)}
                </span>
                {factLine ? (
                  <div className="mt-2.5 text-[11.5px] tracking-[0.04em] text-mute">
                    {factLine}
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
        <span className="w-2 shrink-0" aria-hidden />
      </div>

      {/* Pagination dots — 6px visual dots inside 26px touch targets */}
      <div className="mt-4 flex items-center justify-center" role="tablist" aria-label="Featured listings">
        {items.map((l, i) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to listing ${i + 1}`}
            onClick={() => goTo(i)}
            className="p-2.5"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full transition-all duration-300 ease-out",
                i === active ? "w-6 bg-crimson-bright" : "w-1.5 bg-cream/25",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
