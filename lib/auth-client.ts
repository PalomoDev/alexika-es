import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [adminClient()],
    // базовый URL для API (опционально)
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000'
})



// Экспортируем функции для удобства
export const signOut = authClient.signOut
export const useSession = authClient.useSession

// Админские функции
export const admin = authClient.admin