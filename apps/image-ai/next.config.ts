import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ai-prototypes/ui", "@ai-prototypes/ai-core"],
};

export default nextConfig;
