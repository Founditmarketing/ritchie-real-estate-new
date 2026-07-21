import { randomUUID } from "node:crypto";
import { MATT_ID, rotationIds } from "./roster";
import type {
  CrmDoc,
  Lead,
  LeadKind,
  LeadOrigin,
  LeadSource,
  LeadStatus,
  TimelineEvent,
} from "./types";
import { RESPONSE_WINDOW_MIN } from "./types";

const now = () => new Date().toISOString();

export function makeEvent(
  by: string,
  type: TimelineEvent["type"],
  extra?: Partial<TimelineEvent>,
): TimelineEvent {
  return { id: randomUUID(), at: now(), by, type, ...extra };
}

/** Commercial goes to Matt; residential round-robins through the rotation. */
export function assign(doc: CrmDoc, kind: LeadKind): string {
  if (kind === "commercial") return MATT_ID;
  const rotation = rotationIds();
  if (rotation.length === 0) return MATT_ID;
  const id = rotation[doc.rotationCursor % rotation.length];
  doc.rotationCursor = (doc.rotationCursor + 1) % rotation.length;
  return id;
}

export function classifyKind(input: {
  intent?: string;
  message?: string;
  source?: string;
}): LeadKind {
  const hay = `${input.intent ?? ""} ${input.message ?? ""}`.toLowerCase();
  if (/commercial|office|retail|warehouse|investment|acreage.*development|sq ?ft.*lease|lease.*space/.test(hay)) {
    return "commercial";
  }
  return "residential";
}

export function ingestLead(
  doc: CrmDoc,
  input: {
    name: string;
    contact: string;
    message?: string;
    intent?: string;
    source: LeadSource;
    kind?: LeadKind;
    origin?: LeadOrigin;
    /** For self-generated leads, the agent who logged it. */
    loggedBy?: string;
  },
): Lead {
  const kind = input.kind ?? classifyKind(input);
  const origin = input.origin ?? "broker";
  const assignedTo =
    origin === "self" && input.loggedBy ? input.loggedBy : assign(doc, kind);

  const lead: Lead = {
    id: randomUUID(),
    createdAt: now(),
    name: input.name,
    contact: input.contact,
    message: input.message,
    intent: input.intent,
    source: input.source,
    kind,
    origin,
    assignedTo,
    status: "new",
    timeline: [
      makeEvent("system", "created", {
        text: origin === "self" ? "Logged as self-generated" : "Came in from the website",
      }),
      makeEvent("system", "assigned", {
        text:
          kind === "commercial"
            ? "Commercial — routed to Matt"
            : origin === "self"
              ? "Self-generated — stays with the agent"
              : "Residential — next up in the rotation",
      }),
    ],
  };
  doc.leads.unshift(lead);
  return lead;
}

export function setStatus(lead: Lead, by: string, status: LeadStatus): void {
  lead.status = status;
  if (!lead.firstResponseAt && status !== "new") lead.firstResponseAt = now();
  lead.timeline.push(makeEvent(by, "status", { status }));
}

export function addNote(lead: Lead, by: string, text: string): void {
  lead.timeline.push(makeEvent(by, "note", { text }));
}

/** Broker hands a lead to a different agent (or takes it himself). */
export function reassign(lead: Lead, by: string, toId: string, toName: string): void {
  lead.assignedTo = toId;
  lead.timeline.push(
    makeEvent(by, "assigned", { text: `Handed to ${toName}` }),
  );
}

export function logContactAttempt(lead: Lead, by: string, how: string): void {
  if (!lead.firstResponseAt) lead.firstResponseAt = now();
  lead.timeline.push(makeEvent(by, "contact-attempt", { text: how }));
}

/** Minutes since creation with no human touch — broker-lead SLA. */
export function minutesWaiting(lead: Lead, at = Date.now()): number {
  if (lead.firstResponseAt) return 0;
  return Math.floor((at - new Date(lead.createdAt).getTime()) / 60000);
}

export function needsAttention(lead: Lead, at = Date.now()): boolean {
  return (
    lead.status === "new" &&
    lead.origin === "broker" &&
    !lead.firstResponseAt &&
    minutesWaiting(lead, at) >= RESPONSE_WINDOW_MIN
  );
}

/* ------------------------------------------------------------------ */
/* Demo seed — clearly-labeled sample leads so the prototype opens     */
/* looking alive. Names/numbers are invented placeholders.             */
/* ------------------------------------------------------------------ */

const MIN = 60_000;
const HOUR = 60 * MIN;

export function seedDoc(): CrmDoc {
  const doc: CrmDoc = { version: 1, rotationCursor: 0, leads: [], seededAt: now() };
  const t = Date.now();

  type SeedRow = [
    name: string,
    contact: string,
    intent: string,
    source: LeadSource,
    kind: LeadKind,
    origin: LeadOrigin,
    status: LeadStatus,
    ageMs: number,
    note?: string,
    loggedBy?: string,
  ];

  const rows: SeedRow[] = [
    ["Lacey Fontenot", "318-555-0142", "3 bed in Pineville under $300k", "sell-form", "residential", "broker", "new", 12 * MIN],
    ["Derrick Guillory", "dguillory@example.com", "Valuation for 88 Riverbend Rd", "sell-form", "residential", "broker", "new", 47 * MIN],
    ["Sandra Mott", "318-555-0173", "Office space on MacArthur Dr", "contact-form", "commercial", "broker", "new", 2.4 * HOUR],
    ["Blake & Erin Landry", "318-555-0119", "Relocating to Alexandria in August", "chat-concierge", "residential", "broker", "contacted", 5 * HOUR, "Spoke at 2pm — wants Garden District tour Saturday"],
    ["Pete Ardoin", "318-555-0186", "Land near Kisatchie", "explore-map", "residential", "broker", "contacted", 8 * HOUR],
    ["Monica Deshotel", "mdeshotel@example.com", "Selling in Tioga next spring", "sell-form", "residential", "broker", "contacted", 26 * HOUR, "Wants a spring listing — follow up in March"],
    ["Carl Bevins", "318-555-0151", "Duplex investor, cash", "contact-form", "commercial", "broker", "appointment", 30 * HOUR, "Tuesday 10am at the office"],
    ["Alyssa Broussard", "318-555-0128", "First home, Ball area", "sell-form", "residential", "broker", "appointment", 2 * 24 * HOUR],
    ["The Guidry family", "318-555-0107", "Sold — 4 bed in Pineville", "manual", "residential", "self", "converted", 6 * 24 * HOUR, "Closed Friday. Send review link.", "yvette-hardy"],
    ["R. Thibodeaux", "318-555-0195", "Bought acreage off Hwy 165", "explore-map", "residential", "broker", "converted", 9 * 24 * HOUR],
    ["“Win a cruise” robocall", "unknown", "", "contact-form", "residential", "broker", "junk", 3 * 24 * HOUR],
    ["No-name form fill", "asdf@asdf", "", "newsletter", "residential", "broker", "junk", 4 * 24 * HOUR],
    ["Jamie Rachal", "318-555-0163", "Asked about Boyce cottage", "chat-concierge", "residential", "broker", "no-answer", 22 * HOUR, "Two calls, left voicemail both times"],
    ["Tonya Simms", "318-555-0134", "Neighbor of a past client", "manual", "residential", "self", "contacted", 11 * HOUR, undefined, "jennifer-byrd"],
  ];

  for (const [name, contact, intent, source, kind, origin, status, ageMs, note, loggedBy] of rows) {
    const lead = ingestLead(doc, {
      name,
      contact,
      intent: intent || undefined,
      source,
      kind,
      origin,
      loggedBy,
    });
    // Rewrite timestamps so the inbox has a believable age spread.
    const created = new Date(t - ageMs).toISOString();
    lead.createdAt = created;
    lead.timeline.forEach((e) => (e.at = created));
    if (status !== "new") {
      setStatus(lead, lead.assignedTo, status);
      const touched = new Date(t - ageMs + Math.min(ageMs * 0.3, 45 * MIN)).toISOString();
      lead.firstResponseAt = touched;
      lead.timeline[lead.timeline.length - 1].at = touched;
    }
    if (note) {
      addNote(lead, lead.assignedTo, note);
      lead.timeline[lead.timeline.length - 1].at = new Date(t - ageMs / 2).toISOString();
    }
  }

  // Self-generated rows keep their assigned agent but tag the origin story
  return doc;
}
