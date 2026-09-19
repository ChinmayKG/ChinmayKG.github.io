import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default nextConfig;
