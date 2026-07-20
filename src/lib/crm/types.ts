/**
 * Ritchie CRM — prototype data model.
 *
 * PROTOTYPE SCOPE (Friday build): single-tenant, one shared passcode,
 * per-user selection at login (no per-user passwords yet), last-write-wins
 * persistence in a single Vercel Blob JSON document. Documented tradeoffs,
 * all replaceable behind the store interface without touching the UI.
 */

export type LeadStatus =
  | "new"
  | "contacted"
  | "appointment"
  | "converted"
  | "no-answer"
  | "junk";

export type LeadKind = "residential" | "commercial";

/** Broker-routed vs. agent self-generated — drives the 15–20% split gap. */
export type LeadOrigin = "broker" | "self";

export type LeadSource =
  | "sell-form"
  | "contact-form"
  | "explore-map"
  | "chat-concierge"
  | "newsletter"
  | "manual"
  | "website";

export interface TimelineEvent {
  id: string;
  at: string; // ISO
  /** Who did it — agent id, "system", or "matt". */
  by: string;
  type:
    | "created"
    | "assigned"
    | "status"
    | "note"
    | "contact-attempt";
  /** For status events, the new status. */
  status?: LeadStatus;
  /** Free text for notes / context lines. */
  text?: string;
}

export interface Lead {
  id: string;
  createdAt: string; // ISO
  name: string;
  contact: string; // phone or email, as typed
  message?: string;
  intent?: string;
  source: LeadSource;
  kind: LeadKind;
  origin: LeadOrigin;
  /** Agent id (see roster) — commercial routes to matt. */
  assignedTo: string;
  status: LeadStatus;
  /** True once any human contact attempt/status change happened. */
  firstResponseAt?: string; // ISO
  timeline: TimelineEvent[];
}

export interface CrmUser {
  id: string; // slug, e.g. "matt-ritchie"
  name: string;
  role: "broker" | "agent";
  /** In the round-robin rotation for broker leads? */
  inRotation: boolean;
}

export interface CrmDoc {
  version: 1;
  /** Round-robin cursor: index into rotation order. */
  rotationCursor: number;
  leads: Lead[];
  /** ISO of last seed, so the UI can label demo data. */
  seededAt?: string;
}

export interface Session {
  userId: string;
  role: "broker" | "agent";
}

/** Minutes before an uncontacted broker lead is flagged for Matt. */
export const RESPONSE_WINDOW_MIN = 30;

export const STATUS_LABEL: Record<LeadStatus, string> = {
  "new": "New",
  "contacted": "Contacted",
  "appointment": "Appointment set",
  "converted": "Converted",
  "no-answer": "No answer yet",
  "junk": "Junk",
};

export const SOURCE_LABEL: Record<LeadSource, string> = {
  "sell-form": "Home-value form",
  "contact-form": "Contact page",
  "explore-map": "Map search",
  "chat-concierge": "Ask Ritchie chat",
  "newsletter": "Market Letter signup",
  "manual": "Logged by agent",
  "website": "Website",
};
