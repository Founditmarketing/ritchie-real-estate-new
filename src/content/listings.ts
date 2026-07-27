/*
 * PLACEHOLDER INVENTORY — seed data for the pitch; swap to the live feed
 * via src/lib/listings.ts before the client domain launches. None of these
 * properties, prices, or descriptions are real Ritchie listings.
 */

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
      "Class-A office suite on Alexandria’s primary commercial corridor. 38 parking spots, full reception build-out, conference room. Long-term NNN tenant in place.",
    images: [
      { src: u("1497366216548-37526070297c", 1800), alt: "Office building facade" },
      { src: u("1497366811353-6870744d04b2"), alt: "Reception and lobby" },
    ],
    features: ["NNN tenanted", "38 parking", "Class-A finish", "MacArthur corridor"],
    coords: { lat: 31.298, lng: -92.471 },
  },
  {
    id: "jackson-street-retail-center",
    status: "active",
    type: "commercial",
    badge: "New Listing",
    title: "Jackson Street Retail Center",
    address: {
      street: "4715 Jackson St Ext",
      city: "Alexandria",
      state: "LA",
      zip: "71303",
    },
    price: 1485000,
    beds: 0,
    baths: 4,
    sqft: 12400,
    lotAcres: 1.6,
    yearBuilt: 2003,
    description:
      "Six-tenant retail strip on the Jackson Street Extension with a national quick-service anchor. Pylon signage, 62 striped spaces, and staggered lease expirations that leave room to mark rents to market.",
    images: [
      { src: u("1441986300917-64674bd600d8", 1800), alt: "Retail storefront row" },
      { src: u("1567521464027-f127ff144326"), alt: "Retail suite interior" },
    ],
    features: ["6 tenants", "Pylon signage", "62 parking", "Jackson St Ext"],
    coords: { lat: 31.2905, lng: -92.429 },
  },
  {
    id: "england-airpark-warehouse",
    status: "active",
    type: "commercial",
    title: "England Airpark Distribution Warehouse",
    address: {
      street: "1900 Arnold Dr",
      city: "Alexandria",
      state: "LA",
      zip: "71303",
    },
    price: 1150000,
    beds: 0,
    baths: 2,
    sqft: 24000,
    lotAcres: 2.4,
    yearBuilt: 1998,
    description:
      "Clear-span distribution building inside the England Airpark corridor. Four dock-high doors, one grade ramp, 24-foot ceilings, and 1,800 square feet of finished office. Fenced yard with truck turnaround.",
    images: [
      { src: u("1553413077-190dd305871c", 1800), alt: "Warehouse exterior with loading docks" },
      { src: u("1586528116311-ad8dd3c8310d"), alt: "Warehouse interior racking" },
    ],
    features: ["4 dock doors", "24' clear height", "Fenced yard", "Airpark corridor"],
    coords: { lat: 31.327, lng: -92.549 },
  },
  {
    id: "masonic-drive-medical",
    status: "active",
    type: "commercial",
    badge: "Featured",
    title: "Masonic Drive Medical Office",
    address: {
      street: "1215 Masonic Dr",
      city: "Alexandria",
      state: "LA",
      zip: "71301",
    },
    price: 695000,
    beds: 0,
    baths: 3,
    sqft: 4200,
    yearBuilt: 2011,
    description:
      "Purpose-built medical suite minutes from the Masonic Drive hospital corridor. Eight exam rooms, nurse station, lab draw room, and a private physician office. Plumbed and wired for imaging.",
    images: [
      { src: u("1531973576160-7125cd663d86", 1800), alt: "Medical office reception" },
      { src: u("1582407947304-fd86f028f716"), alt: "Exam room corridor" },
    ],
    features: ["8 exam rooms", "Hospital corridor", "Imaging-ready", "Built 2011"],
    coords: { lat: 31.2985, lng: -92.453 },
  },
  {
    id: "third-street-mixed-use",
    status: "active",
    type: "commercial",
    title: "Third Street Mixed-Use Building",
    address: {
      street: "812 Third St",
      city: "Alexandria",
      state: "LA",
      zip: "71301",
      neighborhood: "Downtown",
    },
    price: 585000,
    beds: 0,
    baths: 4,
    sqft: 9600,
    yearBuilt: 1921,
    description:
      "Two-story downtown building with ground-floor retail and two loft apartments above. Original storefront glass, pressed-tin ceiling, and a rear service entrance off the alley. Historic rehabilitation credits may apply — verify with your tax advisor.",
    images: [
      { src: u("1449157291145-7efd050a4d0e", 1800), alt: "Historic downtown building facade" },
      { src: u("1487958449943-2429e8be8625"), alt: "Upper-floor loft interior" },
    ],
    features: ["Retail + 2 lofts", "1921 build", "Downtown Third St", "Alley access"],
    coords: { lat: 31.3115, lng: -92.445 },
  },
  {
    id: "coliseum-restaurant-building",
    status: "active",
    type: "commercial",
    badge: "Just Reduced",
    title: "Coliseum Boulevard Restaurant Building",
    address: {
      street: "3306 Coliseum Blvd",
      city: "Alexandria",
      state: "LA",
      zip: "71303",
    },
    price: 475000,
    beds: 0,
    baths: 2,
    sqft: 3100,
    lotAcres: 0.74,
    yearBuilt: 1996,
    description:
      "Freestanding restaurant with the hood system, walk-in cooler, and grease interceptor already in place. Drive-through lane on the north side, 44 parking spaces, and hard-corner visibility from Coliseum.",
    images: [
      { src: u("1524758631624-e2822e304c36", 1800), alt: "Restaurant dining room" },
      { src: u("1577760258779-e787a1733016"), alt: "Commercial kitchen line" },
    ],
    features: ["Hood + walk-in", "Drive-through", "44 parking", "Hard corner"],
    coords: { lat: 31.2865, lng: -92.464 },
  },
  {
    id: "bolton-avenue-office",
    status: "pending",
    type: "commercial",
    title: "Bolton Avenue Office Investment",
    address: {
      street: "2450 Bolton Ave",
      city: "Alexandria",
      state: "LA",
      zip: "71301",
    },
    price: 920000,
    beds: 0,
    baths: 6,
    sqft: 8900,
    lotAcres: 0.9,
    yearBuilt: 1985,
    description:
      "Multi-tenant professional office a block off Bolton. Four suites, three currently leased to long-term professional tenants; Suite 200 (1,650 sqft) is available for lease. Roof replaced 2021, both HVAC systems under ten years old.",
    images: [
      { src: u("1486406146926-c627a92ad1ab", 1800), alt: "Professional office building" },
      { src: u("1497215842964-222b430dc094"), alt: "Open office suite" },
    ],
    features: ["4 suites", "Suite 200 for lease", "Roof 2021", "Off Bolton Ave"],
    coords: { lat: 31.305, lng: -92.452 },
  },
  {
    id: "pineville-flex-industrial",
    status: "active",
    type: "commercial",
    title: "Pineville Flex & Light Industrial",
    address: {
      street: "705 Highway 28 E",
      city: "Pineville",
      state: "LA",
      zip: "71360",
    },
    price: 640000,
    beds: 0,
    baths: 2,
    sqft: 11500,
    lotAcres: 1.3,
    yearBuilt: 2008,
    description:
      "Flex building split roughly half shop, half conditioned office and showroom. Two overhead doors, three-phase power, and a gravel yard behind a chain-link perimeter. Suited to a contractor, distributor, or service trade.",
    images: [
      { src: u("1565610222536-ef125c59da2e", 1800), alt: "Flex industrial building exterior" },
      { src: u("1578575437130-527eed3abbec"), alt: "Shop bay interior" },
    ],
    features: ["Shop + showroom", "3-phase power", "2 overhead doors", "Hwy 28 E"],
    coords: { lat: 31.332, lng: -92.418 },
  },
  {
    id: "highway-28-development-tract",
    status: "active",
    type: "commercial",
    title: "Highway 28 West Development Tract — 6.8 ac",
    address: {
      street: "Tract 3, Highway 28 W",
      city: "Alexandria",
      state: "LA",
      zip: "71303",
    },
    price: 395000,
    beds: 0,
    baths: 0,
    sqft: 0,
    lotAcres: 6.8,
    description:
      "Level commercial acreage with roughly 420 feet of highway frontage. Utilities run to the property line and the tract will divide into pad sites. Traffic counts and survey available on request.",
    images: [
      { src: u("1500382017468-9049fed747ef", 1800), alt: "Level open development acreage" },
    ],
    features: ["420' frontage", "Utilities at line", "Divisible pads", "Hwy 28 W"],
    coords: { lat: 31.282, lng: -92.51 },
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
