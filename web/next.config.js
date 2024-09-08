const {withContentlayer} = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: process.env.DEVLOG_DEVBLOG_PATH_PREFIX
      ? `${process.env.DEVLOG_DEVBLOG_PATH_PREFIX}/next`
      : undefined,
    reactStrictMode: false,
    trailingSlash: true,
    typescript: {
      tsconfigPath: "./tsconfig.json",
      ignoreBuildErrors: true
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.glsl$/,
            exclude: /node_modules/,
            use: [
                'ts-shader-loader'
            ]
        })

        return config
    },
    // These variables will always be public to the client even we don't use prefix: NEXT_PUBLIC.
    // So that, please don't put any private key here.
    // NextJS will consider empty string as undefined, so don't put the default value as empty string
    env: {
        NEXT_PUBLIC_API_URL: process.env.DEVLOG_DEVBLOG_API_URL || 'http://localhost:3000',
        NEXT_PUBLIC_API_GRPC_URL: process.env.DEVLOG_DEVBLOG_API_GRPC_URL || 'http://localhost:30001',
        NEXT_PUBLIC_PATH_PREFIX: process.env.DEVLOG_DEVBLOG_PATH_PREFIX || '/'
    }
}

module.exports = withContentlayer(nextConfig);

