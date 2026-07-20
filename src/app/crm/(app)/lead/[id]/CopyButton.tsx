"use client";

import { useRef, useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-[44px] shrink-0 rounded-[3px] border border-line-strong px-4 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-cream transition-colors hover:bg-navy active:scale-[0.97]"
    >
      <span aria-live="polite">
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Couldn’t copy"
            : "Copy"}
      </span>
    </button>
  );
}
