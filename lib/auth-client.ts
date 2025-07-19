// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'

export const {
    signIn,
    signOut,
    signUp,
    useSession,
    getSession,
    updateUser,
    // Основные методы, которые доступны в базовом клиенте
} = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
    // Если используете кастомный basePath, укажите его:
    // baseURL: 'http://localhost:3000/api/auth'
})

// Дополнительные методы можно получить через auth.api
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
})