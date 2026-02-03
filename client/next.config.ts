import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      }
    ],
  },

  async redirects() {
    return [
      {
        source: '/:locale/categories',
        destination: '/:locale/category',
        permanent: true,
      },
      {
        source: '/categories',
        destination: '/category',
        permanent: true,
      },
    ]
  },
};

export default withNextIntl(nextConfig);
