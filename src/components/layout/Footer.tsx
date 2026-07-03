"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoWordmarkImage } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

const COLS = [
  {
    heading: "Explore",
    links: [
      { href: "/listings", label: "Buy a home" },
      { href: "/sell", label: "Sell a home" },
      { href: "/listings?type=commercial", label: "Commercial" },
      { href: "/listings?type=rental", label: "Rentals" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/team", label: "Our agents" },
      { href: "/#broker", label: "About Ritchie" },
      { href: "/areas", label: "Area guides" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

type NewsletterStatus = "idle" | "sending" | "done" | "error";

// All four submit labels stay mounted in one grid cell so state changes
// cross-fade in CSS instead of hard-swapping text. The widest label sizes
// the button, which also kills the width jump between states.
const SUBMIT_LABELS: Record<NewsletterStatus, string> = {
  idle: "Subscribe",
  sending: "Sending…",
  done: "On the list",
  error: "Try again",
};

// Shared header-nav underline draw for footer links: hairline grows from
// the left on hover (and on press, for touch).
const UNDERLINE_DRAW =
  "relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-crimson-bright after:transition-[width] after:duration-300 hover:after:w-full active:after:w-full";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<NewsletterStatus>("idle");

  async function subscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending" || status === "done") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter signup",
          contact: email.trim(),
          message: "Subscribe to The Cenla Market Letter",
          source: "newsletter",
        }),
      });
      const data = await res.json();
      setStatus(res.ok && data?.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-navy-ink pb-[calc(64px+env(safe-area-inset-bottom))] text-cream-warm md:pb-0">
      {/*
        Newsletter band sits at the top of the footer, dark navy with a
        tight headline + a one-field signup. Reads as the soft secondary
        conversion after the loud "Talk to Ritchie" closer.
      */}
      <div className="border-b border-cream/12">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-y-8 px-6 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-x-16 lg:px-12 lg:py-20">
          <div>
            <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.26em] text-crimson-bright">
              The Cenla Market Letter
            </span>
            <h3 className="mt-3 font-serif text-[clamp(28px,3vw,42px)] leading-[1.05] tracking-[-0.015em] text-paper">
              Quarterly read on what&rsquo;s{" "}
              <em className="italic">moving</em>{" "}
              in Central Louisiana.
            </h3>
            <p className="mt-4 max-w-[44ch] text-[14px] font-light leading-[1.65] text-cream-warm/75">
              Four issues a year. Sale comparables, neighborhood trends,
              commercial corridor notes. Written by Matt, not a CRM.
            </p>
          </div>

          <form onSubmit={subscribe} className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 border-b border-cream/30 bg-transparent px-1 py-3 font-serif text-[17px] text-paper outline-none placeholder:text-cream-warm/40 focus:border-crimson-bright"
              />
              <button
                type="submit"
                disabled={status === "sending" || status === "done"}
                data-cursor-label={status === "done" ? "Done" : "Subscribe"}
                className="whitespace-nowrap bg-crimson px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-[background-color,translate,scale,opacity] duration-200 ease-out hover:bg-crimson-deep active:scale-[0.98] disabled:opacity-60"
              >
                <span className="grid text-center">
                  {(Object.keys(SUBMIT_LABELS) as NewsletterStatus[]).map(
                    (s) => (
                      <span
                        key={s}
                        aria-hidden={s !== status}
                        className={cn(
                          "col-start-1 row-start-1 transition-opacity duration-200",
                          s === status ? "opacity-100" : "opacity-0",
                        )}
                      >
                        {SUBMIT_LABELS[s]}
                      </span>
                    ),
                  )}
                </span>
              </button>
            </div>
            <p
              aria-live="polite"
              role="status"
              className="min-h-[1.3em] text-[12px] font-light text-cream-warm/70"
            >
              {status === "done"
                ? "You’re on the list."
                : status === "error"
                  ? "Didn’t take — try again, or call the desk at 318·449·8919."
                  : ""}
            </p>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-[2fr_1fr_1fr_1.1fr] md:gap-x-12">
          {/* Brand column */}
          <div>
            <LogoWordmarkImage light width={210} className="h-auto w-[210px]" />
            <p className="mt-6 max-w-[33ch] text-[13.5px] font-light leading-[1.7]">
              Ritchie Real Estate, LLC. 1268 Dorchester Dr, Alexandria, LA
              71303. Representing buyers, sellers, and investors across
              Central Louisiana since 2003.
            </p>
            <a
              href="tel:+13184498919"
              className="mt-5 inline-block font-serif text-[24px] italic text-crimson-bright hover:text-crimson"
              data-cursor-label="Call"
            >
              318&middot;449&middot;8919
            </a>
            <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-cream-warm/70">
              Mon&ndash;Fri 8&ndash;6 &middot; Sat by appt.
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.22em] text-crimson-bright">
                {col.heading}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={cn(
                        "text-[13.5px] font-light transition-colors hover:text-paper",
                        UNDERLINE_DRAW,
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.22em] text-crimson-bright">
              Office
            </h4>
            <address className="mt-5 not-italic text-[13.5px] font-light leading-[1.7]">
              1268 Dorchester Dr<br />
              Alexandria, LA 71303
            </address>
            <Link
              href="https://maps.google.com/?q=1268+Dorchester+Dr+Alexandria+LA"
              className="group mt-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-cream-warm/70 transition-colors duration-200 hover:text-crimson-bright"
              data-cursor-label="Maps"
            >
              Directions{" "}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-1 group-active:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/*
          Trust lockups: REALTOR / Equal Housing / CCIM / MLS treated as
          designed marks rather than 8px legal gray text. Each is a small
          SVG badge with consistent visual weight.
        */}
        <div className="mt-16 grid grid-cols-2 gap-y-8 border-t border-cream/12 pt-12 md:grid-cols-4 md:gap-x-12">
          <Lockup
            mark="R"
            title="REALTOR®"
            sub="National Association"
          />
          <Lockup
            mark="EHO"
            title="Equal Housing"
            sub="Opportunity"
          />
          <Lockup
            mark="CCIM"
            title="Certified Commercial"
            sub="Investment Member"
          />
          <Lockup
            mark="MLS"
            title="Cenla MLS"
            sub="Member since 2003"
          />
        </div>

        {/* Bottom rail */}
        <div className="mt-12 flex flex-col gap-3 border-t border-cream/12 pt-7 text-[11px] text-cream-warm/70 md:flex-row md:justify-between">
          <span>&copy; 2026 Ritchie Real Estate, LLC. All rights reserved.</span>
          <div className="flex gap-6">
            {(
              [
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/accessibility", label: "Accessibility" },
              ] as const
            ).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "transition-colors hover:text-paper",
                  UNDERLINE_DRAW,
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function Lockup({
  mark,
  title,
  sub,
}: {
  mark: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-cream/30 font-serif text-[14px] font-semibold tracking-[0.05em] text-crimson-bright">
        {mark}
      </div>
      <div className="leading-tight">
        <div className="font-serif text-[15px] text-paper">{title}</div>
        <div className="mt-0.5 text-[10.5px] uppercase tracking-[0.16em] text-cream-warm/70">
          {sub}
        </div>
      </div>
    </div>
  );
}
