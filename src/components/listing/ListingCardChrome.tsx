"use client";

import { useState } from "react";
import { type Listing } from "@/lib/listings";

/**
 * Client-only interactive bits that get composited onto otherwise
 * server-rendered listing plates. Extracted here so the surrounding
 * plate components can remain server components (and fetch listings
 * directly via `getListings`) without losing the favorite/hover
 * affordances.
 */

export function FavoriteHeart({ listing }: { listing: Listing }) {
  const [fav, setFav] = useState(false);
  void listing; // kept for future saved-listing wiring
  return (
    <button
      type="button"
      aria-label={fav ? "Remove from saved" : "Save listing"}
      aria-pressed={fav}
      data-cursor-label={fav ? "Saved" : "Save"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFav((v) => !v);
      }}
      className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition ${
        fav
          ? "bg-crimson text-cream"
          : "bg-paper/85 text-navy-ink hover:bg-paper hover:scale-110"
      }`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M12 21s-7-4.534-7-10a4.5 4.5 0 0 1 8-2.829A4.5 4.5 0 0 1 19 11c0 5.466-7 10-7 10z"
          fill={fav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
