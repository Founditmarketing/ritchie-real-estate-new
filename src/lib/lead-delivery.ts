/**
 * Lead delivery — email via Resend.
 *
 * Server-only. Sends each captured lead to Matt's inbox using Resend's REST
 * API (no SDK dependency, which keeps the serverless bundle small). Driven
 * entirely by environment variables so no secret is ever committed:
 *
 *   RESEND_API_KEY   — your Resend API key (required to actually send)
 *   LEAD_TO_EMAIL    — where leads land; comma-separate for multiple inboxes
 *   LEAD_FROM_EMAIL  — verified sender, e.g. "Ritchie Leads <leads@ritchierealestate.com>"
 *                      (falls back to Resend's sandbox sender for testing)
 *
 * If RESEND_API_KEY is missing, delivery is skipped gracefully and the caller
 * still logs the lead — the visitor never sees an error.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

export interface Lead {
  name: string;
  contact: string;
  message?: string;
  intent?: string;
  source?: string;
  receivedAt: string;
}

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");

/**
 * Best-effort local archive. Works in dev; fails quietly on read-only
 * serverless filesystems (Vercel), where email is the source of truth.
 * Returns whether the lead actually persisted so the caller can be honest
 * with the visitor when neither email nor archive succeeded.
 */
export async function archiveLocally(lead: Lead): Promise<boolean> {
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
    return true;
  } catch {
    /* read-only fs in production */
    return false;
  }
}

export type DeliveryResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(lead: Lead): string {
  const row = (label: string, value: string) =>
    `<tr>
       <td style="padding:6px 16px 6px 0;color:#8b93a6;font:600 11px/1.4 -apple-system,Segoe UI,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top;white-space:nowrap">${label}</td>
       <td style="padding:6px 0;color:#131a2b;font:400 15px/1.5 Georgia,serif">${value}</td>
     </tr>`;
  const rows = [
    row("Name", escapeHtml(lead.name)),
    row("Contact", escapeHtml(lead.contact)),
    lead.message ? row("Looking for", escapeHtml(lead.message)) : "",
    lead.intent && lead.intent !== lead.message
      ? row("Last message", escapeHtml(lead.intent))
      : "",
    row("Source", escapeHtml(lead.source ?? "website")),
    row("Received", new Date(lead.receivedAt).toLocaleString("en-US")),
  ].join("");

  return `<div style="background:#081231;padding:28px">
    <table style="max-width:560px;margin:0 auto;background:#f7f5f1;border-radius:6px;overflow:hidden">
      <tr><td style="background:#101c42;padding:18px 24px">
        <span style="color:#f7f5f1;font:700 18px Georgia,serif">Ritchie Real Estate</span>
        <span style="color:#e73a58;font:600 11px/1 -apple-system,sans-serif;letter-spacing:.18em;text-transform:uppercase;display:block;margin-top:4px">New lead</span>
      </td></tr>
      <tr><td style="padding:22px 24px"><table style="width:100%;border-collapse:collapse">${rows}</table></td></tr>
      <tr><td style="padding:0 24px 22px"><a href="${/@/.test(lead.contact) ? "mailto:" + encodeURIComponent(lead.contact) : "tel:" + lead.contact.replace(/[^\d+]/g, "")}" style="display:inline-block;background:#a81640;color:#f7f5f1;font:600 12px -apple-system,sans-serif;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:11px 22px;border-radius:3px">Reply to ${escapeHtml(lead.name.split(" ")[0])}</a></td></tr>
    </table>
  </div>`;
}

function renderText(lead: Lead): string {
  return [
    "New lead — Ritchie Real Estate",
    "",
    `Name:    ${lead.name}`,
    `Contact: ${lead.contact}`,
    lead.message ? `Looking for: ${lead.message}` : "",
    lead.intent && lead.intent !== lead.message ? `Last message: ${lead.intent}` : "",
    `Source:  ${lead.source ?? "website"}`,
    `Received: ${new Date(lead.receivedAt).toLocaleString("en-US")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from =
    process.env.LEAD_FROM_EMAIL ?? "Ritchie Leads <onboarding@resend.dev>";

  if (!apiKey || !to) {
    // Not configured yet — caller still logs/stores the lead.
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: lead.contact.includes("@") ? lead.contact : undefined,
        subject: `New lead: ${lead.name}${lead.source ? ` (${lead.source})` : ""}`,
        html: renderHtml(lead),
        text: renderText(lead),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "send failed" };
  }
}
