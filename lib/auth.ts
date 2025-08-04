// lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { admin } from "better-auth/plugins"
import createLogger from '@/lib/logger';

const logger = createLogger('auth.ts');

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        requireEmailVerification: false,
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 дней
        updateAge: 60 * 60 * 24, // 1 день
    },

    // Настройки куков для разных хостов
    cookies: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true,
        // В dev режиме не устанавливаем домен, чтобы куки работали 
        // как на localhost:3000, так и на 192.168.0.100:3000
        domain: process.env.NODE_ENV === 'production' 
            ? process.env.COOKIE_DOMAIN 
            : undefined,
        path: '/',
    },

    trustedOrigins: [
        'http://localhost:3000',
        'http://192.168.0.100:3000',
        'https://alexika.es'  // для продакшена
    ],

    appName: 'Alexika de Aventura',

    plugins: [
        admin({
            defaultRole: 'user',
            adminRole: 'admin',
        })
    ],

    user: {
        additionalFields: {
            role: {
                type: 'string',
                defaultValue: 'user',
                required: false,
            }
        }
    }
})

logger.info('🔧 Initializing Better Auth...')