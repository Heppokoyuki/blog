/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/posts/:path*.map',
        destination: '/404',
      },
      {
        source: '/:path*.map',
        destination: '/404',
      },
    ];
  },
  basePath: process.env.NODE_ENV === 'production' ? '/tategaki' : '',
}

module.exports = nextConfig 