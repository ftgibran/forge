import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@app/utils'],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

export default nextConfig
