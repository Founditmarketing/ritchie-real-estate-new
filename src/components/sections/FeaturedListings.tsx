import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PlateImage } from "@/components/listing/PlateImage";
import { TiltCard } from "@/components/listing/TiltCard";
import { FeaturedCarousel } from "@/components/sections/FeaturedCarousel";
import { getListings, formatPrice, formatSqft, type Listing } from "@/lib/listings";

/**
 * Featured listings as an editorial spread. Shares the exact PlateMeta /
 * PriceAnchor / ScheduleTourAffordance vocabulary with ListingsCatalog
 * and RelatedListings so cards read as one system.
 *
 * Server component: fetches its own data, renders mostly static markup.
 */
/** Commercial plates that lead the spread before the rest fills in. */
const COMMERCIAL_SLOTS = 2;

export async function FeaturedListings() {
  // Commercial anchors the spread (client direction 7/26) — the feature
  // plate is a commercial listing. But the spread is capped at
  // COMMERCIAL_SLOTS: with a deep commercial inventory an unbounded
  // "commercial first" fill made all four plates commercial, which reads
  // like the firm quit selling houses. Commercial leads; homes still show.
  const [commercial, all] = await Promise.all([
    getListings({ type: "commercial", status: "active" }),
    getListings({ status: "active" }),
  ]);
  const lead = commercial.slice(0, COMMERCIAL_SLOTS);
  const leadIds = new Set(lead.map((l) => l.id));
  const ordered = [...lead, ...all.filter((l) => !leadIds.has(l.id))].slice(0, 4);
  if (ordered.length === 0) return null;
  const feat = ordered[0];
  const rest = ordered.filter((l) => l.id !== feat.id).slice(0, 3);

  return (
    // No ghost watermark here — the device lives in Sell ("Worth.") and
    // the Testimonials quote mark; a third dilutes it.
    <section className="relative bg-navy-deep py-16 md:py-32">
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal>
          <div className="mb-9 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <Eyebrow variant="numbered" num="01" tone="crimson-bright">
                Now on the market
              </Eyebrow>
              <h2 className="mt-5 font-serif text-[clamp(34px,5vw,72px)] leading-[0.98] tracking-[-0.02em] text-paper">
                A few listings <em className="italic">worth</em>
                <br />
                the drive over.
              </h2>
            </div>
            <Link
              href="/listings"
              data-cursor-label="All"
              className="group inline-flex items-center gap-3 self-start text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright md:self-end"
            >
              <span className="border-b border-current pb-1">View all listings</span>
              <span
                aria-hidden
                className="inline-block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-14"
              />
            </Link>
          </div>
        </Reveal>

        {/* MOBILE — native swipe carousel with pagination dots */}
        <FeaturedCarousel items={[feat, ...rest]} />

        {/* DESKTOP — editorial spread */}
        <div className="hidden md:block">
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
      </div>
    </section>
  );
}

function FeaturePlate({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      data-cursor-label="Tour"
      className="group block transition-transform duration-150 active:scale-[0.995]"
    >
      <PlateMeta num="01" type={listing.type} />
      <div className="mt-4 grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="relative col-span-12 aspect-[16/10] overflow-hidden bg-navy md:col-span-8 md:aspect-[16/12]">
          <PlateImage listing={listing} sizes="(min-width: 768px) 66vw, 100vw" />
          {listing.badge ? <BadgeTag>{listing.badge}</BadgeTag> : null}
          <ScheduleTourAffordance />
        </div>
        <div className="col-span-12 flex flex-col justify-between gap-7 md:col-span-4">
          <div>
            <h3 className="font-serif text-[clamp(26px,2.8vw,40px)] leading-[1.04] tracking-[-0.015em] text-paper transition-colors group-hover:text-crimson-bright">
              {listing.title}
            </h3>
            <p className="mt-2.5 text-[13px] font-light leading-[1.55] text-mute">
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
  return (
    <li>
      <Link
        href={`/listings/${listing.id}`}
        data-cursor-label="View"
        className="group block transition-transform duration-150 active:scale-[0.995]"
      >
        <PlateMeta num={num} type={listing.type} />
        <TiltCard className="relative mt-3.5 aspect-[16/10] overflow-hidden bg-navy sm:aspect-[4/5]">
          <PlateImage
            listing={listing}
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
          />
          {listing.badge ? <BadgeTag>{listing.badge}</BadgeTag> : null}
          <ScheduleTourAffordance />
        </TiltCard>
        <div className="mt-5">
          <h3 className="font-serif text-[22px] leading-[1.12] text-paper transition-colors group-hover:text-crimson-bright">
            {listing.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] font-light text-mute">
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
    <div className="flex items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-mute">
      <span className="font-serif text-[16px] italic font-medium text-crimson-bright">
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
    <div className={`border-t border-cream/15 pt-3.5 ${className ?? ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`font-serif ${priceSize} font-semibold leading-none tracking-[-0.015em] text-paper`}
        >
          {formatPrice(listing.price)}
        </span>
        {psf ? (
          <span className="font-serif text-[15px] italic text-mute">{psf}</span>
        ) : null}
      </div>
      {/* Price tick — crimson hairline draws under the price on plate hover,
          the desktop cue that the whole plate is live. Mirrors ListingsCatalog. */}
      <span
        aria-hidden
        className="mt-1.5 block h-px w-0 bg-crimson-bright transition-[width] duration-500 ease-out group-hover:w-full"
      />
      {factLine ? (
        <div className="mt-2.5 text-[11.5px] tracking-[0.04em] text-mute">
          {factLine}
        </div>
      ) : null}
    </div>
  );
}
