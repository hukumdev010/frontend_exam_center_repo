import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Development mode configuration for better hot reloading
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Enhanced file watching for better hot reload in dev containers
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/dist/**',
          '**/build/**',
          '**/__pycache__/**',
          '**/backend/**',
          '**/*.log',
          '**/logs/**',
          '**/tmp/**',
          '**/temp/**'
        ],
      };
    }
    return config;
  },
  // Enable experimental features for better development experience
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react'],
  },
  // Configure allowed development origins
  async headers() {
    return [
      {
        source: '/_next/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
