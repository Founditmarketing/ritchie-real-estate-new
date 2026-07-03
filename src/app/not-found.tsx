"use client";

import Link from "next/link";
import { openAskRitchie } from "@/components/chat/AskRitchie";

/**
 * Branded 404. Renders inside the root layout (header, footer, grain),
 * so it only needs to be the page itself. The root not-found also catches
 * every unmatched URL across the app.
 */
export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-ink px-6 pb-24 pt-28 text-center">
      <span className="eyebrow center">Off the map</span>

      <h1 className="mt-7 max-w-[18ch] font-serif text-[clamp(38px,6vw,84px)] leading-[1.02] tracking-[-0.02em] text-paper">
        Even Ritchie doesn&rsquo;t know{" "}
        <em className="italic text-crimson-bright">this address.</em>
      </h1>

      <p className="mt-6 max-w-[46ch] font-sans text-[15px] leading-[1.7] text-cream-warm">
        The listing may have sold, or the link has wandered.
      </p>

      <div className="mt-11 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
        <Link
          href="/listings"
          data-cursor-label="Browse"
          className="inline-flex items-center justify-center gap-3 bg-crimson px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-crimson-deep"
        >
          Browse the listings
        </Link>
        <button
          type="button"
          onClick={openAskRitchie}
          aria-haspopup="dialog"
          data-cursor-label="Ask"
          className="inline-flex items-center justify-center border border-cream/25 px-8 py-4 font-sans text-[12px] uppercase tracking-[0.2em] text-cream-warm transition-colors hover:border-cream/50 hover:text-cream"
        >
          Ask Ritchie instead
        </button>
      </div>

      <a
        href="tel:+13184498919"
        className="mt-9 font-sans text-[11.5px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-cream"
      >
        Or call 318&middot;449&middot;8919
      </a>
    </section>
  );
}
