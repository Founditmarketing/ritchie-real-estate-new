"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../api";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    if (pending) return;
    setPending(true);
    await api("/api/crm/logout");
    router.push("/crm/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="min-h-[44px] shrink-0 px-2 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-mute transition-colors hover:text-cream disabled:opacity-60"
    >
      {pending ? "Bye…" : "Sign out"}
    </button>
  );
}
