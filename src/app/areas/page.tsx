import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { areas, type Area } from "@/content/areas";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { PlateGrade } from "@/components/listing/PlateGrade";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AskAboutArea } from "./AskAboutArea";

export const metadata: Metadata = {
  title: "Central Louisiana Area Guides",
  description:
    "Alexandria, Pineville, Ball, Boyce, and Tioga — what each Central Louisiana town is, what it trades for, and how fast it moves. Working notes from Ritchie Real Estate.",
};

/* ------------------------------------------------------------------ */
/* Imagery                                                             */
/* ------------------------------------------------------------------ */

/**
 * Section imagery reuses Unsplash photo IDs that already ship in this
 * repo (the listings seed in src/content/listings.ts + Sell section).
 * Do NOT add new photo IDs here — an area without an existing image
 * simply renders type-led (see Ball's interstitial).
 */
const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const AREA_IMAGES: Record<string, { src: string; alt: string } | undefined> = {
  alexandria: {
    src: img("1572120360610-d971b9d7767c", 1600),
    alt: "Historic colonial facade among mature trees",
  },
  pineville: {
    src: img("1568605114967-8130f3a36994", 1600),
    alt: "Brick ranch home on a quiet corner lot",
  },
  boyce: {
    src: img("1518780664697-55e3ad937233", 1200),
    alt: "Waterside cottage with a wraparound deck",
  },
  tioga: {
    src: img("1500382017468-9049fed747ef", 2000),
    alt: "Cleared pasture with a pond at dusk",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function AreasPage() {
  return (
    <div className="bg-navy-ink pb-28 pt-[130px]">
      {/* Front matter */}
      <header className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* House cadence: eyebrow, mask-reveal h1 (never nested in a
            Reveal), aside at +0.15. */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-8">
            <Reveal>
              <span className="eyebrow">Area guides</span>
            </Reveal>
            <h1 className="mt-6 font-serif text-[clamp(44px,6.5vw,100px)] leading-[0.94] tracking-[-0.025em] text-paper">
              <HeadlineReveal>
                {[
                  "Know the ground,",
                  <em key="l2" className="block italic text-crimson-bright">
                    town by town.
                  </em>,
                ]}
              </HeadlineReveal>
            </h1>
          </div>
          <Reveal delay={0.15} as="div" className="col-span-12 md:col-span-4 md:pt-8">
              <p className="font-serif text-[18px] italic leading-[1.55] text-cream-warm">
                Five towns, one market. These are the notes we work from —
                what each place is, what it trades for, and how fast it
                moves.
              </p>
              <Link
                href="/explore"
                data-cursor-label="Map"
                className="group mt-6 inline-flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright transition-transform duration-150 ease-out active:scale-[0.98]"
              >
                <span className="border-b border-current pb-1">
                  Every listing on the live map
                </span>
                <span
                  aria-hidden
                  className="inline-block h-px w-7 bg-current transition-[width] duration-500 ease-out group-hover:w-12"
                />
              </Link>
          </Reveal>
        </div>

        {/* Anchor index — every town below is a jump target (#slug) */}
        <Reveal delay={0.08}>
          <nav
            aria-label="Towns in this guide"
            className="mt-14 flex flex-wrap items-baseline gap-y-3 border-b border-t border-line py-5 md:mt-20"
          >
            <span className="mr-4 font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
              In this guide
            </span>
            {areas.map((a, i) => (
              <span key={a.slug} className="flex items-baseline">
                {i > 0 ? (
                  <span aria-hidden className="mx-3 text-mute/40">
                    &middot;
                  </span>
                ) : null}
                <a
                  href={`#${a.slug}`}
                  data-cursor-label="Jump"
                  className="flex items-baseline gap-2 font-serif text-[17px] text-cream transition-[translate,scale,color,border-color] duration-200 ease-out hover:-translate-y-px hover:text-crimson-bright active:translate-y-0 active:scale-95"
                >
                  <span className="font-serif text-[15px] italic text-cream-warm/75">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{a.name}</span>
                </a>
              </span>
            ))}
          </nav>
        </Reveal>
      </header>

      {/* One editorial section per area — compositions alternate so the
          page never settles into a template rhythm. */}
      {areas.map((area, i) => {
        const image = AREA_IMAGES[area.slug];
        const num = String(i + 1).padStart(2, "0");
        switch (i % 5) {
          case 1:
            return (
              <SectionImageText key={area.slug} area={area} image={image} />
            );
          case 2:
            return <SectionInterstitial key={area.slug} area={area} />;
          case 3:
            return (
              <SectionRailText
                key={area.slug}
                area={area}
                num={num}
                image={image}
              />
            );
          case 4:
            return <SectionPlate key={area.slug} area={area} image={image} />;
          default:
            return (
              <SectionTextImage
                key={area.slug}
                area={area}
                num={num}
                image={image}
              />
            );
        }
      })}

      {/* Closer */}
      <Reveal>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex flex-col items-start gap-6 border-t border-line pt-12 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-serif text-[clamp(24px,2.8vw,36px)] leading-[1.15] text-paper">
                Not sure which town fits? Start with a conversation.
              </p>
              <p className="mt-3 font-sans text-[10.5px] uppercase tracking-[0.22em] text-mute">
                Mon&ndash;Fri 8&ndash;6 &middot; Sat by appointment &middot;
                1268 Dorchester Dr, Alexandria, LA
              </p>
            </div>
            <a
              href="tel:+13184498919"
              data-cursor-label="Call"
              className="inline-flex items-center gap-3 bg-crimson px-8 py-4 font-sans text-[11px] uppercase tracking-[0.18em] text-cream transition-[background-color,translate,scale] duration-200 ease-out hover:bg-crimson-deep active:scale-[0.98]"
            >
              Call 318&middot;449&middot;8919
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

type AreaImage = { src: string; alt: string } | undefined;

function AreaName({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <h2
      className={`font-serif leading-[0.95] tracking-[-0.02em] text-paper ${className}`}
    >
      {name}
      <span className="ml-3 font-serif text-[17px] font-normal italic text-mute">
        LA
      </span>
    </h2>
  );
}

function AreaBody({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 max-w-[62ch] text-[15.5px] font-light leading-[1.7] text-cream-warm">
      {children}
    </p>
  );
}

/** Quiet inline stats — serif numeral + sans label on one baseline. */
function StatLine({
  stats,
  center = false,
  className = "",
}: {
  stats: Area["stats"];
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline gap-y-4 ${
        center ? "justify-center" : ""
      } ${className}`}
    >
      {stats.map((s, i) => (
        <span key={s.label} className="flex items-baseline">
          {i > 0 ? (
            <span
              aria-hidden
              className="mx-4 inline-block h-3.5 w-px self-center bg-line-strong md:mx-5"
            />
          ) : null}
          <b className="font-serif text-[24px] font-medium leading-none text-paper">
            {s.value}
          </b>
          <span className="ml-2.5 font-sans text-[10.5px] uppercase tracking-[0.16em] text-mute">
            {s.label}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Stats mounted on a vertical hairline rail. */
function StatRail({
  stats,
  className = "",
}: {
  stats: Area["stats"];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap gap-x-10 gap-y-7 border-l border-line pl-5 md:flex-col ${className}`}
    >
      {stats.map((s) => (
        <div key={s.label}>
          <b className="block font-serif text-[26px] font-medium leading-none text-paper">
            {s.value}
          </b>
          <span className="mt-1.5 block font-sans text-[10.5px] uppercase tracking-[0.16em] text-mute">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/** "See listings" (crimson) + "Ask Ritchie" (quiet) affordances. */
function AreaLinks({ name, center = false }: { name: string; center?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${
        center ? "justify-center" : ""
      }`}
    >
      <Link
        href={`/listings?city=${encodeURIComponent(name)}`}
        data-cursor-label="Listings"
        className="group inline-flex items-center gap-3 text-[11.5px] font-medium uppercase tracking-[0.18em] text-crimson-bright transition-transform duration-150 ease-out active:scale-[0.98]"
      >
        <span className="border-b border-current pb-1">
          See {name} listings
        </span>
        <span
          aria-hidden
          className="inline-block h-px w-7 bg-current transition-[width] duration-500 ease-out group-hover:w-12"
        />
      </Link>
      <AskAboutArea name={name} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section compositions                                                */
/* ------------------------------------------------------------------ */

/** Text left / image right, stats mounted beneath the plate. */
function SectionTextImage({
  area,
  num,
  image,
}: {
  area: Area;
  num: string;
  image: AreaImage;
}) {
  return (
    <section id={area.slug} className="scroll-mt-28">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 md:py-28">
        <Reveal amount={0.15}>
          <div className="grid grid-cols-12 gap-x-10 gap-y-12">
            <div className="col-span-12 flex flex-col justify-center md:col-span-6">
              <Eyebrow variant="numbered" num={num} tone="crimson-bright">
                {area.tagline}
              </Eyebrow>
              <AreaName
                name={area.name}
                className="mt-5 text-[clamp(42px,4.8vw,72px)]"
              />
              <AreaBody>{area.description}</AreaBody>
              <div className="mt-9">
                <AreaLinks name={area.name} />
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              {image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover saturate-[0.88]"
                  />
                  <PlateGrade />
                </div>
              ) : null}
              <StatLine
                stats={area.stats}
                className={image ? "mt-6 border-t border-line pt-5" : ""}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Portrait image left / text right, stats inline above the links. */
function SectionImageText({
  area,
  image,
}: {
  area: Area;
  image: AreaImage;
}) {
  return (
    <section id={area.slug} className="scroll-mt-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="border-t border-line py-20 md:py-28">
          <Reveal amount={0.15}>
            <div className="grid grid-cols-12 gap-x-10 gap-y-12">
              {image ? (
                <div className="col-span-12 md:col-span-5">
                  <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover saturate-[0.88]"
                    />
                  <PlateGrade />
                  </div>
                </div>
              ) : null}
              <div
                className={`col-span-12 flex flex-col justify-center md:col-span-6 ${
                  image ? "md:col-start-7" : ""
                }`}
              >
                <Eyebrow variant="italic" tone="crimson-bright">
                  {area.tagline}
                </Eyebrow>
                <AreaName
                  name={area.name}
                  className="mt-4 text-[clamp(42px,4.8vw,72px)]"
                />
                <AreaBody>{area.description}</AreaBody>
                <StatLine
                  stats={area.stats}
                  className="mt-8 border-t border-line pt-6"
                />
                <div className="mt-9">
                  <AreaLinks name={area.name} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Full-width type-led interstitial band — no photography needed. */
function SectionInterstitial({ area }: { area: Area }) {
  return (
    <section id={area.slug} className="scroll-mt-28 bg-navy-deep">
      <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-12 md:py-32">
        <Reveal amount={0.2}>
          <div className="mx-auto max-w-[860px] text-center">
            <Eyebrow tone="crimson-bright" center>
              {area.tagline}
            </Eyebrow>
            <AreaName
              name={area.name}
              className="mt-6 text-[clamp(52px,7vw,104px)]"
            />
            <p className="mx-auto mt-6 max-w-[58ch] text-[15.5px] font-light leading-[1.7] text-cream-warm">
              {area.description}
            </p>
            <StatLine stats={area.stats} center className="mt-10" />
            <div className="mt-10">
              <AreaLinks name={area.name} center />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Stats rail far left / text center / small portrait plate right. */
function SectionRailText({
  area,
  num,
  image,
}: {
  area: Area;
  num: string;
  image: AreaImage;
}) {
  return (
    <section id={area.slug} className="scroll-mt-28">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 md:py-28">
        <Reveal amount={0.15}>
          <div className="grid grid-cols-12 gap-x-10 gap-y-12">
            <StatRail
              stats={area.stats}
              className="order-3 col-span-12 md:order-none md:col-span-2 md:justify-center"
            />
            <div className="order-1 col-span-12 flex flex-col justify-center md:order-none md:col-span-5 md:col-start-4">
              <Eyebrow variant="numbered" num={num} tone="crimson-bright">
                {area.tagline}
              </Eyebrow>
              <AreaName
                name={area.name}
                className="mt-5 text-[clamp(42px,4.8vw,72px)]"
              />
              <AreaBody>{area.description}</AreaBody>
              <div className="mt-9">
                <AreaLinks name={area.name} />
              </div>
            </div>
            {image ? (
              <div className="order-2 col-span-12 md:order-none md:col-span-3 md:col-start-10">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy md:aspect-[3/4]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover saturate-[0.88]"
                  />
                  <PlateGrade />
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Wide cinematic plate on top, text left + stats rail right below. */
function SectionPlate({ area, image }: { area: Area; image: AreaImage }) {
  return (
    <section id={area.slug} className="scroll-mt-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="border-t border-line py-20 md:py-28">
          {image ? (
            <Reveal amount={0.1}>
              <div className="relative aspect-[16/9] overflow-hidden bg-navy md:aspect-[21/9]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1280px) 1184px, 100vw"
                  className="object-cover saturate-[0.88]"
                />
                  <PlateGrade />
              </div>
            </Reveal>
          ) : null}
          <Reveal amount={0.2}>
            <div
              className={`grid grid-cols-12 gap-x-10 gap-y-10 ${
                image ? "mt-12 md:mt-16" : ""
              }`}
            >
              <div className="col-span-12 md:col-span-7">
                <Eyebrow variant="italic" tone="crimson-bright">
                  {area.tagline}
                </Eyebrow>
                <AreaName
                  name={area.name}
                  className="mt-4 text-[clamp(42px,4.8vw,72px)]"
                />
                <AreaBody>{area.description}</AreaBody>
                <div className="mt-9">
                  <AreaLinks name={area.name} />
                </div>
              </div>
              <StatRail
                stats={area.stats}
                className="col-span-12 md:col-span-3 md:col-start-10 md:self-center"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
