// components/auth/UserProfile.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'

export default function UserProfile() {
    const { data: session, isPending } = useSession()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
        router.refresh()
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="text-center p-4">
                <p className="text-gray-600">Вы не авторизованы</p>
                <a href="/login" className="text-blue-600 hover:text-blue-500">
                    Войти
                </a>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Профиль</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                    {session.user.image ? (
                        <img
                            src={session.user.image}
                            alt={session.user.name}
                            className="w-16 h-16 rounded-full"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xl">
                {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <h3 className="text-lg font-semibold">{session.user.name}</h3>
                    <p className="text-gray-600">{session.user.email}</p>
                </div>

                <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Информация о сессии:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>ID: {session.user.id}</p>
                        <p>Email подтвержден: {session.user.emailVerified ? 'Да' : 'Нет'}</p>
                        <p>Роль: {session.user.role || 'user'}</p>
                    </div>
                </div>

                <button
                    onClick={handleSignOut}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Выйти
                </button>
            </div>
        </div>
    )
}