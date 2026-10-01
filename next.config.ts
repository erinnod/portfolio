import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 for project screenshots, whose UI text softens at the default 75 (Next 16 requires the allowlist).
    qualities: [75, 90],
  },
};

export default nextConfig;
