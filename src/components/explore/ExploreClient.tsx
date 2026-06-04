"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/brand/Logo";
import type { ConciergeReply } from "@/lib/concierge";
import type { ListingType } from "@/lib/listings";
import type { MapListing } from "./CenlaLiveMap";

export interface ExploreListing {
  id: string;
  title: string;
  type: ListingType;
  badge?: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  city: string;
  neighborhood?: string;
  image?: string;
  href: string;
  lat?: number;
  lng?: number;
  status: string;
}

const CenlaLiveMap = dynamic(() => import("./CenlaLiveMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-navy-ink text-[12px] uppercase tracking-[0.2em] text-cream-warm/50">
      Loading map…
    </div>
  ),
});

const TYPE_TABS: { id: ListingType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "residential", label: "Homes" },
  { id: "commercial", label: "Commercial" },
  { id: "land", label: "Land" },
  { id: "rental", label: "Rentals" },
];

const STARTERS = [
  "Homes under $300k",
  "Commercial in Alexandria",
  "Land & acreage",
  "3 bed in Pineville",
];

export function ExploreClient({ listings }: { listings: ExploreListing[] }) {
  const [typeFilter, setTypeFilter] = useState<ListingType | "all">("all");
  const [aiIds, setAiIds] = useState<string[] | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiChips, setAiChips] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const histRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const displayed = useMemo(() => {
    if (aiIds) {
      const order = new Map(aiIds.map((id, i) => [id, i]));
      return listings
        .filter((l) => order.has(l.id))
        .sort((a, b) => (order.get(a.id)! - order.get(b.id)!));
    }
    return typeFilter === "all"
      ? listings
      : listings.filter((l) => l.type === typeFilter);
  }, [listings, aiIds, typeFilter]);

  const mapListings: MapListing[] = useMemo(
    () =>
      displayed
        .filter((l) => typeof l.lat === "number" && typeof l.lng === "number")
        .map((l) => ({
          id: l.id,
          title: l.title,
          price: l.price,
          lat: l.lat as number,
          lng: l.lng as number,
        })),
    [displayed],
  );

  const activeListing = activeId
    ? displayed.find((l) => l.id === activeId) ?? null
    : null;

  const activate = useCallback((id: string) => {
    setActiveId(id);
    const card = cardRefs.current.get(id);
    card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const ask = useCallback(
    async (raw: string) => {
      const content = raw.trim();
      if (!content || loading) return;
      setInput("");
      setLoading(true);
      histRef.current = [
        ...histRef.current,
        { role: "user" as const, content },
      ].slice(-8);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: histRef.current }),
        });
        const data: ConciergeReply = await res.json();
        histRef.current = [
          ...histRef.current,
          { role: "assistant" as const, content: data.reply },
        ].slice(-8);
        setAiReply(data.reply);
        setAiChips(data.chips ?? []);
        if (data.matchedIds) {
          setAiIds(data.matchedIds);
          setActiveId(data.matchedIds[0] ?? null);
          listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        setAiReply(
          "I lost my connection for a second — try again, or call Matt at 318-449-8919.",
        );
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  const reset = useCallback(() => {
    setAiIds(null);
    setAiReply(null);
    setAiChips([]);
    setActiveId(null);
    setTypeFilter("all");
    histRef.current = [];
  }, []);

  const filtersActive = aiIds !== null || typeFilter !== "all";

  return (
    <div className="h-[100svh] bg-navy-ink pt-[58px] md:pt-[66px]">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(380px,440px)_1fr]">
        {/* ---- LEFT: search + list -------------------------------- */}
        <div
          className={cn(
            "flex min-h-0 flex-col border-r border-cream/10 bg-navy-deep",
            mobileView === "map" && "hidden lg:flex",
          )}
        >
          {/* AI search bar */}
          <div className="border-b border-cream/10 px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy">
                <LogoMark tone="light" size={22} />
              </span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex flex-1 items-center gap-2 rounded-full border border-cream/15 bg-navy px-3.5 py-2 focus-within:border-crimson/50"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Ritchie to find it…"
                  aria-label="Ask Ritchie to filter the map"
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-cream placeholder:text-cream-warm/45 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Search"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-crimson text-cream transition-colors hover:bg-crimson-bright disabled:opacity-40"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden>
                    <path
                      d="M2 8h11M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Suggestion chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {(aiChips.length ? aiChips : STARTERS).map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => ask(chip)}
                  className="rounded-full border border-crimson/40 px-2.5 py-1 text-[11px] text-crimson-bright transition-colors hover:bg-crimson/15 hover:text-cream"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* AI reply line */}
            {aiReply && (
              <p className="mt-3 font-serif text-[13.5px] italic leading-[1.5] text-cream-warm">
                {aiReply}
              </p>
            )}

            {/* Type tabs / reset */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              {TYPE_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setAiIds(null);
                    setAiReply(null);
                    setTypeFilter(t.id);
                  }}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.14em] transition-colors",
                    !aiIds && typeFilter === t.id
                      ? "text-crimson-bright"
                      : "text-cream-warm/55 hover:text-cream",
                  )}
                >
                  {t.label}
                </button>
              ))}
              {filtersActive && (
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto text-[11px] uppercase tracking-[0.14em] text-cream-warm/50 underline-offset-2 hover:text-cream hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-baseline justify-between px-4 pt-4">
            <span className="font-serif text-[20px] text-paper">
              {displayed.length} {displayed.length === 1 ? "result" : "results"}
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-cream-warm/50">
              Central Louisiana
            </span>
          </div>

          {/* List */}
          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4"
          >
            {displayed.length === 0 ? (
              <p className="mt-10 text-center font-serif text-[15px] italic text-cream-warm/60">
                Nothing matches yet. Try “Reset” or ask Ritchie something
                broader.
              </p>
            ) : (
              displayed.map((l) => (
                <ListingRow
                  key={l.id}
                  listing={l}
                  active={l.id === activeId}
                  onActivate={() => setActiveId(l.id)}
                  registerRef={(el) => {
                    if (el) cardRefs.current.set(l.id, el);
                    else cardRefs.current.delete(l.id);
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* ---- RIGHT: map ----------------------------------------- */}
        <div
          className={cn(
            "relative min-h-0",
            mobileView === "list" && "hidden lg:block",
          )}
        >
          <CenlaLiveMap
            listings={mapListings}
            activeId={activeId}
            onActivate={activate}
          />

          {/* Active listing preview card over the map */}
          {activeListing && (
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[500] flex justify-center lg:left-4 lg:right-auto lg:justify-start">
              <PreviewCard
                listing={activeListing}
                onClose={() => setActiveId(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile list/map toggle */}
      <button
        type="button"
        onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
        className="fixed bottom-5 left-1/2 z-[600] -translate-x-1/2 rounded-full border border-cream/20 bg-crimson px-6 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-cream shadow-[0_14px_36px_-10px_rgba(0,0,0,0.8)] lg:hidden"
      >
        {mobileView === "list" ? "Map" : "List"}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function ListingRow({
  listing,
  active,
  onActivate,
  registerRef,
}: {
  listing: ExploreListing;
  active: boolean;
  onActivate: () => void;
  registerRef: (el: HTMLAnchorElement | null) => void;
}) {
  const meta =
    listing.type === "land"
      ? `${listing.sqft ? listing.sqft.toLocaleString() + " sq ft · " : ""}Land`
      : listing.type === "commercial"
        ? `${listing.sqft.toLocaleString()} sq ft · Commercial`
        : `${listing.beds} bd · ${listing.baths} ba · ${listing.sqft.toLocaleString()} sq ft`;

  return (
    <Link
      ref={registerRef}
      href={listing.href}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group flex gap-3 overflow-hidden rounded-[5px] border bg-navy/50 p-2.5 transition-colors",
        active ? "border-crimson/60" : "border-cream/12 hover:border-crimson/40",
      )}
    >
      <span className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-[3px] bg-navy">
        {listing.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        {listing.badge ? (
          <span className="absolute left-1.5 top-1.5 bg-crimson px-1.5 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-cream">
            {listing.badge}
          </span>
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="font-serif text-[17px] leading-tight text-crimson-bright">
          {listing.price}
        </span>
        <span className="mt-0.5 truncate font-serif text-[14px] text-cream">
          {listing.title}
        </span>
        <span className="truncate font-sans text-[11px] text-cream-warm/60">
          {listing.neighborhood
            ? `${listing.neighborhood}, ${listing.city}`
            : listing.city}
        </span>
        <span className="mt-1 truncate font-sans text-[10.5px] uppercase tracking-[0.08em] text-cream-warm/45">
          {meta}
        </span>
      </span>
    </Link>
  );
}

function PreviewCard({
  listing,
  onClose,
}: {
  listing: ExploreListing;
  onClose: () => void;
}) {
  return (
    <div className="pointer-events-auto relative flex w-full max-w-[340px] gap-3 overflow-hidden rounded-[6px] border border-cream/15 bg-navy-deep p-2.5 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.85)]">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-1.5 top-1.5 z-10 grid h-6 w-6 place-items-center rounded-full bg-navy-ink/70 text-cream-warm/80 transition-colors hover:text-cream"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <span className="relative h-[92px] w-[120px] shrink-0 overflow-hidden rounded-[3px] bg-navy">
        {listing.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.image}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center pr-4">
        <span className="font-serif text-[18px] text-crimson-bright">
          {listing.price}
        </span>
        <span className="truncate font-serif text-[14px] text-cream">
          {listing.title}
        </span>
        <span className="truncate font-sans text-[11px] text-cream-warm/60">
          {listing.neighborhood
            ? `${listing.neighborhood}, ${listing.city}`
            : listing.city}
        </span>
        <Link
          href={listing.href}
          className="mt-1.5 inline-flex w-fit items-center gap-1.5 font-sans text-[10.5px] uppercase tracking-[0.16em] text-crimson-bright hover:text-cream"
        >
          View listing
          <span aria-hidden>→</span>
        </Link>
      </span>
    </div>
  );
}
