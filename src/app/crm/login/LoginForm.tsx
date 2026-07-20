"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { USERS } from "@/lib/crm/roster";
import { api } from "../api";

/**
 * Two steps on one screen: type the shared passcode, then tap your name.
 * Tapping a name is the submit — one obvious action, no extra button.
 */
export function LoginForm() {
  const router = useRouter();
  const codeRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const matt = USERS.find((u) => u.role === "broker");
  const agents = USERS.filter((u) => u.role === "agent").sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  async function pick(userId: string) {
    if (pendingId) return;
    if (!code.trim()) {
      setError("Type the passcode first.");
      codeRef.current?.focus();
      return;
    }
    setError(null);
    setPendingId(userId);
    const res = await api("/api/crm/login", { passcode: code, userId });
    if (res.ok) {
      router.push("/crm");
      router.refresh();
      return;
    }
    setError(
      res.error === "Wrong passcode"
        ? "That’s not the code. Ask Matt or Found It."
        : res.error,
    );
    setPendingId(null);
  }

  const userBtn =
    "flex min-h-[52px] items-center justify-center gap-2 rounded-[3px] border border-line bg-navy-deep px-3 font-sans text-[15px] font-medium text-cream transition-colors hover:bg-navy active:scale-[0.98] disabled:opacity-50";

  return (
    <div className="mt-8">
      <label
        htmlFor="crm-passcode"
        className="block font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-cream-warm"
      >
        Passcode
      </label>
      <input
        ref={codeRef}
        id="crm-passcode"
        name="passcode"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        autoFocus
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="next"
        placeholder="The team code"
        className="mt-2 block h-14 w-full rounded-[3px] border border-line bg-navy px-4 text-center font-sans text-[18px] uppercase tracking-[0.28em] text-paper placeholder:normal-case placeholder:tracking-normal placeholder:text-mute"
      />
      {error && (
        <p role="alert" className="mt-2 font-sans text-[13px] text-crimson-bright">
          {error}
        </p>
      )}

      <p className="mt-7 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-cream-warm">
        Who are you?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {matt && (
          <button
            type="button"
            onClick={() => pick(matt.id)}
            disabled={!!pendingId}
            className={cn(userBtn, "col-span-2 min-h-[56px] justify-between px-4")}
          >
            <span>{pendingId === matt.id ? "Signing in…" : matt.name}</span>
            <span className="inline-flex items-center rounded-full border border-crimson-bright/50 px-2 py-[3px] text-[9.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright">
              Broker
            </span>
          </button>
        )}
        {agents.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => pick(u.id)}
            disabled={!!pendingId}
            className={userBtn}
          >
            {pendingId === u.id ? "Signing in…" : u.name}
          </button>
        ))}
      </div>
      <p className="mt-5 text-center font-sans text-[12px] text-mute">
        One shared code for the whole team. Don’t have it? Ask Matt.
      </p>
    </div>
  );
}
