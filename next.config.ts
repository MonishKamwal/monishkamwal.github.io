import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // GitHub Pages is static hosting only; all dynamic behavior is client-side.
  output: "export",
  images: { unoptimized: true },
  pageExtensions: ["md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
