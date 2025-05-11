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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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

export default nextConfig; 