import { promises as fs } from "node:fs";
import path from "node:path";
import { deliverLead, type Lead } from "@/lib/lead-delivery";

export const runtime = "nodejs";

/**
 * Lead capture for the whole site (Ask Ritchie chat + the Sell valuation form).
 *
 * Delivery: emails the lead to Matt via Resend (see lib/lead-delivery.ts).
 * Configure RESEND_API_KEY + LEAD_TO_EMAIL in your environment to turn it on.
 * Until then it falls back to a local JSON file + console log so nothing breaks
 * in development.
 */

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

/** Best-effort local archive — works in dev; silently no-ops on read-only
 *  serverless filesystems (Vercel), where email is the source of truth. */
async function archiveLocally(lead: Lead) {
  try {
    await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
    let existing: unknown[] = [];
    try {
      const parsed = JSON.parse(await fs.readFile(LEADS_FILE, "utf8"));
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      /* first lead */
    }
    existing.push(lead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(existing, null, 2), "utf8");
  } catch {
    /* read-only fs in production — ignore */
  }
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

  const lead: Lead = {
    name: name.slice(0, 120),
    contact: contact.slice(0, 160),
    message: (body.message ?? "").toString().slice(0, 1000) || undefined,
    intent: (body.intent ?? "").toString().slice(0, 200) || undefined,
    source: (body.source ?? "website").toString().slice(0, 40),
    receivedAt: new Date().toISOString(),
  };

  await archiveLocally(lead);

  const delivery = await deliverLead(lead);
  if (delivery.ok && delivery.skipped) {
    console.log("[lead] captured (email not configured):", lead);
  } else if (delivery.ok) {
    console.log("[lead] delivered to inbox:", lead.name, lead.contact);
  } else {
    // Never lose a lead to a send failure — log loudly so it's recoverable.
    console.error("[lead] DELIVERY FAILED:", delivery.error, lead);
  }

  return Response.json({
    ok: true,
    message: `Got it, ${lead.name.split(" ")[0]}. Matt will reach out personally.`,
  });
}
