import Link from "next/link";
import type { Listing } from "@/lib/listings";
import { formatCoords, formatMiles, milesFromOffice } from "@/lib/slate";

/**
 * All current inventory sits in Rapides Parish — hardcoded on purpose.
 * Revisit (move onto the Listing record) the day inventory crosses
 * parish lines.
 */
const PARISH = "Rapides Parish";

/**
 * "Miles From Our Door" — a computed film-slate strip in the Hero slate
 * vocabulary: coordinates / parish / distance from the office, with the
 * distance as the crimson star of the line. The whole strip links to the
 * Cenla map focused on this listing. Renders nothing when the listing has
 * no coordinates — the number is always computed, never asserted.
 */
export function ListingSlate({ listing }: { listing: Listing }) {
  const miles = milesFromOffice(listing.coords);
  if (!listing.coords || miles === null) return null;

  const milesLabel = formatMiles(miles);

  return (
    <Link
      href={`/explore?focus=${listing.id}`}
      data-cursor-label="See it on the map"
      aria-label={`${milesLabel} miles from the Ritchie office — see it on the map`}
      className="group inline-flex flex-wrap items-baseline gap-y-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.26em]"
    >
      <span className="whitespace-nowrap text-cream transition-colors group-hover:text-paper">
        {formatCoords(listing.coords)}
      </span>
      <span className="whitespace-nowrap text-mute">
        <span aria-hidden className="mx-3 text-cream/55">
          /
        </span>
        {PARISH}
      </span>
      <span className="whitespace-nowrap text-crimson-bright">
        <span aria-hidden className="mx-3 text-cream/55">
          /
        </span>
        {milesLabel} miles from our door
      </span>
    </Link>
  );
}
