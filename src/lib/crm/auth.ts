import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { userById } from "./roster";
import type { Session } from "./types";

/**
 * Two-layer auth: the shared door code (CRM_PASSCODE, default RITCHIE)
 * gets you to the name list; a personal PIN proves which person you are.
 * PINs are scrypt-hashed in the store (never plaintext — fleet security
 * floor) and claimed on first login. The broker can clear an agent's PIN
 * from the dashboard, which sends them back through the claim flow.
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

/* ---------------- per-user PINs ---------------- */

export const PIN_RULE = /^\d{4,8}$/;

export function hashPin(pin: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 32).toString("hex");
  return { hash, salt };
}

export function verifyPin(
  pin: string,
  stored: { hash: string; salt: string },
): boolean {
  try {
    const candidate = scryptSync(pin, stored.salt, 32);
    return timingSafeEqual(candidate, Buffer.from(stored.hash, "hex"));
  } catch {
    return false;
  }
}
