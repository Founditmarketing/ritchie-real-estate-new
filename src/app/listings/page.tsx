import type { Metadata } from "next";
import { getListings, type ListingType } from "@/lib/listings";
import { ListingsCatalog } from "@/components/listing/ListingsCatalog";
import { ListingsFilters } from "@/components/listing/ListingsFilters";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Listings",
  description: "Active homes, commercial, and land across Central Louisiana.",
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

  return (
    <div className="bg-cream pt-[130px] pb-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Front matter — like the opening page of a catalog */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-10 pb-16">
          <div className="col-span-12 md:col-span-7">
            <Eyebrow variant="numbered" num="01" tone="crimson">
              Cenla listings
            </Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(48px,7vw,108px)] leading-[0.92] tracking-[-0.025em] text-navy-ink">
              <span className="block">
                {items.length} home{items.length === 1 ? "" : "s"}
              </span>
              <span className="block">
                <em className="not-italic italic text-crimson">on the market.</em>
              </span>
            </h1>
          </div>
          <aside className="col-span-12 md:col-span-4 md:col-start-9 md:pt-10">
            <p className="font-serif text-[18px] italic leading-[1.55] text-ink-soft">
              Curated by Ritchie Real Estate. Every plate below is an active
              listing across Rapides Parish &mdash; residential, commercial,
              and land.
            </p>
            <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.22em] text-crimson">
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
