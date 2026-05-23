"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Cross-fades between routes on the client. Uses Motion's AnimatePresence
 * keyed on the current pathname so navigations look intentional, not jarring.
 * The native View Transitions API is still unstable in React 19 + Next 16
 * (TypeError on `unstable_ViewTransition`), so this is the reliable path.
 */
export function RouteTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: ease.outExpo }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
