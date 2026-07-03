import type { Metadata, Viewport } from "next";
import { serif, sans } from "@/lib/fonts";
import { siteUrl } from "@/lib/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { RouteTransitions } from "@/components/motion/RouteTransitions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AskRitchie } from "@/components/chat/AskRitchie";
import { MobileDock } from "@/components/layout/MobileDock";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ritchie Real Estate — Central Louisiana knows Ritchie",
    template: "%s · Ritchie Real Estate",
  },
  description:
    "Two decades of local knowledge across Alexandria, Pineville, and Central Louisiana. CCIM-credentialed brokerage. Residential, commercial, land.",
  // Icons and the OG image come from the app/ file conventions
  // (icon.svg, apple-icon.tsx, opengraph-image.tsx) — not declared here.
  openGraph: {
    title: "Ritchie Real Estate",
    description:
      "Two decades of Central Louisiana knowledge. Residential, commercial, land.",
    type: "website",
    siteName: "Ritchie Real Estate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // navy-ink: sRGB hex of oklch(0.145 0.030 264) — the page canvas.
  themeColor: "#050a17",
};

/**
 * RealEstateAgent (a LocalBusiness subtype) structured data.
 * Verified NAP only — no invented ratings, reviews, or extra hours.
 */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Ritchie Real Estate, LLC",
  url: siteUrl,
  telephone: "+13184498919",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1268 Dorchester Dr",
    addressLocality: "Alexandria",
    addressRegion: "LA",
    postalCode: "71303",
    addressCountry: "US",
  },
  areaServed: "Central Louisiana",
  openingHours: "Mo-Fr 08:00-18:00",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-navy-ink text-cream">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-crimson focus:px-5 focus:py-3 focus:text-[12px] focus:uppercase focus:tracking-[0.2em] focus:text-cream"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <CustomCursor />
        <ScrollProgress />
        <Header />
        <main id="main" className="flex-1">
          <RouteTransitions>{children}</RouteTransitions>
        </main>
        <Footer />
        <AskRitchie />
        <MobileDock />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </body>
    </html>
  );
}
