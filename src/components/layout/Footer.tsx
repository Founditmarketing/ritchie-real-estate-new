import Link from "next/link";
import { LogoWordmarkImage } from "@/components/brand/Logo";

const COLS = [
  {
    heading: "Explore",
    links: [
      { href: "/listings", label: "Buy a home" },
      { href: "/sell", label: "Sell a home" },
      { href: "/listings?type=commercial", label: "Commercial" },
      { href: "/listings?type=rental", label: "Rentals" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "Our agents" },
      { href: "/about", label: "About Ritchie" },
      { href: "/areas", label: "Area guides" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Get in touch",
    links: [
      { href: "tel:+13184498919", label: "318\u00b7449\u00b78919" },
      { href: "https://maps.google.com", label: "1268 Dorchester Dr" },
      { href: "https://maps.google.com", label: "Alexandria, LA 71303" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="bg-navy-ink text-cream-warm py-20 pb-9">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-13 border-b border-cream/13">
          <div>
            {/*
              Canonical wordmark sits on a cream nameplate so the navy text
              and maroon diamond keep their real colors. The previous
              `brightness-0 invert` filter stripped the maroon \u2014 visually
              broken. A backing card reads as an intentional "agent plate"
              treatment, common on print collateral.
            */}
            <span className="inline-block bg-cream px-5 py-4">
              <LogoWordmarkImage width={200} className="h-auto w-[200px]" />
            </span>
            <p className="text-[13.5px] font-light leading-[1.7] mt-6 max-w-[33ch]">
              Ritchie Real Estate, LLC. 1268 Dorchester Dr, Alexandria, LA
              71303. Representing buyers, sellers, and investors across Central
              Louisiana since 2003.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[10px] tracking-[0.16em] uppercase text-crimson-bright mb-4">
                {col.heading}
              </h4>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="block text-[13.5px] font-light mb-3 transition-colors hover:text-paper"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-2 pt-7 text-[11px] text-cream-warm/55 font-light">
          <span>&copy; 2026 Ritchie Real Estate, LLC. All rights reserved.</span>
          <span>Equal Housing Opportunity &middot; Licensed in Louisiana</span>
        </div>
      </div>
    </footer>
  );
}
