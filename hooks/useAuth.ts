import { authClient } from '@/lib/auth-client'
import { UserRole } from '@/types/better-auth'

export const useAuth = () => {
    const { data: session, isPending } = authClient.useSession()

    return {
        session,
        isPending,
        user: session?.user,
        role: session?.user?.role as UserRole | undefined,
        isAdmin: session?.user?.role === 'admin',
        isAuthenticated: !!session,
    }
}