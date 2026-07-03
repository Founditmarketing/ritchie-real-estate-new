"use client";

import { openAskRitchie } from "@/components/chat/AskRitchie";

/**
 * Quiet concierge affordance for the area guides. Opens the same
 * "Ask Ritchie" drawer the hero CTA uses — no new chat surface, just a
 * doorway into the existing one, labeled with the town at hand.
 */
export function AskAboutArea({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openAskRitchie()}
      aria-haspopup="dialog"
      data-cursor-label="Ask"
      className={`group inline-flex items-center gap-2.5 font-sans text-[11.5px] font-medium uppercase tracking-[0.18em] text-cream-warm transition-[color,translate,scale] duration-200 ease-out hover:text-crimson-bright active:scale-[0.98] ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-crimson-bright"
      />
      Ask Ritchie about {name}
      <span
        aria-hidden
        className="inline-block h-px w-7 bg-current transition-[width] duration-500 ease-out group-hover:w-12"
      />
    </button>
  );
}
