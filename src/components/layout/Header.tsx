"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Drawer } from "./Drawer";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/listings", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/listings?type=commercial", label: "Commercial" },
  { href: "/about", label: "Our Agents" },
  { href: "/areas", label: "Cenla" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Don't flip to the cream-background state until the user has
    // scrolled past the top edge of the second viewport. Previously the
    // header changed at 24px which felt like it was "popping in" while
    // the user was still inside the hero photograph.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500",
          scrolled
            ? "bg-cream/95 backdrop-blur shadow-[0_1px_0_var(--color-line)]"
            : "bg-transparent",
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between px-6 lg:px-12 transition-[padding] duration-300",
            scrolled ? "py-3" : "py-4",
          )}
        >
          <Logo tone={scrolled ? "dark" : "light"} />

          <div className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[13.5px] tracking-wide transition-colors hover:text-crimson",
                  "after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-crimson after:transition-[width] after:duration-300 hover:after:w-full",
                  scrolled ? "text-ink" : "text-cream",
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="tel:+13184498919"
              className={cn(
                "border px-5 py-2.5 text-[11.5px] tracking-[0.12em] uppercase font-medium transition-colors",
                scrolled
                  ? "bg-crimson text-cream border-crimson hover:bg-crimson-deep"
                  : "border-cream text-cream hover:bg-cream hover:text-navy",
              )}
            >
              318&middot;449&middot;8919
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative z-[60] flex flex-col gap-[5px] p-2"
          >
            <span
              className={cn(
                "h-0.5 w-6 transition-all duration-300 origin-center",
                open ? "translate-y-[7px] rotate-45 bg-cream" : scrolled ? "bg-ink" : "bg-cream",
              )}
            />
            <span
              className={cn(
                "h-0.5 w-6 transition-all duration-300",
                open ? "opacity-0" : scrolled ? "bg-ink" : "bg-cream",
              )}
            />
            <span
              className={cn(
                "h-0.5 w-6 transition-all duration-300 origin-center",
                open ? "-translate-y-[7px] -rotate-45 bg-cream" : scrolled ? "bg-ink" : "bg-cream",
              )}
            />
          </button>
        </nav>
      </header>

      <Drawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
