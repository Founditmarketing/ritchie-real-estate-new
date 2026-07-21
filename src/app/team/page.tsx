import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { broker, agents, type TeamMember } from "@/content/team";

export const metadata: Metadata = {
  title: "Our Agents",
  description:
    "Meet the Ritchie Real Estate team — a CCIM-led brokerage serving Central Louisiana with residential, commercial, and land expertise since 2003.",
};

export default function TeamPage() {
  return (
    <div className="bg-navy-ink pb-32 pt-[130px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Front matter — house cadence: eyebrow, mask-reveal h1 (never
            nested inside a Reveal), aside at +0.15. */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-8 pb-14 md:pb-20">
          <div className="col-span-12 md:col-span-8">
            <Reveal>
              <Eyebrow variant="stamp" tone="crimson-bright">
                The firm
              </Eyebrow>
            </Reveal>
            <h1 className="mt-5 font-serif text-[clamp(40px,6.5vw,104px)] leading-[0.94] tracking-[-0.025em] text-paper">
              <HeadlineReveal>
                {[
                  "Thirteen people.",
                  <em key="l2" className="block italic text-crimson-bright">
                    One market.
                  </em>,
                ]}
              </HeadlineReveal>
            </h1>
          </div>
          <aside className="col-span-12 md:col-span-4 md:pt-6">
            <Reveal delay={0.15}>
              <p className="font-serif text-[18px] italic leading-[1.55] text-cream-warm">
                A CCIM-led brokerage with deep Central Louisiana roots — residential,
                commercial, land, and property management under one roof since
                2003.
              </p>
              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.22em] text-crimson-bright">
                318·449·8919 &middot; Alexandria, LA
              </p>
            </Reveal>
          </aside>
        </header>

        {/* Featured broker */}
        <Reveal>
          <Link
            href="/#broker"
            data-cursor-label="His story"
            className="group relative grid grid-cols-1 overflow-hidden border border-cream/12 bg-navy-deep transition-transform duration-150 ease-out active:scale-[0.99] md:grid-cols-[0.85fr_1.15fr]"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[440px]">
              <Image
                src={broker.photo}
                alt={`${broker.name}, ${broker.title}`}
                fill
                sizes="(min-width:768px) 42vw, 100vw"
                className="object-cover"
                style={{ objectPosition: broker.objectPosition }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/10 to-transparent md:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center gap-5 p-8 md:p-14">
              <Eyebrow variant="numbered" num="01" tone="crimson-bright">
                Broker &middot; Owner
              </Eyebrow>
              <div>
                <h2 className="font-serif text-[clamp(34px,4vw,60px)] leading-[1] tracking-[-0.02em] text-paper">
                  {broker.name}
                </h2>
                <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.18em] text-crimson-bright">
                  {broker.title}
                </p>
              </div>
              <p className="max-w-[46ch] font-serif text-[18px] italic leading-[1.6] text-cream-warm">
                CCIM-credentialed and a Louisiana REALTOR® of the Year.
                Nearly three decades of reading every corner of the Central
                Louisiana market.
              </p>
              <span className="inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] text-crimson-bright">
                <span className="h-px w-7 bg-current transition-[width] duration-500 ease-out group-hover:w-12" />
                Read his story
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Roster */}
        <Reveal>
          <div className="mb-9 mt-16 flex items-end justify-between border-b border-cream/12 pb-4">
            <h2 className="font-serif text-[22px] italic text-paper md:text-[28px]">
              The agents
            </h2>
            <span className="font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
              {agents.length} REALTORS®
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-7 md:gap-y-14 lg:grid-cols-4">
          {agents.map((m, i) => (
            <Reveal key={m.slug} delay={(i % 4) * 0.05}>
              <TeamCard member={m} index={i} />
            </Reveal>
          ))}
        </div>

        {/* Closer */}
        <Reveal>
          <div className="mt-20 flex flex-col items-start gap-5 border-t border-cream/12 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="font-serif text-[clamp(22px,2.6vw,34px)] leading-[1.15] text-paper">
              Not sure who to ask for?{" "}
              <em className="italic">
                Start with the desk.
              </em>
            </p>
            <Link
              href="tel:+13184498919"
              data-cursor-label="Call"
              className="inline-flex items-center gap-3 bg-crimson px-8 py-4 font-sans text-[11px] uppercase tracking-[0.18em] text-cream transition-[background-color,translate,scale] duration-200 ease-out hover:bg-crimson-bright active:scale-[0.98]"
            >
              Call 318·449·8919
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function TeamCard({
  member,
  index,
}: {
  member: TeamMember;
  index: number;
}) {
  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-navy">
        <Image
          src={member.photo}
          alt={`${member.name}, ${member.title}`}
          fill
          sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 45vw"
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]"
          style={{ objectPosition: member.objectPosition ?? "50% 22%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/55 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-90" />
        <span className="absolute left-3 top-3 font-serif text-[16px] italic text-crimson-bright drop-shadow-[0_1px_6px_oklch(0.08_0.03_264/0.7)]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-4">
        <h3 className="font-serif text-[19px] leading-tight text-paper md:text-[21px]">
          {member.name}
        </h3>
        <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-crimson-bright">
          {member.title}
        </p>
      </div>
    </div>
  );
}
