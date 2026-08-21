import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { broker } from "@/content/team";
import { formatSqft, getListingById, LISTINGS_ARE_SEED } from "@/lib/listings";
import { PrintButton } from "./PrintButton";

/**
 * The mark, with hardcoded hex rather than the shared LogoMark.
 * LogoMark paints from CSS custom properties, and this sheet is white in
 * BOTH themes — under the light palette those tokens resolve to a pale
 * surface and a navy glyph, which would render the mark nearly invisible
 * on paper. Fixed values keep the OM identical everywhere it prints.
 */
function SheetMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={(size * 140) / 120}
      viewBox="0 0 120 140"
      role="img"
      aria-label="Ritchie Real Estate"
      className="shrink-0"
    >
      <polygon
        points="60,4 116,70 60,136 4,70"
        fill="none"
        stroke="#101c42"
        strokeWidth="5"
        strokeLinejoin="miter"
      />
      <polygon points="60,16 105,70 60,124 15,70" fill="#a81640" />
      <text
        x="60"
        y="88"
        textAnchor="middle"
        fontSize="52"
        fontWeight="600"
        fill="#ffffff"
        fontFamily="var(--font-serif), Georgia, serif"
      >
        R
      </text>
    </svg>
  );
}

/**
 * The offering memorandum — the artifact a commercial broker actually
 * hands a buyer. Every commercial listing gets one, generated from the
 * same record that drives the listing page, so the OM can never drift
 * from the listing the way a hand-built PDF does.
 *
 * Designed for paper first: a single US-Letter portrait page with its own
 * print stylesheet (see globals.css .om-sheet). Cmd/Ctrl-P — or Share →
 * Print on a phone — produces the PDF. No export service, no dependency.
 *
 * Honesty: while the inventory is seed data the sheet carries a visible
 * SAMPLE rule, so a placeholder OM can never be mistaken for a real
 * offering. It disappears the moment LISTINGS_ARE_SEED flips.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing) return { title: "Offering Memorandum" };
  return {
    title: `${listing.title} — Offering Memorandum`,
    description: `Offering memorandum for ${listing.title}, ${listing.address.city}, LA. Ritchie Real Estate — CCIM-led commercial desk.`,
    robots: { index: false, follow: false },
  };
}

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default async function OfferingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);
  if (!listing || listing.type !== "commercial") notFound();

  const psf =
    listing.sqft > 0 ? Math.round(listing.price / listing.sqft) : null;
  const cover = listing.images[0];

  const facts: { label: string; value: string }[] = [
    { label: "Price", value: money(listing.price) },
    ...(psf ? [{ label: "Per sq ft", value: `$${psf}` }] : []),
    ...(listing.sqft > 0
      ? [{ label: "Building", value: `${formatSqft(listing.sqft)} sq ft` }]
      : []),
    ...(listing.lotAcres
      ? [{ label: "Site", value: `${listing.lotAcres} acres` }]
      : []),
    ...(listing.yearBuilt
      ? [{ label: "Year built", value: String(listing.yearBuilt) }]
      : []),
    { label: "Status", value: listing.status === "pending" ? "Under contract" : "Available" },
  ];

  return (
    <div className="om-screen bg-navy-ink pb-24 pt-[120px] print:bg-white print:p-0">
      {/* Screen-only toolbar */}
      <div className="mx-auto mb-8 flex max-w-[8.5in] items-center justify-between gap-4 px-6 print:hidden">
        <Link
          href="/commercial"
          className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-mute transition-colors hover:text-cream"
        >
          &larr; Commercial desk
        </Link>
        <PrintButton />
      </div>

      {/* THE SHEET — one US Letter page */}
      <article className="om-sheet mx-auto max-w-[8.5in] bg-white text-[#101c42] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] print:shadow-none">
        <div className="px-[0.7in] py-[0.6in]">
          {/* Masthead */}
          <header className="flex items-start justify-between gap-6 border-b-2 border-[#a81640] pb-4">
            <div className="flex items-center gap-3">
              <SheetMark size={38} />
              <div>
                <p className="font-serif text-[19px] font-semibold leading-none tracking-[0.14em]">
                  RITCHIE
                </p>
                <p className="mt-1 font-sans text-[7.5px] font-medium uppercase tracking-[0.26em] text-[#6b7280]">
                  Real Estate &middot; Alexandria, LA
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.24em] text-[#a81640]">
                Offering Memorandum
              </p>
              <p className="mt-1 font-sans text-[8px] uppercase tracking-[0.18em] text-[#6b7280]">
                {listing.type} &middot; {listing.address.city}, LA
              </p>
            </div>
          </header>

          {/* Title block */}
          <div className="mt-6">
            <h1 className="font-serif text-[34px] leading-[1.05] tracking-[-0.015em]">
              {listing.title}
            </h1>
            <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.16em] text-[#6b7280]">
              {listing.address.street} &middot; {listing.address.city}, LA{" "}
              {listing.address.zip}
            </p>
          </div>

          {/* Cover image */}
          <div className="relative mt-5 h-[3.1in] w-full overflow-hidden bg-[#e8e6e1]">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes="(min-width: 900px) 8in, 100vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Fact band */}
          <dl className="mt-5 grid grid-cols-3 gap-x-6 gap-y-4 border-y border-[#d8d5cf] py-4">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="font-sans text-[7.5px] font-semibold uppercase tracking-[0.22em] text-[#6b7280]">
                  {f.label}
                </dt>
                <dd className="mt-1 font-serif text-[19px] font-semibold leading-none">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Narrative + highlights */}
          <div className="mt-5 grid grid-cols-[1.55fr_1fr] gap-7">
            <section>
              <h2 className="font-sans text-[8px] font-semibold uppercase tracking-[0.24em] text-[#a81640]">
                The property
              </h2>
              <p className="mt-2 font-serif text-[11.5px] leading-[1.6] text-[#26303f]">
                {listing.description}
              </p>
            </section>

            <section>
              <h2 className="font-sans text-[8px] font-semibold uppercase tracking-[0.24em] text-[#a81640]">
                Highlights
              </h2>
              <ul className="mt-2 space-y-1.5">
                {listing.features.map((f) => (
                  <li
                    key={f}
                    className="flex gap-2 font-sans text-[10px] leading-snug text-[#26303f]"
                  >
                    <span className="mt-[5px] inline-block h-[3px] w-[3px] shrink-0 bg-[#a81640]" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Broker block */}
          <footer className="mt-6 flex items-end justify-between gap-6 border-t border-[#d8d5cf] pt-4">
            <div>
              <p className="font-sans text-[7.5px] font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
                Presented by
              </p>
              <p className="mt-1.5 font-serif text-[17px] font-semibold leading-none">
                {broker.name}
              </p>
              <p className="mt-1 font-sans text-[8.5px] uppercase tracking-[0.18em] text-[#a81640]">
                {broker.title}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-[17px] font-semibold leading-none">
                318&middot;449&middot;8919
              </p>
              <p className="mt-1 font-sans text-[8.5px] text-[#6b7280]">
                ritchierealestate.com
              </p>
            </div>
          </footer>

          <p className="mt-4 font-sans text-[6.5px] leading-relaxed text-[#8b93a6]">
            {LISTINGS_ARE_SEED
              ? "SAMPLE — this sheet is generated from placeholder inventory for demonstration. Not an offer. "
              : ""}
            Information contained herein has been obtained from sources deemed
            reliable but is not guaranteed. Buyer should verify all
            information, including measurements, zoning, and condition, prior
            to purchase. Ritchie Real Estate, LLC &middot; Licensed in
            Louisiana.
          </p>
        </div>
      </article>
    </div>
  );
}
