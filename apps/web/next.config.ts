import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@himmel/api", "@himmel/db", "@himmel/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
