import type { NextConfig } from "next";
import "dotenv/config";

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2PublicBaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(r2PublicBaseUrl).hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;