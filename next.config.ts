import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",              // /api/*
        destination: "http://localhost:8080/api/:path*", // proxy to Go API
      },
    ];
  },
};

export default nextConfig;
