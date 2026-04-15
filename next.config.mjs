import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media-service.pynfi.com',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
};

export default withNextIntl(nextConfig);
