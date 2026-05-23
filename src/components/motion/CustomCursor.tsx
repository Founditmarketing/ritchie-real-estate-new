"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function useCursorEnabled() {
  const subscribe = useCallback((cb: () => void) => {
    const m1 = window.matchMedia("(pointer: coarse)");
    const m2 = window.matchMedia("(prefers-reduced-motion: reduce)");
    m1.addEventListener("change", cb);
    m2.addEventListener("change", cb);
    return () => {
      m1.removeEventListener("change", cb);
      m2.removeEventListener("change", cb);
    };
  }, []);
  const getSnapshot = () =>
    !window.matchMedia("(pointer: coarse)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

type CursorMode = "default" | "hover" | "label";

/**
 * Two-part editorial cursor:
 *   - a 5px crimson dot that snaps to the pointer
 *   - a 32px ring that lazily trails on a spring
 *
 * When a target carries `data-cursor-label="View"` the ring expands into a
 * navy disc carrying that label text. This is the visible micro-interaction
 * that prior versions were too subtle to convey.
 *
 * Disabled on coarse pointers and under prefers-reduced-motion.
 */
export function CustomCursor() {
  const enabled = useCursorEnabled();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 240, damping: 28, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 240, damping: 28, mass: 0.4 });

  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const labeled = target?.closest<HTMLElement>("[data-cursor-label]");
      const interactive = target?.closest(
        'a, button, input, select, textarea, [data-cursor="grow"]',
      );
      if (labeled) {
        setMode("label");
        setLabel(labeled.dataset.cursorLabel ?? "");
      } else if (interactive) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.classList.add("cursor-none-deep");

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("cursor-none-deep");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringSize =
    mode === "label" ? 88 : mode === "hover" ? 56 : 28;

  return (
    <>
      {/* Inner crimson dot — always visible */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson"
        style={{ x, y }}
      />
      {/* Outer ring / label disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor:
            mode === "label" ? "var(--color-navy-ink)" : "transparent",
          borderColor:
            mode === "label"
              ? "transparent"
              : "color-mix(in oklch, var(--color-crimson) 70%, transparent)",
          opacity: pressed ? 1 : mode === "default" ? 0.7 : 0.95,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border"
          animate={{
            borderColor:
              mode === "label"
                ? "transparent"
                : "color-mix(in oklch, var(--color-crimson) 60%, transparent)",
          }}
        />
        {mode === "label" ? (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 font-sans text-[10px] uppercase tracking-[0.22em] text-cream"
          >
            {label}
          </motion.span>
        ) : null}
      </motion.div>
    </>
  );
}
