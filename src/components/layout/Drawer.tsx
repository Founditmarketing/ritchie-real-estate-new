"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { LogoWordmarkImage } from "@/components/brand/Logo";
import { duration, ease, stagger } from "@/lib/motion";

const ITEMS = [
  { href: "/explore", label: "Map Search" },
  { href: "/listings", label: "Buy a Home" },
  { href: "/sell", label: "Sell a Home" },
  { href: "/listings?type=commercial", label: "Commercial" },
  { href: "/team", label: "Our Agents" },
  { href: "/areas", label: "Cenla Guides" },
] as const;

type DrawerProps = { open: boolean; onClose: () => void };

export function Drawer({ open, onClose }: DrawerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="drawer"
          className="fixed inset-0 z-40 flex flex-col bg-navy-ink px-7 pt-24 pb-10 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: ease.out }}
        >
          {/* Bone-white wordmark variant reads cleanly on the dark drawer
              without a nameplate box. */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.outExpo, delay: 0.08 }}
          >
            <Link
              href="/"
              onClick={onClose}
              aria-label="Ritchie Real Estate, home"
              className="inline-block"
            >
              <LogoWordmarkImage light width={180} className="h-auto w-[180px]" />
            </Link>
          </motion.div>

          {/* Nav links \u2014 push toward vertical center of remaining space */}
          <ul className="mt-auto flex flex-col">
            {ITEMS.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: duration.base,
                  ease: ease.outExpo,
                  delay: 0.18 + i * stagger.base,
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between border-b border-cream/15 py-3.5 font-serif text-[34px] font-medium text-cream"
                >
                  {item.label}
                  <span className="font-sans text-[13px] text-crimson-bright">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Contact rail anchored to bottom */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: ease.outExpo, delay: 0.7 }}
            className="mt-12"
          >
            <a
              href="tel:+13184498919"
              className="block font-sans text-[10.5px] uppercase tracking-[0.22em] text-cream-warm/70"
            >
              Call
            </a>
            <a
              href="tel:+13184498919"
              className="mt-1.5 block font-serif text-[24px] italic text-crimson-bright"
            >
              318&middot;449&middot;8919
            </a>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
