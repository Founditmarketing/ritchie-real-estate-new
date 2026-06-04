"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { ease } from "@/lib/motion";

/* Single architectural detail — Cenla-feeling front porch with columns,
   shot in afternoon light. Replaces the stock glam-bedroom image. */
const PORCH_IMG =
  "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80";

/* A scanned signature aesthetic — supports the "earned trust" angle. */

export function Sell() {
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="sell" className="relative isolate overflow-hidden bg-navy-ink py-24 md:py-32">
      {/* Ghost serif "Worth." sits behind everything as ambient watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 font-serif italic font-medium text-[28vw] leading-[0.8] text-paper/[0.04] select-none"
      >
        Worth.
      </span>

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:px-12">
        {/* LEFT — single architectural detail, treated as fine art ---- */}
        <Reveal className="relative">
          <figure className="relative">
            <div className="relative aspect-[3/4] w-full max-w-[360px] overflow-hidden">
              <Image
                src={PORCH_IMG}
                alt="A traditional Louisiana front porch in afternoon light"
                fill
                sizes="(min-width: 1024px) 360px, 80vw"
                className="object-cover"
              />
            </div>
            {/* Editorial caption block under the photo */}
            <figcaption className="mt-4 flex items-start gap-3 text-[11px] uppercase tracking-[0.24em] text-mute">
              <span className="mt-1 inline-block h-px w-6 bg-crimson-bright" />
              <span>
                Plate 04 &mdash; <span className="italic text-crimson-bright">Garden District</span>
                <br />
                Porch detail, west elevation
              </span>
            </figcaption>
            {/* A vertical brass-thin rule echoes the editorial book feel */}
            <div className="absolute -right-6 top-0 hidden h-full w-px bg-line lg:block" />
          </figure>
        </Reveal>

        {/* RIGHT — type-led valuation moment --------------------------- */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="font-sans text-[10.5px] uppercase tracking-[0.28em] text-crimson-bright">
              Chapter 03 / For sellers
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="mt-5 font-serif font-medium tracking-[-0.025em] text-paper">
              <span className="block text-[clamp(42px,5.5vw,84px)] leading-[0.95]">
                Find out
              </span>
              <span className="block text-[clamp(42px,5.5vw,84px)] leading-[0.95]">
                what it&rsquo;s{" "}
                <em className="not-italic italic text-crimson-bright">worth.</em>
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            {/* Roman body, not italic \u2014 reserved for accent words. */}
            <p className="mt-6 max-w-[46ch] font-serif text-[18px] leading-[1.55] text-cream-warm">
              A complimentary valuation built from real Cenla comparables and
              current market data, not a Zillow algorithm. Takes about thirty
              seconds.
            </p>
          </Reveal>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.2 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
              /* TODO: wire to a server action that emails via Resend */
            }}
            className="mt-10 flex max-w-[560px] flex-col border-t-2 border-b border-cream/15 bg-transparent sm:flex-row sm:items-stretch"
          >
            <label className="flex flex-1 flex-col gap-1.5 px-2 py-5">
              <span className="text-[10px] uppercase tracking-[0.22em] text-crimson-bright">
                Your home address
              </span>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="88 Riverbend Rd, Alexandria"
                className="border-none bg-transparent font-serif text-[20px] text-paper outline-none placeholder:text-mute/55"
              />
            </label>
            <button
              type="submit"
              className="group relative whitespace-nowrap bg-crimson px-7 text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-crimson-deep sm:self-stretch"
            >
              <span className="relative z-10">
                {submitted ? "On the way" : "Value it"}
              </span>
            </button>
          </motion.form>

          <Reveal delay={0.28}>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11.5px] font-light text-mute">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson-bright" />
                {submitted
                  ? "Thanks. Ritchie will reach you within one business day."
                  : "No pressure. No spam."}
              </span>
              <span>Average response: under 4 hours.</span>
              <span className="italic">Signed by the broker, not a bot.</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
