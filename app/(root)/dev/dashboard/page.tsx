// app/dashboard/_page.tsx
import UserProfile from '@/components/auth/UserProfile'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'



export default async function DashboardPage() {
    // Получаем сессию на сервере
    const session = await auth.api.getSession({
        headers: await headers()
    })
    console.log(session)


    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Панель управления</h1>
                <UserProfile />
            </div>
        </div>
    )
}