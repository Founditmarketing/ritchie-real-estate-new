/**
 * "Miles From Our Door" — film-slate geography for listing pages.
 *
 * Dependency-free math + formatting so server components and any future
 * client surface (map, concierge) compute the same honest numbers.
 */

export type Coords = { lat: number; lng: number };

// APPROXIMATE — TODO(launch): verify against the actual office pin before the
// client domain goes live. Display is clamped to one decimal mile so ~150m of
// error is invisible, but verify anyway.
// (1268 Dorchester Dr, Alexandria, LA 71303)
export const OFFICE: Coords = { lat: 31.2933, lng: -92.5019 };

/** Mean Earth radius in statute miles (IUGG). */
const EARTH_RADIUS_MILES = 3958.7613;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Great-circle distance from the Ritchie office in statute miles
 * (haversine). Returns `null` when the listing has no coordinates —
 * callers must render nothing rather than guess.
 */
export function milesFromOffice(coords?: Coords): number | null {
  if (!coords) return null;
  const dLat = toRad(coords.lat - OFFICE.lat);
  const dLng = toRad(coords.lng - OFFICE.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(OFFICE.lat)) * Math.cos(toRad(coords.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(a));
}

/**
 * Honest one-decimal display: round to the nearest tenth, never floor or
 * otherwise nudge toward "closer". Always shows the decimal — "6.0" is
 * fine and honest.
 */
export function formatMiles(miles: number): string {
  return (Math.round(miles * 10) / 10).toFixed(1);
}

/**
 * Film-slate coordinate line, e.g. "N 31.30° · W 92.48°" — two decimals,
 * absolute values with hemisphere letters (all Central Louisiana inventory is N/W).
 */
export function formatCoords(coords: Coords): string {
  const latHemi = coords.lat >= 0 ? "N" : "S";
  const lngHemi = coords.lng >= 0 ? "E" : "W";
  const lat = Math.abs(coords.lat).toFixed(2);
  const lng = Math.abs(coords.lng).toFixed(2);
  return `${latHemi} ${lat}° · ${lngHemi} ${lng}°`;
}
