import { Cormorant_Garamond, Outfit } from "next/font/google";

export const serif = Cormorant_Garamond({
  subsets: ["latin"],
  // 300 is used (hero "knows" beat renders font-light); 700 was shipped
  // but never used anywhere — swap them so no weight synthesizes.
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

export const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});
