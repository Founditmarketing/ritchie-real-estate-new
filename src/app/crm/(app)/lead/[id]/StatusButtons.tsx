"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { STATUS_LABEL, type LeadStatus } from "@/lib/crm/types";
import { api } from "../../../api";

const ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "no-answer",
  "appointment",
  "converted",
  "junk",
];

export function StatusButtons({
  leadId,
  current,
}: {
  leadId: string;
  current: LeadStatus;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<LeadStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function set(status: LeadStatus) {
    if (pending || status === current) return;
    setPending(status);
    setError(null);
    const res = await api(`/api/crm/leads/${leadId}`, { status }, "PATCH");
    if (!res.ok) setError(res.error);
    router.refresh();
    setPending(null);
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ORDER.map((status) => {
          const active = status === current;
          return (
            <button
              key={status}
              type="button"
              onClick={() => set(status)}
              disabled={!!pending}
              aria-pressed={active}
              className={cn(
                "min-h-[52px] rounded-[3px] border px-3 font-sans text-[14px] font-medium transition-colors active:scale-[0.98] disabled:opacity-60",
                active
                  ? "border-crimson bg-crimson text-cream"
                  : "border-line-strong bg-navy-deep text-cream hover:bg-navy",
              )}
            >
              {pending === status ? "Saving…" : STATUS_LABEL[status]}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 font-sans text-[12.5px] text-crimson-bright">
          {error}
        </p>
      )}
    </div>
  );
}
