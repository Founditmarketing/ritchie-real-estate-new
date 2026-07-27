"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "done" | "degraded" | "error";

/**
 * Commercial inquiry form. The intent line is prefixed "Commercial" on
 * purpose: /api/lead feeds the CRM, whose classifier routes commercial
 * leads straight to Matt (the broker) instead of the residential
 * rotation — so this form literally IS the "goes straight to the
 * broker" promise.
 */
export function CommercialForm() {
  const [state, setState] = useState<FormState>("idle");
  const [reply, setReply] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const contact = String(fd.get("contact") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!name || !contact) return;

    setState("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message: message || undefined,
          intent: "Commercial inquiry",
          source: "contact-form",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error();
      setReply(data.message ?? null);
      setState(data.degraded ? "degraded" : "done");
    } catch {
      setState("error");
    }
  }

  if (state === "done" || state === "degraded") {
    return (
      <div className="border border-line bg-navy-deep px-7 py-10 text-center">
        <p className="font-serif text-[24px] leading-snug text-paper">
          {state === "done" ? (
            <>
              Got it. Commercial goes straight to{" "}
              <em className="italic text-crimson-bright">Matt.</em>
            </>
          ) : (
            "Got it — but to be certain, call."
          )}
        </p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-cream-warm">
          {reply ?? "He'll reach out personally."}
        </p>
        <a
          href="tel:+13184498919"
          className="mt-6 inline-block font-sans text-[11.5px] font-medium uppercase tracking-[0.22em] text-crimson-bright transition-colors hover:text-cream"
        >
          318&middot;449&middot;8919
        </a>
      </div>
    );
  }

  const field =
    "w-full rounded-[3px] border border-cream/15 bg-navy px-4 py-3.5 font-serif text-[17px] text-paper transition-colors duration-200 placeholder:text-mute/75 focus:border-crimson/55";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.24em] text-mute">
            Your name
          </span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="First and last"
            className={`mt-2 ${field}`}
          />
        </label>
        <label className="block">
          <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.24em] text-mute">
            Phone or email
          </span>
          <input
            name="contact"
            type="text"
            required
            autoComplete="tel"
            placeholder="Best way to reach you"
            className={`mt-2 ${field}`}
          />
        </label>
      </div>
      <label className="block">
        <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.24em] text-mute">
          The property, or the space you need
        </span>
        <textarea
          name="message"
          rows={4}
          placeholder="Selling a building, leasing space, looking at land — tell us what you're working with."
          className={`mt-2 resize-none ${field}`}
        />
      </label>

      {state === "error" && (
        <p role="alert" className="font-sans text-[13px] text-crimson-bright">
          That didn&rsquo;t go through. Try again, or call 318-449-8919.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="group flex w-full items-center justify-center gap-3 bg-crimson px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition duration-150 ease-out hover:bg-crimson-deep active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "Send it to the broker"}
        <span
          aria-hidden
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        >
          &rarr;
        </span>
      </button>
    </form>
  );
}
