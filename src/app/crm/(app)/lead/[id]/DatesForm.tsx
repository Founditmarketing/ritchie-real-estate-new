"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../api";

/**
 * The long-game dates. A birthday (month + day, no year — nobody wants
 * to ask) and the closing date. Setting either enrolls this person in
 * the yearly reach-out queue; clearing both retires them from it.
 */
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function DatesForm({
  leadId,
  birthday,
  closedOn,
}: {
  leadId: string;
  birthday?: string;
  closedOn?: string;
}) {
  const router = useRouter();
  const [bMonth, setBMonth] = useState(birthday ? birthday.slice(0, 2) : "");
  const [bDay, setBDay] = useState(birthday ? birthday.slice(3, 5) : "");
  const [closed, setClosed] = useState(closedOn ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (busy) return;
    const hasMonth = !!bMonth;
    const hasDay = !!bDay;
    if (hasMonth !== hasDay) {
      setError("Pick both the month and the day.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await api(
      `/api/crm/leads/${leadId}`,
      {
        birthday: hasMonth ? `${bMonth}-${bDay}` : "",
        closedOn: closed || "",
      },
      "PATCH",
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  const select =
    "min-h-[44px] rounded-[3px] border border-line bg-navy px-3 font-sans text-[14px] text-cream [&>option]:bg-navy";

  return (
    <div className="rounded-[10px] border border-line bg-navy-deep/40 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-cream-warm">
            Birthday
          </span>
          <div className="mt-2 flex gap-2">
            <select
              aria-label="Birthday month"
              value={bMonth}
              onChange={(e) => setBMonth(e.target.value)}
              className={`${select} flex-1`}
            >
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, "0")}>
                  {m}
                </option>
              ))}
            </select>
            <select
              aria-label="Birthday day"
              value={bDay}
              onChange={(e) => setBDay(e.target.value)}
              className={`${select} w-24`}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, "0")}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="closed-on"
            className="block font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-cream-warm"
          >
            Closing day
          </label>
          <input
            id="closed-on"
            type="date"
            value={closed}
            onChange={(e) => setClosed(e.target.value)}
            className="mt-2 block min-h-[44px] w-full rounded-[3px] border border-line bg-navy px-3 font-sans text-[14px] text-cream [color-scheme:dark]"
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="mt-3 font-sans text-[12.5px] text-crimson-bright">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="mt-4 min-h-[44px] rounded-[3px] border border-line px-5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-cream-warm transition-colors hover:border-line-bright hover:text-cream disabled:opacity-50"
      >
        {busy ? "Saving…" : saved ? "Saved" : "Save dates"}
      </button>
      <p className="mt-3 font-sans text-[12px] leading-relaxed text-mute">
        Set either one and they join the yearly reach-out list — birthday
        wishes and home-anniversary check-ins, written for you, one tap to
        send.
      </p>
    </div>
  );
}
