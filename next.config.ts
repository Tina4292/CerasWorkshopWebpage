import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Removed 'output: export' to enable API routes for payment processing
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
