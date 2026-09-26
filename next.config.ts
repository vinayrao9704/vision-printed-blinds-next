import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/products/roller-blinds', destination: '/products/roller-shades', permanent: true },
      { source: '/products/zebra-blinds', destination: '/products/zebra-shades', permanent: true },
    ];
  },
};

export default nextConfig;
