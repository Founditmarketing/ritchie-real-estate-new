"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../api";

/** Broker only — wipes the doc and reloads the labeled demo leads. */
export function SeedButton({ label = "Reset demo data" }: { label?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function go() {
    if (pending) return;
    if (!window.confirm("Replace everything with fresh demo leads?")) return;
    setPending(true);
    setError(null);
    const res = await api("/api/crm/seed");
    if (!res.ok) setError(res.error);
    router.refresh();
    setPending(false);
  }

  return (
    <span className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={go}
        disabled={pending}
        className="min-h-[44px] shrink-0 rounded-[3px] border border-line-strong px-3 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-navy active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Loading…" : label}
      </button>
      {error && (
        <span role="alert" className="font-sans text-[11.5px] text-crimson-bright">
          {error}
        </span>
      )}
    </span>
  );
}
