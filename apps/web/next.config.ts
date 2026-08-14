import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@himmel/api", "@himmel/db", "@himmel/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
