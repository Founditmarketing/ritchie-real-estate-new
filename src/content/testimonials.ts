/*
 * PLACEHOLDER — INVENTED PEOPLE. Every quote, name, property, and
 * transaction figure below is pitch-stage placeholder content, not a real
 * client review. DO NOT DEPLOY to the client domain until replaced with
 * permissioned real reviews.
 */

export type Testimonial = {
  quote: string;
  name: string;
  /** Role + city; e.g. "Seller · Garden District". */
  role: string;
  avatar?: string;
  /** The actual property they bought / sold / leased. */
  property?: string;
  /** Transaction value formatted, e.g. "$615k". Optional. */
  transaction?: string;
  /** Rating (1–5). Defaults to 5. */
  rating?: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We had three offers in the first weekend. Matt knew exactly how to price it for our block and the marketing photos were the best I’ve seen in Alexandria.",
    name: "Anne LeBlanc",
    role: "Seller · Garden District",
    property: "214 Elliott St — Sold over ask",
    transaction: "$402k",
  },
  {
    quote:
      "Bought our first commercial building through Ritchie. The CCIM credential is real — Matt walked us through cap rates, NOI, and lease terms like it was second nature.",
    name: "James Thibodeaux",
    role: "Investor · Alexandria",
    property: "3422 MacArthur Dr — NNN lease",
    transaction: "$825k",
  },
  {
    quote:
      "We were relocating from Houston and didn’t know Central Louisiana at all. Ritchie sent a 14-page area guide before we even visited. By the third weekend, we had the keys.",
    name: "Priya & Eli Patel",
    role: "Buyers · Pineville",
    property: "1102 Edgewood Dr — Relocation",
    transaction: "$273k",
  },
  {
    quote:
      "Sold our parents’ estate after a long, complicated probate. Ritchie’s team handled the paperwork, the cleanouts, the staging — we just signed at closing.",
    name: "Tom Beaulieu",
    role: "Estate sale · Tioga",
    property: "18.4 acres on Indian Creek Rd",
    transaction: "$145k",
  },
];
