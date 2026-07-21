"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { ease } from "@/lib/motion";

/**
 * Enter-only route transition. The previous AnimatePresence mode="wait"
 * version held every navigation hostage for ~450ms of exit animation and
 * let Next's scroll restoration yank mid-fade; entering content is the
 * only choreography a navigation needs. Keyed on pathname so the enter
 * plays on every route change, skipped entirely on first paint (the hero
 * owns the landing entrance) and under prefers-reduced-motion.
 */
export function RouteTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const firstPath = useRef(pathname);
  const isFirst = firstPath.current === pathname;

  // The CRM is an app, not a page — no fade between tabs. More important:
  // the enter tween leaves a transform on this wrapper, and a transformed
  // ancestor breaks position:fixed for the CRM's bottom dock (it starts
  // scrolling with the page on iOS).
  if (reduced || pathname.startsWith("/crm")) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={isFirst ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: ease.outExpo }}
    >
      {children}
    </motion.div>
  );
}
