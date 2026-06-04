import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

/**
 * Lead capture for "Ask Ritchie".
 *
 * Prototype storage: appends each lead to `data/leads.json` and logs it to the
 * server console. Swap the `storeLead` body for an email send (Resend, etc.)
 * or a CRM call when you're ready — the client contract stays the same.
 */

interface Lead {
  name: string;
  contact: string;
  message?: string;
  intent?: string;
  source?: string;
}

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

async function storeLead(lead: Lead & { receivedAt: string }) {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  let existing: unknown[] = [];
  try {
    const raw = await fs.readFile(LEADS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) existing = parsed;
  } catch {
    // First lead — file doesn't exist yet.
  }
  existing.push(lead);
  await fs.writeFile(LEADS_FILE, JSON.stringify(existing, null, 2), "utf8");
}

export async function POST(request: Request) {
  let body: Partial<Lead>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim();
  const contact = (body.contact ?? "").toString().trim();

  if (!name || !contact) {
    return Response.json(
      { ok: false, error: "Name and a way to reach you are required." },
      { status: 422 },
    );
  }

  const lead: Lead & { receivedAt: string } = {
    name: name.slice(0, 120),
    contact: contact.slice(0, 160),
    message: (body.message ?? "").toString().slice(0, 1000) || undefined,
    intent: (body.intent ?? "").toString().slice(0, 80) || undefined,
    source: "ask-ritchie",
    receivedAt: new Date().toISOString(),
  };

  try {
    await storeLead(lead);
    console.log("[ask-ritchie] new lead:", lead);
  } catch (err) {
    console.error("[ask-ritchie] failed to store lead:", err);
    // Still acknowledge — never lose a lead to a disk error in the prototype.
  }

  return Response.json({
    ok: true,
    message: `Got it, ${lead.name.split(" ")[0]}. Matt will reach out personally.`,
  });
}
