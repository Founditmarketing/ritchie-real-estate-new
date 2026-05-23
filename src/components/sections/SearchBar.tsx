"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Floating search bar that overlaps the hero with negative margin.
 * Submits to /listings with URL state so the listings page can read it.
 */
export function SearchBar() {
  const router = useRouter();
  const [intent, setIntent] = useState("buy");
  const [where, setWhere] = useState("");
  const [price, setPrice] = useState("any");

  return (
    <div className="relative z-20 -mt-14">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const params = new URLSearchParams();
          if (intent === "rent") params.set("type", "rental");
          if (intent === "commercial") params.set("type", "commercial");
          if (where) params.set("city", where);
          if (price !== "any") {
            const [min, max] = price.split("-").map((n) => Number(n));
            if (min) params.set("priceMin", String(min));
            if (max) params.set("priceMax", String(max));
          }
          router.push(`/listings?${params.toString()}`);
        }}
        className="mx-auto flex max-w-[1080px] flex-col border border-line bg-paper shadow-[0_36px_70px_-28px_oklch(0.22_0.10_262/0.5)] md:flex-row"
      >
        <Seg label="I want to">
          <select
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            className="w-full border-none bg-transparent font-serif text-[18px] font-medium text-ink outline-none"
          >
            <option value="buy">Buy a home</option>
            <option value="rent">Rent a home</option>
            <option value="commercial">Find commercial</option>
          </select>
        </Seg>
        <Seg label="Location">
          <input
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder={"Alexandria, Pineville\u2026"}
            className="w-full border-none bg-transparent font-serif text-[18px] font-medium text-ink placeholder:text-ink-soft/60 outline-none"
          />
        </Seg>
        <Seg label="Price range" last>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border-none bg-transparent font-serif text-[18px] font-medium text-ink outline-none"
          >
            <option value="any">Any price</option>
            <option value="0-200000">Up to $200k</option>
            <option value="200000-350000">$200k\u2013$350k</option>
            <option value="350000-500000">$350k\u2013$500k</option>
            <option value="500000-0">$500k+</option>
          </select>
        </Seg>
        <button
          type="submit"
          className="whitespace-nowrap bg-crimson px-9 py-5 font-sans text-[12px] uppercase tracking-[0.14em] text-cream transition-colors hover:bg-crimson-deep md:py-0"
        >
          Search Cenla
        </button>
      </form>
    </div>
  );
}

function Seg({
  label,
  children,
  last = false,
}: {
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col gap-1.5 px-6 py-5 ${
        last ? "" : "border-b border-line md:border-b-0 md:border-r"
      }`}
    >
      <label className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-crimson">
        {label}
      </label>
      {children}
    </div>
  );
}
