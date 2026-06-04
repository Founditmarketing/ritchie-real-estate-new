"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

const PRICE_OPTIONS = [
  { label: "Any price", min: undefined, max: undefined },
  { label: "Under $200k", min: 0, max: 200000 },
  { label: "$200k\u2013$350k", min: 200000, max: 350000 },
  { label: "$350k\u2013$500k", min: 350000, max: 500000 },
  { label: "$500k+", min: 500000, max: undefined },
];

const INTENTS = [
  { v: "residential", label: "A home" },
  { v: "commercial", label: "Commercial" },
  { v: "land", label: "Land" },
  { v: "rental", label: "A rental" },
];

const BEDS = [
  { v: "", label: "Any" },
  { v: "1", label: "1+" },
  { v: "2", label: "2+" },
  { v: "3", label: "3+" },
  { v: "4", label: "4+" },
];

/**
 * Real-estate search as an editorial section. Lives between the Manifesto
 * (light) and MarketStats (dark) so the rhythm goes cream \u2192 cream \u2192 navy,
 * with this section providing the section's product-layer payload.
 *
 * Posts to /listings via URL params so the catalog page can read them.
 * No card chrome \u2014 hairline-rule fields, serif inputs, one big crimson
 * submit, so it reads as part of the editorial vocabulary rather than
 * a Zillow widget bolted on.
 */
export function SearchBar() {
  const router = useRouter();
  const [intent, setIntent] = useState<string>("residential");
  const [city, setCity] = useState("");
  const [beds, setBeds] = useState<string>("");
  const [priceIdx, setPriceIdx] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (intent && intent !== "residential") params.set("type", intent);
    if (city.trim()) params.set("city", city.trim());
    if (beds) params.set("bedsMin", beds);
    const p = PRICE_OPTIONS[priceIdx];
    if (p?.min) params.set("priceMin", String(p.min));
    if (p?.max) params.set("priceMax", String(p.max));
    router.push(`/listings${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section className="bg-navy-ink pb-24 pt-16 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-9 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <Eyebrow variant="numbered" num="03" tone="crimson-bright">
              Start the search
            </Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(28px,3.4vw,48px)] leading-[1.04] tracking-[-0.02em] text-paper">
              Show me{" "}
              <em className="not-italic italic text-crimson-bright">what&rsquo;s out there.</em>
            </h2>
          </div>
          <p className="max-w-[34ch] font-serif text-[15px] italic leading-[1.55] text-cream-warm">
            Four fields, every Cenla listing. Filters write the URL so you can
            share a search with anyone.
          </p>
        </div>

        <form onSubmit={submit}>
          {/* MOBILE — native app controls: segmented intent, chip rows,
              one full-width action. No dropdowns. */}
          <div className="space-y-6 border-t border-cream/15 pt-7 md:hidden">
            <div>
              <Legend>I want</Legend>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {INTENTS.map((i) => (
                  <Seg
                    key={i.v}
                    active={intent === i.v}
                    onClick={() => setIntent(i.v)}
                  >
                    {i.label}
                  </Seg>
                ))}
              </div>
            </div>

            <label className="block">
              <Legend>In</Legend>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Alexandria, Pineville…"
                className="mt-2.5 w-full rounded-[3px] border border-cream/15 bg-navy px-4 py-3.5 font-serif text-[18px] text-paper outline-none placeholder:text-mute/55 focus:border-crimson/55"
              />
            </label>

            <div>
              <Legend>Beds</Legend>
              <div className="mt-2.5 flex gap-2">
                {BEDS.map((b) => (
                  <Chip
                    key={b.v || "any"}
                    active={beds === b.v}
                    onClick={() => setBeds(b.v)}
                    className="flex-1"
                  >
                    {b.label}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <Legend>Up to</Legend>
              <div className="-mx-6 mt-2.5 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PRICE_OPTIONS.map((p, i) => (
                  <Chip
                    key={p.label}
                    active={priceIdx === i}
                    onClick={() => setPriceIdx(i)}
                    className="shrink-0 whitespace-nowrap"
                  >
                    {p.label}
                  </Chip>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 bg-crimson px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition duration-150 ease-out hover:bg-crimson-deep active:scale-[0.98]"
            >
              Search Cenla
              <span aria-hidden>&rarr;</span>
            </button>
          </div>

          {/* DESKTOP — editorial hairline grid */}
          <div className="hidden border-t border-b border-cream/15 py-6 md:grid md:grid-cols-[1.4fr_1.4fr_0.9fr_1fr_auto] md:items-end md:gap-x-8">
            <Field label="I want">
              <select
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                className="w-full border-none bg-transparent font-serif text-[18px] text-paper outline-none [&>option]:bg-navy-ink [&>option]:text-paper"
              >
                {INTENTS.map((i) => (
                  <option key={i.v} value={i.v}>
                    {i.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="In" border>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Alexandria"
                className="w-full border-none bg-transparent font-serif text-[18px] text-paper placeholder:text-mute/60 outline-none"
              />
            </Field>
            <Field label="Beds" border>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full border-none bg-transparent font-serif text-[18px] text-paper outline-none [&>option]:bg-navy-ink [&>option]:text-paper"
              >
                {BEDS.map((b) => (
                  <option key={b.v || "any"} value={b.v}>
                    {b.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Up to" border>
              <select
                value={priceIdx}
                onChange={(e) => setPriceIdx(Number(e.target.value))}
                className="w-full border-none bg-transparent font-serif text-[18px] text-paper outline-none [&>option]:bg-navy-ink [&>option]:text-paper"
              >
                {PRICE_OPTIONS.map((p, i) => (
                  <option key={p.label} value={i}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="submit"
              data-cursor-label="Go"
              className="inline-flex items-center justify-center gap-3 self-stretch bg-crimson px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-crimson-deep"
            >
              Search Cenla
              <span aria-hidden>&rarr;</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.22em] text-crimson-bright">
      {children}
    </span>
  );
}

function Seg({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-[3px] border px-4 py-3 text-center font-serif text-[16px] transition duration-150 ease-out active:scale-[0.97]",
        active
          ? "border-crimson bg-crimson text-cream"
          : "border-cream/15 text-cream-warm hover:border-crimson/45 hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2.5 font-sans text-[12.5px] tracking-wide transition duration-150 ease-out active:scale-[0.95]",
        active
          ? "border-crimson bg-crimson text-cream"
          : "border-cream/15 text-cream-warm hover:border-crimson/45 hover:text-paper",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
  border = false,
}: {
  label: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1.5 py-2 md:py-0 ${
        border ? "md:border-l md:border-cream/15 md:pl-8" : ""
      }`}
    >
      <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.22em] text-crimson-bright">
        {label}
      </span>
      {children}
    </label>
  );
}
