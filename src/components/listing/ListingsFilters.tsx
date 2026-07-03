"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { formatPrice } from "@/lib/listings";
import { cn } from "@/lib/cn";

const TYPES = [
  { v: "all", label: "All" },
  { v: "residential", label: "Residential" },
  { v: "commercial", label: "Commercial" },
  { v: "land", label: "Land" },
  { v: "rental", label: "Rentals" },
] as const;

const SORTS = [
  { v: "newest", label: "Newest" },
  { v: "price-asc", label: "Price ↑" },
  { v: "price-desc", label: "Price ↓" },
] as const;

/**
 * Hairline editorial filter bar. Lives between the section title and the
 * catalog grid. No card, no chips with backgrounds at md+ — just type-led
 * controls separated by thin rules so the page reads as one continuous
 * page of a book. Below md the type tabs become a scrollable 44px chip
 * row (the SearchBar recipe) so the money page has real touch targets.
 *
 * Beds/price constraints written by the homepage search surface here as
 * a removable "Refined" segment — otherwise a "4+ beds under $200k"
 * search lands on an inexplicable empty catalog with no way out.
 */
export function ListingsFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, start] = useTransition();

  const current = {
    type: sp.get("type") ?? "all",
    sort: sp.get("sort") ?? "newest",
    city: sp.get("city") ?? "",
  };

  const bedsMin = Number(sp.get("bedsMin")) || 0;
  const priceMin = Number(sp.get("priceMin")) || 0;
  const priceMax = Number(sp.get("priceMax")) || 0;

  const update = useCallback(
    (next: Record<string, string | undefined>) => {
      const params = new URLSearchParams(sp);
      for (const [k, v] of Object.entries(next)) {
        if (!v || v === "all") params.delete(k);
        else params.set(k, v);
      }
      start(() => router.replace(`/listings?${params.toString()}`, { scroll: false }));
    },
    [router, sp],
  );

  // Active constraints set by the homepage search (or a shared URL) that
  // have no control of their own in this bar. Price min/max clear as one.
  const refined: { label: string; clear: Record<string, string | undefined> }[] = [];
  if (bedsMin > 0) {
    refined.push({ label: `${bedsMin}+ beds`, clear: { bedsMin: undefined } });
  }
  if (priceMin > 0 && priceMax > 0) {
    refined.push({
      label: `${formatPrice(priceMin)}–${formatPrice(priceMax)}`,
      clear: { priceMin: undefined, priceMax: undefined },
    });
  } else if (priceMax > 0) {
    refined.push({
      label: `Under ${formatPrice(priceMax)}`,
      clear: { priceMin: undefined, priceMax: undefined },
    });
  } else if (priceMin > 0) {
    refined.push({
      label: `Over ${formatPrice(priceMin)}`,
      clear: { priceMin: undefined, priceMax: undefined },
    });
  }

  return (
    <div className="flex flex-col gap-6 border-t border-b border-cream/15 py-6 md:flex-row md:items-center md:gap-10">
      {/* Type — chips below md (44px targets), dot-joined serif tabs at md+ */}
      <div className="min-w-0 flex-1">
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
          {TYPES.map((t) => (
            <button
              key={t.v}
              type="button"
              onClick={() => update({ type: t.v })}
              aria-pressed={current.type === t.v}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-2.5 font-sans text-[12.5px] tracking-wide transition duration-150 ease-out active:scale-[0.95]",
                current.type === t.v
                  ? "border-crimson bg-crimson text-cream"
                  : "border-cream/15 text-cream-warm hover:border-crimson/45 hover:text-paper",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="hidden flex-wrap items-baseline gap-x-1.5 gap-y-1.5 text-[12px] md:flex">
          <span className="mr-2 font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
            Type
          </span>
          {TYPES.map((t, i) => (
            <span key={t.v} className="flex items-baseline">
              {i > 0 ? (
                <span aria-hidden className="mx-1.5 text-mute/40">
                  &middot;
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => update({ type: t.v })}
                data-cursor-label={t.label}
                className={`font-serif text-[15px] transition-colors hover:text-crimson-bright ${
                  current.type === t.v
                    ? "italic font-medium text-crimson-bright"
                    : "text-cream"
                }`}
              >
                {t.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* City — serif input under a small label */}
      <div className="flex items-baseline gap-3 md:border-l md:border-cream/15 md:pl-9">
        <label
          htmlFor="filter-city"
          className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute"
        >
          City
        </label>
        <input
          id="filter-city"
          defaultValue={current.city}
          onBlur={(e) => update({ city: e.target.value })}
          placeholder="Any"
          className="w-[14ch] border-b border-transparent bg-transparent py-2 font-serif text-[16px] text-paper outline-none transition-colors placeholder:text-mute/75 focus:border-crimson-bright md:py-1"
        />
      </div>

      {/* Sort */}
      <div className="flex items-baseline gap-3 md:border-l md:border-cream/15 md:pl-9">
        <label
          htmlFor="filter-sort"
          className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute"
        >
          Sort
        </label>
        <select
          id="filter-sort"
          value={current.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="bg-transparent py-2 font-serif text-[16px] text-paper outline-none md:py-0 [&>option]:bg-navy-ink [&>option]:text-paper"
        >
          {SORTS.map((s) => (
            <option key={s.v} value={s.v}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Refined — constraints set upstream (home search / shared URL),
          each removable in one tap */}
      {refined.length > 0 ? (
        <div className="flex items-baseline gap-3 md:border-l md:border-cream/15 md:pl-9">
          <span className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
            Refined
          </span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {refined.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => update(r.clear)}
                aria-label={`Remove ${r.label} filter`}
                data-cursor-label="Remove"
                className="group/refined -my-2 inline-flex min-h-11 items-center gap-2"
              >
                <span className="font-serif text-[15px] italic text-crimson-bright transition-colors group-hover/refined:text-crimson">
                  {r.label}
                </span>
                <span
                  aria-hidden
                  className="text-[13px] leading-none text-mute transition-colors group-hover/refined:text-crimson-bright"
                >
                  &times;
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Always-mounted live region so the pending state is announced */}
      <span
        role="status"
        aria-live="polite"
        className="font-sans text-[10.5px] uppercase tracking-[0.18em] text-crimson-bright"
      >
        {pending ? "updating…" : ""}
      </span>
    </div>
  );
}
