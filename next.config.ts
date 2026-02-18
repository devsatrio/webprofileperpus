import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'http://192.168.1.5:3000',
    'http://192.168.1.5:3001',
    'http://localhost:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jnlfbpgwuubgadbzllkz.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
    
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  
};

export default nextConfig;
