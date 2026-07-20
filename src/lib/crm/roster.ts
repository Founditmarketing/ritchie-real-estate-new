import { broker, agents } from "@/content/team";
import type { CrmUser } from "./types";

const slug = (name: string) =>
  name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

export const MATT_ID = slug(broker.name); // "matt-ritchie"

/**
 * The round-robin rotation for broker-routed residential leads.
 * Prototype: the agents Matt named in the kickoff meeting; everyone
 * else can still log self-generated leads. Adjust freely — routing
 * reads this list at assignment time.
 */
const ROTATION = new Set([
  "jennifer-byrd",
  "yvette-hardy",
  "ben-gatch",
  "anthony-baillio",
  "teri-strickland",
]);

export const USERS: CrmUser[] = [
  { id: MATT_ID, name: broker.name, role: "broker", inRotation: false },
  ...agents.map((a) => ({
    id: slug(a.name),
    name: a.name,
    role: "agent" as const,
    inRotation: ROTATION.has(slug(a.name)),
  })),
];

export const rotationIds = () => USERS.filter((u) => u.inRotation).map((u) => u.id);

export const userById = (id: string) => USERS.find((u) => u.id === id);

export const firstName = (id: string) =>
  (userById(id)?.name ?? "your agent").split(" ")[0];
