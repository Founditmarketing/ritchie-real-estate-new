"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { api } from "../../../api";

/**
 * Broker-only: hand this lead to a different agent. Collapsed to a single
 * quiet row until Matt opens it — reassignment is an occasional move, not
 * an every-visit action.
 */
export function AssignPanel({
  leadId,
  currentId,
  people,
  note,
}: {
  leadId: string;
  currentId: string;
  people: { id: string; name: string }[];
  /** Shown under the grid, e.g. the commercial-only rule. */
  note?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handOff(id: string) {
    if (busy || id === currentId) return;
    setBusy(id);
    setError(null);
    const res = await api(`/api/crm/leads/${leadId}`, { assignTo: id }, "PATCH");
    if (!res.ok) {
      setError(res.error);
      setBusy(null);
      return;
    }
    setOpen(false);
    setBusy(null);
    router.refresh();
  }

  const current = people.find((p) => p.id === currentId);

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[10px] border border-line bg-navy-deep/40 px-4 text-left transition-colors hover:border-line-bright"
      >
        <span className="font-sans text-[13.5px] text-cream-warm">
          {current ? (
            <>
              This is <span className="text-cream">{current.name}</span>’s lead
            </>
          ) : (
            "Unassigned lead"
          )}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 font-sans text-[11.5px] font-medium uppercase tracking-[0.14em] text-crimson-bright">
          {open ? "Never mind" : "Hand it off"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={cn("transition-transform duration-200", open && "rotate-180")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-2 gap-2">
          {people.map((p) => {
            const isCurrent = p.id === currentId;
            return (
              <button
                key={p.id}
                type="button"
                disabled={isCurrent || busy !== null}
                onClick={() => handOff(p.id)}
                className={cn(
                  "min-h-[48px] rounded-[10px] border px-3 font-sans text-[13px] font-medium transition-colors",
                  isCurrent
                    ? "border-crimson bg-crimson/15 text-cream"
                    : "border-line bg-navy-deep/40 text-cream-warm hover:border-line-bright hover:text-cream",
                  busy === p.id && "opacity-60",
                )}
              >
                {busy === p.id ? "Handing off…" : p.name}
                {isCurrent && (
                  <span className="ml-1.5 text-[10.5px] uppercase tracking-[0.12em] text-crimson-bright">
                    has it
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {open && note && (
        <p className="font-sans text-[12px] leading-relaxed text-mute">{note}</p>
      )}

      {error && (
        <p role="alert" className="font-sans text-[12.5px] text-crimson-bright">
          {error}
        </p>
      )}
    </div>
  );
}
