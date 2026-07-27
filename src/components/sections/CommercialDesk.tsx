import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * The commercial desk — the homepage's flagship band (client direction
 * 2026-07-26: "more commercial centric"). Every claim here is verified:
 * Matt holds the CCIM, commercial inquiries route to the broker (that is
 * literally how /api/lead + the CRM behave), and the shop has been in
 * this market since 1997. No deal counts, no square-footage brags.
 */
const SERVICES = [
  { num: "01", label: "Buying & investment" },
  { num: "02", label: "Selling" },
  { num: "03", label: "Leasing" },
  { num: "04", label: "Land & development" },
  { num: "05", label: "Property management" },
] as const;

export function CommercialDesk() {
  return (
    <section className="relative overflow-hidden bg-navy-ink py-20 md:py-32">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-12 px-6 lg:px-12">
        {/* THE CLAIM ------------------------------------------------ */}
        <div className="col-span-12 md:col-span-7">
          <Reveal>
            <Eyebrow variant="stamp" tone="crimson-bright">
              The commercial desk
            </Eyebrow>
          </Reveal>
          <h2 className="mt-5 font-serif text-[clamp(34px,4.6vw,64px)] leading-[1.02] tracking-[-0.02em] text-paper">
            <HeadlineReveal>
              {[
                "Commercial goes straight",
                <em key="l2" className="block italic text-crimson-bright">
                  to the broker.
                </em>,
              ]}
            </HeadlineReveal>
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[52ch] font-serif text-[clamp(17px,1.35vw,21px)] leading-[1.6] text-cream-warm">
              Office, retail, warehouse, land. When a commercial call comes
              into this shop, it doesn&rsquo;t get handed down the line — it
              lands on Matt Ritchie&rsquo;s desk. He&rsquo;s a CCIM, and
              he&rsquo;s been reading this market since 1997.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <ul className="mt-10 border-t border-line">
              {SERVICES.map((s) => (
                <li
                  key={s.num}
                  className="flex items-baseline gap-5 border-b border-line py-3.5"
                >
                  <span className="font-serif text-[14px] italic text-crimson-bright">
                    {s.num}
                  </span>
                  <span className="font-sans text-[13px] font-medium uppercase tracking-[0.16em] text-cream">
                    {s.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* THE CREDENTIAL ------------------------------------------- */}
        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <Reveal delay={0.15}>
            <div className="border border-line bg-navy-deep p-8 md:p-10">
              <LogoMark tone="light" size={44} />
              <p className="mt-7 font-serif text-[56px] leading-none tracking-[-0.01em] text-paper">
                CCIM
              </p>
              <p className="mt-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.22em] text-crimson-bright">
                Certified Commercial Investment Member
              </p>
              <p className="mt-5 font-sans text-[13.5px] leading-[1.65] text-cream-warm">
                Commercial real estate&rsquo;s highest designation — deal
                analysis, valuation, and investment strategy most agents
                never train in. Matt holds it. He&rsquo;s the one who
                answers.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href="/commercial"
                  data-cursor-label="Commercial"
                  className="group inline-flex items-center justify-center gap-3 bg-crimson px-6 py-3.5 text-center font-sans text-[11.5px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-crimson-deep"
                >
                  The commercial desk
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
                <a
                  href="tel:+13184498919"
                  data-cursor-label="Call"
                  className="inline-flex items-center justify-center gap-3 border border-cream/25 px-6 py-3.5 font-sans text-[11.5px] font-medium uppercase tracking-[0.18em] text-cream-warm transition-colors hover:border-cream/50 hover:text-cream"
                >
                  Call the broker &middot; 318&middot;449&middot;8919
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
