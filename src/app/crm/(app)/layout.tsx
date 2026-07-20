import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { getSession } from "@/lib/crm/auth";
import { firstName } from "@/lib/crm/roster";
import { DockNav } from "./DockNav";
import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";

/**
 * Guard + app chrome for every authed CRM screen. Login lives OUTSIDE
 * this group so it stays reachable without a session.
 */
export default async function CrmAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) redirect("/crm/login");

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-line bg-navy-ink/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-3xl items-center gap-2.5 px-4">
          <Link
            href="/crm"
            className="flex min-h-[44px] items-center gap-2.5"
            aria-label="Ritchie CRM inbox"
          >
            <LogoMark tone="light" size={26} />
            <span className="font-serif text-[17px] leading-none text-paper">
              Ritchie <span className="text-cream-warm">CRM</span>
            </span>
          </Link>
          <span className="hidden items-center rounded-full border border-line px-2 py-[3px] text-[9px] font-medium uppercase tracking-[0.18em] text-mute min-[400px]:inline-flex">
            Prototype
          </span>
          <span className="ml-auto truncate font-sans text-[13px] text-cream-warm">
            {firstName(session.userId)}
          </span>
          <SignOutButton />
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-32 pt-6">{children}</div>

      <DockNav broker={session.role === "broker"} />
    </>
  );
}
