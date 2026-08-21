import { classifyKind } from "./logic";
import type { LeadKind } from "./types";

/**
 * "Speak it in" — turn a spoken ramble into a reviewable lead draft.
 *
 * Deterministic on purpose. This site has no LLM key (see the seam in
 * /api/chat), and a demo that parses a lead correctly every single time
 * beats one that is usually brilliant and occasionally invents a phone
 * number. Everything here is regex + word lists, so it runs instantly,
 * costs nothing, and is auditable line by line.
 *
 * Contract: never invent a value. A field we cannot find comes back
 * empty so the human fills it in — the review step is the point.
 */

export type SpokenDraft = {
  name: string;
  contact: string;
  kind: LeadKind;
  intent: string;
  note: string;
  /** Fields we actually found, for the "check this" UI. */
  found: { name: boolean; contact: boolean };
};

/** Words that are never a person's name, even when capitalized. */
const NOT_NAME = new Set([
  "i","me","my","we","he","she","they","this","that","the","a","an","and","but",
  "so","then","ok","okay","um","uh","new","lead","call","called","talked","spoke",
  "met","name","number","phone","email","cell","mobile","wants","needs","looking",
  "about","for","from","at","in","on","to","is","was","said","says","her","his",
  "their","alexandria","pineville","tioga","boyce","ball","louisiana","la",
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday","today",
  "tomorrow","yesterday","morning","afternoon","evening","tonight",
]);

const NAME_CUES = [
  /\b(?:name(?:'s| is)?|named)\s+([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+){0,2})/,
  /\b(?:talked to|spoke (?:to|with)|met|call(?:ed)? (?:with )?|heard from|this is)\s+([A-Z][a-z'’-]+(?:\s+[A-Z][a-z'’-]+){0,2})/i,
];

/** Spoken digits → figures, so "three one eight" becomes 318. */
const DIGIT_WORDS: Record<string, string> = {
  zero:"0", oh:"0", one:"1", two:"2", three:"3", four:"4", five:"5",
  six:"6", seven:"7", eight:"8", nine:"9",
};

function digitsFromWords(text: string): string {
  return text.replace(
    /\b(?:zero|oh|one|two|three|four|five|six|seven|eight|nine)(?:[\s-]+(?:zero|oh|one|two|three|four|five|six|seven|eight|nine)){6,}\b/gi,
    (run) =>
      run
        .split(/[\s-]+/)
        .map((w) => DIGIT_WORDS[w.toLowerCase()] ?? "")
        .join(""),
  );
}

function findEmail(text: string): string {
  // Spoken emails often arrive as "jane at example dot com".
  const spoken = text.replace(
    /\b([A-Za-z0-9._%-]+)\s+at\s+([A-Za-z0-9-]+)\s+dot\s+([A-Za-z]{2,})\b/gi,
    "$1@$2.$3",
  );
  const m = spoken.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  return m ? m[0] : "";
}

function findPhone(text: string): string {
  const m = digitsFromWords(text).match(
    /(?:\+?1[\s.-]?)?\(?\b(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\b/,
  );
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

function findName(text: string): string {
  for (const cue of NAME_CUES) {
    const m = text.match(cue);
    if (m?.[1]) {
      const cleaned = m[1]
        .split(/\s+/)
        .filter((w) => !NOT_NAME.has(w.toLowerCase()))
        .join(" ")
        .trim();
      if (cleaned) return cleaned;
    }
  }
  // No cue phrase — fall back to the first run of capitalized words that
  // isn't a stop word. A sentence-initial capital is NOT excluded: people
  // open with the name constantly ("Sandra Mott called about…"), and
  // skipping it cost the first name. NOT_NAME already filters the openers
  // that aren't names ("Talked", "Met", "New").
  const run: string[] = [];
  for (const word of text.split(/\s+/)) {
    const raw = word.replace(/[^A-Za-z'’-]/g, "");
    if (/^[A-Z][a-z'’-]+$/.test(raw) && !NOT_NAME.has(raw.toLowerCase())) {
      run.push(raw);
      if (run.length === 2) break;
    } else if (run.length) {
      break;
    }
  }
  return run.join(" ");
}

/** First sentence that says what they want; falls back to the whole note. */
function findIntent(text: string, kind: LeadKind): string {
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const wantCue =
    /\b(want|wants|need|needs|looking|interested|asking about|shopping|buy|buying|sell|selling|lease|leasing|rent|renting)\b/i;
  const hit = sentences.find((s) => wantCue.test(s));
  let line = hit ?? sentences[0] ?? text;

  // Start at the cue word so the intent reads as the ask instead of the
  // whole story: "Talked to Carl, 318-555-0151, he's looking at the
  // warehouse" becomes "looking at the warehouse".
  const at = hit ? hit.search(wantCue) : -1;
  if (at > 0) line = line.slice(at);

  line = line
    // Drop a trailing "…, her number is 318-555-0173" clause — that digit
    // run is already captured as the contact.
    .replace(
      /,?\s*(?:and\s+)?(?:his|her|their|the)?\s*(?:number|phone|cell|email)\s+is\b.*$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .replace(/^[\s,;-]+|[\s,;-]+$/g, "");

  const trimmed = line.slice(0, 160);
  if (trimmed) return trimmed;
  return kind === "commercial" ? "Commercial inquiry" : "";
}

export function parseSpokenLead(raw: string): SpokenDraft {
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) {
    return {
      name: "",
      contact: "",
      kind: "residential",
      intent: "",
      note: "",
      found: { name: false, contact: false },
    };
  }

  const email = findEmail(text);
  const phone = findPhone(text);
  const contact = email || phone;
  const name = findName(text);
  // Same classifier the website and router use, so what the CRM shows and
  // where the lead lands can never disagree.
  const kind = classifyKind({ message: text });

  return {
    name,
    contact,
    kind,
    intent: findIntent(text, kind),
    note: text.slice(0, 1000),
    found: { name: !!name, contact: !!contact },
  };
}
