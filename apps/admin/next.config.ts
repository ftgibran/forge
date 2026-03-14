import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@app/utils'],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
}

export default withNextIntl(nextConfig)
