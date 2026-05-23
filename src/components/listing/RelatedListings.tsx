import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FavoriteHeart } from "@/components/listing/ListingCardChrome";
import { formatPrice, getListings, type Listing } from "@/lib/listings";

/**
 * Three more plates from the same city (falls back to same type if there
 * aren't enough nearby). Sits at the bottom of the listing detail page
 * so the visitor never reaches a dead end.
 */
export async function RelatedListings({ current }: { current: Listing }) {
  // Prefer same city
  const byCity = await getListings({ city: current.address.city, status: "active" });
  let pool = byCity.filter((l) => l.id !== current.id);
  if (pool.length < 3) {
    const sameType = await getListings({ type: current.type, status: "active" });
    pool = [
      ...pool,
      ...sameType.filter(
        (l) => l.id !== current.id && !pool.some((p) => p.id === l.id),
      ),
    ];
  }
  const items = pool.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="bg-cream py-24 md:py-32 lg:py-36">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <div>
            <Eyebrow variant="italic" tone="crimson">
              Also worth seeing
            </Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(30px,3.6vw,52px)] leading-[1.04] tracking-[-0.015em] text-navy-ink">
              More from{" "}
              <em className="not-italic italic text-crimson">{current.address.city}.</em>
            </h2>
          </div>
          <Link
            href="/listings"
            data-cursor-label="All"
            className="group inline-flex items-center gap-3 self-start text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson md:self-end"
          >
            <span className="border-b border-current pb-1">Back to all listings</span>
            <span
              aria-hidden
              className="inline-block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-14"
            />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-3">
          {items.map((l, i) => (
            <RelatedPlate key={l.id} listing={l} num={String(i + 1).padStart(2, "0")} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function RelatedPlate({ listing, num }: { listing: Listing; num: string }) {
  const cover = listing.images[0];
  const facts: string[] = [];
  if (listing.beds > 0) facts.push(`${listing.beds} bed`);
  if (listing.baths > 0) facts.push(`${listing.baths} bath`);
  if (listing.sqft > 0) facts.push(`${listing.sqft.toLocaleString()} sqft`);
  else if (listing.lotAcres) facts.push(`${listing.lotAcres} acres`);

  return (
    <li>
      <Link
        href={`/listings/${listing.id}`}
        data-cursor-label="View"
        className="group block"
      >
        <div className="flex items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
          <span className="font-serif text-[14px] italic font-medium text-crimson">
            {num}
          </span>
          <span>{listing.type}</span>
        </div>
        <div className="relative mt-3.5 aspect-[16/10] overflow-hidden bg-cream-warm sm:aspect-[4/5]">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 28vw, 100vw"
            className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          <FavoriteHeart listing={listing} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full bg-navy-ink/85 px-4 py-3 text-center font-sans text-[10.5px] font-medium uppercase tracking-[0.24em] text-cream backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
          >
            Schedule a tour <span className="ml-2 text-crimson-bright">&rarr;</span>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="font-serif text-[22px] leading-[1.12] text-navy-ink transition-colors group-hover:text-crimson">
            {listing.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] font-light text-ink-soft">
            {listing.address.street}, {listing.address.city}
          </p>
        </div>
        <div className="mt-5 border-t border-navy-ink/15 pt-3.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-serif text-[24px] font-semibold leading-none tracking-[-0.015em] text-navy-ink">
              {formatPrice(listing.price)}
            </span>
            {listing.sqft > 0 ? (
              <span className="font-serif text-[12px] italic text-ink-soft">
                ${Math.round(listing.price / listing.sqft).toLocaleString()}/sqft
              </span>
            ) : null}
          </div>
          {facts.length ? (
            <div className="mt-2.5 text-[11.5px] tracking-[0.04em] text-ink-soft">
              {facts.slice(0, 3).join("  \u00b7  ")}
            </div>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
