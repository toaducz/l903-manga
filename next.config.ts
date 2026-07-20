import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/img/:path*',
        destination: '/api/image?url=:path*' // Chuyển tiếp ảnh
      }
    ]
  },
  images: {
    domains: ['mangadex.network', 'uploads.mangadex.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.mangadex.network'
      },
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org'
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['react-icons', 'date-fns', 'framer-motion']
  }
}

export default nextConfig
