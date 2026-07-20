import { getSession } from "@/lib/crm/auth";
import { seedDoc } from "@/lib/crm/logic";
import { writeDoc } from "@/lib/crm/store";

/** Broker-only: reset the prototype to labeled demo data. */
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "broker") {
    return Response.json({ ok: false, error: "Broker only" }, { status: 403 });
  }
  await writeDoc(seedDoc());
  return Response.json({ ok: true });
}
