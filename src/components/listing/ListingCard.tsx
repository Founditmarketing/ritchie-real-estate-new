"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatPrice, formatSqft, type Listing } from "@/lib/listings";
import { ease } from "@/lib/motion";

type ListingCardProps = {
  listing: Listing;
  size?: "feat" | "small";
  className?: string;
};

export function ListingCard({ listing, size = "small", className }: ListingCardProps) {
  const [fav, setFav] = useState(false);
  const cover = listing.images[0];

  return (
    <article className={cn("group cursor-pointer", className)}>
      <Link
        href={`/listings/${listing.id}`}
        data-cursor-label="View"
        className="block"
      >
        <div
          className={cn(
            "relative overflow-hidden bg-navy",
            size === "feat" ? "aspect-[16/12]" : "aspect-[16/10]",
          )}
        >
          {/* badge */}
          {listing.badge ? (
            <span className="absolute left-4 top-4 z-10 bg-paper px-3 py-1.5 text-[9.5px] font-semibold tracking-[0.12em] uppercase text-crimson">
              {listing.badge}
            </span>
          ) : null}

          {/* favourite */}
          <button
            type="button"
            aria-label={fav ? "Remove from favourites" : "Save to favourites"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFav((v) => !v);
            }}
            className={cn(
              "absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-full transition",
              fav
                ? "bg-crimson text-cream"
                : "bg-paper/92 text-ink hover:scale-110",
            )}
          >
            <Heart filled={fav} />
          </button>

          {/* image */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.9, ease: ease.outQuart }}
          >
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes={size === "feat" ? "(min-width: 768px) 60vw, 100vw" : "(min-width: 768px) 40vw, 100vw"}
              className="object-cover"
            />
          </motion.div>

          {/* gradient + price overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_45%,rgba(20,20,30,0.66))]" />
          <div className="pointer-events-none absolute inset-x-5 bottom-4 z-10 flex items-end justify-between gap-3 text-paper">
            <span
              className={cn(
                "font-serif font-semibold leading-none",
                size === "feat" ? "text-3xl" : "text-2xl",
              )}
            >
              {formatPrice(listing.price)}
            </span>
            <span className="text-right text-[11.5px] font-light leading-snug text-cream-warm">
              {listing.beds > 0
                ? `${listing.beds} bd \u00b7 ${listing.baths} ba`
                : listing.type === "land"
                  ? `${listing.lotAcres} acres`
                  : `${listing.baths} ba`}
              <br />
              {listing.sqft > 0 ? `${formatSqft(listing.sqft)} sq ft` : "Land"}
            </span>
          </div>
        </div>

        <div className="pt-4">
          <h3
            className={cn(
              "font-serif font-semibold leading-tight text-paper transition-colors group-hover:text-crimson-bright",
              size === "feat" ? "text-[23px]" : "text-[20px]",
            )}
          >
            {listing.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[12.5px] font-light text-mute">
            <span className="h-px w-3 bg-crimson-bright" />
            {listing.address.street}, {listing.address.city}
          </div>
        </div>
      </Link>
    </article>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s-7-4.534-7-10a4.5 4.5 0 0 1 8-2.829A4.5 4.5 0 0 1 19 11c0 5.466-7 10-7 10z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
