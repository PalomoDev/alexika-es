'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
// import { UserRole } from '@/types/better-auth'
import Image from "next/image";

export default function UserProfile() {
    const { data: session, isPending } = authClient.useSession()
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut()
        router.push('/login')
        router.refresh()
    }

    // Функция для изменения роли пользователя (только для админов)
    // const changeUserRole = async (userId: string, newRole: UserRole) => {
    //     if (session?.user.role !== 'admin') {
    //         alert('У вас нет прав для изменения ролей')
    //         return
    //     }
    //
    //     try {
    //         await authClient.admin.setRole({
    //             userId,
    //             role: newRole
    //         })
    //
    //         // Обновляем сессию
    //         router.refresh()
    //         alert('Роль успешно изменена')
    //     } catch (error) {
    //         console.error('Ошибка при изменении роли:', error)
    //         alert('Произошла ошибка при изменении роли')
    //     }
    // }

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
                    {session.user?.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name}
                            width={100}
                            height={100}
                            objectFit="cover"
                            className="w-16 h-16 rounded-full"/>


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
                        <p>Роль: <span className="font-medium text-blue-600">{session.user.role}</span></p>
                    </div>
                </div>

                {/* Показываем доступные функции в зависимости от роли */}
                {session.user.role === 'admin' && (
                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 text-red-600">Админские функции:</h4>
                        <div className="text-sm space-y-1">
                            <p>✅ Доступ к /admin</p>
                            <p>✅ Доступ к /manager</p>
                            <p>✅ Доступ к /dashboard</p>
                            <p>✅ Управление пользователями</p>
                            <p>✅ Изменение ролей</p>
                        </div>
                    </div>
                )}

                {session.user.role === 'manager' && (
                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 text-orange-600">Менеджерские функции:</h4>
                        <div className="text-sm space-y-1">
                            <p>❌ Доступ к /admin</p>
                            <p>✅ Доступ к /manager</p>
                            <p>✅ Доступ к /dashboard</p>
                            <p>✅ Управление товарами</p>
                        </div>
                    </div>
                )}

                {session.user.role === 'user' && (
                    <div className="border-t pt-4">
                        <h4 className="font-medium mb-2 text-green-600">Пользовательские функции:</h4>
                        <div className="text-sm space-y-1">
                            <p>❌ Доступ к /admin</p>
                            <p>❌ Доступ к /manager</p>
                            <p>✅ Доступ к /dashboard</p>
                            <p>✅ Просмотр товаров</p>
                            <p>✅ Оформление заказов</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleSignOut}
                    className="w-full bg-brand text-white py-2 px-4 rounded-md hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Выйти
                </button>
            </div>
        </div>
    )
}