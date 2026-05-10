/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nextui-org/react', 'react-icons'],
  experimental: {
    optimizePackageImports: ['react-icons', '@nextui-org/react', 'framer-motion'],
  },
  swcMinify: true,
  reactStrictMode: false,
  async rewrites() {
    // In production, NEXT_PUBLIC_BACKEND_URL should be your Railway URL 
    // e.g. https://welaund-api.up.railway.app
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost/pWeB/WEBTECH/backend';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
