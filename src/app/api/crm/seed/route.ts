import { getSession } from "@/lib/crm/auth";
import { seedDoc } from "@/lib/crm/logic";
import { readDoc, writeDoc } from "@/lib/crm/store";

/**
 * Broker-only: reset to labeled demo data. Leads are clobbered on
 * purpose; PINs are carried across — resetting demo leads must never
 * lock the whole office out of their logins.
 */
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "broker") {
    return Response.json({ ok: false, error: "Broker only" }, { status: 403 });
  }
  const pins = (await readDoc()).pins;
  const fresh = seedDoc();
  if (pins) fresh.pins = pins;
  await writeDoc(fresh);
  return Response.json({ ok: true });
}
