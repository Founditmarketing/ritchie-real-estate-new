"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../api";

/**
 * One reach-out in the daily queue. The message is already written; Text
 * opens the phone's own composer with it typed (sms:?body=), Call dials.
 * "Done" logs the touch on the lead's timeline and retires this card for
 * the year — the human sent it, the CRM remembers it.
 */
export function TouchCard({
  leadId,
  name,
  contact,
  reason,
  message,
  kind,
  dueKey,
  today,
}: {
  leadId: string;
  name: string;
  contact: string;
  reason: string;
  message: string;
  kind: "birthday" | "anniversary";
  dueKey: string;
  today: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const isPhone = !contact.includes("@");
  const tel = contact.replace(/[^\d+]/g, "");
  const body = encodeURIComponent(message);

  async function done() {
    if (busy) return;
    setBusy(true);
    const res = await api(
      `/api/crm/leads/${leadId}`,
      { touch: { kind, dueKey } },
      "PATCH",
    );
    if (res.ok) {
      router.refresh();
      return;
    }
    setBusy(false);
  }

  return (
    <li className="px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <Link
          href={`/crm/lead/${leadId}`}
          className="min-w-0 truncate font-serif text-[17px] text-paper transition-colors hover:text-crimson-bright"
        >
          {name}
        </Link>
        <span className="shrink-0 font-sans text-[10.5px] font-medium uppercase tracking-[0.16em] text-crimson-bright">
          {reason}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 font-sans text-[12.5px] leading-relaxed text-cream-warm">
        &ldquo;{message}&rdquo;
      </p>
      <div className="mt-2.5 flex gap-2">
        {isPhone ? (
          <>
            <a
              href={`sms:${tel}?body=${body}`}
              className="flex min-h-[40px] flex-1 items-center justify-center rounded-[3px] bg-crimson px-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-crimson-deep"
            >
              Text it
            </a>
            <a
              href={`tel:${tel}`}
              className="flex min-h-[40px] items-center justify-center rounded-[3px] border border-line px-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-cream-warm transition-colors hover:border-line-bright hover:text-cream"
            >
              Call
            </a>
          </>
        ) : (
          <a
            href={`mailto:${contact}?subject=${encodeURIComponent(
              kind === "birthday" ? "Happy birthday!" : "Happy home anniversary!",
            )}&body=${body}`}
            className="flex min-h-[40px] flex-1 items-center justify-center rounded-[3px] bg-crimson px-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-crimson-deep"
          >
            Email it
          </a>
        )}
        <button
          type="button"
          onClick={done}
          disabled={busy || !today}
          title={today ? "Mark sent" : "Not due yet"}
          className="flex min-h-[40px] items-center justify-center rounded-[3px] border border-line px-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-mute transition-colors hover:border-line-bright hover:text-cream disabled:opacity-40"
        >
          {busy ? "…" : "Done"}
        </button>
      </div>
    </li>
  );
}
