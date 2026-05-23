import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  // Hide the floating dev mode badge in the corner. It's a Next devtool,
  // not part of the site, and it muddles every screenshot we take.
  devIndicators: false,
};

export default nextConfig;
