// app/dashboard/page.tsx
import UserProfile from '@/components/auth/UserProfile'

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Панель управления</h1>
                <UserProfile />
            </div>
        </div>
    )
}