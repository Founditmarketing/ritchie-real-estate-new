import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { minutesWaiting, needsAttention } from "@/lib/crm/logic";
import { MATT_ID, USERS, firstName } from "@/lib/crm/roster";
import { readDoc } from "@/lib/crm/store";
import { RESPONSE_WINDOW_MIN, type Lead } from "@/lib/crm/types";
import { LeadRow, SectionLabel } from "../../ui";
import { ResetPinButton } from "./ResetPinButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/crm/login");
  if (session.role !== "broker") redirect("/crm");

  const doc = await readDoc();
  const leads = doc.leads;
  const at = Date.now();

  const count = (fn: (l: Lead) => boolean) => leads.filter(fn).length;
  const stats = [
    {
      label: "Working",
      value: count((l) =>
        l.status === "new" || l.status === "contacted" || l.status === "no-answer",
      ),
    },
    { label: "Appointments", value: count((l) => l.status === "appointment") },
    { label: "Converted", value: count((l) => l.status === "converted") },
    { label: "Junk", value: count((l) => l.status === "junk") },
  ];

  const attention = leads
    .filter((l) => needsAttention(l, at))
    .sort((a, b) => minutesWaiting(b, at) - minutesWaiting(a, at));

  const roster = USERS.filter((u) => u.inRotation || u.id === MATT_ID);

  return (
    <div className="space-y-9">
      <h1 className="font-serif text-[28px] leading-tight text-paper">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-line bg-navy-deep/40 px-4 py-4"
          >
            <p className="font-serif text-[34px] leading-none tabular-nums text-paper">
              {s.value}
            </p>
            <p className="mt-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.18em] text-mute">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section aria-label="Needs attention" className="space-y-2.5">
        <SectionLabel
          tone={attention.length ? "alert" : "quiet"}
          count={attention.length || undefined}
        >
          Needs attention
        </SectionLabel>
        {attention.length ? (
          <ul className="divide-y divide-line overflow-hidden rounded-[10px] border border-line bg-navy-deep/40">
            {attention.map((lead) => (
              <li key={lead.id}>
                <LeadRow lead={lead} showAgent at={at} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[10px] border border-line bg-navy-deep/40 px-4 py-5 font-sans text-[13.5px] text-mute">
            Nothing slipping right now.
          </p>
        )}
      </section>

      <section aria-label="By agent" className="space-y-2.5">
        <SectionLabel>By agent</SectionLabel>
        <div className="overflow-x-auto rounded-[10px] border border-line bg-navy-deep/40">
          <table className="w-full min-w-[480px] font-sans text-[13px]">
            <thead>
              <tr className="text-left text-[10.5px] font-medium uppercase tracking-[0.16em] text-mute">
                <th scope="col" className="px-3.5 py-3 font-medium">
                  Agent
                </th>
                <th scope="col" className="px-2 py-3 text-right font-medium">
                  Leads
                </th>
                <th scope="col" className="px-2 py-3 text-right font-medium">
                  Untouched
                </th>
                <th scope="col" className="px-2 py-3 text-right font-medium">
                  Appts
                </th>
                <th scope="col" className="px-2 py-3 text-right font-medium">
                  Converted
                </th>
                <th scope="col" className="px-3.5 py-3 text-right font-medium">
                  First reply
                </th>
              </tr>
            </thead>
            <tbody>
              {roster.map((u) => {
                const theirs = leads.filter((l) => l.assignedTo === u.id);
                return (
                  <tr key={u.id} className="border-t border-line">
                    <td className="px-3.5 py-3 text-cream">
                      {firstName(u.id)}
                      {u.id === MATT_ID && (
                        <span className="ml-1.5 text-[10px] uppercase tracking-[0.14em] text-mute">
                          Broker
                        </span>
                      )}
                    </td>
                    <Num>{theirs.length}</Num>
                    <Num>{theirs.filter((l) => l.status === "new").length}</Num>
                    <Num>
                      {theirs.filter((l) => l.status === "appointment").length}
                    </Num>
                    <Num>
                      {theirs.filter((l) => l.status === "converted").length}
                    </Num>
                    <td className="px-3.5 py-3 text-right tabular-nums text-cream">
                      {avgFirstResponse(theirs)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="font-sans text-[12.5px] leading-relaxed text-mute">
          A lead counts as slipping after {RESPONSE_WINDOW_MIN} minutes with no
          touch.
        </p>
      </section>

      {/* SIGN-IN PINS — who's claimed one, and the office-manager reset.
          Resetting sends that person back through the create-a-PIN step;
          nobody (broker included) ever sees anyone's PIN. */}
      <section aria-label="Sign-in PINs" className="space-y-2.5">
        <SectionLabel>Sign-in PINs</SectionLabel>
        <ul className="divide-y divide-line overflow-hidden rounded-[10px] border border-line bg-navy-deep/40">
          {USERS.map((u) => {
            const hasPin = !!doc.pins?.[u.id];
            return (
              <li
                key={u.id}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5"
              >
                <span className="font-sans text-[13.5px] text-cream">
                  {u.name}
                  {u.role === "broker" && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-[0.14em] text-mute">
                      Broker
                    </span>
                  )}
                </span>
                {hasPin ? (
                  <ResetPinButton userId={u.id} name={firstName(u.id)} />
                ) : (
                  <span className="font-sans text-[10.5px] uppercase tracking-[0.14em] text-mute">
                    Not set yet
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-2 py-3 text-right tabular-nums text-cream">{children}</td>
  );
}

/** Average minutes from arrival to first touch across an agent's leads. */
function avgFirstResponse(leads: Lead[]): string {
  const mins = leads
    .filter((l) => l.firstResponseAt)
    .map(
      (l) =>
        (new Date(l.firstResponseAt as string).getTime() -
          new Date(l.createdAt).getTime()) /
        60000,
    )
    .filter((m) => m >= 0);
  if (mins.length === 0) return "—";
  const avg = mins.reduce((a, b) => a + b, 0) / mins.length;
  if (avg < 1) return "under 1m";
  if (avg < 60) return `${Math.round(avg)}m`;
  return `${Math.floor(avg / 60)}h ${Math.round(avg % 60)}m`;
}
