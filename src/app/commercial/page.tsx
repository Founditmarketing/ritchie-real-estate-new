import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { PlateImage } from "@/components/listing/PlateImage";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatPrice, getListings } from "@/lib/listings";
import { CommercialForm } from "./CommercialForm";

export const metadata: Metadata = {
  title: "Commercial Real Estate",
  description:
    "Office, retail, warehouse, and land across Alexandria and Central Louisiana. A CCIM-led commercial desk — every commercial inquiry goes straight to the broker. 318-449-8919.",
};

/**
 * The commercial money page. Front matter cadence matches /team; every
 * claim is verified (CCIM, since-1997, broker-direct routing). The lead
 * form's intent is classified commercial by the CRM, so submissions land
 * on Matt's desk — the page's promise is the system's actual behavior.
 */
const SERVICES = [
  {
    num: "01",
    title: "Buying & investment",
    body: "Income property, owner-occupied, or your first commercial deal. The numbers come first, always.",
  },
  {
    num: "02",
    title: "Selling",
    body: "Valuation, marketing, and a negotiator who knows what Central Louisiana corridors actually trade for.",
  },
  {
    num: "03",
    title: "Leasing",
    body: "Landlord or tenant — space matched to the way your business actually runs.",
  },
  {
    num: "04",
    title: "Land & development",
    body: "Acreage, corners, and ground-up projects from Alexandria to the parish lines.",
  },
  {
    num: "05",
    title: "Property management",
    body: "Day-to-day operations handled, so the building pays you — not the other way around.",
  },
] as const;

export default async function CommercialPage() {
  const commercial = await getListings({ type: "commercial", status: "active" });

  return (
    <div className="bg-navy-ink pb-32 pt-[130px]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* FRONT MATTER ------------------------------------------------ */}
        <header className="grid grid-cols-12 gap-x-6 gap-y-8 pb-14 md:pb-20">
          <div className="col-span-12 md:col-span-8">
            <Reveal>
              <Eyebrow variant="stamp" tone="crimson-bright">
                The commercial desk
              </Eyebrow>
            </Reveal>
            <h1 className="mt-5 font-serif text-[clamp(40px,6.5vw,104px)] leading-[0.94] tracking-[-0.025em] text-paper">
              <HeadlineReveal>
                {[
                  "Commercial, handled",
                  <em key="l2" className="block italic text-crimson-bright">
                    by the broker.
                  </em>,
                ]}
              </HeadlineReveal>
            </h1>
          </div>
          <aside className="col-span-12 md:col-span-4 md:pt-6">
            <Reveal delay={0.15}>
              <p className="font-serif text-[18px] italic leading-[1.55] text-cream-warm">
                Office, retail, warehouse, land — bought, sold, leased, and
                managed by a CCIM who&rsquo;s been reading this market since
                1997. No hand-offs.
              </p>
              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.22em] text-crimson-bright">
                318&middot;449&middot;8919 &middot; Alexandria, LA
              </p>
            </Reveal>
          </aside>
        </header>

        {/* WHAT THE DESK DOES ------------------------------------------ */}
        <Reveal>
          <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                className={`border-b border-line px-1 py-8 sm:px-6 sm:py-9 lg:border-b-0 ${
                  i > 0 ? "lg:border-l lg:border-line" : "lg:pl-1"
                }`}
              >
                <span className="font-serif text-[14px] italic text-crimson-bright">
                  {s.num}
                </span>
                <h2 className="mt-4 font-serif text-[21px] leading-[1.15] text-paper">
                  {s.title}
                </h2>
                <p className="mt-2.5 text-[13px] font-light leading-[1.6] text-cream-warm">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* THE CREDENTIAL ---------------------------------------------- */}
        <Reveal>
          <div className="mt-20 grid grid-cols-1 gap-10 border border-line bg-navy-deep p-8 md:mt-28 md:grid-cols-[auto_1fr] md:items-center md:gap-14 md:p-14">
            <div className="flex items-center gap-7">
              <LogoMark tone="light" size={64} />
              <div>
                <p className="font-serif text-[64px] leading-none tracking-[-0.01em] text-paper md:text-[84px]">
                  CCIM
                </p>
                <p className="mt-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.2em] text-crimson-bright">
                  Certified Commercial Investment Member
                </p>
              </div>
            </div>
            <div>
              <p className="max-w-[58ch] font-serif text-[clamp(17px,1.4vw,21px)] leading-[1.6] text-cream-warm">
                The CCIM is commercial real estate&rsquo;s highest
                designation — financial analysis, market analysis, and
                investment strategy most agents never train in. Matt earned
                it, and he&rsquo;s the one who picks up the phone.
              </p>
              <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.22em] text-mute">
                Matt Ritchie &mdash; Broker &middot; Owner &middot; CCIM
              </p>
            </div>
          </div>
        </Reveal>

        {/* ON THE MARKET ------------------------------------------------ */}
        {commercial.length > 0 ? (
          <div className="mt-20 md:mt-28">
            <Reveal>
              <div className="mb-9 flex items-end justify-between border-b border-line pb-4">
                <h2 className="font-serif text-[22px] italic text-paper md:text-[28px]">
                  Commercial, on the market now
                </h2>
                <Link
                  href="/listings?type=commercial"
                  className="font-sans text-[10.5px] font-medium uppercase tracking-[0.22em] text-crimson-bright transition-colors hover:text-cream"
                >
                  View all
                </Link>
              </div>
            </Reveal>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {commercial.slice(0, 3).map((l) => (
                <li key={l.id}>
                  <Reveal>
                    <Link
                      href={`/listings/${l.id}`}
                      data-cursor-label="View"
                      className="group block"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                        <PlateImage
                          listing={l}
                          sizes="(min-width: 1128px) 340px, (min-width: 640px) 45vw, 100vw"
                        />
                      </div>
                      <div className="mt-4 flex items-baseline justify-between gap-4">
                        <span className="min-w-0 truncate font-serif text-[18px] leading-[1.25] text-paper transition-colors group-hover:text-crimson-bright">
                          {l.title}
                        </span>
                        <span className="shrink-0 font-serif text-[18px] font-semibold leading-none text-crimson-bright">
                          {formatPrice(l.price)}
                        </span>
                      </div>
                      <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.18em] text-mute">
                        {l.address.city}, LA
                      </p>
                    </Link>
                    {/* The OM sits one tap from every commercial plate —
                        the sheet a buyer actually gets handed. */}
                    <Link
                      href={`/commercial/${l.id}/offering`}
                      data-cursor-label="Sheet"
                      className="mt-2.5 inline-flex items-center gap-2 font-sans text-[10.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright transition-colors hover:text-cream"
                    >
                      Offering memorandum
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* THE ASK ------------------------------------------------------ */}
        <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-line pt-14 md:mt-28 md:pt-20">
          <div className="col-span-12 md:col-span-5">
            <Reveal>
              <Eyebrow variant="stamp" tone="crimson-bright">
                Talk to the desk
              </Eyebrow>
              <h2 className="mt-5 font-serif text-[clamp(30px,3.6vw,52px)] leading-[1.05] tracking-[-0.015em] text-paper">
                Tell us about
                <br />
                the <em className="italic text-crimson-bright">building.</em>
              </h2>
              <p className="mt-6 max-w-[42ch] font-sans text-[14px] leading-[1.7] text-cream-warm">
                Selling, leasing, buying, or just weighing an idea — this
                form goes straight to Matt, not a queue. Prefer the phone?
              </p>
              <a
                href="tel:+13184498919"
                data-cursor-label="Call"
                className="mt-4 inline-block font-serif text-[26px] italic text-crimson-bright transition-colors hover:text-cream"
              >
                318&middot;449&middot;8919
              </a>
            </Reveal>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <CommercialForm />
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
