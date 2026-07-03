import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/**
 * Shared shell for the quiet pages — /privacy, /terms, /accessibility.
 * One considered typeset: eyebrow + serif h1 up top, prose capped at 70ch
 * with generous leading, a small side rail that cross-links the three
 * pages and keeps the phone number one glance away.
 */

const LEGAL_PAGES = [
  { key: "privacy", href: "/privacy", label: "Privacy" },
  { key: "terms", href: "/terms", label: "Terms" },
  { key: "accessibility", href: "/accessibility", label: "Accessibility" },
] as const;

type LegalKey = (typeof LEGAL_PAGES)[number]["key"];

type LegalShellProps = {
  eyebrow: string;
  /** Serif h1 content — may carry the page’s single italic-crimson accent. */
  title: ReactNode;
  /** Optional serif-italic deck under the h1. */
  lede?: ReactNode;
  /** Which of the three legal pages this is (highlights the side rail). */
  current: LegalKey;
  children: ReactNode;
};

export function LegalShell({
  eyebrow,
  title,
  lede,
  current,
  children,
}: LegalShellProps) {
  return (
    <div className="bg-navy-ink pb-24 pt-36 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Front matter */}
        <Reveal>
          <header className="border-b border-cream/12 pb-12 md:pb-16">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="mt-5 max-w-[18ch] font-serif text-[clamp(36px,5vw,72px)] leading-[1] tracking-[-0.02em] text-paper">
              {title}
            </h1>
            {lede ? (
              <p className="mt-6 max-w-[56ch] font-serif text-[18px] italic leading-[1.6] text-cream-warm">
                {lede}
              </p>
            ) : null}
          </header>
        </Reveal>

        {/* Side rail + prose */}
        <div className="mt-12 grid grid-cols-1 gap-y-12 md:mt-16 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-x-20">
          <Reveal className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <nav aria-label="Legal pages">
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-mute">
                  The paperwork
                </span>
                <ul className="mt-4 space-y-2.5">
                  {LEGAL_PAGES.map((p) => {
                    const active = p.key === current;
                    return (
                      <li key={p.key}>
                        <Link
                          href={p.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "inline-flex items-center gap-2.5 font-sans text-[11.5px] uppercase tracking-[0.18em] transition-colors",
                            active
                              ? "text-crimson-bright"
                              : "text-cream-warm/65 hover:text-paper",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "h-px bg-current transition-[width] duration-300",
                              active ? "w-6" : "w-3",
                            )}
                          />
                          {p.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-10 border-t border-cream/12 pt-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-mute">
                  Questions?
                </span>
                <a
                  href="tel:+13184498919"
                  data-cursor-label="Call"
                  className="mt-2 block font-serif text-[22px] italic text-crimson-bright transition-colors hover:text-crimson"
                >
                  318&middot;449&middot;8919
                </a>
                <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.16em] text-cream-warm/55">
                  Mon&ndash;Fri 8&ndash;6 &middot; Sat by appt.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="order-1 lg:order-2">
            <div className="max-w-[70ch] space-y-12 md:space-y-14">
              {children}
            </div>
          </Reveal>
        </div>

        {/* Bottom rail */}
        <Reveal>
          <div className="mt-16 flex flex-col gap-2 border-t border-cream/12 pt-6 text-[11px] uppercase tracking-[0.18em] text-mute md:mt-24 md:flex-row md:items-center md:justify-between">
            <span>&copy; 2026 Ritchie Real Estate, LLC</span>
            <span>1268 Dorchester Dr &middot; Alexandria, LA 71303</span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

type LegalSectionProps = {
  /** Two-digit index, e.g. "01" — the site’s numbered-eyebrow motif. */
  num: string;
  title: string;
  children: ReactNode;
};

export function LegalSection({ num, title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="flex items-baseline gap-3 font-serif text-[24px] leading-[1.15] text-paper md:text-[27px]">
        <span
          aria-hidden
          className="font-serif text-[15px] italic text-crimson-bright"
        >
          {num}
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] font-light leading-[1.75] text-cream-warm">
        {children}
      </div>
    </section>
  );
}
