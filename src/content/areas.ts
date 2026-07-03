export type Area = {
  slug: string;
  name: string;
  /** Short headline for the panel. */
  tagline: string;
  description: string;
  stats: { label: string; value: string }[];
  /** Pin position in the map's 600x520 viewBox. */
  pin: { x: number; y: number };
  /** Pin diameter at rest. */
  pinR?: number;
};

/*
 * PLACEHOLDER — the stats below (median sale, avg DOM, active counts) are
 * pitch-stage estimates, not compiled MLS data. Verify every figure before
 * the client domain launches.
 */
export const areas: Area[] = [
  {
    slug: "alexandria",
    name: "Alexandria",
    tagline: "The Cenla seat.",
    description:
      "Cenla’s largest city. Garden District historics, MacArthur retail corridor, riverfront downtown reborn. Strongest commercial market in the region.",
    stats: [
      { label: "Median sale", value: "$255k" },
      { label: "Avg DOM", value: "37 days" },
      { label: "Active listings", value: "182" },
    ],
    pin: { x: 210, y: 250 },
    pinR: 13,
  },
  {
    slug: "pineville",
    name: "Pineville",
    tagline: "Across the bridge.",
    description:
      "Family neighborhoods, LSUA campus, and quick commute over the Jackson Street Bridge. Inventory holds value; new builds in Edgewood and Buckeye trade quickly.",
    stats: [
      { label: "Median sale", value: "$224k" },
      { label: "Avg DOM", value: "31 days" },
      { label: "Active listings", value: "94" },
    ],
    pin: { x: 320, y: 200 },
    pinR: 11,
  },
  {
    slug: "ball",
    name: "Ball",
    tagline: "Where Cenla expands.",
    description:
      "Where Cenla’s new construction is going. New builds off Highway 165 with country-feel acreage 10 minutes from Pineville schools.",
    stats: [
      { label: "Median sale", value: "$268k" },
      { label: "Avg DOM", value: "29 days" },
      { label: "Active listings", value: "41" },
    ],
    pin: { x: 370, y: 120 },
    pinR: 9,
  },
  {
    slug: "boyce",
    name: "Boyce",
    tagline: "Bayou Jean de Jean.",
    description:
      "Riverfront cottages, bass-water lots, and historic Boyce proper. Strong second-home demand; emerging short-term rental market.",
    stats: [
      { label: "Median sale", value: "$176k" },
      { label: "Avg DOM", value: "44 days" },
      { label: "Active listings", value: "22" },
    ],
    pin: { x: 110, y: 150 },
    pinR: 9,
  },
  {
    slug: "tioga",
    name: "Tioga",
    tagline: "Country, but close.",
    description:
      "Acreage country with the schools Cenla families move for. New custom builds on cleared pasture; Kisatchie National Forest on the back fence.",
    stats: [
      { label: "Median sale", value: "$298k" },
      { label: "Avg DOM", value: "33 days" },
      { label: "Active listings", value: "37" },
    ],
    pin: { x: 300, y: 90 },
    pinR: 9,
  },
];

export function getArea(slug: string) {
  return areas.find((a) => a.slug === slug);
}
