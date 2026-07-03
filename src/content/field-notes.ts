/*
 * PLACEHOLDER — EXAMPLE FIELD NOTES, WRITTEN TO DEMONSTRATE THE FORMAT.
 * Every note below must be replaced with Matt's actual words (one recorded
 * 30-minute windshield drive covers it) and every coordinate verified
 * before the client domain goes live. DO NOT DEPLOY AS-IS.
 *
 * FAIR HOUSING RULE — the categories below are the ONLY lanes allowed.
 * Notes describe infrastructure, drainage, traffic, construction, history,
 * commerce, and nature. Never people, demographics, schools-as-proxy, or
 * "good/bad area" judgments of any kind. If a note can't be written inside
 * these lanes, it doesn't go on the map.
 */

export type FieldNoteCategory =
  | "traffic"
  | "drainage"
  | "construction"
  | "history"
  | "commerce"
  | "nature";

export type FieldNote = {
  id: string;
  /** Short place label shown on the note card, e.g. "Jackson Street Ext". */
  place: string;
  /** Which area/city the note belongs to (matches src/content/areas.ts names). */
  area: "Alexandria" | "Pineville" | "Ball" | "Boyce" | "Tioga";
  category: FieldNoteCategory;
  /** One sentence in Matt's plain-English register. */
  note: string;
  lat: number;
  lng: number;
};

export const fieldNotes: FieldNote[] = [
  {
    id: "jackson-ext-5pm",
    place: "Jackson Street Extension",
    area: "Alexandria",
    category: "traffic",
    note:
      "A left onto Jackson at five o’clock is a ten-minute wish. Coming home, route through Texas Avenue and you’ll beat it every time.",
    lat: 31.288,
    lng: -92.472,
  },
  {
    id: "bentley-downtown",
    place: "Downtown, near the Bentley",
    area: "Alexandria",
    category: "history",
    note:
      "The Bentley sat dark for decades before she reopened. Downtown addresses within walking distance trade on that lobby.",
    lat: 31.312,
    lng: -92.445,
  },
  {
    id: "hynson-bayou-drain",
    place: "Garden District, south edge",
    area: "Alexandria",
    category: "drainage",
    note:
      "These blocks drain toward Hynson Bayou. Drive the street you’re buying on the same afternoon as a hard rain — you’ll learn more in ten minutes than any report will tell you.",
    lat: 31.298,
    lng: -92.462,
  },
  {
    id: "pier-and-beam-block",
    place: "Garden District interiors",
    area: "Alexandria",
    category: "construction",
    note:
      "Most of this block is 1950s pier-and-beam. Budget a leveling check into any offer — and don’t let it scare you, it’s routine here.",
    lat: 31.305,
    lng: -92.468,
  },
  {
    id: "macarthur-turnover",
    place: "MacArthur Drive corridor",
    area: "Alexandria",
    category: "commerce",
    note:
      "MacArthur retail is turning over quietly. Watch what’s moving between the hospital and the mall before the rents catch up to it.",
    lat: 31.29,
    lng: -92.455,
  },
  {
    id: "up-line-nights",
    place: "Lee Street rail line",
    area: "Alexandria",
    category: "history",
    note:
      "The Union Pacific line still runs nights. Two blocks of distance is the difference between charm and a horn at two in the morning — I’ll show you exactly where the line sits.",
    lat: 31.307,
    lng: -92.452,
  },
  {
    id: "jackson-bridge-rhythm",
    place: "Jackson Street Bridge",
    area: "Pineville",
    category: "traffic",
    note:
      "The bridge is five minutes at noon and fifteen at 7:40 on a school morning. Pineville commuters learn the rhythm inside a week.",
    lat: 31.315,
    lng: -92.44,
  },
  {
    id: "pineville-main-foot",
    place: "Pineville Main Street",
    area: "Pineville",
    category: "commerce",
    note:
      "Main Street storefronts are some of the cheapest per-foot space in the parish right now. That never lasts.",
    lat: 31.322,
    lng: -92.432,
  },
  {
    id: "edgewood-sun",
    place: "Edgewood new builds",
    area: "Pineville",
    category: "construction",
    note:
      "The newer builds out here sit on cleared timber ground — young trees, full sun. Plan your porch for the west heat.",
    lat: 31.335,
    lng: -92.425,
  },
  {
    id: "kisatchie-fence-line",
    place: "Kisatchie edge",
    area: "Ball",
    category: "nature",
    note:
      "Back fences on this stretch open straight into Kisatchie pines. At dusk you’ll hear whip-poor-wills and not much else.",
    lat: 31.41,
    lng: -92.41,
  },
  {
    id: "hwy-165-run",
    place: "Highway 165 north",
    area: "Ball",
    category: "traffic",
    note:
      "The 165 four-lane makes Ball a twelve-minute run into Alexandria. That road is most of the reason this zip keeps growing.",
    lat: 31.4,
    lng: -92.4,
  },
  {
    id: "red-river-fog",
    place: "Red River bank",
    area: "Boyce",
    category: "nature",
    note:
      "River fog sits on these lots most January mornings and burns off by nine. Some people buy for exactly that.",
    lat: 31.443,
    lng: -92.482,
  },
  {
    id: "boyce-landing-brick",
    place: "Old Boyce main block",
    area: "Boyce",
    category: "history",
    note:
      "Boyce grew up on a riverboat landing. The brick storefronts on the main block are older than the levee that protects them.",
    lat: 31.447,
    lng: -92.476,
  },
  {
    id: "tioga-clay-ponds",
    place: "Tioga acreage",
    area: "Tioga",
    category: "drainage",
    note:
      "Half these parcels hold a pond because the clay lets them. If yours doesn’t, the neighbor’s overflow easement matters — ask me why.",
    lat: 31.392,
    lng: -92.664,
  },
];

/** First note for an area, for the concierge to quote. */
export function fieldNoteFor(area: string): FieldNote | undefined {
  return fieldNotes.find(
    (n) => n.area.toLowerCase() === area.toLowerCase(),
  );
}
