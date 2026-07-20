import type { Metadata } from "next";
import { getListings, formatPrice } from "@/lib/listings";
import { fieldNotes } from "@/content/field-notes";
import { ExploreClient, type ExploreListing } from "@/components/explore/ExploreClient";

export const metadata: Metadata = {
  title: "Explore the Map",
  description:
    "Ritchie’s Central Louisiana listings on one map, with Matt’s street-level field notes. Ask Ritchie to filter it for you.",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const [items, sp] = await Promise.all([
    getListings({ sort: "newest" }),
    searchParams,
  ]);

  const listings: ExploreListing[] = items.map((l) => ({
    id: l.id,
    title: l.title,
    type: l.type,
    badge: l.badge,
    price: formatPrice(l.price),
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    city: l.address.city,
    neighborhood: l.address.neighborhood,
    image: l.images[0]?.src,
    href: `/listings/${l.id}`,
    lat: l.coords?.lat,
    lng: l.coords?.lng,
    status: l.status,
  }));

  // /explore?focus={id} deep links (e.g. the listing page's slate strip)
  // land with that pin active. Validate against real inventory.
  const focus = sp.focus && items.some((l) => l.id === sp.focus) ? sp.focus : null;

  return (
    <ExploreClient listings={listings} notes={fieldNotes} initialFocusId={focus} />
  );
}
