import {withContentlayer} from 'next-contentlayer'

const env = {
  DEVBLOG_API_URL: process.env.DEVLOG_DEVBLOG_API_URL || 'http://localhost:3001'
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    env,
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
