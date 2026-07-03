import { archiveLocally, deliverLead, type Lead } from "@/lib/lead-delivery";

export const runtime = "nodejs";

/**
 * Lead capture for the whole site (Ask Ritchie chat + the Sell valuation form
 * + the footer newsletter).
 *
 * Delivery: emails the lead to Matt via Resend (see lib/lead-delivery.ts).
 * Configure RESEND_API_KEY + LEAD_TO_EMAIL in your environment to turn it on.
 * Until then it falls back to a local JSON file + console log in development.
 *
 * Honesty contract: if the lead reached NEITHER an inbox nor the local
 * archive (e.g. unconfigured email on a read-only serverless fs), we still
 * accept the request but respond with `degraded: true` and a message that
 * points the visitor at the phone — never a false "Matt will reach out."
 */

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

  const archived = await archiveLocally(lead);

  const delivery = await deliverLead(lead);
  const emailed = delivery.ok && !delivery.skipped;
  if (delivery.ok && delivery.skipped) {
    console.log("[lead] captured (email not configured):", lead);
  } else if (delivery.ok) {
    console.log("[lead] delivered to inbox:", lead.name, lead.contact);
  } else {
    // Never lose a lead to a send failure — log loudly so it's recoverable.
    console.error("[lead] DELIVERY FAILED:", delivery.error, lead);
  }

  const first = lead.name.split(" ")[0];

  if (!emailed && !archived) {
    // Nothing persisted anywhere — say so instead of promising a callback.
    return Response.json({
      ok: true,
      degraded: true,
      message: `Got it, ${first}. To be certain, call or text Matt at 318-449-8919.`,
    });
  }

  return Response.json({
    ok: true,
    message: `Got it, ${first}. Matt will reach out personally.`,
  });
}
