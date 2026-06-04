"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

const TYPES = [
  { v: "all", label: "All" },
  { v: "residential", label: "Residential" },
  { v: "commercial", label: "Commercial" },
  { v: "land", label: "Land" },
  { v: "rental", label: "Rentals" },
] as const;

const SORTS = [
  { v: "newest", label: "Newest" },
  { v: "price-asc", label: "Price \u2191" },
  { v: "price-desc", label: "Price \u2193" },
] as const;

/**
 * Hairline editorial filter bar. Lives between the section title and the
 * catalog grid. No card, no chips with backgrounds \u2014 just type-led
 * controls separated by thin rules so the page reads as one continuous
 * page of a book.
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

  return (
    <div className="flex flex-col gap-6 border-t border-b border-cream/15 py-6 md:flex-row md:items-center md:gap-10">
      {/* Type — text-based tabs joined by middle-dots */}
      <div className="flex flex-1 flex-wrap items-baseline gap-x-1.5 gap-y-1.5 text-[12px]">
        <span className="mr-2 font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
          Type
        </span>
        {TYPES.map((t, i) => (
          <span key={t.v} className="flex items-baseline">
            {i > 0 ? <span className="mx-1.5 text-mute/40">&middot;</span> : null}
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

      {/* City — serif input under a small label */}
      <div className="flex items-baseline gap-3 md:border-l md:border-cream/15 md:pl-9">
        <label className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
          City
        </label>
        <input
          defaultValue={current.city}
          onBlur={(e) => update({ city: e.target.value })}
          placeholder="Any"
          className="w-[14ch] border-b border-transparent bg-transparent py-1 font-serif text-[16px] text-paper outline-none transition-colors placeholder:text-mute/55 focus:border-crimson-bright"
        />
      </div>

      {/* Sort */}
      <div className="flex items-baseline gap-3 md:border-l md:border-cream/15 md:pl-9">
        <label className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
          Sort
        </label>
        <select
          value={current.sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="bg-transparent font-serif text-[16px] text-paper outline-none [&>option]:bg-navy-ink [&>option]:text-paper"
        >
          {SORTS.map((s) => (
            <option key={s.v} value={s.v}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {pending ? (
        <span className="font-sans text-[10.5px] uppercase tracking-[0.18em] text-crimson-bright">
          updating&hellip;
        </span>
      ) : null}
    </div>
  );
}
