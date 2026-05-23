"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { type Listing } from "@/lib/listings";
import { ease } from "@/lib/motion";

/**
 * The narrative section of a listing detail page. Asymmetric 12-column
 * spread with a hand-set drop cap on the opening paragraph, numbered
 * Plates for the features list, and a contact rail (call / tour / write)
 * on the right that reads like a sidebar in a magazine spread.
 */
export function ListingDescription({ listing }: { listing: Listing }) {
  const headingNoun = listing.type === "land" ? "property" : "home";
  // Split first word off so we can render a large drop cap.
  const [firstChar, ...restChars] = listing.description;
  const restText = restChars.join("");

  return (
    <section className="bg-paper py-24 md:py-32 lg:py-36">
      <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-x-6 gap-y-14 px-6 lg:px-12">
        {/* LEFT — narrative + features */}
        <div className="col-span-12 md:col-span-8">
          <Eyebrow variant="numbered" num="01" tone="crimson">
            About this {headingNoun}
          </Eyebrow>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: ease.outExpo }}
            className="mt-5 font-serif text-[clamp(32px,3.6vw,52px)] leading-[1.04] tracking-[-0.015em] text-navy-ink"
          >
            Notes from the broker.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: ease.outExpo, delay: 0.1 }}
            className="mt-8 max-w-[58ch]"
          >
            <p className="font-serif text-[18px] leading-[1.72] text-navy-ink">
              <span className="float-left mr-3 mt-1 font-serif text-[80px] italic font-medium leading-[0.78] text-crimson">
                {firstChar}
              </span>
              {restText}
            </p>
          </motion.div>

          {listing.features.length ? (
            <div className="mt-14">
              <Eyebrow variant="italic" tone="crimson">
                What stands out
              </Eyebrow>
              <ol className="mt-6 grid grid-cols-1 gap-x-10 gap-y-1 sm:grid-cols-2">
                {listing.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: ease.outExpo, delay: i * 0.05 }}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-[16px]"
                  >
                    <span className="font-serif text-[13px] italic font-medium text-crimson">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-navy-ink">{f}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>

        {/* RIGHT — contact rail */}
        <aside className="col-span-12 md:col-span-4 md:pl-6">
          <div className="md:sticky md:top-32">
            <Eyebrow variant="stamp" tone="crimson">
              Tour it
            </Eyebrow>
            <h3 className="mt-5 font-serif text-[clamp(26px,2.4vw,34px)] leading-[1.08] tracking-[-0.015em] text-navy-ink">
              The fastest way to{" "}
              <em className="not-italic italic text-crimson">walk through</em>{" "}
              this one is to call.
            </h3>
            <p className="mt-4 max-w-[36ch] text-[14px] font-light leading-[1.65] text-ink-soft">
              Matt or a Ritchie agent will meet you at the curb, on your
              schedule. Same-day tours when we can.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <MagneticButton
                href="tel:+13184498919"
                data-cursor-label="Call"
                className="group inline-flex items-center justify-between gap-3 bg-crimson px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-crimson-deep"
              >
                Call Ritchie
                <span aria-hidden className="font-serif text-[14px] italic">
                  318&middot;449&middot;8919
                </span>
              </MagneticButton>
              <a
                href="/contact"
                data-cursor-label="Write"
                className="inline-flex items-center justify-between gap-3 border border-navy-ink/20 px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-navy-ink transition-colors hover:border-navy-ink hover:bg-navy-ink hover:text-cream"
              >
                Schedule a tour
                <span aria-hidden>&rarr;</span>
              </a>
            </div>

            <div className="mt-9 border-t border-line pt-5 text-[11.5px] font-light leading-[1.6] text-ink-soft">
              <span className="block font-sans text-[10px] uppercase tracking-[0.22em] text-crimson">
                Listed by
              </span>
              <span className="mt-2 block font-serif text-[18px] italic text-navy-ink">
                Matt Ritchie
              </span>
              <span className="block">CCIM &middot; Broker &middot; Owner</span>
              <span className="block">Lic. #LA-RE-998211</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
