"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
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
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus the container itself on open (matches AskRitchie's mobile
  // behavior) so the trap engages without flashing the crimson focus
  // ring on the wordmark mid-stagger.
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => drawerRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // Escape closes; Tab cycles inside the drawer (modal trap).
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = drawerRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (activeEl === first || activeEl === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-40 flex flex-col bg-navy-ink px-7 pt-24 pb-10 outline-none md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: ease.out }}
        >
          {/* The visible close control (hamburger X) lives outside the
              drawer DOM, so give screen readers a reachable one inside. */}
          <button type="button" onClick={onClose} className="sr-only">
            Close menu
          </button>
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
          <nav aria-label="Site" className="mt-auto">
          <ul className="flex flex-col">
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
          </nav>

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
