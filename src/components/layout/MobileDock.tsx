"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/brand/Logo";
import { openAskRitchie } from "@/components/chat/AskRitchie";
import { cn } from "@/lib/cn";

/**
 * Native-style bottom action dock for phones. Persistent, safe-area aware,
 * with an elevated center concierge action — the home indicator zone of a
 * real app, not a scaled-down web nav. Hidden at md+ (desktop keeps the
 * floating launcher + header nav) and on /explore (its own full app).
 */
export function MobileDock() {
  const pathname = usePathname();
  if (pathname === "/explore") return null;

  const onHome = pathname === "/";
  const goSell = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      document
        .getElementById("sell")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-[70] md:hidden"
    >
      {/* soft fade so scrolling content dissolves into the bar instead of
          hard-cutting at its edge */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-navy-ink to-transparent" />
      {/* Solid (not translucent) on purpose: a blurred bar smears the busy
          dark photography scrolling behind it and flickers during momentum
          scroll. Opaque surface + separation shadow reads cleaner. */}
      <div className="border-t border-cream/10 bg-navy-ink shadow-[0_-12px_32px_-12px_oklch(0.08_0.03_264/0.8)]">
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-1.5 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5">
          <DockItem
            href="/listings"
            label="Search"
            active={pathname.startsWith("/listings")}
            icon={<SearchIcon />}
          />
          <DockItem href="/explore" label="Map" icon={<MapIcon />} />

          <li className="flex justify-center">
            <button
              type="button"
              onClick={openAskRitchie}
              aria-haspopup="dialog"
              aria-label="Ask Ritchie, the Central Louisiana concierge"
              className="group relative -mt-7 flex flex-col items-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-crimson text-cream shadow-[0_12px_30px_-8px_oklch(0.40_0.17_20/0.85)] ring-[5px] ring-navy-ink transition-transform duration-200 ease-out group-active:scale-90">
                <LogoMark tone="light" size={28} />
                <span className="absolute right-1 top-1 flex h-2.5 w-2.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cream/70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cream" />
                </span>
              </span>
              <span className="mt-1 font-sans text-[9.5px] font-medium uppercase tracking-[0.14em] text-crimson-bright">
                Ask
              </span>
            </button>
          </li>

          <DockItem
            href={onHome ? "/#sell" : "/sell"}
            label="Sell"
            onClick={goSell}
            icon={<TagIcon />}
          />
          <DockItem href="tel:+13184498919" label="Call" icon={<PhoneIcon />} />
        </ul>
      </div>
    </nav>
  );
}

function DockItem({
  href,
  label,
  icon,
  active = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const cls = cn(
    "flex flex-col items-center gap-1 py-1.5 transition-transform duration-150 ease-out active:scale-90",
    // Solid mute (6.37:1 on navy-ink) — alpha-faded cream fell under AA on
    // the primary mobile navigation labels.
    active ? "text-crimson-bright" : "text-mute",
  );
  const inner = (
    <>
      <span className="grid h-6 w-6 place-items-center">{icon}</span>
      <span className="font-sans text-[9.5px] font-medium uppercase tracking-[0.14em]">
        {label}
      </span>
    </>
  );
  return (
    <li className="flex justify-center">
      {href.startsWith("tel:") ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={href} onClick={onClick} className={cls}>
          {inner}
        </Link>
      )}
    </li>
  );
}

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M3.5 12.3 11 4.8a2 2 0 0 1 1.5-.6l5 .2a1.6 1.6 0 0 1 1.6 1.6l.2 5a2 2 0 0 1-.6 1.5l-7.5 7.5a1.7 1.7 0 0 1-2.4 0l-4.8-4.8a1.7 1.7 0 0 1 0-2.4Z" />
      <circle cx="15.5" cy="8.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Shared with the /explore bottom action cluster (ExploreClient). */
export function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...ICON} aria-hidden>
      <path d="M6.5 4h3l1.4 4-2 1.4a11 11 0 0 0 5.2 5.2l1.4-2 4 1.4v3a1.8 1.8 0 0 1-2 1.8A15 15 0 0 1 4.7 6 1.8 1.8 0 0 1 6.5 4Z" />
    </svg>
  );
}
