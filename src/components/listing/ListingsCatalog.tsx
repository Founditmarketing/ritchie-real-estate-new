"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FavoriteHeart } from "@/components/listing/ListingCardChrome";
import { TiltCard } from "@/components/listing/TiltCard";
import { formatPrice, formatSqft, type Listing } from "@/lib/listings";
import { ease } from "@/lib/motion";

/**
 * Editorial catalog of listings. Treats each property as a numbered Plate
 * in a 12-column grid, rotating between four layouts so the page never
 * reads as a templated IDX grid.
 *
 *   - feature  (12 cols, big landscape, title beside image in the gutter)
 *   - portrait (4 cols, tall 4/5 image)
 *   - wide     (8 cols, landscape 16/10)
 *   - column   (4 cols, type-led companion to wide)
 *
 * Every variant uses the same typographic hierarchy:
 *   plate # / type  \u2192  image  \u2192  title  \u2192  address  \u2192  PRICE (anchor)
 * so the page reads as one consistent system, not five different cards.
 */
export function ListingsCatalog({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <div className="mt-16 border-t border-line py-24 text-center">
        <p className="font-serif text-[clamp(24px,3vw,40px)] italic text-navy-ink/70">
          Nothing matches.
        </p>
        <p className="mt-4 text-[13px] text-ink-soft">
          Clear a filter or two and try again.
        </p>
      </div>
    );
  }

  const blocks = buildBlocks(listings);

  return (
    <div className="mt-12 flex flex-col gap-y-16 md:gap-y-20">
      {blocks.map((b, i) => (
        <Row key={i} block={b} />
      ))}
    </div>
  );
}

type Block =
  | { kind: "feature"; listing: Listing; startIndex: number }
  | { kind: "trio"; listings: Listing[]; startIndex: number }
  | { kind: "split"; wide: Listing; column?: Listing; startIndex: number };

function buildBlocks(items: Listing[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  let cycle = 0;
  while (i < items.length) {
    if (cycle === 0) {
      blocks.push({ kind: "feature", listing: items[i], startIndex: i + 1 });
      i += 1;
    } else if (cycle === 1) {
      const slice = items.slice(i, i + 3);
      if (slice.length === 0) break;
      blocks.push({ kind: "trio", listings: slice, startIndex: i + 1 });
      i += slice.length;
    } else {
      const wide = items[i];
      const col = items[i + 1];
      blocks.push({ kind: "split", wide, column: col, startIndex: i + 1 });
      i += col ? 2 : 1;
    }
    cycle = (cycle + 1) % 3;
  }
  return blocks;
}

function Row({ block }: { block: Block }) {
  if (block.kind === "feature") {
    return <FeatureRow listing={block.listing} num={pad(block.startIndex)} />;
  }
  if (block.kind === "trio") {
    return (
      <ul className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 md:gap-y-16 lg:grid-cols-3">
        {block.listings.map((l, k) => (
          <PortraitPlate key={l.id} listing={l} num={pad(block.startIndex + k)} />
        ))}
      </ul>
    );
  }
  return (
    <SplitRow
      wide={block.wide}
      column={block.column}
      startIndex={block.startIndex}
    />
  );
}

/* ---------- LAYOUT VARIANTS ---------- */

function FeatureRow({ listing, num }: { listing: Listing; num: string }) {
  const cover = listing.images[0];
  return (
    <Link
      href={`/listings/${listing.id}`}
      data-cursor-label="Tour"
      className="group block"
    >
      <PlateMeta num={num} type={listing.type} />
      <div className="mt-4 grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="relative col-span-12 aspect-[16/9] overflow-hidden bg-cream-warm md:col-span-8 md:aspect-[16/10]">
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
              {listing.address.city}, LA{" "}
              {listing.address.neighborhood ? (
                <span className="italic text-ink-soft/75">
                  &middot; {listing.address.neighborhood}
                </span>
              ) : null}
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
        {/* Mobile uses 16/10; sm+ reverts to the editorial 4/5 portrait.
            TiltCard adds a subtle pointer-tracked 3D tilt to the image
            on hover \u2014 desktop only (touch pointers don't fire continuous
            move events). Caps at 5\u00b0; intentional restraint. */}
        <TiltCard className="relative mt-3.5 aspect-[16/10] overflow-hidden bg-cream-warm sm:aspect-[4/5]">
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
        </TiltCard>
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

function SplitRow({
  wide,
  column,
  startIndex,
}: {
  wide: Listing;
  column?: Listing;
  startIndex: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-8">
        <WidePlate listing={wide} num={pad(startIndex)} />
      </div>
      {column ? (
        <div className="lg:col-span-4 lg:pt-16">
          <ColumnPlate listing={column} num={pad(startIndex + 1)} />
        </div>
      ) : null}
    </div>
  );
}

function WidePlate({ listing, num }: { listing: Listing; num: string }) {
  const cover = listing.images[0];
  return (
    <Link
      href={`/listings/${listing.id}`}
      data-cursor-label="View"
      className="group block"
    >
      <PlateMeta num={num} type={listing.type} />
      <div className="relative mt-3.5 aspect-[16/10] overflow-hidden bg-cream-warm">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        {listing.badge ? <BadgeTag>{listing.badge}</BadgeTag> : null}
        <FavoriteHeart listing={listing} />
        <ScheduleTourAffordance />
      </div>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-7">
        <div>
          <h3 className="font-serif text-[clamp(22px,2.4vw,30px)] leading-[1.1] text-navy-ink transition-colors group-hover:text-crimson">
            {listing.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] font-light text-ink-soft">
            {listing.address.street}, {listing.address.city}
          </p>
        </div>
        <PriceAnchor listing={listing} size="md" />
      </div>
    </Link>
  );
}

function ColumnPlate({ listing, num }: { listing: Listing; num: string }) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      data-cursor-label="View"
      className="group block"
    >
      <PlateMeta num={num} type={listing.type} />
      <h3 className="mt-3.5 font-serif text-[clamp(24px,2.4vw,34px)] leading-[1.05] text-navy-ink transition-colors group-hover:text-crimson">
        {listing.title}
      </h3>
      <p className="mt-2 text-[13px] font-light leading-[1.6] text-ink-soft">
        {listing.address.street}, {listing.address.city}
      </p>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: ease.outExpo }}
        className="relative mt-5 aspect-[5/6] overflow-hidden bg-cream-warm"
      >
        <Image
          src={listing.images[0].src}
          alt={listing.images[0].alt}
          fill
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        />
        <FavoriteHeart listing={listing} />
        <ScheduleTourAffordance />
      </motion.div>
      <PriceAnchor listing={listing} size="sm" className="mt-5" />
    </Link>
  );
}

/* ---------- SHARED PARTS (single hierarchy across variants) ---------- */

function PlateMeta({ num, type }: { num: string; type: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink-soft">
      {/* "Plate" word dropped \u2014 the italic number alone reads as
          editorial without adding noise to scannable property cards. */}
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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Bottom-edge hover affordance that hints "schedule a tour" without
 * stealing focus from the image. Hidden until hover, slides in from
 * below, fully accessible by clicking anywhere on the card (the parent
 * Link captures the click; this is a visual hint, not an interactive
 * sub-element). Touch-only users skip this gracefully \u2014 they tap the
 * card and land on the detail page where the real tour CTA lives.
 */
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
