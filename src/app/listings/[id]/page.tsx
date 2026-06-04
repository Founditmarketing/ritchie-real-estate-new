import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getListingById } from "@/lib/listings";
import { listings } from "@/content/listings";
import { ListingHero } from "@/components/listing/ListingHero";
import { ListingFactBand } from "@/components/listing/ListingFactBand";
import { ListingGallery } from "@/components/listing/ListingGallery";
import { ListingDescription } from "@/components/listing/ListingDescription";
import { RelatedListings } from "@/components/listing/RelatedListings";

export async function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const l = await getListingById(id);
  if (!l) return { title: "Listing not found" };
  return {
    title: `${l.title} \u2014 ${l.address.city}`,
    description: l.description.slice(0, 160),
    openGraph: {
      title: l.title,
      description: l.description.slice(0, 160),
      images: l.images.slice(0, 1).map((i) => i.src),
    },
  };
}

export default async function ListingDetail(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const l = await getListingById(id);
  if (!l) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: l.title,
    description: l.description,
    image: l.images.map((i) => i.src),
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address.street,
      addressLocality: l.address.city,
      addressRegion: l.address.state,
      postalCode: l.address.zip,
      addressCountry: "US",
    },
    offers: {
      "@type": "Offer",
      price: l.price,
      priceCurrency: "USD",
      availability:
        l.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
    },
    numberOfRooms: l.beds || undefined,
    floorSize: l.sqft
      ? { "@type": "QuantitativeValue", value: l.sqft, unitCode: "FTK" }
      : undefined,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ListingHero listing={l} />

      {/* Breadcrumb / back link, on its own dark band so it sits below the
          cinematic hero without competing with the type. */}
      <nav className="bg-navy-ink pt-7">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <Link
            href="/listings"
            data-cursor-label="Back"
            className="inline-flex items-baseline gap-2 font-serif text-[14px] italic text-mute hover:text-crimson-bright"
          >
            <span aria-hidden>&larr;</span> Back to all listings
          </Link>
        </div>
      </nav>

      <ListingFactBand listing={l} />
      <ListingGallery images={l.images} />
      <ListingDescription listing={l} />
      <RelatedListings current={l} />
    </article>
  );
}
