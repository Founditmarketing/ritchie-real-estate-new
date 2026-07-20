import { cookies } from "next/headers";
import { userById } from "./roster";
import type { Session } from "./types";

/**
 * Prototype auth: one shared passcode (CRM_PASSCODE, default RITCHIE),
 * then pick who you are. Cookie is httpOnly JSON — no per-user passwords
 * yet, documented as prototype scope. Real auth is a swap at this seam.
 */

const COOKIE = "rre_crm";

export function passcodeOk(code: string): boolean {
  return code.trim().toUpperCase() === (process.env.CRM_PASSCODE ?? "RITCHIE").toUpperCase();
}

export async function createSession(userId: string): Promise<Session | null> {
  const user = userById(userId);
  if (!user) return null;
  const session: Session = { userId: user.id, role: user.role };
  (await cookies()).set(COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
  return session;
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  try {
    const raw = (await cookies()).get(COOKIE)?.value;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!userById(parsed.userId)) return null;
    return parsed;
  } catch {
    return null;
  }
}
