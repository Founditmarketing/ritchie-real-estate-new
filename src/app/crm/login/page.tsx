import { redirect } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { getSession } from "@/lib/crm/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function CrmLoginPage() {
  const session = await getSession();
  if (session) redirect("/crm");

  return (
    <div className="flex min-h-screen items-start justify-center px-4 pb-16 pt-[max(4rem,env(safe-area-inset-top))]">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <LogoMark tone="light" size={56} />
          <h1 className="mt-4 font-serif text-[30px] leading-tight text-paper">
            Ritchie CRM
          </h1>
          <p className="mt-1 flex items-center gap-2 font-sans text-[12.5px] text-mute">
            Team lead manager
            <span className="inline-flex items-center rounded-full border border-line px-2 py-[3px] text-[9px] font-medium uppercase tracking-[0.18em] text-mute">
              Prototype
            </span>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
