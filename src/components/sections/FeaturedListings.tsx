import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FavoriteHeart } from "@/components/listing/ListingCardChrome";
import { getListings, formatPrice, formatSqft, type Listing } from "@/lib/listings";

/**
 * Featured listings as an editorial spread. Shares the exact PlateMeta /
 * PriceAnchor / FavoriteHeart / ScheduleTourAffordance vocabulary with
 * ListingsCatalog and RelatedListings so cards read as one system.
 *
 * Server component: fetches its own data, renders mostly static markup,
 * inlines the FavoriteHeart client island for the per-card save toggle.
 */
export async function FeaturedListings() {
  const items = await getListings({ status: "active", limit: 4 });
  if (items.length === 0) return null;
  const feat = items.find((l) => l.feat) ?? items[0];
  const rest = items.filter((l) => l.id !== feat.id).slice(0, 3);

  return (
    <section className="relative bg-paper py-24 md:py-32">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 top-24 hidden font-serif italic font-medium text-[14vw] leading-[0.8] text-navy-ink/[0.035] lg:block"
      >
        Index
      </span>

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <Eyebrow variant="numbered" num="01" tone="crimson">
                Now on the market
              </Eyebrow>
              <h2 className="mt-5 font-serif text-[clamp(34px,5vw,72px)] leading-[0.98] tracking-[-0.02em] text-navy-ink">
                A few homes <em className="not-italic italic text-crimson">worth</em>
                <br />
                the drive over.
              </h2>
            </div>
            <Link
              href="/listings"
              data-cursor-label="All"
              className="group inline-flex items-center gap-3 self-start text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson md:self-end"
            >
              <span className="border-b border-current pb-1">View all listings</span>
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-14"
              />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <FeaturePlate listing={feat} />
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="mt-20 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((l, i) => (
              <PortraitPlate
                key={l.id}
                listing={l}
                num={String(i + 2).padStart(2, "0")}
              />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function FeaturePlate({ listing }: { listing: Listing }) {
  const cover = listing.images[0];
  return (
    <Link
      href={`/listings/${listing.id}`}
      data-cursor-label="Tour"
      className="group block"
    >
      <PlateMeta num="01" type={listing.type} />
      <div className="mt-4 grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="relative col-span-12 aspect-[16/10] overflow-hidden bg-cream-warm md:col-span-8 md:aspect-[16/12]">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          {listing.badge ? <BadgeTag>{listing.badge}</BadgeTag> : null}
          <FavoriteHeart listing={listing} />
          <ScheduleTourAffordance />
        </div>
        <div className="col-span-12 flex flex-col justify-between gap-7 md:col-span-4">
          <div>
            <h3 className="font-serif text-[clamp(26px,2.8vw,40px)] leading-[1.04] tracking-[-0.015em] text-navy-ink transition-colors group-hover:text-crimson">
              {listing.title}
            </h3>
            <p className="mt-2.5 text-[13px] font-light leading-[1.55] text-ink-soft">
              {listing.address.street}
              <br />
              {listing.address.city}, LA
            </p>
          </div>
          <PriceAnchor listing={listing} size="lg" />
        </div>
      </div>
    </Link>
  );
}

function PortraitPlate({ listing, num }: { listing: Listing; num: string }) {
  const cover = listing.images[0];
  return (
    <li>
      <Link
        href={`/listings/${listing.id}`}
        data-cursor-label="View"
        className="group block"
      >
        <PlateMeta num={num} type={listing.type} />
        <div className="relative mt-3.5 aspect-[16/10] overflow-hidden bg-cream-warm sm:aspect-[4/5]">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
          {listing.badge ? <BadgeTag>{listing.badge}</BadgeTag> : null}
          <FavoriteHeart listing={listing} />
          <ScheduleTourAffordance />
        </div>
        <div className="mt-5">
          <h3 className="font-serif text-[22px] leading-[1.12] text-navy-ink transition-colors group-hover:text-crimson">
            {listing.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] font-light text-ink-soft">
            {listing.address.street}, {listing.address.city}
          </p>
        </div>
        <PriceAnchor listing={listing} size="sm" className="mt-5" />
      </Link>
    </li>
  );
}

/* ---------- SHARED PARTS (mirrored in ListingsCatalog) ---------- */

function PlateMeta({ num, type }: { num: string; type: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
      <span className="font-serif text-[14px] italic font-medium text-crimson">
        {num}
      </span>
      <span>{type}</span>
    </div>
  );
}

function BadgeTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-4 top-4 z-10 bg-paper px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-crimson">
      {children}
    </span>
  );
}

function ScheduleTourAffordance() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-full bg-navy-ink/85 px-4 py-3 text-center font-sans text-[10.5px] font-medium uppercase tracking-[0.24em] text-cream backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
    >
      Schedule a tour
      <span className="ml-2 text-crimson-bright">&rarr;</span>
    </div>
  );
}

function pricePerSqft(listing: Listing): string | null {
  if (!listing.sqft || listing.sqft <= 0) return null;
  return `$${Math.round(listing.price / listing.sqft).toLocaleString()}/sqft`;
}

function PriceAnchor({
  listing,
  size,
  className,
}: {
  listing: Listing;
  size: "sm" | "md" | "lg";
  className?: string;
}) {
  const facts: string[] = [];
  if (listing.beds > 0) facts.push(`${listing.beds} bed`);
  if (listing.baths > 0) facts.push(`${listing.baths} bath`);
  if (listing.sqft > 0) facts.push(`${formatSqft(listing.sqft)} sqft`);
  else if (listing.lotAcres) facts.push(`${listing.lotAcres} acres`);
  const factLine = facts.slice(0, 3).join("  \u00b7  ");
  const psf = pricePerSqft(listing);
  const priceSize =
    size === "lg"
      ? "text-[clamp(34px,3.6vw,52px)]"
      : size === "md"
        ? "text-[clamp(26px,2.4vw,34px)]"
        : "text-[24px]";

  return (
    <div className={`border-t border-navy-ink/15 pt-3.5 ${className ?? ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`font-serif ${priceSize} font-semibold leading-none tracking-[-0.015em] text-navy-ink`}
        >
          {formatPrice(listing.price)}
        </span>
        {psf ? (
          <span className="font-serif text-[12px] italic text-ink-soft">{psf}</span>
        ) : null}
      </div>
      {factLine ? (
        <div className="mt-2.5 text-[11.5px] tracking-[0.04em] text-ink-soft">
          {factLine}
        </div>
      ) : null}
    </div>
  );
}
