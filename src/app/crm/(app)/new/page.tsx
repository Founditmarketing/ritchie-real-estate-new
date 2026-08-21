import { NewLeadForm } from "./NewLeadForm";
import { SpeakItIn } from "./SpeakItIn";

export const dynamic = "force-dynamic";

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-serif text-[28px] leading-tight text-paper">
        Log a lead
      </h1>
      <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-mute">
        Self-generated leads stay yours — they’re tagged for the split
        difference.
      </p>
      {/* Speak it in leads the page: talking is faster than typing on a
          truck seat, and the manual form stays right below for anyone who
          would rather type. */}
      <SpeakItIn />

      <div className="mt-9 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-mute">
          or type it
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <NewLeadForm />
    </div>
  );
}
