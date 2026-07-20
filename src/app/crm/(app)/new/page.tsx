import { NewLeadForm } from "./NewLeadForm";

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
      <NewLeadForm />
    </div>
  );
}
