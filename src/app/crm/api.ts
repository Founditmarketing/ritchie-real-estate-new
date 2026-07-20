import type { Lead } from "@/lib/crm/types";

/**
 * Tiny client-side helper for the CRM mutation routes. Every route
 * answers { ok: true, ... } or { ok: false, error } — normalize network
 * failures into the same shape so components have one code path.
 */
export type ApiResult =
  | { ok: true; lead?: Lead }
  | { ok: false; error: string };

export async function api(
  path: string,
  body?: unknown,
  method: "POST" | "PATCH" = "POST",
): Promise<ApiResult> {
  try {
    const res = await fetch(path, {
      method,
      headers: { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = (await res.json()) as ApiResult;
    if (typeof data !== "object" || data === null || typeof data.ok !== "boolean") {
      return { ok: false, error: "Something went wrong. Try again." };
    }
    return data;
  } catch {
    return { ok: false, error: "Couldn’t reach the server. Try again." };
  }
}
