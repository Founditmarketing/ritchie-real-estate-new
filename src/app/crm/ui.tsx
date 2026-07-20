import Link from "next/link";
import { cn } from "@/lib/cn";
import { firstName } from "@/lib/crm/roster";
import { minutesWaiting, needsAttention } from "@/lib/crm/logic";
import {
  SOURCE_LABEL,
  STATUS_LABEL,
  type Lead,
  type LeadKind,
  type LeadOrigin,
  type LeadStatus,
} from "@/lib/crm/types";

/**
 * Shared CRM presentation pieces. Server-safe only — this module imports
 * logic.ts (node:crypto), so client components must not import it.
 */

/** "just now" / "12m ago" / "3h ago" / "2d ago" */
export function fmtAge(iso: string, at = Date.now()): string {
  const m = Math.max(0, Math.floor((at - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** "47 min" / "2h 24m" — for the waiting badge. */
export function fmtWait(mins: number): string {
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

const CHIP_TONE: Record<LeadStatus, string> = {
  "new": "border-crimson-bright/50 text-crimson-bright",
  "contacted": "border-line-strong text-cream-warm",
  "appointment": "border-steel/50 text-steel",
  "converted": "border-line-strong bg-navy text-cream",
  "no-answer": "border-line text-mute",
  "junk": "border-line text-mute",
};

export function StatusChip({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-[3px] font-sans text-[10px] font-medium uppercase tracking-[0.14em]",
        CHIP_TONE[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function KindTag({ kind }: { kind: LeadKind }) {
  return <span>{kind === "commercial" ? "Commercial" : "Residential"}</span>;
}

export function OriginTag({ origin }: { origin: LeadOrigin }) {
  return <span>{origin === "self" ? "Self-gen" : "Broker lead"}</span>;
}

export function SectionLabel({
  children,
  tone = "quiet",
  count,
}: {
  children: React.ReactNode;
  tone?: "quiet" | "alert";
  count?: number;
}) {
  return (
    <h2
      className={cn(
        "flex items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.22em]",
        tone === "alert" ? "text-crimson-bright" : "text-mute",
      )}
    >
      {children}
      {typeof count === "number" && (
        <span className="tabular-nums opacity-80">· {count}</span>
      )}
    </h2>
  );
}

/**
 * One tappable inbox row. Wrap in an <li>. `showAgent` is the broker
 * view; `quiet` is for the Done section.
 */
export function LeadRow({
  lead,
  showAgent = false,
  quiet = false,
  at = Date.now(),
}: {
  lead: Lead;
  showAgent?: boolean;
  quiet?: boolean;
  at?: number;
}) {
  const attention = needsAttention(lead, at);
  const line = lead.intent || lead.message;
  return (
    <Link
      href={`/crm/lead/${lead.id}`}
      className="flex min-h-[64px] items-center gap-3 px-3.5 py-3 transition-colors hover:bg-navy-deep/60 active:bg-navy-deep"
    >
      {attention && (
        <span
          aria-hidden
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-crimson-bright/40 text-crimson-bright"
        >
          <AlertIcon />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "truncate font-serif text-[17px] leading-snug",
              quiet ? "text-cream-warm" : "text-paper",
            )}
          >
            {lead.name}
          </span>
          <StatusChip status={lead.status} />
        </span>
        {line && (
          <span
            className={cn(
              "mt-0.5 block truncate text-[13px]",
              quiet ? "text-mute" : "text-cream-warm",
            )}
          >
            {line}
          </span>
        )}
        <span className="mt-0.5 block truncate text-[11.5px] text-mute">
          {SOURCE_LABEL[lead.source]} · <KindTag kind={lead.kind} /> ·{" "}
          <OriginTag origin={lead.origin} />
          {showAgent && <> · {firstName(lead.assignedTo)}</>}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-[12px] tabular-nums text-mute">
          {fmtAge(lead.createdAt, at)}
        </span>
        {attention && (
          <span className="mt-0.5 block text-[11.5px] font-medium tabular-nums text-crimson-bright">
            Waiting {fmtWait(minutesWaiting(lead, at))}
          </span>
        )}
      </span>
    </Link>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.2" />
      <circle cx="12" cy="16.4" r="0.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
