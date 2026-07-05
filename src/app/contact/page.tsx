import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm, AskRitchieButton } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Ritchie Real Estate — call 318-449-8919, visit the Alexandria office at 1268 Dorchester Dr, or send a note. Mon–Fri 8–6, Sat by appointment.",
};

/**
 * /contact — "Talk to Ritchie" made into a page. Phone-first per the
 * brand: the tel: link is the hero action, the form is the quieter
 * written path beside the office block.
 */
export default function ContactPage() {
  return (
    <div className="bg-navy-ink pb-24 pt-36 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Front matter — the phone number IS the hero */}
        <Reveal>
          <header className="border-b border-cream/12 pb-12 md:pb-16">
            <span className="eyebrow">Talk to Ritchie</span>
            <h1 className="mt-5 max-w-[14ch] font-serif text-[clamp(40px,6vw,92px)] leading-[0.96] tracking-[-0.025em] text-paper">
              You ask.{" "}
              <em className="italic text-crimson-bright">Ritchie answers.</em>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] font-light leading-[1.7] text-cream-warm">
              No phone tree, no portal login, no ticket number &mdash; a Cenla
              desk where a person picks up.
            </p>
            <a
              href="tel:+13184498919"
              data-cursor-label="Call"
              className="mt-10 inline-block font-serif text-[clamp(46px,7.5vw,104px)] italic leading-[0.95] tracking-[-0.02em] text-crimson-bright transition-colors hover:text-crimson"
            >
              318&middot;449&middot;8919
            </a>
            <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.22em] text-mute">
              Mon&ndash;Fri 8&ndash;6 &middot; Sat by appt.
            </p>
          </header>
        </Reveal>

        {/* Asymmetric band: office block left, written path right */}
        <div className="mt-12 grid grid-cols-1 gap-y-14 md:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-20">
          <Reveal>
            <section aria-labelledby="office-heading">
              <h2
                id="office-heading"
                className="font-serif text-[22px] italic text-paper md:text-[26px]"
              >
                The office.
              </h2>

              <div className="mt-6 border-t border-cream/12">
                <div className="border-b border-cream/12 py-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
                    Address
                  </span>
                  <address className="mt-3 font-serif text-[22px] not-italic leading-[1.3] text-paper">
                    1268 Dorchester Dr
                    <br />
                    Alexandria, LA 71303
                  </address>
                  <a
                    href="https://maps.google.com/?q=1268+Dorchester+Dr+Alexandria+LA"
                    data-cursor-label="Maps"
                    className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-cream-warm/70 transition-colors hover:text-crimson-bright"
                  >
                    Directions <span aria-hidden>&rarr;</span>
                  </a>
                </div>

                <div className="border-b border-cream/12 py-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
                    Hours
                  </span>
                  <p className="mt-3 text-[14px] font-light leading-[1.7] text-cream-warm">
                    Monday&ndash;Friday, 8&ndash;6
                    <br />
                    Saturday by appointment
                  </p>
                </div>

                <div className="py-6">
                  <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
                    The concierge
                  </span>
                  <p className="mt-3 max-w-[38ch] text-[14px] font-light leading-[1.7] text-cream-warm">
                    After hours? The concierge knows the Cenla market cold
                    and every listing Ritchie represents &mdash; ask it
                    anything, and it hands the important stuff to Matt.
                  </p>
                  <div className="mt-5">
                    <AskRitchieButton />
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delay={0.08}>
            <section aria-labelledby="write-heading">
              <h2
                id="write-heading"
                className="font-serif text-[22px] italic text-paper md:text-[26px]"
              >
                Or put it in writing.
              </h2>
              <p className="mt-3 max-w-[46ch] text-[14px] font-light leading-[1.7] text-cream-warm">
                Tell us what you&rsquo;re after &mdash; buying, selling,
                commercial, land, or just a question about a street. It lands
                in the brokerage inbox, not a CRM queue.
              </p>
              <ContactForm />
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
