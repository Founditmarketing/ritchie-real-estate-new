import type { Metadata } from "next";
import { serif, sans } from "@/lib/fonts";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { RouteTransitions } from "@/components/motion/RouteTransitions";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AskRitchie } from "@/components/chat/AskRitchie";
import { MobileDock } from "@/components/layout/MobileDock";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Ritchie Real Estate \u2014 Central Louisiana Knows Ritchie",
    template: "%s \u00b7 Ritchie Real Estate",
  },
  description:
    "Two decades of local knowledge across Alexandria, Pineville, and Central Louisiana. CCIM-credentialed brokerage. Residential, commercial, land.",
  openGraph: {
    title: "Ritchie Real Estate",
    description:
      "Two decades of Central Louisiana knowledge. Residential, commercial, land.",
    type: "website",
    images: ["/brand/ritchie-logo.png"],
  },
  icons: {
    icon: "/brand/ritchie-logo.png",
  },
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
        <SmoothScroll />
        <CustomCursor />
        <Header />
        <main className="flex-1">
          <RouteTransitions>{children}</RouteTransitions>
        </main>
        <Footer />
        <AskRitchie />
        <MobileDock />
      </body>
    </html>
  );
}
