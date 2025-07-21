// types/better-auth.d.ts
import { User as BetterAuthUser, Session as BetterAuthSession } from 'better-auth/types'

declare module 'better-auth/types' {
    interface User extends BetterAuthUser {
        role: 'user' | 'admin'
        address?: string | null
        paymentMethod?: string | null
    }

    interface Session extends BetterAuthSession {
        user: User
    }
}

export type UserRole = 'user' | 'admin'