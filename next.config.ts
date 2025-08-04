import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    },

    allowedDevOrigins: ['192.168.0.100'],
    images: {
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
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
    async headers() {
        return [
            {
                source: '/activities/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=2592000, immutable', // 30 дней
                    },
                ],
            },
        ]
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