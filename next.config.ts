import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/git-blog",
  trailingSlash: true,
};

export default nextConfig;
