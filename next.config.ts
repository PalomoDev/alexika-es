import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    },
    allowedDevOrigins: ['192.168.0.100'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qqe0aa93xo.ufs.sh',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '*.local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: '*.local-origin.dev',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**',
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: '/uploads/:path*',
                destination: '/api/static/:path*',
            },
        ];
    },
};

export default nextConfig;