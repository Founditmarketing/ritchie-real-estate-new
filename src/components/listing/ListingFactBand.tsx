import { formatPrice, formatSqft, type Listing } from "@/lib/listings";

/**
 * Typographic facts strip immediately below the cinematic hero. Price is
 * the dominant typographic moment; the other facts sit alongside as a
 * proper dl with serif numerals and small-caps labels, separated by
 * hairline rules. No card, no panel \u2014 just type on cream.
 */
export function ListingFactBand({ listing }: { listing: Listing }) {
  const facts: { label: string; value: string }[] = [];
  if (listing.beds > 0) facts.push({ label: "Bedrooms", value: String(listing.beds) });
  if (listing.baths > 0) facts.push({ label: "Bathrooms", value: String(listing.baths) });
  if (listing.sqft > 0)
    facts.push({ label: "Living area", value: `${formatSqft(listing.sqft)} sq ft` });
  if (listing.lotAcres)
    facts.push({ label: "Lot", value: `${listing.lotAcres} acres` });
  if (listing.yearBuilt)
    facts.push({ label: "Year built", value: String(listing.yearBuilt) });
  facts.push({ label: "Type", value: cap(listing.type) });

  return (
    <section className="bg-navy-ink py-16 md:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-10 px-6 lg:px-12">
        <div className="col-span-12 md:col-span-5">
          <span className="font-sans text-[10.5px] uppercase tracking-[0.28em] text-crimson-bright">
            Asking
          </span>
          <div className="mt-3 flex items-baseline gap-3 font-serif">
            <span className="text-[clamp(56px,8vw,128px)] font-semibold leading-[0.9] tracking-[-0.025em] text-paper">
              {formatPrice(listing.price)}
            </span>
            {listing.sqft > 0 ? (
              <span className="text-[14px] italic text-mute">
                / {Math.round(listing.price / listing.sqft).toLocaleString()} per sq ft
              </span>
            ) : null}
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 md:pt-2">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-cream/15 pt-3">
                <dt className="font-sans text-[10px] uppercase tracking-[0.18em] text-mute">
                  {f.label}
                </dt>
                <dd className="mt-1.5 font-serif text-[clamp(20px,1.8vw,26px)] font-medium text-paper">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
