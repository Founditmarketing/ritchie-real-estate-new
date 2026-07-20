import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { minutesWaiting, needsAttention } from "@/lib/crm/logic";
import { readDoc } from "@/lib/crm/store";
import type { Lead, LeadStatus } from "@/lib/crm/types";
import { LeadRow, SectionLabel } from "../ui";
import { SeedButton } from "./SeedButton";

export const dynamic = "force-dynamic";

const WORKING: LeadStatus[] = ["new", "contacted", "appointment", "no-answer"];

export default async function InboxPage() {
  const session = await getSession();
  if (!session) redirect("/crm/login");
  const doc = await readDoc();
  const isBroker = session.role === "broker";
  const at = Date.now();

  const mine = isBroker
    ? doc.leads
    : doc.leads.filter((l) => l.assignedTo === session.userId);

  const attention = mine
    .filter((l) => needsAttention(l, at))
    .sort((a, b) => minutesWaiting(b, at) - minutesWaiting(a, at));
  const attnIds = new Set(attention.map((l) => l.id));
  const working = mine.filter(
    (l) => WORKING.includes(l.status) && !attnIds.has(l.id),
  );
  const done = mine.filter(
    (l) => l.status === "converted" || l.status === "junk",
  );

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-serif text-[28px] leading-tight text-paper">Inbox</h1>
        {mine.length > 0 && (
          <p className="pb-1 font-sans text-[12px] tabular-nums text-mute">
            {mine.length} {mine.length === 1 ? "lead" : "leads"}
          </p>
        )}
      </div>

      {doc.seededAt && (
        <div className="flex items-center justify-between gap-3 rounded-[3px] border border-line px-3.5 py-2.5">
          <p className="font-sans text-[12.5px] text-mute">
            Showing demo leads — real ones replace these the moment the site
            sends them.
          </p>
          {isBroker && <SeedButton />}
        </div>
      )}

      {mine.length === 0 ? (
        <div className="rounded-[10px] border border-line bg-navy-deep/40 px-6 py-16 text-center">
          <p className="font-serif text-[21px] text-paper">Quiet in here.</p>
          <p className="mx-auto mt-2 max-w-[36ch] font-sans text-[14px] leading-relaxed text-mute">
            New website leads land at the top the second they arrive.
          </p>
          {isBroker && (
            <div className="mt-6 flex justify-center">
              <SeedButton label="Load demo leads" />
            </div>
          )}
        </div>
      ) : (
        <>
          {attention.length > 0 && (
            <section aria-label="Needs attention" className="space-y-2.5">
              <SectionLabel tone="alert" count={attention.length}>
                Needs attention
              </SectionLabel>
              <LeadList leads={attention} showAgent={isBroker} at={at} />
            </section>
          )}

          {working.length > 0 && (
            <section aria-label="Working" className="space-y-2.5">
              <SectionLabel count={working.length}>Working</SectionLabel>
              <LeadList leads={working} showAgent={isBroker} at={at} />
            </section>
          )}

          {done.length > 0 && (
            <details className="group">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-mute transition-colors hover:text-cream-warm [&::-webkit-details-marker]:hidden">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="group-open:rotate-90"
                >
                  <path d="m9 6 6 6-6 6" />
                </svg>
                Done <span className="tabular-nums opacity-80">· {done.length}</span>
              </summary>
              <div className="mt-1 opacity-80">
                <LeadList leads={done} showAgent={isBroker} quiet at={at} />
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}

function LeadList({
  leads,
  showAgent,
  quiet = false,
  at,
}: {
  leads: Lead[];
  showAgent: boolean;
  quiet?: boolean;
  at: number;
}) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-[10px] border border-line bg-navy-deep/40">
      {leads.map((lead) => (
        <li key={lead.id}>
          <LeadRow lead={lead} showAgent={showAgent} quiet={quiet} at={at} />
        </li>
      ))}
    </ul>
  );
}
