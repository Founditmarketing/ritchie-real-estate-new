"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../api";

export function NoteForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const note = text.trim();
    if (!note || pending) return;
    setPending(true);
    setError(null);
    const res = await api(`/api/crm/leads/${leadId}`, { note }, "PATCH");
    if (res.ok) {
      setText("");
      router.refresh();
    } else {
      setError(res.error);
    }
    setPending(false);
  }

  return (
    <form onSubmit={save}>
      <label htmlFor="crm-note" className="sr-only">
        Add a note
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id="crm-note"
          name="note"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write down what happened…"
          autoComplete="off"
          enterKeyHint="done"
          maxLength={1000}
          className="min-h-[52px] w-full min-w-0 flex-1 rounded-[3px] border border-line bg-navy px-4 font-sans text-[16px] text-cream placeholder:text-mute"
        />
        <button
          type="submit"
          disabled={pending || !text.trim()}
          className="min-h-[52px] shrink-0 rounded-[3px] border border-line-strong px-4 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-navy active:scale-[0.98] disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 font-sans text-[12.5px] text-crimson-bright">
          {error}
        </p>
      )}
    </form>
  );
}
