"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Broker-only: clears one user's PIN so they re-claim it on next login.
 * Confirmation is inline (tap twice) — a window.confirm() dialog reads
 * as broken on iOS standalone.
 */
export function ResetPinButton({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const [arm, setArm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function fire() {
    if (busy) return;
    if (!arm) {
      setArm(true);
      window.setTimeout(() => setArm(false), 3000);
      return;
    }
    setBusy(true);
    try {
      await fetch("/api/crm/pin-reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      router.refresh();
    } finally {
      setBusy(false);
      setArm(false);
    }
  }

  return (
    <button
      type="button"
      onClick={fire}
      disabled={busy}
      className={`min-h-[36px] rounded-[3px] border px-3 font-sans text-[10.5px] font-medium uppercase tracking-[0.14em] transition-colors disabled:opacity-50 ${
        arm
          ? "border-crimson bg-crimson text-cream"
          : "border-line text-mute hover:border-line-bright hover:text-cream"
      }`}
    >
      {busy ? "Resetting…" : arm ? `Really reset ${name}?` : "Reset PIN"}
    </button>
  );
}
