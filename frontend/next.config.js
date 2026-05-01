/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nextui-org/react', 'react-icons'],
  experimental: {
    optimizePackageImports: ['react-icons', '@nextui-org/react', 'framer-motion'],
  },
  swcMinify: true,
  reactStrictMode: false,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // Keep compiled pages in memory for 1 hour
    pagesBufferLength: 5, // Keep 5 pages in buffer
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/gitNEWWEB/backend/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
