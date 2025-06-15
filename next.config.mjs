// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     experimental: {
//         serverActions: true,
//         missingSuspenseWithCSRBailout: false,
//     },
// };

// export default nextConfig;

// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default withNextIntl(nextConfig);

import createNextIntlPlugin from "next-intl/plugin";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': path.join(__dirname, "src"),
          '@public': path.join(__dirname, 'public')
        }
      }
    }
  },
};

export default withNextIntl(nextConfig);
