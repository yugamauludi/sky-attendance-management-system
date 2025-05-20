import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    if (!process.env.API_URL) {
      throw new Error('API_URL environment variable is not defined');
    }
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/v1/api/:path*`
      }
    ];
  }
};

export default nextConfig;
