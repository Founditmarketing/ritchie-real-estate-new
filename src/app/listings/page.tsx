import type { Metadata } from "next";
import { getListings, type ListingType } from "@/lib/listings";
import { ListingsCatalog } from "@/components/listing/ListingsCatalog";
import { ListingsFilters } from "@/components/listing/ListingsFilters";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Listings",
  description: "Homes, commercial, and land across Central Louisiana.",
};

type SearchParams = Promise<{
  type?: string;
  city?: string;
  priceMin?: string;
  priceMax?: string;
  bedsMin?: string;
  q?: string;
  sort?: string;
}>;

/**
 * Front-matter copy keyed to the active type filter, so a commercial or
 * land view never describes its inventory as "homes."
 */
const TYPE_COPY: Record<
  string,
  { eyebrow: string; noun: [string, string]; tail: string; blurb: string }
> = {
  commercial: {
    eyebrow: "Central Louisiana commercial",
    noun: ["property", "properties"],
    tail: "on the market.",
    blurb:
      "CCIM-credentialed. Retail, office, industrial, and investment across Central Louisiana.",
  },
  land: {
    eyebrow: "Central Louisiana land",
    noun: ["tract", "tracts"],
    tail: "for sale.",
    blurb:
      "Homesites, acreage, and development ground across Central Louisiana.",
  },
  rental: {
    eyebrow: "Central Louisiana rentals",
    noun: ["rental", "rentals"],
    tail: "available now.",
    blurb:
      "Rentals across Central Louisiana, managed by people who pick up the phone.",
  },
  default: {
    eyebrow: "Central Louisiana listings",
    noun: ["home", "homes"],
    tail: "on the market.",
    blurb:
      "Curated by Ritchie Real Estate \u2014 residential, commercial, and land across Rapides Parish.",
  },
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const items = await getListings({
    type: (sp.type as ListingType | "all") ?? "all",
    city: sp.city,
    priceMin: sp.priceMin ? Number(sp.priceMin) : undefined,
    priceMax: sp.priceMax ? Number(sp.priceMax) : undefined,
    bedsMin: sp.bedsMin ? Number(sp.bedsMin) : undefined,
    q: sp.q,
    sort: (sp.sort as "newest" | "price-asc" | "price-desc") ?? "newest",
  });

  const copy = TYPE_COPY[sp.type ?? ""] ?? TYPE_COPY.default;
  const noun = copy.noun[items.length === 1 ? 0 : 1];

  return (
    <div className="bg-navy-ink pt-[130px] pb-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Front matter — like the opening page of a catalog */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-10 pb-16">
          <div className="col-span-12 md:col-span-7">
            <Eyebrow variant="numbered" num="01" tone="crimson-bright">
              {copy.eyebrow}
            </Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(48px,7vw,108px)] leading-[0.92] tracking-[-0.025em] text-paper">
              <HeadlineReveal>
                {[
                  <span key="l1">
                    {items.length} {noun}
                  </span>,
                  <em key="l2" className="block italic text-crimson-bright">
                    {copy.tail}
                  </em>,
                ]}
              </HeadlineReveal>
            </h1>
          </div>
          <aside className="col-span-12 md:col-span-4 md:col-start-9 md:pt-10">
            <p className="font-serif text-[18px] italic leading-[1.55] text-cream-warm">
              {copy.blurb}
            </p>
            <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.22em] text-crimson-bright">
              Filters write the URL. Share a search.
            </p>
          </aside>
        </header>

        <ListingsFilters />
        <ListingsCatalog listings={items} />
      </div>
    </div>
  );
}
