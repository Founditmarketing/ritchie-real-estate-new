import { getSession } from "@/lib/crm/auth";
import { parseSpokenLead } from "@/lib/crm/speak";

/**
 * Parse-only. Turns spoken text into a draft and returns it — it never
 * writes. The human reviews the draft and commits through the normal
 * POST /api/crm/leads path, so "speak it in" cannot create a lead nobody
 * looked at.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ ok: false, error: "Sign in first" }, { status: 401 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const text = String(body.text ?? "").slice(0, 2000);
  if (!text.trim()) {
    return Response.json(
      { ok: false, error: "Say something first" },
      { status: 400 },
    );
  }

  return Response.json({ ok: true, draft: parseSpokenLead(text) });
}
