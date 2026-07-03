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
      className={`group inline-flex items-center gap-2.5 font-sans text-[11.5px] font-medium uppercase tracking-[0.18em] text-cream-warm transition-colors hover:text-crimson-bright ${className ?? ""}`}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-crimson-bright"
      />
      Ask Ritchie about {name}
    </button>
  );
}
