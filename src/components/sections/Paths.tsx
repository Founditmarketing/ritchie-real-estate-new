"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { HeadlineReveal } from "@/components/motion/HeadlineReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ease } from "@/lib/motion";

const PATHS = [
  {
    num: "01",
    audience: "Buyers",
    title: ["Buying", "a home"],
    body: "Search every active listing across Central Louisiana, with an agent who knows the street before you turn onto it.",
    link: "Start your search",
    href: "/listings",
  },
  {
    num: "02",
    audience: "Sellers",
    title: ["Selling", "your home"],
    body: "A real marketing engine and a negotiator named Louisiana REALTOR of the Year. See what your home is worth.",
    link: "Get your valuation",
    href: "/sell",
  },
  {
    num: "03",
    audience: "Commercial",
    title: ["Commercial", "property"],
    body: "CCIM-credentialed expertise in investment, land, and commercial deals most local firms can't touch.",
    link: "Explore commercial",
    href: "/listings?type=commercial",
  },
] as const;

export function Paths() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <Reveal>
          <Eyebrow variant="italic" tone="crimson">However you move</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(34px,4.4vw,58px)] leading-[1.03] tracking-[-0.015em]">
            <HeadlineReveal>
              {["Three ways we put", <>Cenla to <em className="not-italic italic text-crimson">work.</em></>]}
            </HeadlineReveal>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 border-t border-line md:grid-cols-3">
          {PATHS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, ease: ease.out, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`group relative border-t-2 border-transparent px-9 py-11 transition-colors hover:bg-paper hover:border-t-crimson ${
                i < PATHS.length - 1 ? "md:border-r md:border-line" : ""
              }`}
            >
              <Link href={p.href} className="block">
                <span className="font-serif italic text-[14px] text-crimson">
                  {p.num} &mdash; {p.audience}
                </span>
                <h3 className="mt-9 font-serif text-[34px] leading-[1.04]">
                  {p.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-3 max-w-[36ch] text-[14px] font-light leading-[1.64] text-ink-soft">
                  {p.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2.5 text-[11.5px] font-medium uppercase tracking-[0.14em] text-crimson">
                  {p.link}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1.5">
                    &rarr;
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
