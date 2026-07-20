"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { LeadKind } from "@/lib/crm/types";
import { api } from "../../api";

const inputCls =
  "mt-2 block min-h-[52px] w-full rounded-[3px] border border-line bg-navy px-4 font-sans text-[16px] text-cream placeholder:text-mute";
const labelCls =
  "block font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-cream-warm";

export function NewLeadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [intent, setIntent] = useState("");
  const [kind, setKind] = useState<LeadKind>("residential");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!name.trim() || !contact.trim()) {
      setError("Add a name and a phone or email.");
      return;
    }
    setPending(true);
    setError(null);
    const res = await api("/api/crm/leads", {
      name: name.trim(),
      contact: contact.trim(),
      intent: intent.trim() || undefined,
      kind,
      origin: "self",
      source: "manual",
    });
    if (res.ok) {
      router.push(res.lead ? `/crm/lead/${res.lead.id}` : "/crm");
      router.refresh();
      return;
    }
    setError(res.error);
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-5">
      <div>
        <label htmlFor="nl-name" className={labelCls}>
          Their name
        </label>
        <input
          id="nl-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
          autoComplete="off"
          placeholder="Jane Smith"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="nl-contact" className={labelCls}>
          Phone or email
        </label>
        <input
          id="nl-contact"
          name="contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          maxLength={160}
          autoComplete="off"
          inputMode="email"
          placeholder="318-555-0123 or jane@example.com"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="nl-intent" className={labelCls}>
          What are they after?
        </label>
        <input
          id="nl-intent"
          name="intent"
          type="text"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          maxLength={200}
          autoComplete="off"
          placeholder="3 bed in Pineville, office space, land…"
          className={inputCls}
        />
      </div>

      <div role="radiogroup" aria-label="Lead type" className="grid grid-cols-2 gap-2">
        {(["residential", "commercial"] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="radio"
            aria-checked={kind === k}
            onClick={() => setKind(k)}
            className={cn(
              "min-h-[52px] rounded-[3px] border font-sans text-[14px] font-medium transition-colors active:scale-[0.98]",
              kind === k
                ? "border-line-strong bg-navy text-paper"
                : "border-line text-mute hover:text-cream-warm",
            )}
          >
            {k === "residential" ? "Residential" : "Commercial"}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="font-sans text-[13px] text-crimson-bright">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-[56px] w-full rounded-[3px] bg-crimson font-sans text-[15px] font-medium text-cream transition-colors hover:bg-crimson-deep active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Log it"}
      </button>
    </form>
  );
}
