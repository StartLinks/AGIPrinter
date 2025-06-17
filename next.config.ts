import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    disableStaticImages: true,
    unoptimized: true,
    domains: ["cdn.bonjour.bio"],
  },
};

export default nextConfig;
