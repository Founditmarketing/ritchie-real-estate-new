import { getSession } from "@/lib/crm/auth";
import { ingestLead } from "@/lib/crm/logic";
import { updateDoc } from "@/lib/crm/store";
import type { LeadKind } from "@/lib/crm/types";

/** Agents logging self-generated leads (and manual broker entries). */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ ok: false, error: "Sign in first" }, { status: 401 });
  }

  let body: {
    name?: string;
    contact?: string;
    message?: string;
    intent?: string;
    kind?: LeadKind;
    origin?: "broker" | "self";
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const contact = String(body.contact ?? "").trim().slice(0, 160);
  if (!name || !contact) {
    return Response.json(
      { ok: false, error: "Name and a phone or email are required" },
      { status: 400 },
    );
  }

  const lead = await updateDoc((doc) =>
    ingestLead(doc, {
      name,
      contact,
      message: body.message?.toString().slice(0, 1000) || undefined,
      intent: body.intent?.toString().slice(0, 200) || undefined,
      source: "manual",
      kind: body.kind === "commercial" ? "commercial" : "residential",
      origin: body.origin === "broker" ? "broker" : "self",
      loggedBy: session.userId,
    }),
  );

  return Response.json({ ok: true, lead });
}
