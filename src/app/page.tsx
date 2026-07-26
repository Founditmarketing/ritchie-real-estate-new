import { BrandIntro } from "@/components/motion/BrandIntro";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { SearchBar } from "@/components/sections/SearchBar";
import { MarketStats } from "@/components/sections/MarketStats";
import { Paths } from "@/components/sections/Paths";
import { FeaturedListings } from "@/components/sections/FeaturedListings";
import { Broker } from "@/components/sections/Broker";
import { Testimonials } from "@/components/sections/Testimonials";
import { Sell } from "@/components/sections/Sell";
import { AreasMap } from "@/components/sections/AreasMap";
import { Closer } from "@/components/sections/Closer";

export default function HomePage() {
  return (
    <>
      <BrandIntro />
      <Hero />
      <Manifesto />
      {/* Search lives here, not over the hero. After the manifesto's
          editorial breath and before the navy market band, it gets full
          breathing room as its own product moment. */}
      <SearchBar />
      <MarketStats />
      {/* Hidden on mobile to keep the phone flow under ~9 sections.
          Paths duplicate the header nav, Testimonials and the Central Louisiana map
          (now its own /explore experience) are the most cuttable on a
          small screen. All three remain on tablet/desktop. */}
      <div className="hidden md:block">
        <Paths />
      </div>
      <FeaturedListings />
      <Broker />
      <div className="hidden md:block">
        <Testimonials />
      </div>
      <Sell />
      <div className="hidden md:block">
        <AreasMap />
      </div>
      <Closer />
    </>
  );
}
