import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { PlateImage } from "@/components/listing/PlateImage";
import { formatPrice, getListings } from "@/lib/listings";
import { AskRitchieButton } from "./contact/ContactForm";

/**
 * "Scene Not Found" — the film-slate 404. Renders inside the root layout
 * (header, footer, grain) and also catches every unmatched URL across
 * the app.
 *
 * Server component: the clapperboard is plain HTML + one CSS clap
 * (`.slate-clap` in globals.css — jaw server-rendered open, closes once,
 * reduced-motion lands instantly on the closed state), and the live
 * plates come straight from getListings. The only client island is the
 * shared AskRitchieButton, so the page reads perfectly with JS disabled.
 */
export default async function NotFound() {
  const plates = await getListings({ status: "active", limit: 3 });

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-ink px-6 pb-24 pt-28 text-center">
      {/* THE CLAPPERBOARD ------------------------------------------- */}
      <div className="relative mt-8 w-full max-w-[480px] text-left sm:mt-10">
        {/* Top jaw — starts open, claps shut once (.slate-clap). */}
        <div
          aria-hidden
          className="slate-clap relative z-10 h-9 border border-line-strong bg-navy-deep bg-[repeating-linear-gradient(-56deg,transparent_0,transparent_17px,var(--color-line)_17px,var(--color-line)_34px)]"
        />

        {/* Slate body */}
        <div className="border border-line-strong bg-navy-deep/60 shadow-[0_36px_90px_-36px_oklch(0.08_0.03_264/0.7)]">
          {/* Lower stick — fixed, stripes mirrored against the jaw */}
          <div
            aria-hidden
            className="h-7 border-b border-line-strong bg-[repeating-linear-gradient(56deg,transparent_0,transparent_17px,var(--color-line)_17px,var(--color-line)_34px)]"
          />

          <SlateField
            label="Prod."
            value="Ritchie Real Estate"
            className="border-b border-line px-4 py-3"
          />

          <div className="grid grid-cols-[minmax(0,1fr)_84px] sm:grid-cols-[minmax(0,1fr)_112px]">
            <div className="min-w-0 border-r border-line">
              <div className="grid grid-cols-2 border-b border-line">
                <SlateField
                  label="Scene"
                  value="404"
                  accent
                  className="border-r border-line px-3.5 py-3 sm:px-4"
                />
                <SlateField label="Take" value="1" className="px-3.5 py-3 sm:px-4" />
              </div>
              <SlateField
                label="Dir."
                value="M. Ritchie"
                className="px-3.5 py-3 sm:px-4"
              />
            </div>
            {/* The slate's logo plate */}
            <div aria-hidden className="flex items-center justify-center">
              <LogoMark tone="light" size={46} />
            </div>
          </div>

          <SlateField
            label="Loc."
            value={"N 31.3° — Alexandria, LA"}
            className="border-t border-line px-4 py-3"
          />
        </div>

        {/* Hinge pin — the jaw's pivot, x = 18px (matches .slate-clap origin) */}
        <div
          aria-hidden
          className="absolute left-[13px] top-9 z-20 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-line-strong bg-navy"
        />
      </div>

      {/* THE LINE ---------------------------------------------------- */}
      <h1 className="mt-12 max-w-[20ch] font-serif text-[clamp(34px,5.2vw,64px)] leading-[1.05] tracking-[-0.02em] text-paper sm:mt-14">
        This address isn&rsquo;t in{" "}
        <em className="whitespace-nowrap italic text-crimson-bright">the book.</em>
      </h1>

      <p className="mt-5 max-w-[46ch] font-sans text-[15px] leading-[1.7] text-cream-warm">
        The listing may have sold, or the link has wandered.
      </p>

      {/* RECOVERY ROW ------------------------------------------------ */}
      <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
        <Link
          href="/listings"
          data-cursor-label="Browse"
          className="inline-flex items-center justify-center gap-3 bg-crimson px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-colors hover:bg-crimson-deep"
        >
          Browse the listings
        </Link>
        <AskRitchieButton />
      </div>

      <a
        href="tel:+13184498919"
        data-cursor-label="Call"
        className="mt-8 font-sans text-[11.5px] uppercase tracking-[0.22em] text-mute transition-colors hover:text-cream"
      >
        Or call 318&middot;449&middot;8919
      </a>

      {/* MEANWHILE, ON THE MARKET ------------------------------------ */}
      {plates.length > 0 ? (
        <div className="mt-20 w-full max-w-[1080px] border-t border-line pt-12 sm:mt-24">
          <span className="eyebrow center">Meanwhile, on the market</span>

          <ul className="mt-9 grid grid-cols-1 gap-x-8 gap-y-10 text-left sm:grid-cols-3">
            {plates.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/listings/${l.id}`}
                  data-cursor-label="View"
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                    <PlateImage
                      listing={l}
                      sizes="(min-width: 1128px) 340px, (min-width: 640px) 33vw, 100vw"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <span className="min-w-0 truncate font-serif text-[17px] leading-[1.25] text-paper transition-colors group-hover:text-crimson-bright">
                      {l.title}
                    </span>
                    <span className="shrink-0 font-serif text-[17px] font-semibold leading-none text-crimson-bright">
                      {formatPrice(l.price)}
                    </span>
                  </div>
                  <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.18em] text-mute">
                    {l.address.city}, LA
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

/**
 * One ruled field on the slate body: Outfit caps, mute label + cream
 * value. `accent` is reserved for the SCENE number. flex-wrap lets the
 * long LOC value drop under its label on very narrow phones instead of
 * overflowing the slate.
 */
function SlateField({
  label,
  value,
  accent = false,
  className = "",
}: {
  label: string;
  value: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${className}`}>
      <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-mute">
        {label}
      </span>
      <span
        className={`font-sans text-[11px] font-medium uppercase tracking-[0.22em] ${
          accent ? "text-crimson-bright" : "text-cream"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
