/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizeCss: false, // Disable CSS optimization to avoid critters dependency
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: [
      'images.unsplash.com',
      'www.american-giant.com',
      's7d2.scene7.com',
      'gwestblanks.com',
      'ychef.files.bbci.co.uk',
      'animalfactguide.com',
      'i.natgeofe.com'
    ],
    unoptimized: true,
  },
  // Uncomment to analyze bundle size
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'static',
  //         openAnalyzer: false,
  //       })
  //     )
  //   }
  //   return config
  // },
}

export default nextConfig
