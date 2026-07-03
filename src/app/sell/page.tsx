import type { Metadata } from "next";
import { Fragment } from "react";
import { Sell } from "@/components/sections/Sell";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Sell your home",
  description:
    "List with Ritchie Real Estate — pricing built from tracked Cenla comparables, professional photography and marketing, and negotiation by a broker named Louisiana REALTOR of the Year. Complimentary valuation.",
};

/* ------------------------------------------------------------------ */
/*  The marketing engine — items 02–05 (01 is the flagship statement)  */
/* ------------------------------------------------------------------ */

const ENGINE = [
  {
    num: "02",
    label: "Photography & reach",
    title: "Shot well. Seen where buyers look.",
    body: "Professional photography that makes people stop, then real marketing distribution behind it — your listing pushed to the places Cenla buyers actually search, not left to wait on drive-by traffic.",
    className: "md:col-span-5 md:col-start-1",
    delay: 0,
  },
  {
    num: "03",
    label: "The buyer network",
    title: "The network a local firm earns.",
    body: "Ritchie has been matching Cenla buyers and sellers since 2003. A listing here launches into two decades of relationships — agents, past clients, and buyers already looking.",
    className: "md:col-span-5 md:col-start-8 md:mt-20",
    delay: 0.08,
  },
  {
    num: "04",
    label: "Commercial & complex",
    title: "CCIM rigor for the hard ones.",
    body: "Commercial parcels, acreage, investment property — the CCIM credential brings real analysis to the deals most local firms can’t touch.",
    className: "md:col-span-5 md:col-start-2",
    delay: 0,
  },
  {
    num: "05",
    label: "At the table",
    title: "REALTOR® of the Year at the close.",
    body: "When offers come in, your side of the table is Matt Ritchie — named Louisiana REALTOR® of the Year, and the person whose name is on the sign.",
    className: "md:col-span-5 md:col-start-8 md:mt-24",
    delay: 0.08,
  },
] as const;

/* ------------------------------------------------------------------ */
/*  How it goes — the quiet process rail                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: "1",
    title: "The walk-through",
    body: "We see the property in person — what adds value, what to fix before photos, what to leave alone.",
  },
  {
    n: "2",
    title: "The price",
    body: "A number built from tracked comparables, with the reasoning laid out in plain English.",
  },
  {
    n: "3",
    title: "The launch",
    body: "Photography, prep, and the listing pushed live to the buyers and agents who need to see it.",
  },
  {
    n: "4",
    title: "Negotiation to close",
    body: "Offers weighed, terms argued, paperwork walked all the way to the closing table.",
  },
] as const;

export default function SellPage() {
  return (
    <div className="bg-navy-ink">
      {/* 1 — Type-led opening statement ------------------------------ */}
      <section className="pt-[150px] pb-20 md:pt-[180px] md:pb-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 md:col-span-8">
              <Reveal>
                <Eyebrow variant="stamp" tone="crimson-bright">
                  Selling in Cenla
                </Eyebrow>
              </Reveal>
              <h1 className="mt-6 font-serif text-[clamp(44px,7vw,108px)] leading-[0.94] tracking-[-0.025em] text-paper">
                <HeadlineReveal>
                  {[
                    "More than a sign",
                    <Fragment key="l2">
                      in the{" "}
                      <em className="italic text-crimson-bright">yard.</em>
                    </Fragment>,
                  ]}
                </HeadlineReveal>
              </h1>
            </div>

            <aside className="col-span-12 md:col-span-4 md:col-start-9 md:pt-8">
              <Reveal delay={0.15}>
                <p className="max-w-[42ch] font-serif text-[18px] italic leading-[1.55] text-cream-warm">
                  A price built on tracked comparables, marketing that reaches
                  real buyers, and a negotiator who&rsquo;s spent two decades
                  reading this market.
                </p>
                <p className="mt-5 font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
                  CCIM &middot; Louisiana REALTOR&reg; of the Year &middot; Est.
                  2003
                </p>
              </Reveal>
            </aside>
          </div>

          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-5 md:mt-16">
              <a
                href="#sell"
                data-cursor-label="Value it"
                className="inline-flex items-center bg-crimson px-8 py-4 font-sans text-[11px] uppercase tracking-[0.18em] text-cream transition-[background-color,translate,scale] duration-200 ease-out hover:bg-crimson-deep active:scale-[0.98]"
              >
                See what it&rsquo;s worth
              </a>
              <a
                href="tel:+13184498919"
                data-cursor-label="Call"
                className="group inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] text-cream-warm transition-[color,translate,scale] duration-200 ease-out hover:text-paper active:scale-[0.98]"
              >
                <span className="h-px w-7 bg-crimson-bright transition-[width] duration-500 ease-out group-hover:w-12" />
                Or call 318&middot;449&middot;8919
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — The marketing engine ------------------------------------ */}
      <section className="bg-navy-deep py-20 md:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <Reveal>
            <Eyebrow variant="italic" tone="crimson-bright">
              The marketing engine
            </Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(30px,3.8vw,52px)] leading-[1.05] tracking-[-0.015em] text-paper">
              What a seller actually gets.
            </h2>
          </Reveal>

          {/* 01 — the flagship: pricing from evidence */}
          <Reveal>
            <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-6 border-t border-line pt-10 md:mt-16 md:pt-12">
              <div className="col-span-12 md:col-span-7">
                <Eyebrow variant="numbered" num="01" tone="crimson-bright">
                  Pricing from evidence
                </Eyebrow>
                <h3 className="mt-5 font-serif text-[clamp(30px,3.6vw,50px)] leading-[1.04] tracking-[-0.02em]">
                  <span className="block font-normal text-cream-warm">
                    We don&rsquo;t guess the market.
                  </span>
                  <span className="block font-medium text-paper">
                    We track it.
                  </span>
                </h3>
              </div>
              <div className="col-span-12 md:col-span-4 md:col-start-9 md:self-end">
                <p className="max-w-[44ch] font-sans text-[14.5px] font-light leading-[1.7] text-cream-warm">
                  Your list price starts with tracked Cenla comparables —
                  what actually sold, on which street, for how much — read
                  against what&rsquo;s sitting on the market right now. Evidence
                  first, then the number.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 02–05 — staggered editorial entries, no card grid */}
          <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-20">
            {ENGINE.map((item) => (
              <Reveal
                key={item.num}
                delay={item.delay}
                className={`col-span-12 ${item.className}`}
              >
                <div className="border-t border-line pt-7">
                  <Eyebrow variant="numbered" num={item.num} tone="crimson-bright">
                    {item.label}
                  </Eyebrow>
                  <h3 className="mt-4 font-serif text-[clamp(24px,2.4vw,32px)] leading-[1.1] tracking-[-0.01em] text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[44ch] font-sans text-[14px] font-light leading-[1.68] text-cream-warm">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — How it goes --------------------------------------------- */}
      <section className="border-b border-line py-16 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <Reveal>
            <span className="eyebrow">How it goes</span>
            <h2 className="mt-4 font-serif text-[clamp(26px,3vw,38px)] leading-[1.1] tracking-[-0.01em] text-paper">
              Four steps, no mystery.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-0">
            {STEPS.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 0.06}
                className="border-l border-line pl-5 md:pl-7"
              >
                <span className="font-serif text-[32px] italic leading-none text-crimson-bright">
                  {s.n}
                </span>
                <h3 className="mt-4 font-sans text-[11px] uppercase tracking-[0.2em] text-paper">
                  {s.title}
                </h3>
                <p className="mt-2.5 max-w-[30ch] font-sans text-[13px] font-light leading-[1.65] text-mute">
                  {s.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — The valuation form (carries id="sell") ------------------ */}
      <Sell />
    </div>
  );
}
