import { createSession, passcodeOk } from "@/lib/crm/auth";

export async function POST(req: Request) {
  let body: { passcode?: string; userId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!passcodeOk(String(body.passcode ?? ""))) {
    return Response.json({ ok: false, error: "Wrong passcode" }, { status: 401 });
  }
  const session = await createSession(String(body.userId ?? ""));
  if (!session) {
    return Response.json({ ok: false, error: "Pick who you are" }, { status: 400 });
  }
  return Response.json({ ok: true, session });
}
