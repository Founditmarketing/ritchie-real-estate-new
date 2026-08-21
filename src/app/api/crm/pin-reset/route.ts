import { getSession } from "@/lib/crm/auth";
import { userById } from "@/lib/crm/roster";
import { updateDoc } from "@/lib/crm/store";

/**
 * Broker-only: clear an agent's PIN so they re-claim on next login.
 * The office-manager path for "I forgot my PIN" — no plaintext ever
 * moves, the broker never learns anyone's PIN.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "broker") {
    return Response.json({ ok: false, error: "Broker only" }, { status: 403 });
  }
  let body: { userId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const userId = String(body.userId ?? "");
  if (!userById(userId)) {
    return Response.json({ ok: false, error: "Unknown user" }, { status: 400 });
  }
  await updateDoc((doc) => {
    if (doc.pins) delete doc.pins[userId];
  });
  return Response.json({ ok: true });
}
