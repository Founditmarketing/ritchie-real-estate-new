"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Persistent bottom dock on ALL viewports — this is an app, not the
 * marketing site. Echoes the MobileDock pattern: opaque bar, safe-area
 * padding, mute labels with crimson-bright active tinting.
 */
export function DockNav({ broker }: { broker: boolean }) {
  const pathname = usePathname();

  const items: { href: string; label: string; active: boolean; icon: React.ReactNode }[] = [
    {
      href: "/crm",
      label: "Inbox",
      active: pathname === "/crm" || pathname.startsWith("/crm/lead"),
      icon: <InboxIcon />,
    },
    {
      href: "/crm/new",
      label: "New lead",
      active: pathname.startsWith("/crm/new"),
      icon: <PlusIcon />,
    },
  ];
  if (broker) {
    items.push({
      href: "/crm/dashboard",
      label: "Dashboard",
      active: pathname.startsWith("/crm/dashboard"),
      icon: <ChartIcon />,
    });
  }

  return (
    <nav aria-label="CRM navigation" className="fixed inset-x-0 bottom-0 z-[70]">
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-navy-ink to-transparent" />
      <div className="border-t border-line bg-navy-ink shadow-[0_-12px_32px_-12px_oklch(0.08_0.03_264/0.8)]">
        <ul
          className={cn(
            "mx-auto grid max-w-md items-center px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5",
            broker ? "grid-cols-3" : "grid-cols-2",
          )}
        >
          {items.map((item) => (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={cn(
                  "flex min-h-[48px] w-full flex-col items-center justify-center gap-1 py-1.5 transition-colors active:scale-95",
                  item.active ? "text-crimson-bright" : "text-mute hover:text-cream-warm",
                )}
              >
                <span className="grid h-6 w-6 place-items-center">{item.icon}</span>
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.14em]">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function InboxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}
