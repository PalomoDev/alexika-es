// lib/utils/auth-utils.ts
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UserRole } from '@/types/better-auth'
import { User } from 'better-auth/types'
import createLogger from '@/lib/logger'

const logger = createLogger('auth-utils')

// Тип для пользователя с ролью
export interface AuthenticatedUser extends User {
  role: UserRole
}



/**
 * Получить текущего пользователя на сервере
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await import('next/headers').then(h => h.headers()),
    })

    if (!session?.user) {
      return null
    }

    logger.info('Current user:', session.user.id)

    return {
      ...session.user,
      role: session.user.role as UserRole,
    } as AuthenticatedUser
  } catch (error) {
    logger.error('Failed to get current user:', error)
    return null
  }
}