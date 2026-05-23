/**
 * Listing seed data. Types mirror common IDX/RESO fields so the
 * `lib/listings.ts` adapter can be swapped to a real feed (Spark, Bridge,
 * RealtyFeed, direct RESO) without touching any UI component.
 */

export type ListingStatus = "active" | "pending" | "sold" | "coming-soon";
export type ListingType = "residential" | "commercial" | "land" | "rental";

export type Listing = {
  /** RESO ListingId equivalent; URL slug uses this. */
  id: string;
  status: ListingStatus;
  type: ListingType;
  /** Marketing label (overrides status if set). */
  badge?: "New Listing" | "Featured" | "Open House" | "Just Reduced";
  title: string;
  address: {
    street: string;
    city: string;
    state: "LA";
    zip: string;
    /** Human-readable neighborhood / subdivision. */
    neighborhood?: string;
  };
  /** Whole-dollar amount; format with toLocaleString in the UI. */
  price: number;
  beds: number;
  baths: number;
  /** Living area, square feet. */
  sqft: number;
  /** Lot in acres. */
  lotAcres?: number;
  yearBuilt?: number;
  description: string;
  /** First image is the cover; rest are gallery. */
  images: { src: string; alt: string }[];
  features: string[];
  /** Coordinates for the area map (decimal degrees). */
  coords?: { lat: number; lng: number };
  /** Mark the hero listing on the home page. */
  feat?: boolean;
};

/* Image helpers — Unsplash hosted, sized via query string */
const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const listings: Listing[] = [
  {
    id: "bayou-robert-estate",
    status: "active",
    type: "residential",
    badge: "New Listing",
    title: "Bayou Robert Estate",
    address: {
      street: "88 Riverbend Rd",
      city: "Alexandria",
      state: "LA",
      zip: "71303",
      neighborhood: "Bayou Robert",
    },
    price: 615000,
    beds: 5,
    baths: 4,
    sqft: 4210,
    lotAcres: 1.2,
    yearBuilt: 2014,
    description:
      "Set on a wooded acre and a quarter along Bayou Robert. Open-plan kitchen flows to a screened porch overlooking the water; primary suite on the main floor; two-car garage with a finished bonus above.",
    images: [
      { src: u("1564013799919-ab600027ffc6", 1800), alt: "Estate exterior at golden hour" },
      { src: u("1600585154340-be6161a56a0c"), alt: "Open kitchen and dining" },
      { src: u("1600210491892-03d54c0aaf87"), alt: "Living room facing porch" },
      { src: u("1600566753190-17f0baa2a6c3"), alt: "Primary suite" },
    ],
    features: ["Bayou frontage", "Screened porch", "Primary on main", "3-car capacity"],
    coords: { lat: 31.301, lng: -92.476 },
    feat: true,
  },
  {
    id: "garden-district-colonial",
    status: "active",
    type: "residential",
    badge: "Featured",
    title: "Garden District Colonial",
    address: {
      street: "214 Elliott St",
      city: "Alexandria",
      state: "LA",
      zip: "71301",
      neighborhood: "Garden District",
    },
    price: 389000,
    beds: 4,
    baths: 3,
    sqft: 2940,
    lotAcres: 0.31,
    yearBuilt: 1928,
    description:
      "A storied Garden District colonial: original heart-pine floors, plaster medallions, dual fireplaces. Kitchen updated in 2022 with marble counters and a Wolf range. Walk to Bolton Avenue.",
    images: [
      { src: u("1572120360610-d971b9d7767c", 1800), alt: "Colonial facade" },
      { src: u("1600585154526-990dced4db0d"), alt: "Front parlor with fireplace" },
      { src: u("1600585154363-67eb9e2e2099"), alt: "Updated kitchen with marble counters" },
    ],
    features: ["1928 build", "Heart-pine floors", "Walk to Bolton", "Updated kitchen"],
    coords: { lat: 31.31, lng: -92.453 },
  },
  {
    id: "pineville-brick-ranch",
    status: "active",
    type: "residential",
    title: "Pineville Brick Ranch",
    address: {
      street: "1102 Edgewood Dr",
      city: "Pineville",
      state: "LA",
      zip: "71360",
      neighborhood: "Edgewood",
    },
    price: 272500,
    beds: 3,
    baths: 2,
    sqft: 1860,
    lotAcres: 0.22,
    yearBuilt: 1978,
    description:
      "Move-in-ready Edgewood ranch on a corner lot. Updated electrical, new roof 2023, fenced yard with a covered patio. Easy commute over the Jackson Street Bridge.",
    images: [
      { src: u("1568605114967-8130f3a36994", 1800), alt: "Brick ranch exterior" },
      { src: u("1600585154084-4e5fe7c39198"), alt: "Family room" },
    ],
    features: ["New roof 2023", "Fenced yard", "Corner lot"],
    coords: { lat: 31.323, lng: -92.434 },
  },
  {
    id: "macarthur-drive-office",
    status: "active",
    type: "commercial",
    badge: "Featured",
    title: "MacArthur Drive Office Suite",
    address: {
      street: "3422 MacArthur Dr",
      city: "Alexandria",
      state: "LA",
      zip: "71301",
    },
    price: 825000,
    beds: 0,
    baths: 2,
    sqft: 6800,
    yearBuilt: 2006,
    description:
      "Class-A office suite on Alexandria's primary commercial corridor. 38 parking spots, full reception build-out, conference room. NNN lease in place through 2027 from a Fortune-500 tenant.",
    images: [
      { src: u("1497366216548-37526070297c", 1800), alt: "Office building facade" },
      { src: u("1497366811353-6870744d04b2"), alt: "Reception and lobby" },
    ],
    features: ["NNN tenanted", "38 parking", "Class-A finish", "MacArthur corridor"],
    coords: { lat: 31.298, lng: -92.471 },
  },
  {
    id: "tioga-acreage",
    status: "active",
    type: "land",
    title: "Tioga Acreage \u2014 18.4 ac",
    address: {
      street: "Tract 7, Indian Creek Rd",
      city: "Tioga",
      state: "LA",
      zip: "71477",
    },
    price: 145000,
    beds: 0,
    baths: 0,
    sqft: 0,
    lotAcres: 18.4,
    description:
      "Mostly cleared pasture with a stocked pond and old-growth pecan stand. Power and water at the road. Frontage on Indian Creek; rear borders Kisatchie National Forest.",
    images: [
      { src: u("1500382017468-9049fed747ef", 1800), alt: "Cleared pasture with pond" },
    ],
    features: ["Pond", "Pecan stand", "Kisatchie border", "Power at road"],
    coords: { lat: 31.443, lng: -92.474 },
  },
  {
    id: "boyce-cottage",
    status: "coming-soon",
    type: "residential",
    badge: "Just Reduced",
    title: "Boyce Cottage on Bayou Jean de Jean",
    address: {
      street: "44 Bayou Bend",
      city: "Boyce",
      state: "LA",
      zip: "71409",
    },
    price: 198000,
    beds: 2,
    baths: 2,
    sqft: 1320,
    yearBuilt: 1962,
    description:
      "Updated cottage with a wraparound deck and a private dock. Renovated 2021: new HVAC, kitchen, baths. Used as a successful short-term rental for the past two seasons.",
    images: [
      { src: u("1518780664697-55e3ad937233", 1800), alt: "Cottage with wraparound deck" },
    ],
    features: ["Private dock", "STR-ready", "Renovated 2021"],
    coords: { lat: 31.388, lng: -92.668 },
  },
];

/** Quick lookups */
export const featured = listings.find((l) => l.feat);
export const rest = listings.filter((l) => !l.feat);

export function getListing(id: string) {
  return listings.find((l) => l.id === id);
}
