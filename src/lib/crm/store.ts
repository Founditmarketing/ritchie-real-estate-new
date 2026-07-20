import { head, put } from "@vercel/blob";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { CrmDoc } from "./types";

/**
 * One JSON document, last-write-wins — prototype-grade persistence.
 * Vercel Blob (private store) when BLOB_READ_WRITE_TOKEN is present
 * (linked on the ritchie-real-estate-new project), local file fallback
 * for tokenless dev. Swap for Postgres when the CRM graduates.
 */

const BLOB_PATH = "crm/leads-v1.json";
const LOCAL_PATH = path.join(process.cwd(), ".crm-data.json");

const hasBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;

const EMPTY: CrmDoc = { version: 1, rotationCursor: 0, leads: [] };

export async function readDoc(): Promise<CrmDoc> {
  if (hasBlob()) {
    try {
      const meta = await head(BLOB_PATH);
      const res = await fetch(meta.downloadUrl, {
        cache: "no-store",
        headers: { authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
      });
      if (!res.ok) return EMPTY;
      return (await res.json()) as CrmDoc;
    } catch {
      // BlobNotFoundError on first run — start empty.
      return EMPTY;
    }
  }
  try {
    return JSON.parse(await fs.readFile(LOCAL_PATH, "utf8")) as CrmDoc;
  } catch {
    return EMPTY;
  }
}

export async function writeDoc(doc: CrmDoc): Promise<void> {
  const body = JSON.stringify(doc);
  if (hasBlob()) {
    await put(BLOB_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  await fs.writeFile(LOCAL_PATH, body, "utf8");
}

/** Read-modify-write helper (last-write-wins; fine for the prototype). */
export async function updateDoc<T>(
  fn: (doc: CrmDoc) => T | Promise<T>,
): Promise<T> {
  const doc = await readDoc();
  const out = await fn(doc);
  await writeDoc(doc);
  return out;
}
