import type { Metadata } from "next";
import { getListings, formatPrice } from "@/lib/listings";
import { ExploreClient, type ExploreListing } from "@/components/explore/ExploreClient";

export const metadata: Metadata = {
  title: "Explore the Map",
  description:
    "Every active Central Louisiana listing on one map. Ask Ritchie to filter it for you.",
};

export default async function ExplorePage() {
  const items = await getListings({ sort: "newest" });

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

  return <ExploreClient listings={listings} />;
}
