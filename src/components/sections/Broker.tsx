import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Broker() {
  return (
    <section id="broker" className="bg-navy-ink text-paper">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.05fr]">
        {/* Mobile height tightened from 420 \u2192 320: at 420px the photo alone
            consumed >60% of a phone viewport, creating the "scroll through
            nothing then content" feel. */}
        <div className="relative min-h-[440px] md:min-h-[720px]">
          {/* object-top pins the frame to the top edge of the portrait so
              Matt's head is never cropped at any container height; only the
              lower body trims on shorter (mobile) viewports. */}
          <Image
            src="/team/matt-ritchie.png"
            alt="Matt Ritchie, broker and owner of Ritchie Real Estate, on the cover of REALTOR Magazine's CREATE"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
            priority={false}
          />
          {/* Navy washes so the full-body portrait reads as part of the
              brand band; edges fade into the dark canvas. */}
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-ink/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy-ink/75 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy-ink to-transparent md:block" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-ink via-navy-ink/50 to-transparent" />
          <div className="absolute bottom-8 left-8 font-serif text-[22px] italic text-crimson-bright drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            &ldquo;Ritchie knows.&rdquo;
          </div>
        </div>

        <Reveal>
          <div className="flex flex-col justify-center px-7 py-16 sm:px-9 sm:py-20 md:px-20 md:py-24">
            <Eyebrow variant="stamp" tone="cream">
              The broker
            </Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(32px,3.6vw,54px)] leading-[1.06] tracking-[-0.015em] text-paper">
              It started with one
              <br />
              belief.{" "}
              <em className="not-italic italic text-crimson-bright">Know the ground.</em>
            </h2>
            <p className="mt-7 max-w-[44ch] font-serif text-[20px] italic leading-[1.6] text-cream-warm">
              Anybody can pull a listing off the MLS. Knowing what a Garden
              District lot really trades for, or which commercial corridor is
              about to turn: that takes a lifetime in Cenla.
            </p>

            {/* Magazine credential — the CREATE cover is the credibility flex,
                stated rather than shown. */}
            <p className="mt-7 inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.2em] text-mute">
              <span className="h-px w-7 bg-crimson-bright" />
              Cover, REALTOR&reg; Magazine&rsquo;s CREATE &middot; Fall 2022
            </p>

            <div className="mt-9 flex flex-wrap gap-8">
              <Cred title="CCIM" sub="Credentialed" />
              <Cred title="REALTOR of the Year" sub="Louisiana" />
              <Cred title="Cenla&rsquo;s Best" sub="130k+ Votes" />
            </div>

            <div className="mt-10 font-serif text-[25px] italic text-paper">
              Matt Ritchie
              <small className="mt-1.5 block font-sans text-[10.5px] not-italic uppercase tracking-[0.16em] text-crimson-bright">
                Broker &middot; Owner
              </small>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Cred({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <b className="block font-serif text-[20px] font-semibold text-paper">{title}</b>
      <span className="mt-1 block text-[10.5px] uppercase tracking-[0.1em] text-crimson-bright">
        {sub}
      </span>
    </div>
  );
}
