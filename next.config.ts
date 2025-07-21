import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
};

export default nextConfig;