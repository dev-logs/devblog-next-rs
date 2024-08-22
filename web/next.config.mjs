import {withContentlayer} from 'next-contentlayer'

const env = {
  API_URL: process.env.DEVLOG_DEVBLOG_API_URL || 'http://localhost:3000',
  API_GRPC_URL: process.env.DEVLOG_DEVBLOG_API_GRPC_URL || 'http://localhost:30001',
  PATH_PREFIX: process.env.DEVLOG_DEVBLOG_PATH_PREFIX || ''
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    env,
    assetPrefix: process.env.DEVLOG_DEVBLOG_PATH_PREFIX,
    reactStrictMode: false,
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

export default withContentlayer({...nextConfig})

