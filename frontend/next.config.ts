import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http",  hostname: "localhost", port: "4000" },
      { protocol: "https", hostname: "techstore-backend.onrender.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
    unoptimized: true,
  },
  turbopack: { root: __dirname },
};

export default nextConfig;
