"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

/**
 * Root error boundary. Deliberately dependency-light — no motion imports,
 * no chat module — so it can still render when the page under it crashes.
 *
 * This Next version passes both `reset` and `unstable_retry`; the docs
 * prefer `unstable_retry()` (re-fetches, then re-renders), so the button
 * uses it and falls back to `reset()`.
 */
export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging / future reporting.
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-ink px-6 pb-24 pt-28 text-center">
      <span className="eyebrow center">A wrong turn</span>

      <h1 className="mt-7 max-w-[18ch] font-serif text-[clamp(38px,6vw,84px)] leading-[1.02] tracking-[-0.02em] text-paper">
        That didn&rsquo;t go as planned.
      </h1>

      <p className="mt-6 max-w-[46ch] font-sans text-[15px] leading-[1.7] text-cream-warm">
        Something broke on our end — not yours. Try again, and if it keeps
        happening, call the office.
      </p>

      <button
        type="button"
        onClick={() => (unstable_retry ?? reset)()}
        className="mt-11 inline-flex items-center justify-center gap-3 bg-crimson px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-crimson-deep"
      >
        Try again
      </button>

      <a
        href="tel:+13184498919"
        className="mt-9 font-sans text-[11.5px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-cream"
      >
        Or call 318&middot;449&middot;8919
      </a>

      {error.digest ? (
        <p className="mt-6 font-sans text-[10px] tracking-[0.14em] text-mute/70">
          Ref {error.digest}
        </p>
      ) : null}
    </section>
  );
}
