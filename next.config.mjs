/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  // distDir: 'server/out/',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      exclude: /node_modules/,
      use: [
        'ts-shader-loader'
      ]
    })
    return config
  }
}

export default nextConfig
