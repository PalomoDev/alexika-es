// types/better-auth.d.ts
import { User as BetterAuthUser, Session as BetterAuthSession } from 'better-auth/types'

export type UserRole = 'user' | 'admin'

declare module 'better-auth/types' {
    interface User extends BetterAuthUser {
        role: UserRole
        address?: string | null
        paymentMethod?: string | null
    }

    interface Session extends BetterAuthSession {
        user: User
    }
}

