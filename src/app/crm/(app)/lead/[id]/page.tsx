import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { coach } from "@/lib/crm/coach";
import { firstName, USERS } from "@/lib/crm/roster";
import { readDoc } from "@/lib/crm/store";
import {
  SOURCE_LABEL,
  STATUS_LABEL,
  type TimelineEvent,
} from "@/lib/crm/types";
import { fmtAge, KindTag, OriginTag, SectionLabel, StatusChip } from "../../../ui";
import { AssignPanel } from "./AssignPanel";
import { ContactButtons } from "./ContactButtons";
import { CopyButton } from "./CopyButton";
import { NoteForm } from "./NoteForm";
import { StatusButtons } from "./StatusButtons";

export const dynamic = "force-dynamic";

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/crm/login");
  const doc = await readDoc();
  const lead = doc.leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="rounded-[10px] border border-line bg-navy-deep/40 px-6 py-16 text-center">
        <p className="font-serif text-[21px] text-paper">
          This lead isn’t here anymore.
        </p>
        <Link
          href="/crm"
          className="mt-4 inline-flex min-h-[44px] items-center font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-crimson-bright transition-colors hover:text-cream"
        >
          Back to the inbox
        </Link>
      </div>
    );
  }
  if (session.role !== "broker" && lead.assignedTo !== session.userId) {
    redirect("/crm");
  }

  const advice = coach(lead);
  const at = Date.now();
  const notes = sortEvents(lead.timeline).filter((e) => e.type === "note");
  const events = sortEvents(lead.timeline);

  return (
    <div className="space-y-8">
      <Link
        href="/crm"
        className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-mute transition-colors hover:text-cream"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m14 6-6 6 6 6" />
        </svg>
        Inbox
      </Link>

      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-serif text-[30px] leading-tight text-paper">
            {lead.name}
          </h1>
          <StatusChip status={lead.status} />
        </div>
        <p className="mt-2 font-sans text-[12.5px] text-mute">
          <KindTag kind={lead.kind} /> · <OriginTag origin={lead.origin} /> ·{" "}
          {SOURCE_LABEL[lead.source]} · Came in {fmtAge(lead.createdAt, at)}
          {session.role === "broker" && (
            <> · {firstName(lead.assignedTo)}’s lead</>
          )}
        </p>
        <p className="mt-1.5 font-sans text-[15px] text-cream-warm">
          {lead.contact}
        </p>
        {(lead.intent || lead.message) && (
          <div className="mt-3 rounded-[3px] bg-navy-deep px-4 py-3">
            {lead.intent && (
              <p className="font-sans text-[14px] leading-relaxed text-cream">
                {lead.intent}
              </p>
            )}
            {lead.message && (
              <p className="mt-1 font-sans text-[13.5px] leading-relaxed text-cream-warm">
                “{lead.message}”
              </p>
            )}
          </div>
        )}
      </header>

      <ContactButtons
        leadId={lead.id}
        contact={lead.contact}
        message={advice.message}
      />

      <section aria-label="Coach" className="rounded-[10px] border border-line bg-navy-deep p-4">
        <p className="eyebrow">Next move</p>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-cream-warm">
          {advice.read}
        </p>
        {advice.message && (
          <blockquote className="mt-3 rounded-[3px] bg-navy px-4 py-3 font-serif text-[16px] leading-[1.55] text-cream">
            “{advice.message}”
          </blockquote>
        )}
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-sans text-[11.5px] font-medium uppercase tracking-[0.14em] text-mute">
            {advice.action}
          </p>
          {advice.message && <CopyButton text={advice.message} />}
        </div>
      </section>

      <section aria-label="Status" className="space-y-2.5">
        <SectionLabel>Where does it stand?</SectionLabel>
        <StatusButtons leadId={lead.id} current={lead.status} />
      </section>

      {session.role === "broker" && (
        <section aria-label="Assignment">
          <AssignPanel
            leadId={lead.id}
            currentId={lead.assignedTo}
            people={USERS.map((u) => ({ id: u.id, name: u.name }))}
          />
        </section>
      )}

      <section aria-label="Notes" className="space-y-2.5">
        <SectionLabel count={notes.length || undefined}>Notes</SectionLabel>
        {notes.length > 0 && (
          <ul className="divide-y divide-line overflow-hidden rounded-[10px] border border-line bg-navy-deep/40">
            {notes.map((e) => (
              <li key={e.id} className="px-3.5 py-3">
                <p className="font-sans text-[14px] leading-relaxed text-cream">
                  {e.text}
                </p>
                <p className="mt-1 font-sans text-[11.5px] tabular-nums text-mute">
                  {who(e.by)} · {fmtAge(e.at, at)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <NoteForm leadId={lead.id} />
      </section>

      <section aria-label="History" className="space-y-2.5">
        <SectionLabel>History</SectionLabel>
        <ul className="rounded-[10px] border border-line bg-navy-deep/40 px-3.5">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex items-baseline justify-between gap-3 border-t border-line py-2.5 first:border-t-0"
            >
              <span className="min-w-0 font-sans text-[13px] leading-relaxed text-cream-warm">
                {eventLine(e)}
              </span>
              <span className="shrink-0 font-sans text-[11.5px] tabular-nums text-mute">
                {fmtAge(e.at, at)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Newest first; ties (created + assigned share a stamp) keep the later event on top. */
function sortEvents(timeline: TimelineEvent[]): TimelineEvent[] {
  return timeline
    .map((e, i) => ({ e, i }))
    .sort(
      (a, b) =>
        new Date(b.e.at).getTime() - new Date(a.e.at).getTime() || b.i - a.i,
    )
    .map(({ e }) => e);
}

function who(by: string): string {
  if (by === "system") return "the website";
  if (by === "matt") return "Matt";
  return firstName(by);
}

function eventLine(e: TimelineEvent): string {
  switch (e.type) {
    case "created":
      return e.text ?? "Lead created";
    case "assigned":
      return e.text ? `Assigned · ${e.text}` : "Assigned";
    case "status":
      return e.status
        ? `Marked ${STATUS_LABEL[e.status]} by ${who(e.by)}`
        : `Status updated by ${who(e.by)}`;
    case "note":
      return `${who(e.by)} left a note`;
    case "contact-attempt":
      return `${e.text ?? "Reached out"} — ${who(e.by)}`;
  }
}
