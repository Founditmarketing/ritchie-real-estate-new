import { firstName } from "./roster";
import type { Lead } from "./types";

export interface CoachAdvice {
  /** One-line read on the situation, plain English. */
  read: string;
  /** The suggested message, ready to send. */
  message: string;
  /** The single best next action, as a short imperative. */
  action: string;
}

/**
 * AI sales coach — prototype edition. Deterministic and grounded in the
 * lead's actual state (same doctrine as the keyless concierge: never
 * invent facts). When the Claude key lands on the project this becomes a
 * live model call with this output as the fallback; the UI contract
 * doesn't change.
 */
function sentenceCase(text: string): string {
  const firstWord = text.split(" ")[0] ?? "";
  const keep =
    /^[A-Z]{2,}/.test(firstWord) || /^(Mac|Mc)[A-Z]/.test(firstWord);
  return keep || !/^[A-Z][a-z]/.test(text)
    ? text
    : text.charAt(0).toLowerCase() + text.slice(1);
}

export function coach(lead: Lead): CoachAdvice {
  const first = (lead.name.split(" ")[0] || "there").replace(/[^A-Za-z'’-]/g, "") || "there";
  const agent = firstName(lead.assignedTo);
  // Fold the intent into the sentence without mangling proper nouns:
  // lowercase only a plain capitalized first word ("Valuation…"), never
  // acronyms or Mc/Mac names ("MacArthur Dr", "LSUA").
  const about = lead.intent ? ` about ${sentenceCase(lead.intent)}` : "";
  const isPhone = /\d{3}.*\d{4}/.test(lead.contact);

  switch (lead.status) {
    case "new":
      return {
        read: isPhone
          ? "Fresh lead. Speed wins — call first, text if no answer."
          : "Fresh lead with an email. Short and personal beats a template.",
        message: `Hi ${first}, this is ${agent} with Ritchie Real Estate — you reached out${about}. When's a good time to talk for five minutes? Happy to work around your day.`,
        action: isPhone ? "Call now, text if voicemail" : "Send the intro email now",
      };
    case "contacted":
      return {
        read: "They've heard from you once. The second touch is where most agents quit — don't.",
        message: `Hi ${first}, ${agent} again. Wanted to keep this easy — I can line up a couple of options${about} and you pick what's worth your time. Want me to send them over?`,
        action: "Send a value follow-up today",
      };
    case "appointment":
      return {
        read: "Appointment on the books. Confirm it the morning of — confirmed appointments show up.",
        message: `Morning ${first} — ${agent} here. Looking forward to today. I'll have everything ready so it takes exactly as long as you want it to. See you soon.`,
        action: "Confirm the morning of",
      };
    case "no-answer":
      return {
        read: "Two strikes isn't out. Switch channels — if you've been calling, text; people answer what they can answer quietly.",
        message: `Hi ${first}, ${agent} with Ritchie Real Estate. No pressure at all — when you're ready${about}, I'm one text away. I'll leave it in your court.`,
        action: "Switch channels, then park it 3 days",
      };
    case "converted":
      return {
        read: "Done deal. The next lead is inside this one: the review and the referral.",
        message: `${first}, congratulations again — it was a pleasure. If you have sixty seconds, a quick Google review helps our small team more than you know. And if anyone you know needs us, you know where I am.`,
        action: "Send the review link",
      };
    case "junk":
      return {
        read: "Marked junk. No time spent here is time won back.",
        message: "",
        action: "Nothing to do — it's filed",
      };
  }
}
