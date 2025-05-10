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
    loader: 'custom',
    loaderFile: './image-loader.js',
    domains: ['localhost'],
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
}

module.exports = nextConfig 