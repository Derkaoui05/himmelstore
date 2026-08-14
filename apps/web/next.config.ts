import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@himmel/api", "@himmel/db", "@himmel/types"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beautysuccess.co",
      },
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
