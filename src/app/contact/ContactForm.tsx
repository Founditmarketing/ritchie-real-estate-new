"use client";

import { useState, type FormEvent } from "react";
import { openAskRitchie } from "@/components/chat/AskRitchie";

type ContactStatus = "idle" | "sending" | "done" | "error";

/**
 * The message form for /contact. Mirrors the Sell.tsx lead pattern:
 * status union, POST to /api/lead, honest error copy that routes to the
 * phone, disabled-while-sending. Lives in its own client file because the
 * page itself is a server component (it exports metadata).
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<ContactStatus>("idle");
  const submitted = status === "done";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          message: message.trim(),
          source: "contact-form",
        }),
      });
      const data = await res.json();
      setStatus(res.ok && data?.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col border-b border-t-2 border-cream/15"
      >
        <div className="flex flex-col sm:flex-row">
          <label className="flex flex-1 flex-col gap-1.5 px-2 py-4 sm:border-r sm:border-cream/12">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
              Your name
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="First and last"
              className="border-none bg-transparent font-serif text-[17px] text-paper outline-none placeholder:text-mute/55"
            />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 border-t border-cream/12 px-2 py-4 sm:border-t-0">
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
              Phone or email
            </span>
            <input
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoComplete="email tel"
              placeholder="318-449-8919"
              className="border-none bg-transparent font-serif text-[17px] text-paper outline-none placeholder:text-mute/55"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 border-t border-cream/12 px-2 py-4">
          <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
            Your message
          </span>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              "We’re moving to Alexandria in August — where do we start?"
            }
            className="resize-none border-none bg-transparent font-serif text-[17px] leading-[1.5] text-paper outline-none placeholder:text-mute/55"
          />
        </label>
        <button
          type="submit"
          disabled={status === "sending" || submitted}
          data-cursor-label="Send"
          className="bg-crimson px-7 py-4 font-sans text-[11px] uppercase tracking-[0.18em] text-cream transition duration-150 ease-out hover:bg-crimson-deep active:scale-[0.99] disabled:opacity-60"
        >
          {submitted
            ? "On its way"
            : status === "sending"
              ? "Sending…"
              : "Send it"}
        </button>
      </form>

      {/* Live status line — polite so screen readers hear the outcome. */}
      <p
        aria-live="polite"
        className="mt-4 flex items-start gap-2 text-[12px] font-light leading-[1.6] text-mute"
      >
        <span
          aria-hidden
          className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-bright"
        />
        {submitted ? (
          <span>Got it &mdash; Matt will reach out personally.</span>
        ) : status === "error" ? (
          <span>
            That didn&rsquo;t go through. Call Matt at{" "}
            <a
              href="tel:+13184498919"
              className="text-crimson-bright underline underline-offset-4 transition-colors hover:text-crimson"
            >
              318-449-8919
            </a>
            .
          </span>
        ) : (
          <span>Goes to a person, not a pipeline. No spam.</span>
        )}
      </p>
    </div>
  );
}

/**
 * Bordered secondary action that opens the Ask Ritchie concierge drawer —
 * same event hook the hero CTA and the mobile dock use.
 */
export function AskRitchieButton() {
  return (
    <button
      type="button"
      onClick={() => openAskRitchie()}
      aria-haspopup="dialog"
      data-cursor-label="Ask"
      className="group inline-flex items-center gap-3 border border-cream/25 px-7 py-4 font-sans text-[11px] uppercase tracking-[0.2em] text-cream-warm transition duration-150 ease-out hover:border-cream/50 hover:text-cream active:scale-[0.98]"
    >
      <span
        aria-hidden
        className="h-1.5 w-1.5 rounded-full bg-crimson-bright"
      />
      Ask Ritchie
      <span
        aria-hidden
        className="inline-block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-12"
      />
    </button>
  );
}
