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
        <div className="relative min-h-[320px] md:min-h-[640px]">
          <Image
            src="/team/matt-ritchie.png"
            alt="Matt Ritchie, broker and owner of Ritchie Real Estate"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-[center_18%]"
            priority={false}
          />
          {/* Subtle navy-to-transparent wash so the headshot reads as part
              of the brand band without flattening Matt's face. */}
          <div className="absolute inset-0 bg-gradient-to-tr from-navy-ink/40 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-ink/80 to-transparent" />
          <div className="absolute bottom-8 left-8 font-serif text-[22px] italic text-crimson-bright drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            &ldquo;Ritchie know.&rdquo;
          </div>
        </div>

        <Reveal>
          <div className="flex flex-col justify-center px-7 py-16 sm:px-9 sm:py-20 md:px-20 md:py-24">
            <Eyebrow variant="stamp" tone="cream">
              The broker
            </Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(32px,3.6vw,54px)] leading-[1.06] tracking-[-0.015em]">
              It started with one
              <br />
              belief.{" "}
              <em className="not-italic italic text-crimson-bright">Local matters.</em>
            </h2>
            <p className="mt-6 max-w-[44ch] border-l-2 border-crimson pl-5 font-serif text-[20px] italic leading-[1.6] text-cream-warm">
              Anybody can pull a listing off the MLS. Knowing what a Garden
              District lot really trades for, or which commercial corridor is
              about to turn: that takes a lifetime in Cenla.
            </p>

            <div className="mt-8 flex flex-wrap gap-8">
              <Cred title="CCIM" sub="Credentialed" />
              <Cred title="REALTOR of the Year" sub="Louisiana" />
              <Cred title="Cenla&rsquo;s Best" sub="130k+ Votes" />
            </div>

            <div className="mt-9 font-serif text-[25px] italic">
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
