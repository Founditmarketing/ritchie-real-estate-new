import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
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
      <Hero />
      <Manifesto />
      <MarketStats />
      <Paths />
      <FeaturedListings />
      <Broker />
      <Testimonials />
      <Sell />
      <AreasMap />
      <Closer />
    </>
  );
}
