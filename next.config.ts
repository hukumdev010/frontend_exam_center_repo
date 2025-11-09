import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better development experience
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react'],
  },
  // Configure CORS and WebSocket origins
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  // Configure compiler options to handle hydration better
  compiler: {
    // Remove console.logs in production but keep them in dev
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error'] } : false,
  },
  // Configure logging to suppress hydration warnings from browser extensions
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Configure dev indicators
  devIndicators: {
    position: 'bottom-right',
  },
  // Configure environment variables
  env: {
    SUPPRESS_HYDRATION_WARNING: process.env.NEXT_PUBLIC_SUPPRESS_HYDRATION_WARNING || 'false',
  },
};

export default nextConfig;
