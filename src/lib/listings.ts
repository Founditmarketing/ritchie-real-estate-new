/**
 * Listings adapter.
 *
 * Every UI component reads listings through this module \u2014 never imports
 * the raw seed file. When the real IDX feed (Spark / Bridge / RealtyFeed /
 * direct RESO Web API) is ready, swap the body of these functions to call
 * the feed. The function signatures and the `Listing` shape stay the same,
 * so no component needs to change.
 */

import { listings, type Listing, type ListingStatus, type ListingType } from "@/content/listings";

/**
 * True while the site runs on the placeholder seed inventory. Gate anything
 * that asserts the listings are real (JSON-LD, "live" copy) behind this.
 * Flip by setting NEXT_PUBLIC_LISTINGS_SOURCE="live" once the real IDX feed
 * is wired in.
 */
export const LISTINGS_ARE_SEED = process.env.NEXT_PUBLIC_LISTINGS_SOURCE !== "live";

export type ListingsQuery = {
  type?: ListingType | "all";
  status?: ListingStatus;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  bedsMin?: number;
  /** Free-text match across address, title, neighborhood. */
  q?: string;
  /** Result ordering. */
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
};

export async function getListings(query: ListingsQuery = {}): Promise<Listing[]> {
  // Simulate async so swapping to a real fetch is invisible to callers.
  const all = listings.slice();
  let results = all;

  if (query.type && query.type !== "all") {
    results = results.filter((l) => l.type === query.type);
  }
  if (query.status) {
    results = results.filter((l) => l.status === query.status);
  }
  if (query.city) {
    const c = query.city.toLowerCase();
    results = results.filter((l) => l.address.city.toLowerCase().includes(c));
  }
  if (typeof query.priceMin === "number") {
    results = results.filter((l) => l.price >= query.priceMin!);
  }
  if (typeof query.priceMax === "number") {
    results = results.filter((l) => l.price <= query.priceMax!);
  }
  if (typeof query.bedsMin === "number") {
    results = results.filter((l) => l.beds >= query.bedsMin!);
  }
  if (query.q) {
    const q = query.q.toLowerCase();
    results = results.filter((l) =>
      [l.title, l.address.street, l.address.city, l.address.neighborhood ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  switch (query.sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      // Featured first, then mock "newest"
      results.sort((a, b) => (b.feat ? 1 : 0) - (a.feat ? 1 : 0));
      break;
  }

  if (query.limit) results = results.slice(0, query.limit);
  return results;
}

export async function getListingById(id: string): Promise<Listing | undefined> {
  return listings.find((l) => l.id === id);
}

export function formatPrice(p: number) {
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(p % 1_000_000 ? 2 : 1)}M`;
  if (p >= 1_000) return `$${(p / 1_000).toFixed(0)}k`;
  return `$${p.toLocaleString()}`;
}

export function formatSqft(n: number) {
  return n.toLocaleString();
}

export type { Listing, ListingStatus, ListingType };
