/**
 * Ask Ritchie — keyless concierge engine.
 *
 * This is the brain behind the chat. It is intentionally provider-agnostic:
 * the route handler (`/api/chat`) calls `runConcierge()` and, if/when an LLM
 * key is added, that same handler can route to a model while still using the
 * grounded helpers here (listing search, area stats) as tools. The contract —
 * messages in, a `ConciergeReply` out — never changes, so the UI is stable.
 *
 * Everything it says is grounded in the `getListings` adapter and the
 * `areas` data (currently placeholder seed content — see src/content/).
 * It never invents inventory or numbers. Inventory claims in the copy are
 * scoped to "every listing Ritchie represents" while the seed data is live;
 * the stronger "every active listing in Central Louisiana" copy can return once the
 * live IDX feed is wired (see src/lib/listings.ts).
 */

import { getListings, formatPrice, type ListingType } from "@/lib/listings";
import { areas } from "@/content/areas";
import { fieldNoteFor } from "@/content/field-notes";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ListingCard {
  id: string;
  title: string;
  type: ListingType;
  badge?: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  city: string;
  neighborhood?: string;
  image?: string;
  href: string;
}

export interface ConciergeReply {
  reply: string;
  listings?: ListingCard[];
  chips?: string[];
  /** When set, the UI renders the inline "connect with Matt" lead form. */
  cta?: "lead" | null;
  /** Every matching listing id (not just the 3 shown) — lets the map plot
   *  the full result set the same brain produced for the chat. */
  matchedIds?: string[];
}

type Filters = {
  type?: ListingType;
  city?: string;
  priceMin?: number;
  priceMax?: number;
  bedsMin?: number;
};

const CITY_ALIASES: Record<string, string> = {
  alexandria: "Alexandria",
  alex: "Alexandria",
  pineville: "Pineville",
  ball: "Ball",
  boyce: "Boyce",
  tioga: "Tioga",
};

/* ------------------------------------------------------------------ */
/* Parsing                                                            */
/* ------------------------------------------------------------------ */

/** Lowercase + straighten curly apostrophes so the intent regexes (written
 *  with ') keep matching rendered chip copy (written with ’). */
function normalize(s: string): string {
  return s.toLowerCase().replace(/[‘’]/g, "'").trim();
}

/** "300k" → 300000, "1.2m" → 1200000, "300,000" → 300000. */
function parseMoney(raw: string): number | undefined {
  const m = raw
    .toLowerCase()
    .replace(/[$,\s]/g, "")
    .match(/^(\d*\.?\d+)(k|m|thousand|grand|million|mil)?$/);
  if (!m) return undefined;
  let n = parseFloat(m[1]);
  const unit = m[2];
  if (unit === "k" || unit === "thousand" || unit === "grand") n *= 1_000;
  else if (unit === "m" || unit === "million" || unit === "mil") n *= 1_000_000;
  // Bare small numbers like "300" almost always mean thousands in real estate.
  else if (n < 5_000) n *= 1_000;
  return Math.round(n);
}

const MONEY = String.raw`\$?\s?\d[\d,]*\.?\d*\s?(?:k|m|thousand|grand|million|mil)?`;

function detectType(text: string): ListingType | undefined {
  if (/\b(commercial|office(s)?|retail|industrial|investment|nnn|warehouse(s)?|storefront(s)?)\b/.test(text))
    return "commercial";
  if (/\b(land|acre(s|age)?|lot(s)?|tract(s)?|pasture(s)?|farm(s)?)\b/.test(text)) return "land";
  if (/\b(rent|rental(s)?|renting|lease|leasing)\b/.test(text)) return "rental";
  if (/\b(home(s)?|house(s)?|residential|condo(s)?|cottage(s)?|ranch(es)?|colonial(s)?|estate(s)?|\d ?bed(room)?(s)?|buy a)\b/.test(text))
    return "residential";
  return undefined;
}

function detectCity(text: string): string | undefined {
  for (const [alias, name] of Object.entries(CITY_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`).test(text)) return name;
  }
  return undefined;
}

function detectBeds(text: string): number | undefined {
  const matches = [
    ...text.matchAll(/(\d+)\s*\+?\s*(?:bed|beds|bedroom|bedrooms|br|bdr)\b/g),
  ];
  if (matches.length) return parseInt(matches[matches.length - 1][1], 10);
  return undefined;
}

function detectBudget(text: string): { min?: number; max?: number } {
  const out: { min?: number; max?: number } = {};

  const between = text.match(
    new RegExp(`(?:between|from)\\s+(${MONEY})\\s+(?:and|to|[-\u2013])\\s+(${MONEY})`),
  );
  if (between) {
    const a = parseMoney(between[1]);
    const b = parseMoney(between[2]);
    if (a && b) {
      out.min = Math.min(a, b);
      out.max = Math.max(a, b);
      return out;
    }
  }

  const dash = text.match(new RegExp(`(${MONEY})\\s*[-\u2013]\\s*(${MONEY})`));
  if (dash) {
    const a = parseMoney(dash[1]);
    const b = parseMoney(dash[2]);
    if (a && b) {
      out.min = Math.min(a, b);
      out.max = Math.max(a, b);
      return out;
    }
  }

  const max = text.match(
    new RegExp(`(?:under|below|less than|up to|at most|max|maximum|budget(?: of)?|around|about|no more than)\\s+(${MONEY})`),
  );
  if (max) {
    const v = parseMoney(max[1]);
    if (v) out.max = v;
  }

  const min = text.match(
    new RegExp(`(?:over|above|at least|more than|min|minimum|starting at|from)\\s+(${MONEY})`),
  );
  if (min) {
    const v = parseMoney(min[1]);
    if (v) out.min = v;
  }

  // A lone money figure with no qualifier reads as a ceiling.
  if (out.min === undefined && out.max === undefined) {
    const lone = text.match(new RegExp(MONEY));
    if (lone && /\d/.test(lone[0])) {
      const v = parseMoney(lone[0]);
      if (v && v >= 20_000) out.max = v;
    }
  }
  return out;
}

/** Accumulate filters across the whole conversation so context builds. */
function deriveFilters(messages: ChatMessage[]): Filters {
  const filters: Filters = {};
  for (const m of messages) {
    if (m.role !== "user") continue;
    const t = normalize(m.content);
    const type = detectType(t);
    if (type) filters.type = type;
    const city = detectCity(t);
    if (city) filters.city = city;
    const beds = detectBeds(t);
    if (beds !== undefined) filters.bedsMin = beds;
    const { min, max } = detectBudget(t);
    if (min !== undefined) filters.priceMin = min;
    if (max !== undefined) filters.priceMax = max;
  }
  return filters;
}

/* ------------------------------------------------------------------ */
/* Intent                                                             */
/* ------------------------------------------------------------------ */

function wantsToConnect(text: string): boolean {
  return /\b(contact|call me|reach me|connect|schedule|book|tour|showing|appointment|talk to (?:matt|someone)|get in touch|interested in seeing|set (?:it|something) up|reach out|email me|text me)\b/.test(
    text,
  );
}

function isSellIntent(text: string): boolean {
  return /\b(sell|selling|list my|what'?s my (?:home|house|property) worth|home value|valuation|cma|cash offer)\b/.test(
    text,
  );
}

function isMarketIntent(text: string): boolean {
  return /\b(market|median|prices?|price trend|days on market|dom|inventory|appreciat|how'?s (?:the|it)|how is|stats?|data|trend)\b/.test(
    text,
  );
}

function hasSearchSignal(filters: Filters): boolean {
  return Boolean(
    filters.type || filters.city || filters.priceMin || filters.priceMax || filters.bedsMin,
  );
}

/** A concrete search — type/price/beds. A bare city doesn't count, so
 *  "how's the market in Alexandria" stays a market question, not a search. */
function hasConcreteSearch(filters: Filters): boolean {
  return Boolean(
    filters.type || filters.priceMin || filters.priceMax || filters.bedsMin,
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const typeNoun: Record<ListingType, [string, string]> = {
  residential: ["home", "homes"],
  commercial: ["commercial property", "commercial properties"],
  land: ["tract", "tracts"],
  rental: ["rental", "rentals"],
};

const NEUTRAL_NOUN: [string, string] = ["listing", "listings"];

function nounFor(type?: ListingType): [string, string] {
  return type ? typeNoun[type] : NEUTRAL_NOUN;
}

function toCard(l: Awaited<ReturnType<typeof getListings>>[number]): ListingCard {
  return {
    id: l.id,
    title: l.title,
    type: l.type,
    badge: l.badge,
    price: formatPrice(l.price),
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    city: l.address.city,
    neighborhood: l.address.neighborhood,
    image: l.images[0]?.src,
    href: `/listings/${l.id}`,
  };
}

/** Noun-led phrase with a count: "3 homes under $300k in Pineville".
 *  `displayType` lets the caller use the type inferred from results when the
 *  visitor didn't name one. */
function composeNeed(f: Filters, count: number, displayType?: ListingType): string {
  const [singular, plural] = nounFor(displayType ?? f.type);
  const noun = count === 1 ? singular : plural;
  const bedsApply = !f.type || f.type === "residential" || f.type === "rental";
  const bits: string[] = [];
  if (bedsApply && f.bedsMin) bits.push(`with ${f.bedsMin}+ beds`);
  if (f.priceMin && f.priceMax)
    bits.push(`between ${formatPrice(f.priceMin)} and ${formatPrice(f.priceMax)}`);
  else if (f.priceMax) bits.push(`under ${formatPrice(f.priceMax)}`);
  else if (f.priceMin) bits.push(`over ${formatPrice(f.priceMin)}`);
  if (f.city) bits.push(`in ${f.city}`);
  return `${count} ${noun}${bits.length ? " " + bits.join(", ") : ""}`;
}

/** Noun-led phrase without a count, for "nothing matches X" copy. */
function describeFilters(f: Filters): string {
  const parts: string[] = [];
  if ((!f.type || f.type === "residential" || f.type === "rental") && f.bedsMin)
    parts.push(`${f.bedsMin}+ bed`);
  const [, plural] = nounFor(f.type);
  parts.push(plural);
  if (f.priceMin && f.priceMax)
    parts.push(`between ${formatPrice(f.priceMin)} and ${formatPrice(f.priceMax)}`);
  else if (f.priceMax) parts.push(`under ${formatPrice(f.priceMax)}`);
  else if (f.priceMin) parts.push(`over ${formatPrice(f.priceMin)}`);
  if (f.city) parts.push(`in ${f.city}`);
  return parts.join(" ");
}

function marketSummary(city?: string): string {
  if (city) {
    const a = areas.find((x) => x.name.toLowerCase() === city.toLowerCase());
    if (a) {
      const stat = (label: string) =>
        a.stats.find((s) => s.label.toLowerCase().includes(label))?.value ?? "—";
      // Ground the answer in a street-level field note when one exists —
      // the concierge quoting Matt's margin notes is the whole point of them.
      const fieldNote = fieldNoteFor(a.name);
      const noteLine = fieldNote
        ? ` One thing Matt flags near ${fieldNote.place}: “${fieldNote.note}”`
        : "";
      return `${a.name}: ${a.tagline} Median sale ${stat("median")}, about ${stat(
        "dom",
      )} on market, ${stat("active")} active right now. ${a.description}${noteLine}`;
    }
  }
  const lines = areas.map((a) => {
    const median = a.stats.find((s) => s.label.toLowerCase().includes("median"))?.value ?? "—";
    const dom = a.stats.find((s) => s.label.toLowerCase().includes("dom"))?.value ?? "—";
    return `• ${a.name}: ${median} median, ${dom} DOM`;
  });
  return `Here’s the lay of the land across Central Louisiana right now:\n${lines.join(
    "\n",
  )}\n\nWe don’t guess the market, we track it. Want me to dig into one of these?`;
}

const GREETING_CHIPS = [
  "Find me a home",
  "Commercial space",
  "Land & acreage",
  "How’s the market?",
  "Sell my house",
];

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */

export async function runConcierge(messages: ChatMessage[]): Promise<ConciergeReply> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const text = normalize(lastUser?.content ?? "");

  // Cold open.
  if (!text) {
    return {
      reply:
        "I’m Matt’s desk on the web. I know the Central Louisiana market cold and every listing Ritchie represents. Tell me what you’re after: a home, commercial space, or land. Or ask what the market’s doing.",
      chips: GREETING_CHIPS,
    };
  }

  // Ready to talk to a human.
  if (wantsToConnect(text)) {
    return {
      reply:
        "Good. Let’s get you on Matt’s calendar. Drop your name and the best way to reach you, plus a line on what you’re after, and he’ll follow up personally. No call center, no drip campaign.",
      cta: "lead",
    };
  }

  // Sellers.
  if (isSellIntent(text)) {
    const city = detectCity(text);
    return {
      reply:
        `Selling is where local knowledge actually pays. ${
          city ? marketSummary(city) + " " : ""
        }Matt prices off real comps and a walk-through, not a Zestimate. Want a no-pressure valuation? Leave your details and he’ll put a number together.`,
      chips: ["Get a valuation", "How’s the market?", "What sells fastest?"],
      cta: "lead",
    };
  }

  const filters = deriveFilters(messages);

  // Market / area questions (a bare city is fine; it scopes the answer).
  if (isMarketIntent(text) && !hasConcreteSearch(filters)) {
    return {
      reply: marketSummary(detectCity(text)),
      chips: ["Find me a home", "Commercial in Alexandria", "Talk to Matt"],
    };
  }

  // Property search.
  if (hasSearchSignal(filters) || /\b(home|house|listing|listings|buy|looking|find|show me|property)\b/.test(text)) {
    const all = await getListings({
      type: filters.type ?? "all",
      city: filters.city,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      bedsMin: filters.bedsMin,
      status: "active",
      sort: "newest",
    });
    const results = all.slice(0, 3);
    const matchedIds = all.map((l) => l.id);

    const summary = describeFilters(filters);

    if (results.length === 0) {
      // Relax the tightest constraint and try once more so we never dead-end.
      const relaxed = await getListings({
        type: filters.type ?? "all",
        sort: "newest",
        limit: 3,
      });
      if (relaxed.length) {
        return {
          reply: `Nothing active matches ${summary} this minute; Central Louisiana inventory is tight. Here’s the closest I’d show you instead. Want me to flag you the moment something fits?`,
          listings: relaxed.map(toCard),
          chips: ["Notify me", "Widen the budget", "Talk to Matt"],
          cta: "lead",
        };
      }
      return {
        reply: `I don’t have anything active for ${summary} right now. Leave your details and Matt will reach out the moment something fits; he often hears about them before they hit the market.`,
        cta: "lead",
      };
    }

    const top = results[0];
    const count = results.length;
    const resultTypes = new Set(results.map((r) => r.type));
    const inferredType =
      !filters.type && resultTypes.size === 1 ? [...resultTypes][0] : undefined;
    const need = composeNeed(filters, count, inferredType);

    return {
      reply: `Here ${count === 1 ? "is" : "are"} ${need} I’d put in front of you. I’d start with ${top.title}; ${
        top.address.neighborhood ?? top.address.city
      } is a strong spot. Want a closer look or a showing?`,
      listings: results.map(toCard),
      matchedIds,
      chips: [
        filters.city ? "Anywhere in Central Louisiana" : "Only Alexandria",
        filters.priceMax ? "Stretch the budget" : "Under $300k",
        "Book a showing",
      ],
    };
  }

  // Fallback — keep it in voice and steer back to something useful.
  return {
    reply:
      "I’m built to do three things well: find you the right place in Central Louisiana, tell you the truth about the market, and get you to Matt. Which one’s it going to be?",
    chips: GREETING_CHIPS,
  };
}
