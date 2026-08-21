"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { LeadKind } from "@/lib/crm/types";
import { api } from "../../api";

type Draft = {
  name: string;
  contact: string;
  kind: LeadKind;
  intent: string;
  note: string;
  found: { name: boolean; contact: boolean };
};

/**
 * Speak it in — talk, the CRM sorts it, you check it, you commit it.
 *
 * The human ALWAYS reviews before anything is written: the parse endpoint
 * returns a draft and this component posts it through the normal create
 * path only when the broker/agent taps Save. Nothing lands unread.
 *
 * Dictation: desktop Chrome gets a real mic button via the Web Speech
 * API. On iPhone that API is unreliable, so the textarea is the surface
 * and the phone's own keyboard mic does the talking — the gesture Matt
 * already knows.
 */
export function SpeakItIn() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;
    // iOS Safari exposes the constructor but throws or silently no-ops on
    // start — keep the button to desktop, where it actually works.
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return;

    setCanListen(true);
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    let committed = "";
    rec.onresult = (e: SpeechRecognitionEventLike) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const chunk = result[0].transcript;
        if (result.isFinal) committed += chunk + " ";
        else interim += chunk;
      }
      setText((committed + interim).replace(/\s+/g, " ").trimStart());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  function toggleMic() {
    const rec = recRef.current;
    if (!rec) return;
    if (listening) {
      rec.stop();
      setListening(false);
      return;
    }
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }

  async function sort() {
    if (pending || !text.trim()) return;
    setPending(true);
    setError(null);
    const res = await fetch("/api/crm/speak", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json())
      .catch(() => null);
    setPending(false);
    if (!res?.ok) {
      setError(res?.error ?? "Couldn't sort that. Try again.");
      return;
    }
    setDraft(res.draft as Draft);
  }

  async function save() {
    if (!draft || saving) return;
    if (!draft.name.trim() || !draft.contact.trim()) {
      setError("Add a name and a phone or email before saving.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await api("/api/crm/leads", {
      name: draft.name.trim(),
      contact: draft.contact.trim(),
      intent: draft.intent.trim() || undefined,
      message: draft.note.trim() || undefined,
      kind: draft.kind,
      origin: "self",
    });
    if (res.ok) {
      router.push(res.lead ? `/crm/lead/${res.lead.id}` : "/crm");
      router.refresh();
      return;
    }
    setError(res.error);
    setSaving(false);
  }

  const set = (patch: Partial<Draft>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));

  const field =
    "mt-2 block min-h-[52px] w-full rounded-[3px] border border-line bg-navy px-4 font-sans text-[16px] text-cream placeholder:text-mute";
  const label =
    "block font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-cream-warm";

  /* ---------- REVIEW ---------- */
  if (draft) {
    return (
      <section
        aria-label="Check this before saving"
        className="mt-7 rounded-[10px] border border-crimson/40 bg-navy-deep p-4"
      >
        <p className="eyebrow">Check this, then save</p>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="si-name" className={label}>
              Their name
              {!draft.found.name && (
                <span className="ml-2 normal-case tracking-normal text-crimson-bright">
                  couldn&rsquo;t catch it &mdash; type it
                </span>
              )}
            </label>
            <input
              id="si-name"
              value={draft.name}
              onChange={(e) => set({ name: e.target.value })}
              placeholder="Jane Smith"
              className={cn(field, !draft.found.name && "border-crimson/60")}
            />
          </div>

          <div>
            <label htmlFor="si-contact" className={label}>
              Phone or email
              {!draft.found.contact && (
                <span className="ml-2 normal-case tracking-normal text-crimson-bright">
                  couldn&rsquo;t catch it &mdash; type it
                </span>
              )}
            </label>
            <input
              id="si-contact"
              value={draft.contact}
              onChange={(e) => set({ contact: e.target.value })}
              placeholder="318-555-0142"
              className={cn(field, !draft.found.contact && "border-crimson/60")}
            />
          </div>

          <div>
            <label htmlFor="si-intent" className={label}>
              What they want
            </label>
            <input
              id="si-intent"
              value={draft.intent}
              onChange={(e) => set({ intent: e.target.value })}
              placeholder="3 bed in Pineville under $300k"
              className={field}
            />
          </div>

          <div>
            <span className={label}>Type of deal</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["residential", "commercial"] as LeadKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set({ kind: k })}
                  className={cn(
                    "min-h-[52px] rounded-[10px] border px-3 font-sans text-[13px] font-medium capitalize transition-colors",
                    draft.kind === k
                      ? "border-crimson bg-crimson text-cream"
                      : "border-line bg-navy-deep/40 text-cream-warm hover:border-line-bright",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
            {draft.kind === "commercial" && (
              <p className="mt-2 font-sans text-[12.5px] text-cream-warm">
                Commercial &mdash; this one goes to Matt.
              </p>
            )}
          </div>

          <details className="rounded-[3px] bg-navy px-4 py-3">
            <summary className="cursor-pointer font-sans text-[12.5px] text-mute">
              What you said (saved as the first note)
            </summary>
            <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-cream-warm">
              {draft.note}
            </p>
          </details>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 font-sans text-[12.5px] text-crimson-bright"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="min-h-[52px] rounded-[10px] bg-crimson px-6 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-crimson-deep disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save this lead"}
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(null);
              setError(null);
            }}
            className="min-h-[44px] font-sans text-[11.5px] font-medium uppercase tracking-[0.16em] text-mute transition-colors hover:text-cream"
          >
            Start over
          </button>
        </div>
      </section>
    );
  }

  /* ---------- CAPTURE ---------- */
  return (
    <section
      aria-label="Speak it in"
      className="mt-7 rounded-[10px] border border-line bg-navy-deep/40 p-4"
    >
      <p className="eyebrow">Speak it in</p>
      <p className="mt-3 font-sans text-[13.5px] leading-relaxed text-cream-warm">
        {canListen
          ? "Tap the mic and just talk. Or type it."
          : "Tap the mic on your keyboard and just talk — the CRM sorts out the name, the number, and what they want."}
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Talked to Carl Bevins, 318-555-0151, looking at the warehouse on MacArthur, wants to see it Tuesday…"
        className="mt-3 w-full resize-none rounded-[3px] border border-line bg-navy px-4 py-3 font-sans text-[16px] leading-relaxed text-cream placeholder:text-mute"
      />

      {error && (
        <p
          role="alert"
          className="mt-3 font-sans text-[12.5px] text-crimson-bright"
        >
          {error}
        </p>
      )}

      <div className="mt-3 flex gap-2">
        {canListen && (
          <button
            type="button"
            onClick={toggleMic}
            aria-pressed={listening}
            className={cn(
              "flex min-h-[52px] items-center justify-center gap-2 rounded-[10px] border px-4 font-sans text-[12px] font-medium uppercase tracking-[0.16em] transition-colors",
              listening
                ? "border-crimson bg-crimson text-cream"
                : "border-line bg-navy-deep/40 text-cream-warm hover:border-line-bright",
            )}
          >
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-full",
                listening ? "animate-pulse bg-cream" : "bg-crimson-bright",
              )}
              aria-hidden
            />
            {listening ? "Listening…" : "Mic"}
          </button>
        )}
        <button
          type="button"
          onClick={sort}
          disabled={pending || !text.trim()}
          className="min-h-[52px] flex-1 rounded-[10px] bg-crimson px-6 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-crimson-deep disabled:opacity-50"
        >
          {pending ? "Sorting…" : "Sort it out"}
        </button>
      </div>
    </section>
  );
}

/* Minimal shapes for the Web Speech API (not in TS's DOM lib). */
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
}
