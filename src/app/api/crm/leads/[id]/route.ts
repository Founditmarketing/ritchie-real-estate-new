import { getSession } from "@/lib/crm/auth";
import { addNote, logContactAttempt, logTouch, reassign, setStatus, type TouchKind } from "@/lib/crm/logic";
import { userById } from "@/lib/crm/roster";
import { updateDoc } from "@/lib/crm/store";
import { STATUS_LABEL, type LeadStatus } from "@/lib/crm/types";

const CONTACT_LABEL: Record<string, string> = {
  call: "Called the lead",
  text: "Texted the lead",
  email: "Emailed the lead",
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ ok: false, error: "Sign in first" }, { status: 401 });
  }

  const { id } = await params;
  let body: {
    status?: LeadStatus;
    note?: string;
    contact?: string;
    assignTo?: string;
    /** "MM-DD" to set, "" to clear. */
    birthday?: string;
    /** "YYYY-MM-DD" to set, "" to clear. */
    closedOn?: string;
    /** Log a completed reach-out: { kind, dueKey }. */
    touch?: { kind: TouchKind; dueKey: string };
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const result = await updateDoc((doc) => {
    const lead = doc.leads.find((l) => l.id === id);
    if (!lead) return { error: "Lead not found", status: 404 };
    // Agents touch their own leads; the broker touches anything.
    if (session.role !== "broker" && lead.assignedTo !== session.userId) {
      return { error: "That lead belongs to someone else", status: 403 };
    }

    if (body.assignTo) {
      // Only the broker moves leads between agents.
      if (session.role !== "broker") {
        return { error: "Only Matt can move leads", status: 403 };
      }
      const target = userById(body.assignTo);
      if (!target) return { error: "Unknown agent", status: 400 };
      // Matt's rule: commercial leads only move within the commercial
      // desk. Enforced here, not just hidden in the UI.
      if (lead.kind === "commercial" && !target.commercialCapable) {
        return {
          error: "Commercial stays with the commercial desk",
          status: 403,
        };
      }
      reassign(lead, session.userId, target.id, target.name);
    }
    if (body.status) {
      if (!(body.status in STATUS_LABEL)) {
        return { error: "Unknown status", status: 400 };
      }
      setStatus(lead, session.userId, body.status);
    }
    if (typeof body.note === "string" && body.note.trim()) {
      addNote(lead, session.userId, body.note.trim().slice(0, 1000));
    }
    if (body.contact && CONTACT_LABEL[body.contact]) {
      logContactAttempt(lead, session.userId, CONTACT_LABEL[body.contact]);
    }
    if (body.birthday !== undefined) {
      const v = String(body.birthday).trim();
      if (v === "") delete lead.birthday;
      else if (/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(v)) lead.birthday = v;
      else return { error: "Birthday looks off — use MM-DD", status: 422 };
    }
    if (body.closedOn !== undefined) {
      const v = String(body.closedOn).trim();
      if (v === "") delete lead.closedOn;
      else if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(v)) lead.closedOn = v;
      else return { error: "Closing date looks off", status: 422 };
    }
    if (body.touch && (body.touch.kind === "birthday" || body.touch.kind === "anniversary")) {
      const dueKey = String(body.touch.dueKey).replace(/[^a-z0-9-]/g, "").slice(0, 24);
      logTouch(lead, session.userId, body.touch.kind, dueKey);
    }
    return { lead };
  });

  if ("error" in result) {
    return Response.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }
  return Response.json({ ok: true, lead: result.lead });
}
