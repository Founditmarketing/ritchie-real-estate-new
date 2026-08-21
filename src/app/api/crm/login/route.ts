import {
  createSession,
  hashPin,
  passcodeOk,
  PIN_RULE,
  verifyPin,
} from "@/lib/crm/auth";
import { userById } from "@/lib/crm/roster";
import { readDoc, updateDoc } from "@/lib/crm/store";

/**
 * Login, three steps in one endpoint:
 *  1. { passcode, userId }            -> "pin-setup" | "pin-required"
 *  2. { passcode, userId, pin }       -> verifies (or claims, first time)
 *
 * The `code` field tells the form which PIN screen to show. A PIN is
 * claimed exactly once; after that only the matching PIN (or a broker
 * reset) gets that name in.
 */
export async function POST(req: Request) {
  let body: { passcode?: string; userId?: string; pin?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!passcodeOk(String(body.passcode ?? ""))) {
    return Response.json({ ok: false, error: "Wrong passcode" }, { status: 401 });
  }

  const userId = String(body.userId ?? "");
  if (!userById(userId)) {
    return Response.json({ ok: false, error: "Pick who you are" }, { status: 400 });
  }

  const pin = String(body.pin ?? "").trim();
  const stored = (await readDoc()).pins?.[userId];

  if (!stored) {
    if (!pin) {
      return Response.json(
        { ok: false, code: "pin-setup", error: "Create your PIN" },
        { status: 401 },
      );
    }
    if (!PIN_RULE.test(pin)) {
      return Response.json(
        { ok: false, code: "pin-setup", error: "PIN is 4 to 8 digits" },
        { status: 422 },
      );
    }
    // First claim. Guard inside the transaction-ish update: if someone
    // claimed this name between our read and now, verify instead of
    // overwriting their PIN.
    const result = await updateDoc((doc) => {
      const existing = doc.pins?.[userId];
      if (existing) return { claimed: false, ok: verifyPin(pin, existing) };
      doc.pins = { ...(doc.pins ?? {}), [userId]: hashPin(pin) };
      return { claimed: true, ok: true };
    });
    if (!result.ok) {
      return Response.json(
        { ok: false, code: "pin-required", error: "That name already has a PIN" },
        { status: 401 },
      );
    }
    const session = await createSession(userId);
    return Response.json({ ok: true, session, claimed: result.claimed });
  }

  if (!pin) {
    return Response.json(
      { ok: false, code: "pin-required", error: "Enter your PIN" },
      { status: 401 },
    );
  }
  if (!verifyPin(pin, stored)) {
    return Response.json(
      { ok: false, code: "pin-required", error: "That's not your PIN" },
      { status: 401 },
    );
  }

  const session = await createSession(userId);
  return Response.json({ ok: true, session });
}
