import { neon } from "@neondatabase/serverless";
import { head } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CrmDoc } from "./types";

/**
 * CRM persistence — graduated from the prototype.
 *
 * v1 was one JSON blob on Vercel Blob, last-write-wins. Two leads arriving
 * within seconds could erase each other (observed live on 8/21), and the
 * Blob CDN served overwrites stale for up to ~45s. Both defects were the
 * storage, not the app.
 *
 * v2 is Neon Postgres: one JSONB row guarded by OPTIMISTIC VERSION
 * LOCKING. Every mutation re-reads, applies, and commits with
 * `WHERE version = seen`; a concurrent commit bumps the version, the
 * UPDATE matches zero rows, and we retry against fresh state. Nothing is
 * ever silently lost, and reads are immediate — no CDN in the path.
 *
 * The doc-shaped interface (readDoc/writeDoc/updateDoc) is unchanged on
 * purpose: every route and page keeps working, and a move to per-lead
 * rows stays a private refactor inside this file.
 *
 * Fallbacks: no DATABASE_URL (tokenless local dev) → local JSON file.
 * First run against an empty table auto-migrates the old Blob doc if one
 * exists, so live data survives the graduation.
 */

const LOCAL_PATH = path.join(process.cwd(), ".crm-data.json");
const BLOB_PATH = "crm/leads-v1.json";
const MAX_RETRIES = 6;

const EMPTY: CrmDoc = { version: 1, rotationCursor: 0, leads: [] };

const hasDb = () => !!process.env.DATABASE_URL;

function sql() {
  return neon(process.env.DATABASE_URL as string);
}

/* ------------------------------------------------------------------ */
/* Bootstrap: table + one-time migration off the old Blob store.       */
/* Runs at most once per lambda instance; cheap after the first call.  */
/* ------------------------------------------------------------------ */

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const q = sql();
      await q`CREATE TABLE IF NOT EXISTS crm_doc (
        id      int PRIMARY KEY,
        doc     jsonb NOT NULL,
        version bigint NOT NULL DEFAULT 1,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
      const rows = await q`SELECT 1 FROM crm_doc WHERE id = 1`;
      if (rows.length === 0) {
        const seed = (await readLegacyBlob()) ?? EMPTY;
        // ON CONFLICT: two cold lambdas can race this bootstrap; first
        // writer wins and the loser's (identical) migration is dropped.
        await q`INSERT INTO crm_doc (id, doc) VALUES (1, ${JSON.stringify(seed)}::jsonb)
                ON CONFLICT (id) DO NOTHING`;
      }
    })().catch((err) => {
      ready = null; // allow a retry on the next request
      throw err;
    });
  }
  return ready;
}

/** The old store, read once for migration. Never written again. */
async function readLegacyBlob(): Promise<CrmDoc | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const meta = await head(BLOB_PATH);
    const sep = meta.downloadUrl.includes("?") ? "&" : "?";
    const res = await fetch(`${meta.downloadUrl}${sep}v=${Date.now()}`, {
      cache: "no-store",
      headers: { authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as CrmDoc;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Public interface — unchanged signatures.                            */
/* ------------------------------------------------------------------ */

export async function readDoc(): Promise<CrmDoc> {
  if (hasDb()) {
    await ensureReady();
    const rows = await sql()`SELECT doc FROM crm_doc WHERE id = 1`;
    return rows.length ? (rows[0].doc as CrmDoc) : EMPTY;
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_PATH, "utf8")) as CrmDoc;
  } catch {
    return EMPTY;
  }
}

/**
 * Unconditional replace — used by the demo-data reset, where clobbering
 * is the point. Everything else must go through updateDoc.
 */
export async function writeDoc(doc: CrmDoc): Promise<void> {
  if (hasDb()) {
    await ensureReady();
    await sql()`UPDATE crm_doc
                SET doc = ${JSON.stringify(doc)}::jsonb,
                    version = version + 1,
                    updated_at = now()
                WHERE id = 1`;
    return;
  }
  await fs.writeFile(LOCAL_PATH, JSON.stringify(doc), "utf8");
}

/**
 * Read-modify-write with optimistic version locking. On version conflict
 * the mutator re-runs against fresh state, so concurrent lead
 * submissions BOTH land — the exact failure v1 had.
 *
 * The mutator may run more than once; ingestLead & friends only touch
 * the doc they're handed, so re-running them is safe.
 */
export async function updateDoc<T>(
  fn: (doc: CrmDoc) => T | Promise<T>,
): Promise<T> {
  if (!hasDb()) {
    // Local dev: single process, no concurrency to defend against.
    const doc = await readDoc();
    const out = await fn(doc);
    await fs.writeFile(LOCAL_PATH, JSON.stringify(doc), "utf8");
    return out;
  }

  await ensureReady();
  const q = sql();

  for (let attempt = 1; ; attempt++) {
    const rows = await q`SELECT doc, version FROM crm_doc WHERE id = 1`;
    const doc: CrmDoc = rows.length ? (rows[0].doc as CrmDoc) : { ...EMPTY };
    const seen: string = rows.length ? String(rows[0].version) : "0";

    const out = await fn(doc);

    const updated = await q`UPDATE crm_doc
      SET doc = ${JSON.stringify(doc)}::jsonb,
          version = version + 1,
          updated_at = now()
      WHERE id = 1 AND version = ${seen}
      RETURNING version`;

    if (updated.length > 0) return out;

    if (attempt >= MAX_RETRIES) {
      // Persistent contention would take sustained simultaneous writes at
      // a volume this office won't see; fail loud rather than lose data.
      throw new Error("crm store: too many concurrent writes, giving up");
    }
  }
}
