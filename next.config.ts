import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // serverExternalPackages: ['better-auth'],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://skillbridge-server-2.onrender.com'}/api/:path*`
      }
    ]
  },
  async generateBuildId() {
    return 'build-' + Date.now();
  }
};

export default nextConfig;
